export function normalizeReviewInput(body) {
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : ''
  const collegeName = typeof body.collegeName === 'string' ? body.collegeName.trim() : ''
  const education = typeof body.education === 'string' ? body.education : ''
  const projectName = typeof body.projectName === 'string' ? body.projectName.trim() : ''
  const reviewText = typeof body.reviewText === 'string' ? body.reviewText.trim() : ''
  const rating = Number(body.rating)

  if (customerName.length < 1 || customerName.length > 120) {
    throw new Error('Customer name must be between 1 and 120 characters.')
  }
  if (collegeName.length < 1 || collegeName.length > 120) {
    throw new Error('College name must be between 1 and 120 characters.')
  }
  if (education !== 'Engineering' && education !== 'Diploma') {
    throw new Error('Select Engineering or Diploma.')
  }
  if (projectName.length < 1 || projectName.length > 200) {
    throw new Error('Select a valid project.')
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5.')
  }
  if (reviewText.length < 10 || reviewText.length > 1000) {
    throw new Error('Review text must be between 10 and 1000 characters.')
  }

  return { customerName, collegeName, education, projectName, rating, reviewText }
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

export function isReviewStatus(status) {
  return ['pending', 'approved', 'rejected'].includes(status)
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
