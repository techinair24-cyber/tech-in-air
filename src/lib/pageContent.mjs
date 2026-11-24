export function getPublishedSection(content, type) {
  if (!Array.isArray(content?.sections)) return null
  return content.sections.find((section) => section?.type === type) || null
}

export function getPageText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export function getSiteSettings(content) {
  const settings = content?.siteSettings
  return settings && typeof settings === 'object' && !Array.isArray(settings) ? settings : {}
}

export function getSafeInternalPath(value, allowedPaths) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null
  if (allowedPaths.has(value)) return value
  const slug = value.slice(1)
  if (!/^[a-z0-9]+(?:[/-][a-z0-9-]+)*$/.test(slug)) return null
  if (/^(admin|api|login|logout|reviews|review|auth|assets|functions)(\/|$)/.test(slug)) return null
  return value
}

export function getSafeExternalUrl(value) {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'mailto:' || url.protocol === 'tel:'
      ? url.href
      : null
  } catch {
    return null
  }
}

export function getSectionItems(section, fallback = []) {
  if (Array.isArray(section?.items)) return section.items
  if (Array.isArray(section?.features)) return section.features
  return Array.isArray(fallback) ? fallback : []
}
