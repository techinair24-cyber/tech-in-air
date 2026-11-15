import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeoMetadata } from '../seo'

const metaTags = [
  ['name', 'description'],
  ['property', 'og:title'],
  ['property', 'og:description'],
  ['property', 'og:type'],
  ['property', 'og:site_name'],
  ['property', 'og:url'],
  ['property', 'og:image'],
  ['property', 'og:image:alt'],
  ['name', 'twitter:card'],
  ['name', 'twitter:title'],
  ['name', 'twitter:description'],
  ['name', 'twitter:image'],
  ['name', 'twitter:image:alt'],
]

function updateMetaTag(attribute, name, content) {
  const matches = document.head.querySelectorAll(`meta[${attribute}="${name}"]`)
  let element = matches[0]

  matches.forEach((match, index) => {
    if (index > 0) match.remove()
  })

  if (!content) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function updateCanonical(url) {
  const matches = document.head.querySelectorAll('link[rel="canonical"]')
  let element = matches[0]

  matches.forEach((match, index) => {
    if (index > 0) match.remove()
  })

  if (!url) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', url)
}

export default function SeoMetadata() {
  const { pathname } = useLocation()

  useEffect(() => {
    const metadata = getSeoMetadata(pathname)

    if (!metadata) {
      document.title = 'Tech in Air'
      metaTags.forEach(([attribute, name]) => updateMetaTag(attribute, name, null))
      updateCanonical(null)
      return
    }

    document.title = metadata.title
    updateMetaTag('name', 'description', metadata.description)
    updateMetaTag('property', 'og:title', metadata.title)
    updateMetaTag('property', 'og:description', metadata.description)
    updateMetaTag('property', 'og:type', 'website')
    updateMetaTag('property', 'og:site_name', 'Tech in Air')
    updateMetaTag('property', 'og:url', metadata.url)
    updateMetaTag('property', 'og:image', metadata.image)
    updateMetaTag('property', 'og:image:alt', 'Tech in Air logo')
    updateMetaTag('name', 'twitter:card', 'summary_large_image')
    updateMetaTag('name', 'twitter:title', metadata.title)
    updateMetaTag('name', 'twitter:description', metadata.description)
    updateMetaTag('name', 'twitter:image', metadata.image)
    updateMetaTag('name', 'twitter:image:alt', 'Tech in Air logo')
    updateCanonical(metadata.url)
  }, [pathname])

  return null
}
