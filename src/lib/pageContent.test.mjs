import assert from 'node:assert/strict'
import test from 'node:test'
import { getSafeExternalUrl, getSafeInternalPath } from './pageContent.mjs'

const knownPaths = new Set(['/contact'])

test('safe page links allow known and valid published page paths', () => {
  assert.equal(getSafeInternalPath('/contact', knownPaths), '/contact')
  assert.equal(getSafeInternalPath('/new-service-page', knownPaths), '/new-service-page')
})

test('page links reject protocol-relative, reserved, and executable URLs', () => {
  assert.equal(getSafeInternalPath('//example.com', knownPaths), null)
  assert.equal(getSafeInternalPath('/admin/settings', knownPaths), null)
  assert.equal(getSafeInternalPath('/page?redirect=https://example.com', knownPaths), null)
  assert.equal(getSafeExternalUrl('javascript:alert(1)'), null)
  assert.equal(getSafeExternalUrl('https://example.com'), 'https://example.com/')
})
