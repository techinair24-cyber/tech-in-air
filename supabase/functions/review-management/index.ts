import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  getNextReviewStatus,
  hasAdminRole,
  isReviewStatus,
  matchesActiveEditToken,
  hashEditToken,
  hashRateLimitKey,
  consumeRateLimit,
  makeEditToken,
  normalizePhotoSelection,
  normalizeReviewInput as validateReviewInput,
  validatePhotoPath as validateReviewPhotoPath,
} from './core.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
}
const bucketName = 'review-photos'
const maxPhotoBytes = 5 * 1024 * 1024
const maxPhotos = 5
const mimeExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

type ReviewInput = {
  customerName: string
  collegeName: string
  education: 'Engineering' | 'Diploma'
  projectName: string
  rating: number
  reviewText: string
}

type RequestBody = Record<string, unknown> & { action?: unknown }

class RequestError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

function jsonResponse(body: unknown, status = 200, additionalHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, ...additionalHeaders, 'Content-Type': 'application/json' },
  })
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function normalizeReviewInput(body: RequestBody): ReviewInput {
  try {
    return validateReviewInput(body) as ReviewInput
  } catch (error) {
    throw new RequestError(error instanceof Error ? error.message : 'Invalid customer review.')
  }
}

function getServiceClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Review management service configuration is incomplete.')
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

async function authorizeAdmin(request: Request) {
  const authorization = request.headers.get('authorization')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!authorization?.startsWith('Bearer ') || !supabaseUrl || !anonKey) {
    throw new RequestError('Administrator authentication is required.', 401)
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: authorization } },
  })
  const { data, error } = await authClient.auth.getUser()
  if (error || !hasAdminRole(data.user)) {
    throw new RequestError('Administrator access is required.', 403)
  }
}

function getClientIdentifier(request: Request) {
  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
  return request.headers.get('cf-connecting-ip')
    || request.headers.get('x-real-ip')
    || forwardedIp
    || 'unknown'
}

async function enforceRateLimit(
  service: ReturnType<typeof getServiceClient>,
  request: Request,
  scope: string,
  maxRequests: number,
  windowSeconds: number,
) {
  const keyHash = await hashRateLimitKey(scope, getClientIdentifier(request))
  try {
    await consumeRateLimit(service, keyHash, maxRequests, windowSeconds)
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 429) {
      throw new RequestError(error.message, 429)
    }
    throw error
  }
}

async function getEditTokenHash(token: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    throw new RequestError('The edit link is invalid or expired.', 401)
  }
  return hashEditToken(token)
}

async function getCustomerReview(service: ReturnType<typeof getServiceClient>, token: string) {
  const tokenHash = await getEditTokenHash(token)
  const { data: credential, error: credentialError } = await service
    .from('review_edit_tokens')
    .select('review_id, token_hash, expires_at, revoked_at')
    .eq('token_hash', tokenHash)
    .maybeSingle()
  if (credentialError) throw credentialError
  if (!matchesActiveEditToken(credential, tokenHash)) {
    throw new RequestError('This edit link is invalid, revoked, or expired. Request a new link from Tech in Air.', 401)
  }

  const { data: review, error } = await service
    .from('reviews')
    .select('id, customer_name, college_name, education, project_type, rating, review_text, photo_paths, status')
    .eq('id', credential.review_id)
    .maybeSingle()
  if (error) throw error
  if (!review) throw new RequestError('This review is no longer available.', 404)
  return review
}

async function getAdminReview(service: ReturnType<typeof getServiceClient>, reviewId: unknown) {
  const id = typeof reviewId === 'number' && Number.isSafeInteger(reviewId)
    ? String(reviewId)
    : stringValue(reviewId)
  if (!id || id.length > 100) throw new RequestError('A valid review is required.')
  const { data, error } = await service
    .from('reviews')
    .select('id, customer_name, college_name, education, project_type, rating, review_text, photo_paths, status')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  if (!data) throw new RequestError('This review is no longer available.', 404)
  return data
}

async function createSignedPhotoUrls(service: ReturnType<typeof getServiceClient>, paths: string[]) {
  return Promise.all(paths.map(async (path) => {
    const { data, error } = await service.storage.from(bucketName).createSignedUrl(path, 60 * 15)
    if (error) throw error
    return { path, url: data.signedUrl }
  }))
}

