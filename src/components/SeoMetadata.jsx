import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeoMetadata, LOGO_URL, SITE_URL } from '../seo'
import { businessServices } from '../data/businessSolutions'
import projects from '../data/projects'
import { usePublishedPage, usePublishedProjects, usePublishedServices } from '../lib/publicContent'

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
  const cmsSlug = pathname === '/' ? 'home'
    : pathname === '/about' ? 'about'
      : pathname === '/services' ? 'academic-solutions'
        : pathname === '/business-solutions' ? 'business-solutions'
          : ['/contact', '/projects', '/process'].includes(pathname)
            ? pathname.slice(1)
            : /^(\/business-solutions\/[^/]+|\/projects\/[^/]+|\/admin(?:\/|$)|\/review(?:\/|$))/.test(pathname)
              ? ''
              : pathname.replace(/^\/+|\/+$/g, '')
  const { title: cmsPageTitle, seo } = usePublishedPage(cmsSlug)
  const { data: publishedServices } = usePublishedServices('business-solutions')
  const { data: publishedProjects } = usePublishedProjects()

  useEffect(() => {
    const serviceList = publishedServices === null ? businessServices : publishedServices
    const service = serviceList.find((item) => pathname === `/business-solutions/${item.slug}`)
    const projectList = publishedProjects === null ? projects : publishedProjects
    const project = projectList.find((item) => pathname === `/projects/${item.slug || item.id}`)
    const metadata = getSeoMetadata(pathname) || (service ? {
      title: `${service.title} | Tech In Air`,
      description: service.detailedDescription || service.shortDescription,
      url: `${SITE_URL}${pathname}`,
      image: LOGO_URL,
    } : project ? {
      title: `${project.title} | Tech In Air`,
      description: project.description,
      url: `${SITE_URL}${pathname}`,
      image: project.image ? new URL(project.image, SITE_URL).href : LOGO_URL,
    } : cmsPageTitle ? {
      title: `${cmsPageTitle} | Tech In Air`,
      description: typeof seo?.description === 'string' && seo.description.trim()
        ? seo.description.trim()
        : `${cmsPageTitle} from Tech In Air.`,
      url: `${SITE_URL}${pathname}`,
      image: LOGO_URL,
    } : null)
    if (metadata && seo && typeof seo === 'object') {
      if (typeof seo.title === 'string' && seo.title.trim()) metadata.title = seo.title.trim()
      if (typeof seo.description === 'string' && seo.description.trim()) metadata.description = seo.description.trim()
    }
    let structuredData = document.head.querySelector('script[data-tech-in-air-jsonld]')
    if (structuredData) structuredData.remove()

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

    if (service) {
      structuredData = document.createElement('script')
      structuredData.type = 'application/ld+json'
      structuredData.setAttribute('data-tech-in-air-jsonld', 'true')
      structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            name: service.title,
            description: service.detailedDescription,
            provider: {
              '@type': 'Organization',
              name: 'Tech in Air',
              url: 'https://tech-in-air.vercel.app',
            },
            areaServed: 'India',
            offers: service.packages
              .filter((pkg) => Number.isSafeInteger(pkg.priceMinor) && pkg.priceMinor >= 0)
              .map((pkg) => ({
              '@type': 'Offer',
              name: pkg.name,
              priceSpecification: {
                '@type': 'PriceSpecification',
                price: (pkg.priceMinor / 100).toFixed(2),
                priceCurrency: pkg.currency || 'INR',
                ...(pkg.billingInterval ? { unitText: pkg.billingInterval } : {}),
              },
              })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tech-in-air.vercel.app/' },
              { '@type': 'ListItem', position: 2, name: 'Business Solutions', item: 'https://tech-in-air.vercel.app/business-solutions' },
              { '@type': 'ListItem', position: 3, name: service.title, item: metadata.url },
            ],
          },
        ],
      })
      document.head.appendChild(structuredData)
    }
  }, [cmsPageTitle, pathname, seo, publishedProjects, publishedServices])

  return null
}
