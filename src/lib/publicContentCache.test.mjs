import assert from 'node:assert/strict'
import test from 'node:test'
import { createPublicContentCache } from './publicContentCache.mjs'

test('public content cache deduplicates concurrent requests', async () => {
  const cache = createPublicContentCache()
  let calls = 0
  let finishRequest
  const loader = () => {
    calls += 1
    return new Promise((resolve) => {
      finishRequest = resolve
    })
  }

  const first = cache.load('home', loader)
  const second = cache.load('home', loader)
  assert.equal(calls, 1)

  finishRequest({ title: 'Published' })
  assert.deepEqual(await Promise.all([first, second]), [
    { title: 'Published' },
    { title: 'Published' },
  ])
})

test('public content cache retains the last successful value after a failed refresh', async () => {
  const errors = []
  const cache = createPublicContentCache((error, key) => errors.push([error.message, key]))
  await cache.load('home', async () => ({ title: 'Published' }))

  const retained = await cache.load('home', async () => {
    throw new Error('Temporary network failure')
  })

  assert.deepEqual(retained, { title: 'Published' })
  assert.deepEqual(errors, [['Temporary network failure', 'home']])
  assert.equal(cache.snapshot('home').error.message, 'Temporary network failure')
})

test('public content cache stores empty published collections', async () => {
  const cache = createPublicContentCache()
  assert.deepEqual(await cache.load('projects', async () => []), [])
  assert.deepEqual(cache.snapshot('projects'), { found: true, value: [], error: null })
})