async function removeStalePhotoReservations(
  service: ReturnType<typeof getServiceClient>,
  review: { id: string | number; photo_paths: string[] | null },
) {
  const expiry = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: reservations, error } = await service
    .from('review_photo_uploads')
    .select('object_path')
    .eq('review_id', String(review.id))
    .lt('created_at', expiry)
  if (error) throw error
  if (!reservations?.length) return

  const attachedPaths = review.photo_paths ?? []
  const stalePaths = reservations
    .map(({ object_path }) => object_path)
    .filter((path) => !attachedPaths.includes(path))
  if (stalePaths.length > 0) {
    const { error: storageError } = await service.storage.from(bucketName).remove(stalePaths)
    if (storageError) throw storageError
  }
  const { error: reservationError } = await service
    .from('review_photo_uploads')
    .delete()
    .in('object_path', reservations.map(({ object_path }) => object_path))
  if (reservationError) throw reservationError
}

async function preparePhotoUpload(
  service: ReturnType<typeof getServiceClient>,
  review: { id: string | number; photo_paths: string[] | null },
  body: RequestBody,
) {
  const mimeType = stringValue(body.mimeType)
  const size = Number(body.fileSize)
  const extension = mimeExtensions[mimeType]
  const existingPaths = review.photo_paths ?? []
  const keepPaths = Array.isArray(body.keepPhotoPaths)
    ? body.keepPhotoPaths.map((path) => validatePhotoPath(review.id, path))
    : existingPaths
  if (new Set(keepPaths).size !== keepPaths.length || keepPaths.some((path) => !existingPaths.includes(path))) {
    throw new RequestError('One or more selected photos do not belong to this review.')
  }
  if (!extension || !Number.isInteger(size) || size < 1 || size > maxPhotoBytes) {
    throw new RequestError('Use a JPG, PNG, or WEBP photo no larger than 5 MB.')
  }
  if (keepPaths.length >= maxPhotos) {
    throw new RequestError('A review can include no more than five photos.')
  }

  const objectPath = `${review.id}/${crypto.randomUUID()}.${extension}`
  const { data: reservationCreated, error: reservationError } = await service.rpc(
    'reserve_review_management_photo_upload',
    {
      p_review_id: String(review.id),
      p_object_path: objectPath,
      p_keep_photo_count: keepPaths.length,
    },
  )
  if (reservationError) throw reservationError
  if (reservationCreated !== true) {
    throw new RequestError('A review can include no more than five photos.')
  }

  const { data, error } = await service.storage.from(bucketName).createSignedUploadUrl(objectPath, {
    upsert: false,
  })
  if (error) {
    const { error: cleanupError } = await service.from('review_photo_uploads').delete().eq('object_path', objectPath)
    if (cleanupError) console.error('Unable to release a failed review photo reservation:', cleanupError)
    throw error
  }
  return { objectPath, signedUploadToken: data.token }
}

function validatePhotoPath(reviewId: string | number, path: unknown) {
  try {
    return validateReviewPhotoPath(reviewId, path)
  } catch (error) {
    throw new RequestError(error instanceof Error ? error.message : 'One or more selected photos are invalid.')
  }
}

async function validateNewPhotos(
  service: ReturnType<typeof getServiceClient>,
  reviewId: string | number,
  paths: string[],
) {
  if (paths.length === 0) return
  if (paths.length > maxPhotos || new Set(paths).size !== paths.length) {
    throw new RequestError('A review can include no more than five unique photos.')
  }

  const { data: reservations, error: reservationError } = await service
    .from('review_photo_uploads')
    .select('object_path')
    .eq('review_id', String(reviewId))
    .in('object_path', paths)
  if (reservationError) throw reservationError
  if ((reservations?.length ?? 0) !== paths.length) {
    throw new RequestError('One or more photos were not authorized for this review.')
  }

  for (const path of paths) {
    const [folder, filename] = path.split('/')
    if (folder !== String(reviewId) || !filename || path.split('/').length !== 2) {
      throw new RequestError('One or more selected photos are invalid.')
    }

    const { data: files, error } = await service.storage.from(bucketName).list(folder, {
      limit: 100,
      search: filename,
    })
    if (error) throw error
    const file = files.find((item) => item.name === filename)
    const metadata = file?.metadata as { mimetype?: string; size?: number } | undefined
    if (
      !metadata
      || !Number.isFinite(Number(metadata.size))
      || Number(metadata.size) > maxPhotoBytes
      || !Object.keys(mimeExtensions).includes(stringValue(metadata.mimetype).toLowerCase())
    ) {
      throw new RequestError('One or more uploaded photos failed validation.')
    }
  }
}

