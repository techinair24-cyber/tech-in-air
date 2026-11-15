import projects from './data/projects'

export const SITE_URL = 'https://tech-in-air.vercel.app'
export const LOGO_URL = `${SITE_URL}/Projects/tech-in-air-logo.jpeg`

const routeMetadata = {
  '/': {
    title: 'Tech in Air | AI, IoT & Software Project Development',
    description: 'Tech in Air develops Software, AI/ML, IoT and Embedded Systems projects, with project explanation, documentation and hardware setup support in Bangalore.',
  },
  '/about': {
    title: 'About Tech in Air | Technology Project Development in Bangalore',
    description: 'Tech in Air is a technology-focused project development initiative based in Bangalore, working across Software, AI, Machine Learning, IoT and Embedded Systems.',
  },
  '/services': {
    title: 'Tech in Air Services | Software, AI/ML, IoT & Embedded Systems',
    description: 'Explore Tech in Air project development, project explanation, documentation, demonstrations and hardware setup support for technology projects.',
  },
  '/projects': {
    title: 'Tech in Air Projects | Software, AI/ML, IoT & Embedded Systems',
    description: 'Explore Tech in Air projects across Software, AI/ML, IoT, Android and Embedded Systems, with project details and technologies.',
  },
  '/process': {
    title: 'Tech in Air Project Process | From Idea to Implementation',
    description: 'See how Tech in Air discusses requirements, plans and develops projects, tests demonstrations, and provides documentation support.',
  },
  '/contact': {
    title: 'Contact Tech in Air | Project Enquiries',
    description: 'Contact Tech in Air in Bangalore to discuss a project idea, requirements or technology challenge by email, WhatsApp or Instagram.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Tech in Air',
    description: 'Read how Tech in Air handles information shared through website visits, project enquiries and customer review submissions.',
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | Tech in Air',
    description: 'Review the terms for using the Tech in Air website and for project development, technical explanation, documentation and related services.',
  },
}

export function normalizePathname(pathname) {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized || '/'
}

export function getPublicSeoPaths() {
  return [
    ...Object.keys(routeMetadata),
    ...projects.map((project) => `/projects/${project.id}`),
  ]
}

export function getSeoMetadata(pathname) {
  const path = normalizePathname(pathname)
  let metadata = routeMetadata[path]

  if (!metadata) {
    const projectMatch = path.match(/^\/projects\/(\d+)$/)
    if (projectMatch) {
      const project = projects.find((item) => String(item.id) === projectMatch[1])
      if (project) {
        metadata = {
          title: `${project.title} | Tech in Air`,
          description: `Explore ${project.title} by Tech in Air. ${project.description}`,
        }
      }
    }
  }

  if (!metadata) return null

  const url = `${SITE_URL}${path === '/' ? '/' : path}`
  return { ...metadata, url, image: LOGO_URL }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function renderSeoHead(metadata) {
  const title = escapeHtml(metadata.title)
  const description = escapeHtml(metadata.description)
  const url = escapeHtml(metadata.url)
  const image = escapeHtml(metadata.image)

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Tech in Air" />',
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:alt" content="Tech in Air logo" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    '<meta name="twitter:image:alt" content="Tech in Air logo" />',
  ].join('\n    ')
}
