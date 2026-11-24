import assert from 'node:assert/strict'
import test from 'node:test'
import { createPublicContentApi } from './publicContentApi.mjs'

function createMockClient(tables) {
  const queries = []
  return {
    queries,
    from(table) {
      const query = { table, filters: [], selection: '' }
      queries.push(query)
      const builder = {
        select(selection) {
          query.selection = selection
          return builder
        },
        eq(field, value) {
          query.filters.push((row) => row[field] === value)
          return builder
        },
        in(field, values) {
          query.filters.push((row) => values.includes(row[field]))
          return builder
        },
        lte(field, value) {
          query.filters.push((row) => row[field] <= value)
          return builder
        },
        or(expression) {
          query.or = expression
          return builder
        },
        order(field, options) {
          query.order = { field, options }
          return builder
        },
        limit(count) {
          query.limit = count
          return builder
        },
        maybeSingle() {
          const data = (tables[table] || []).filter((row) => query.filters.every((filter) => filter(row)))[0] || null
          return Promise.resolve({ data, error: null })
        },
        then(resolve, reject) {
          let data = (tables[table] || []).filter((row) => query.filters.every((filter) => filter(row)))
          if (query.order) {
            const { field } = query.order
            data = [...data].sort((first, second) => first[field] - second[field])
          }
          if (query.limit) data = data.slice(0, query.limit)
          return Promise.resolve({ data, error: null }).then(resolve, reject)
        },
      }
      return builder
    },
  }
}

test('published page reads exclude drafts and select no draft fields', async () => {
  const client = createMockClient({
    site_pages: [
      { slug: 'home', title: 'Published home', status: 'published', published_content: { hero: { title: 'Live' } }, published_seo: {} },
      { slug: 'home', title: 'Draft home', status: 'draft', draft_content: { hero: { title: 'Private' } }, draft_seo: {} },
    ],
  })
  const api = createPublicContentApi(client)

  const page = await api.fetchPublishedPage('home')

  assert.equal(page.title, 'Published home')
  assert.equal(page.published_content.hero.title, 'Live')
  assert.deepEqual(client.queries[0].filters.length, 2)
  assert.equal(client.queries[0].selection.includes('draft_'), false)
})

test('published service reads include only published enabled services and available packages', async () => {
  const client = createMockClient({
    service_categories: [{ id: 'business', slug: 'business-solutions', status: 'published' }],
    services: [
      { id: 'live', category_id: 'business', slug: 'live-service', name: 'Live service', short_description: 'Public', description: 'Details', image_path: 'services/live.webp', status: 'published', enabled: true, details: {}, features: [], faqs: [], sort_order: 0 },
      { id: 'draft', category_id: 'business', slug: 'draft-service', name: 'Draft service', status: 'draft', enabled: true },
      { id: 'disabled', category_id: 'business', slug: 'disabled-service', name: 'Disabled service', status: 'published', enabled: false },
    ],
    service_packages: [
      { id: 'visible', service_id: 'live', slug: 'starter', name: 'Starter', pricing_type: 'fixed', price_minor: 199900, currency: 'INR', status: 'published', available: true, features: [], limitations: [], sort_order: 0 },
      { id: 'draft-package', service_id: 'live', slug: 'draft', name: 'Draft package', pricing_type: 'fixed', price_minor: 10000, currency: 'INR', status: 'draft', available: true, features: [], limitations: [], sort_order: 1 },
      { id: 'hidden-package', service_id: 'live', slug: 'hidden', name: 'Unavailable package', pricing_type: 'fixed', price_minor: 10000, currency: 'INR', status: 'published', available: false, features: [], limitations: [], sort_order: 2 },
    ],
  })
  const api = createPublicContentApi(client, (path) => `https://media.example/${path}`)

  const services = await api.fetchPublishedServices('business-solutions')

  assert.equal(services.length, 1)
  assert.equal(services[0].slug, 'live-service')
  assert.equal(services[0].image, 'https://media.example/services/live.webp')
  assert.deepEqual(services[0].packages.map((item) => item.id), ['starter'])
  assert.equal(client.queries.some((query) => query.table === 'customer_projects'), false)
})

test('portfolio reads use only published public portfolio records', async () => {
  const client = createMockClient({
    portfolio_projects: [
      { id: 'public-id', slug: 'public-work', title: 'Public work', category: 'Software', status: 'published', categories: ['Software'], technologies: [], image_paths: ['portfolio/work.webp'], featured: true, sort_order: 0 },
      { id: 'draft-id', slug: 'draft-work', title: 'Draft work', category: 'Software', status: 'draft', categories: ['Software'], technologies: [], image_paths: [], featured: false, sort_order: 1 },
    ],
  })
  const api = createPublicContentApi(client, (path) => `https://media.example/${path}`)

  const projects = await api.fetchPublishedProjects()

  assert.equal(projects.length, 1)
  assert.equal(projects[0].slug, 'public-work')
  assert.equal(projects[0].image, 'https://media.example/portfolio/work.webp')
  assert.equal(client.queries[0].table, 'portfolio_projects')
  assert.equal(client.queries[0].filters.length, 1)
})

test('public offer and announcement reads exclude drafts', async () => {
  const now = new Date().toISOString()
  const client = createMockClient({
    announcements: [
      { id: 'public', title: 'Published notice', content: 'Visible', status: 'published', display_location: 'home', starts_at: now, ends_at: null },
      { id: 'draft', title: 'Draft notice', content: 'Private', status: 'draft', display_location: 'home', starts_at: now, ends_at: null },
    ],
    offers: [
      { id: 'active', title: 'Active offer', status: 'active', starts_at: now, ends_at: null },
      { id: 'draft', title: 'Draft offer', status: 'draft', starts_at: now, ends_at: null },
    ],
  })
  const api = createPublicContentApi(client)

  const announcements = await api.fetchPublishedAnnouncements('home')
  const offers = await api.fetchPublishedOffers()

  assert.deepEqual(announcements.map((item) => item.id), ['public'])
  assert.deepEqual(offers.map((item) => item.id), ['active'])
})