async function saveReview(
  service: ReturnType<typeof getServiceClient>,
  review: Record<string, unknown>,
  body: RequestBody,
  isCustomer: boolean,
) {
  const input = normalizeReviewInput(body)
  const existingPaths = Array.isArray(review.photo_paths)
    ? review.photo_paths.filter((path): path is string => typeof path === 'string')
    : []
  let photoSelection
  try {
    photoSelection = normalizePhotoSelection(
      review.id,
      existingPaths,
      Array.isArray(body.keepPhotoPaths) ? body.keepPhotoPaths : [],
      Array.isArray(body.newPhotoPaths) ? body.newPhotoPaths : [],
      maxPhotos,
    )
  } catch (error) {
    throw new RequestError(error instanceof Error ? error.message : 'One or more selected photos are invalid.')
  }
  const { keepPaths: keepPhotoPaths, newPaths: newPhotoPaths, nextPaths: nextPhotoPaths } = photoSelection

  await validateNewPhotos(service, review.id as string | number, newPhotoPaths)

  const updates: Record<string, unknown> = {
    customer_name: input.customerName,
    college_name: input.collegeName,
    education: input.education,
    project_type: input.projectName,
    rating: input.rating,
    review_text: input.reviewText,
    photo_paths: nextPhotoPaths,
  }
  if (isCustomer) updates.status = getNextReviewStatus(review.status, true)

  let updateQuery = service
    .from('reviews')
    .update(updates)
    .eq('id', review.id)
  if (isCustomer) updateQuery = updateQuery.eq('status', review.status)

  const { data: updatedReview, error: updateError } = await updateQuery
    .select('id, customer_name, college_name, education, project_type, rating, review_text, photo_paths, status')
    .maybeSingle()
  if (updateError) throw updateError
  if (!updatedReview) {
    throw new RequestError(
      isCustomer ? 'The review status changed while editing. Reload and try again.' : 'No review was updated.',
      isCustomer ? 409 : 404,
    )
  }

  return await finishReviewSave(service, review, updatedReview, nextPhotoPaths, newPhotoPaths)
}

