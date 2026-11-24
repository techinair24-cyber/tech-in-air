import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { createPublicContentCache } from './publicContentCache.mjs'
import { createPublicContentApi } from './publicContentApi.mjs'

const refreshEventName = 'tech-in-air:public-content-refresh'
const publicContentCache = createPublicContentCache((error, key) => {
  console.error(`Unable to refresh published website content (${key}):`, error)
})

export function getPublicMediaUrl(path) {
  if (typeof path !== 'string' || !path.trim()) return ''
  const normalizedPath = path.trim()
  if (normalizedPath.startsWith('/') && !normalizedPath.startsWith('//')) return normalizedPath
  if (normalizedPath.includes('..') || normalizedPath.includes('\\')) return ''
  return supabase?.storage.from('site-media').getPublicUrl(normalizedPath).data.publicUrl || ''
}

const publicContentApi = createPublicContentApi(supabase, getPublicMediaUrl)

export const fetchPublishedPage = (slug) => publicContentApi.fetchPublishedPage(slug)
export const fetchPublishedAnnouncements = (location) => publicContentApi.fetchPublishedAnnouncements(location)
export const fetchPublishedOffers = () => publicContentApi.fetchPublishedOffers()
export const fetchPublishedServices = (categorySlug) => publicContentApi.fetchPublishedServices(categorySlug)
export const fetchPublishedProjects = () => publicContentApi.fetchPublishedProjects()

function usePublicResource(key, loader) {
  const [state, setState] = useState(() => {
    const cached = publicContentCache.snapshot(key)
    return { key, data: cached.value, loading: !cached.found, error: Boolean(cached.error) }
  })

  useEffect(() => {
    let active = true
    const refresh = () => {
      const cached = publicContentCache.snapshot(key)
      if (cached.found && active) {
        setState({ key, data: cached.value, loading: false, error: Boolean(cached.error) })
      }

      publicContentCache.load(key, loader).then((data) => {
        const latest = publicContentCache.snapshot(key)
        if (active) setState({ key, data, loading: false, error: Boolean(latest.error) })
      })
    }

    refresh()
    window.addEventListener(refreshEventName, refresh)
    return () => {
      active = false
      window.removeEventListener(refreshEventName, refresh)
    }
  }, [key, loader])

  if (state.key === key) return state
  const cached = publicContentCache.snapshot(key)
  return { key, data: cached.value, loading: !cached.found, error: Boolean(cached.error) }
}

export function usePublishedPage(slug) {
  const key = `page:${slug || ''}`
  const load = useCallback(() => fetchPublishedPage(slug), [slug])
  const result = usePublicResource(key, load)
  return {
    title: result.data?.title || null,
    content: result.data?.published_content || null,
    seo: result.data?.published_seo || null,
    loading: result.loading,
    error: result.error,
  }
}

export function usePublishedAnnouncements(displayLocation) {
  const key = `announcements:${displayLocation}`
  const load = useCallback(() => fetchPublishedAnnouncements(displayLocation), [displayLocation])
  const result = usePublicResource(key, load)
  return Array.isArray(result.data) ? result.data : []
}

export function usePublishedOffers() {
  const load = useCallback(() => fetchPublishedOffers(), [])
  const result = usePublicResource('offers', load)
  return Array.isArray(result.data) ? result.data : []
}

export function usePublishedServices(categorySlug) {
  const key = `services:${categorySlug}`
  const load = useCallback(() => fetchPublishedServices(categorySlug), [categorySlug])
  const result = usePublicResource(key, load)
  return { data: result.data, loading: result.loading, error: result.error }
}

export function usePublishedProjects() {
  const load = useCallback(() => fetchPublishedProjects(), [])
  const result = usePublicResource('projects', load)
  return { data: result.data, loading: result.loading, error: result.error }
}
