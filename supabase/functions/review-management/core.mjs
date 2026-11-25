export class RequestError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

export function normalizeReviewInput(body) {
  const clean = (value) =>
    typeof value === 'string' ? value.trim() : ''

  const customerName = clean(body.customerName)
  const customerType = body.customerType === undefined
    ? 'Student'
    : clean(body.customerType)

  const collegeName = clean(body.collegeName)
  const education = clean(body.education)
  const projectName = clean(body.projectName)
  const companyName = clean(body.companyName)
  const serviceName = clean(body.serviceName)
  const reviewText = clean(body.reviewText)
  const rating = Number(body.rating)

  if (customerName.length < 1 || customerName.length > 120) {
    throw new Error(
      'Customer name must be between 1 and 120 characters.'
    )
  }

  if (!['Student', 'Business', 'Individual'].includes(customerType)) {
    throw new Error('Select a valid customer type.')
  }

  if (customerType === 'Student') {
    if (collegeName.length < 1 || collegeName.length > 120) {
      throw new Error(
        'College name must be between 1 and 120 characters.'
      )
    }

    if (!['Engineering', 'Diploma'].includes(education)) {
      throw new Error('Select Engineering or Diploma.')
    }

    if (projectName.length < 1 || projectName.length > 200) {
      throw new Error('Select a valid project.')
    }
  } else {
    if (serviceName.length < 1 || serviceName.length > 200) {
      throw new Error('Select a valid service.')
    }

    if (customerType === 'Business' && companyName.length > 120) {
      throw new Error(
        'Company name must not exceed 120 characters.'
      )
    }
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5.')
  }

  if (reviewText.length < 10 || reviewText.length > 1000) {
    throw new Error(
      'Review text must be between 10 and 1000 characters.'
    )
  }

  return {
    customerName,
    customerType,
    collegeName: customerType === 'Student' ? collegeName : null,
    education: customerType === 'Student' ? education : null,
    projectName: customerType === 'Student' ? projectName : null,
    companyName: customerType === 'Business'
      ? companyName || null
      : null,
    serviceName: customerType !== 'Student' ? serviceName : null,
    rating,
    reviewText,
  }
}

export function makeEditToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

export async function hashEditToken(token) {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    throw new Error('The edit link is invalid or expired.')
  }
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function isEditTokenActive(credential, now = Date.now()) {
  if (!credential || credential.revoked_at) return false
  const expiresAt = Date.parse(credential.expires_at)
  return Number.isFinite(expiresAt) && expiresAt > now
}

function equalTokenHashes(first, second) {
  if (
    typeof first !== 'string'
    || typeof second !== 'string'
    || !/^[0-9a-f]{64}$/.test(first)
    || !/^[0-9a-f]{64}$/.test(second)
  ) return false

  let difference = 0
  for (let index = 0; index < first.length; index += 1) {
    difference |= first.charCodeAt(index) ^ second.charCodeAt(index)
  }
  return difference === 0
}

export function matchesActiveEditToken(credential, tokenHash, now = Date.now()) {
  return isEditTokenActive(credential, now) && equalTokenHashes(credential.token_hash, tokenHash)
}

export function hasAdminRole(user) {
  return user?.app_metadata?.role === 'admin'
}

export async function verifyAdminRequest(request, { supabaseUrl, anonKey, createClient }) {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ') || !supabaseUrl || !anonKey) {
    throw new RequestError('Administrator authentication is required.', 401)
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: authorization } },
  })
  const { data, error } = await authClient.auth.getUser()
  if (error || !hasAdminRole(data?.user)) {
    throw new RequestError('Administrator access is required.', 403)
  }
}

export function isReviewStatus(status) {
  return ['pending', 'approved', 'rejected'].includes(status)
}

const adminReviewFields = 'id, customer_name, customer_type, college_name, education, project_type, company_name, service_name, rating, review_text, photo_paths, status, created_at'
const adminReviewStatuses = ['pending', 'approved', 'rejected']
const defaultAdminPageSize = 25
const maxAdminPageSize = 100
const maxAdminPage = 100_000

function parseAdminPageValue(value, defaultValue, maximum, fieldName) {
  if (value === undefined) return defaultValue
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) {
    throw new RequestError(`${fieldName} must be an integer between 1 and ${maximum}.`)
  }
  return value
}

function requireExactCount(result) {
  if (!Number.isSafeInteger(result.count) || result.count < 0) {
    throw new Error('An exact review count was not returned.')
  }
  return result.count
}

export async function listAdminReviews(service, body) {
  const page = parseAdminPageValue(body.page, 1, maxAdminPage, 'Page')
  const pageSize = parseAdminPageValue(body.pageSize, defaultAdminPageSize, maxAdminPageSize, 'Page size')
  const offset = (page - 1) * pageSize

  const pageQuery = service.from('reviews')
    .select(adminReviewFields, { count: 'exact' })
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(offset, offset + pageSize - 1)
  const statusCountQueries = adminReviewStatuses.map((status) => service.from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('status', status))

  const [pageResult, ...statusCountResults] = await Promise.all([pageQuery, ...statusCountQueries])
  for (const result of [pageResult, ...statusCountResults]) {
    if (result.error) throw result.error
  }
  if (!Array.isArray(pageResult.data)) {
    throw new Error('The review list response was invalid.')
  }

  const total = requireExactCount(pageResult)
  const [pending, approved, rejected] = statusCountResults.map(requireExactCount)
  return {
    reviews: pageResult.data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
    counts: { total, pending, approved, rejected },
  }
}

export async function consumeRateLimit(service, keyHash, maxRequests, windowSeconds) {
  const { data, error } = await service.rpc('consume_review_management_rate_limit', {
    p_key_hash: keyHash,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds,
  })
  if (error) throw error
  if (data !== true) {
    const rateLimitError = new Error('Too many requests. Please wait a while and try again.')
    rateLimitError.status = 429
    throw rateLimitError
  }
}

export async function hashRateLimitKey(scope, clientIdentifier) {
  const input = new TextEncoder().encode(`${scope}:${clientIdentifier}`)
  const digest = await crypto.subtle.digest('SHA-256', input)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function validatePhotoPath(reviewId, path) {
  const value = typeof path === 'string' ? path : ''
  const prefix = `${reviewId}/`
  if (!value.startsWith(prefix) || value.length > 160 || value.includes('..') || value.split('/').length !== 2) {
    throw new Error('One or more selected photos are invalid.')
  }
  return value
}

export function normalizePhotoSelection(reviewId, existingPaths, keepPaths, newPaths, maxPhotos = 5) {
  if (!Array.isArray(keepPaths) || !Array.isArray(newPaths)) {
    throw new Error('One or more selected photos are invalid.')
  }
  const kept = keepPaths.map((path) => validatePhotoPath(reviewId, path))
  const added = newPaths.map((path) => validatePhotoPath(reviewId, path))
  if (new Set(kept).size !== kept.length || kept.some((path) => !existingPaths.includes(path))) {
    throw new Error('One or more selected photos do not belong to this review.')
  }
  const next = [...kept, ...added]
  if (next.length > maxPhotos || new Set(next).size !== next.length) {
    throw new Error(`A review can include no more than ${maxPhotos} unique photos.`)
  }
  return {
    keepPaths: kept,
    newPaths: added,
    nextPaths: next,
    removedPaths: existingPaths.filter((path) => !next.includes(path)),
  }
}

export function getNextReviewStatus(status, isCustomer) {
  return isCustomer && status === 'approved' ? 'pending' : status
}
