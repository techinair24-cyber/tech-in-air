export function createPublicContentCache(onError = () => {}) {
  const values = new Map()
  const errors = new Map()
  const requests = new Map()

  return {
    snapshot(key) {
      return values.has(key)
        ? { found: true, value: values.get(key), error: errors.get(key) || null }
        : { found: false, value: null, error: errors.get(key) || null }
    },

    load(key, loader) {
      if (requests.has(key)) return requests.get(key)

      const request = (async () => {
        try {
          const value = await loader()
          errors.delete(key)
          if (value !== null && value !== undefined) values.set(key, value)
        } catch (error) {
          errors.set(key, error)
          onError(error, key)
        } finally {
          requests.delete(key)
        }

        return values.has(key) ? values.get(key) : null
      })()

      requests.set(key, request)
      return request
    },
  }
}
