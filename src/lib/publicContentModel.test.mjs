import assert from 'node:assert/strict'
import test from 'node:test'
import { formatPackagePrice, mapBusinessService } from './publicContentModel.mjs'

test('formats published package prices using their configured currency and interval', () => {
  assert.equal(formatPackagePrice({
    pricing_type: 'starting',
    price_minor: 199900,
    currency: 'INR',
    billing_interval: 'month',
  }), 'Starting at ₹1,999/month')
  assert.equal(formatPackagePrice({
    pricing_type: 'fixed',
    price_minor: 12550,
    currency: 'USD',
    billing_interval: null,
  }), '$125.5')
})

test('maps only published and available packages into public service data', () => {
  const service = {
    id: 'service-1',
    slug: 'service-one',
    name: 'Service One',
    short_description: 'Short description',
    description: 'Details',
    enabled: true,
    details: {},
  }
  const packages = [
    { id: 'hidden', service_id: 'service-1', slug: 'hidden', status: 'draft', available: true, sort_order: 0 },
    { id: 'unavailable', service_id: 'service-1', slug: 'unavailable', status: 'published', available: false, sort_order: 1 },
    { id: 'visible', service_id: 'service-1', slug: 'visible', name: 'Visible', status: 'published', available: true, sort_order: 2, pricing_type: 'custom', price_minor: null, features: [], limitations: [] },
  ]

  const result = mapBusinessService(service, packages)
  assert.equal(result.title, 'Service One')
  assert.deepEqual(result.packages.map((item) => item.id), ['visible'])
  assert.equal(result.packages[0].price, 'Custom quotation')
})