async function finishReviewSave(
  service: ReturnType<typeof getServiceClient>,
  review: Record<string, unknown>,
  updatedReview: Record<string, unknown>,
  nextPhotoPaths: string[],
  newPhotoPaths: string[],
) {
  const existingPaths = Array.isArray(review.photo_paths)
    ? review.photo_paths.filter((path): path is string => typeof path === 'string')
    : []
  const removedPaths = existingPaths.filter((path) => !nextPhotoPaths.includes(path))
  let photoCleanupWarning = false
  if (removedPaths.length > 0) {
    const { error: removalError } = await service.storage.from(bucketName).remove(removedPaths)
    if (removalError) {
      console.error('Unable to remove detached customer review photos:', removalError)
      photoCleanupWarning = true
    }
  }

  if (newPhotoPaths.length > 0) {
    const { error: reservationDeleteError } = await service
      .from('review_photo_uploads')
      .delete()
      .in('object_path', newPhotoPaths)
    if (reservationDeleteError) {
      console.error('Unable to clear review photo upload reservations:', reservationDeleteError)
      photoCleanupWarning = true
    }
  }

  return { review: updatedReview, photoCleanupWarning }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405)

  let body: RequestBody
  try {
    const requestText = await request.text()
    if (requestText.length > 64 * 1024) return jsonResponse({ error: 'Request is too large.' }, 413)
    const parsedBody = JSON.parse(requestText)
    if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
      return jsonResponse({ error: 'A JSON object is required.' }, 400)
    }
    body = parsedBody as RequestBody
  } catch {
    return jsonResponse({ error: 'The request body is not valid JSON.' }, 400)
  }

  try {
    const action = stringValue(body.action)
    const service = getServiceClient()

    if (action === 'create') {
      await enforceRateLimit(service, request, 'review-create', 5, 60 * 60)
      const input = normalizeReviewInput(body)
      const token = makeEditToken()
      const tokenHash = await hashEditToken(token)
      const { error } = await service.rpc('create_customer_review_with_edit_token', {
        p_customer_name: input.customerName,
        p_college_name: input.collegeName,
        p_education: input.education,
        p_project_type: input.projectName,
        p_rating: input.rating,
        p_review_text: input.reviewText,
        p_edit_token_hash: tokenHash,
      })
      if (error) throw error
      return jsonResponse({ editToken: token }, 201)
    }

    if (action === 'customer-load') {
      await enforceRateLimit(service, request, 'customer-token', 60, 15 * 60)
      const review = await getCustomerReview(service, stringValue(body.editToken))
      const photos = await createSignedPhotoUrls(service, review.photo_paths ?? [])
      return jsonResponse({
        review: {
          customerName: review.customer_name,
          collegeName: review.college_name ?? '',
          education: review.education ?? '',
          projectName: review.project_type,
          rating: review.rating,
          reviewText: review.review_text,
          status: review.status,
        },
        photos,
      })
    }

    if (action === 'customer-prepare-upload' || action === 'customer-cancel-upload'
      || action === 'customer-save') {
      await enforceRateLimit(service, request, 'customer-token', 60, 15 * 60)
      const review = await getCustomerReview(service, stringValue(body.editToken))
      if (action === 'customer-prepare-upload') {
        await removeStalePhotoReservations(service, review)
        return jsonResponse(await preparePhotoUpload(service, review, body))
      }
      if (action === 'customer-cancel-upload') {
        const path = validatePhotoPath(review.id, body.objectPath)
        const { data: reservation, error: reservationError } = await service
          .from('review_photo_uploads')
          .select('object_path')
          .eq('review_id', String(review.id))
          .eq('object_path', path)
          .maybeSingle()
        if (reservationError) throw reservationError
        if (!reservation) throw new RequestError('This photo upload is not reserved.', 403)
        const { error: deleteError } = await service.storage.from(bucketName).remove([path])
        if (deleteError) throw deleteError
        const { error } = await service.from('review_photo_uploads').delete()
          .eq('review_id', String(review.id)).eq('object_path', path)
        if (error) throw error
        return jsonResponse({ ok: true })
      }
      const result = await saveReview(service, review, body, true)
      return jsonResponse(result)
    }

    if (
      action === 'admin-load'
      || action === 'admin-prepare-upload'
      || action === 'admin-cancel-upload'
      || action === 'admin-save'
      || action === 'admin-status'
      || action === 'admin-replace-token'
      || action === 'admin-delete'
    ) {
      await authorizeAdmin(request)
      const review = await getAdminReview(service, body.reviewId)
      if (action === 'admin-load') {
        return jsonResponse({
          review,
          photos: await createSignedPhotoUrls(service, review.photo_paths ?? []),
        })
      }
      if (action === 'admin-replace-token') {
        const token = makeEditToken()
        const tokenHash = await hashEditToken(token)
        const { data, error } = await service.rpc('replace_review_edit_token', {
          p_review_id: String(review.id),
          p_token_hash: tokenHash,
        })
        if (error) throw error
        if (!data) throw new Error('Replacement edit token was not created.')
        return jsonResponse({ editToken: token, expiresAt: data })
      }
      if (action === 'admin-prepare-upload') {
        await removeStalePhotoReservations(service, review)
        return jsonResponse(await preparePhotoUpload(service, review, body))
      }
      if (action === 'admin-cancel-upload') {
        const path = validatePhotoPath(review.id, body.objectPath)
        const { data: reservation, error: reservationError } = await service
          .from('review_photo_uploads')
          .select('object_path')
          .eq('review_id', String(review.id))
          .eq('object_path', path)
          .maybeSingle()
        if (reservationError) throw reservationError
        if (!reservation) throw new RequestError('This photo upload is not reserved.', 403)
        const { error: deleteError } = await service.storage.from(bucketName).remove([path])
        if (deleteError) throw deleteError
        const { error } = await service.from('review_photo_uploads').delete()
          .eq('review_id', String(review.id)).eq('object_path', path)
        if (error) throw error
        return jsonResponse({ ok: true })
      }
      if (action === 'admin-delete') {
        const { error: revokeError } = await service.from('review_edit_tokens')
          .update({ revoked_at: new Date().toISOString() })
          .eq('review_id', String(review.id))
        if (revokeError) throw revokeError
        if (review.photo_paths?.length) {
          const { error } = await service.storage.from(bucketName).remove(review.photo_paths)
          if (error) throw error
        }
        const { data, error } = await service.from('reviews').delete().eq('id', review.id).select('id').maybeSingle()
        if (error) throw error
        if (!data) throw new RequestError('No review was deleted.', 404)
        let cleanupWarning = false
        const { error: reservationError } = await service.from('review_photo_uploads')
          .delete().eq('review_id', String(review.id))
        if (reservationError) {
          console.error('Unable to remove deleted review photo reservations:', reservationError)
          cleanupWarning = true
        }
        return jsonResponse({ ok: true, cleanupWarning })
      }
      if (action === 'admin-status') {
        const status = stringValue(body.status)
        if (!isReviewStatus(status)) {
          throw new RequestError('Select a valid review status.')
        }
        const { data, error } = await service.from('reviews')
          .update({ status })
          .eq('id', review.id)
          .select('id, status')
          .maybeSingle()
        if (error) throw error
        if (!data) throw new RequestError('No review status was updated.', 404)
        return jsonResponse({ review: data })
      }
      const result = await saveReview(service, review, body, false)
      return jsonResponse(result)
    }

    throw new RequestError('Unknown review management action.')
  } catch (error) {
    if (error instanceof RequestError) {
      return jsonResponse(
        { error: error.message },
        error.status,
        error.status === 429 ? { 'Retry-After': '60' } : {},
      )
    }
    if (error instanceof Error && 'status' in error && error.status === 429) {
      return jsonResponse({ error: error.message }, 429, { 'Retry-After': '60' })
    }
    console.error('Review management request failed:', error)
    return jsonResponse({ error: 'Unable to complete the review request.' }, 500)
  }
})
