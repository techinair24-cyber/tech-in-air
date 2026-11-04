import assert from 'node:assert/strict'
import test from 'node:test'
import {
  consumeRateLimit,
  hasAdminRole,
  getNextReviewStatus,
  hashEditToken,
  hashRateLimitKey,
  isEditTokenActive,
  isReviewStatus,
  matchesActiveEditToken,
  makeEditToken,
  normalizePhotoSelection,
  normalizeReviewInput,
  validatePhotoPath,
} from '../functions/review-management/core.mjs'

test('edit tokens are cryptographically random URL-safe 256-bit values', () => {
  const first = makeEditToken()
  const second = makeEditToken()
  assert.match(first, /^[A-Za-z0-9_-]{43}$/)
  assert.notEqual(first, second)
})

test('only a SHA-256 hash is suitable for the stored token value', async () => {
  const token = makeEditToken()
  const hash = await hashEditToken(token)
  assert.match(hash, /^[0-9a-f]{64}$/)
  assert.equal(await hashEditToken(token), hash)
  assert.notEqual(hash, token)
})

test('review fields are trimmed and validated', () => {
  assert.deepEqual(normalizeReviewInput({
    customerName: '  Customer  ',
    collegeName: '  College  ',
    education: 'Engineering',
    projectName: '  Project  ',
    rating: 5,
    reviewText: '  A sufficiently detailed review.  ',
  }), {
    customerName: 'Customer',
    collegeName: 'College',
    education: 'Engineering',
    projectName: 'Project',
    rating: 5,
    reviewText: 'A sufficiently detailed review.',
  })
})

test('review validation rejects unsupported education choices', () => {
  assert.throws(() => normalizeReviewInput({
    customerName: 'Name',
    collegeName: 'College',
    education: 'Other',
    projectName: 'Project',
    rating: 5,
    reviewText: 'A sufficiently detailed review.',
  }), /Engineering or Diploma/)
})

test('review validation rejects ratings outside the supported range', () => {
  assert.throws(() => normalizeReviewInput({
    customerName: 'Name',
    collegeName: 'College',
    education: 'Diploma',
    projectName: 'Project',
    rating: 6,
    reviewText: 'A sufficiently detailed review.',
  }), /Rating must be between 1 and 5/)
})

test('edit token verification rejects malformed credentials', async () => {
  await assert.rejects(() => hashEditToken('review-id'))
  await assert.rejects(() => hashEditToken(''))
})

test('valid, expired, and revoked token credentials are distinguished', async () => {
  const tokenHash = await hashEditToken(makeEditToken())
  const now = Date.parse('2026-11-04T00:00:00.000Z')
  const valid = { token_hash: tokenHash, expires_at: '2027-02-02T00:00:00.000Z', revoked_at: null }
  const expired = { ...valid, expires_at: '2026-11-03T23:59:59.000Z' }
  const revoked = { ...valid, revoked_at: '2026-11-03T12:00:00.000Z' }

  assert.equal(matchesActiveEditToken(valid, tokenHash, now), true)
  assert.equal(isEditTokenActive(expired, now), false)
  assert.equal(matchesActiveEditToken(expired, tokenHash, now), false)
  assert.equal(isEditTokenActive(revoked, now), false)
  assert.equal(matchesActiveEditToken(revoked, tokenHash, now), false)
  assert.equal(matchesActiveEditToken(null, tokenHash, now), false)
})

test('replacing a token hash invalidates the previous edit token', async () => {
  const oldHash = await hashEditToken(makeEditToken())
  const newHash = await hashEditToken(makeEditToken())
  const replacementCredential = {
    token_hash: newHash,
    expires_at: '2027-02-02T00:00:00.000Z',
    revoked_at: null,
  }

  assert.equal(matchesActiveEditToken(replacementCredential, oldHash, Date.parse('2026-11-04T00:00:00Z')), false)
  assert.equal(matchesActiveEditToken(replacementCredential, newHash, Date.parse('2026-11-04T00:00:00Z')), true)
})

test('repeated failed token requests are blocked by the rate limiter with HTTP 429', async () => {
  const counts = new Map()
  const service = {
    async rpc(_functionName, { p_key_hash, p_max_requests }) {
      const requestCount = (counts.get(p_key_hash) ?? 0) + 1
      counts.set(p_key_hash, requestCount)
      return { data: requestCount <= p_max_requests, error: null }
    },
  }
  const keyHash = await hashRateLimitKey('customer-token', '203.0.113.8')

  await consumeRateLimit(service, keyHash, 3, 900)
  await consumeRateLimit(service, keyHash, 3, 900)
  await consumeRateLimit(service, keyHash, 3, 900)
  await assert.rejects(
    () => consumeRateLimit(service, keyHash, 3, 900),
    (error) => error.status === 429,
  )
})

test('photo edits cannot reference another review and remain within five photos', () => {
  const ownPaths = ['review-1/a.jpg', 'review-1/b.jpg']
  assert.deepEqual(
    normalizePhotoSelection('review-1', ownPaths, ['review-1/b.jpg'], ['review-1/c.jpg']).nextPaths,
    ['review-1/b.jpg', 'review-1/c.jpg'],
  )
  assert.throws(
    () => normalizePhotoSelection('review-1', ownPaths, ['review-2/a.jpg'], []),
    /invalid|do not belong/i,
  )
  assert.throws(
    () => normalizePhotoSelection('review-1', [], [], ['review-1/a.jpg', 'review-1/b.jpg', 'review-1/c.jpg', 'review-1/d.jpg', 'review-1/e.jpg', 'review-1/f.jpg']),
    /no more than 5/,
  )
  assert.throws(() => validatePhotoPath('review-1', 'review-1/../secret.png'), /invalid/)
})

test('customer edits return approved reviews to pending without allowing approval changes', () => {
  assert.equal(getNextReviewStatus('approved', true), 'pending')
  assert.equal(getNextReviewStatus('pending', true), 'pending')
  assert.equal(getNextReviewStatus('rejected', true), 'rejected')
  assert.equal(getNextReviewStatus('approved', false), 'approved')
})

test('authenticated admins retain edit authorization and approval statuses', () => {
  assert.equal(hasAdminRole({ app_metadata: { role: 'admin' } }), true)
  assert.equal(hasAdminRole({ app_metadata: { role: 'authenticated' } }), false)
  assert.equal(getNextReviewStatus('pending', false), 'pending')
  assert.equal(getNextReviewStatus('approved', false), 'approved')
  assert.equal(isReviewStatus('approved'), true)
  assert.equal(isReviewStatus('rejected'), true)
  assert.equal(isReviewStatus('invalid'), false)
})
