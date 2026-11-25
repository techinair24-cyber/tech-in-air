import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiBarChart2, FiCode, FiCpu, FiEye, FiSmartphone, FiZap } from 'react-icons/fi'
import {
  SiAndroid,
  SiFirebase,
  SiGithub,
  SiJavascript,
  SiOpencv,
  SiPython,
  SiReact,
  SiTensorflow,
} from 'react-icons/si'
import Hero from '../components/Hero'
import CTA from '../components/CTA'
import ApprovedReviews from '../components/ApprovedReviews'
import PublishedPageSections from '../components/PublishedPageSections'
import projects from '../data/projects'
import { businessServices } from '../data/businessSolutions'
import { getPageText, getPublishedSection, getSafeInternalPath, getSectionItems } from '../lib/pageContent.mjs'
import { getPublicMediaUrl, usePublishedPage, usePublishedProjects, usePublishedServices } from '../lib/publicContent'

const defaultCapabilities = [
  { title: 'Artificial Intelligence & Machine Learning', description: 'Practical intelligent systems for classification, prediction and decision support.' },
  { title: 'Software & Web Development', description: 'Reliable software and responsive websites designed around real requirements.' },
  { title: 'Mobile Application Development', description: 'Useful Android applications with clear interfaces and dependable integrations.' },
  { title: 'Data Science', description: 'Structured data analysis that helps turn information into useful insight.' },
  { title: 'Computer Vision', description: 'Image-based tools for recognition, monitoring and visual analysis.' },
  { title: 'Business Automation', description: 'Connected workflows that reduce repetitive tasks and simplify operations.' },
]

const defaultSolutions = [
  {
    label: 'Academic Solutions',
    title: 'Build your project with confidence.',
    description: 'Engineering and diploma project development, technical guidance and demonstrations for practical AI, software and engineering ideas.',
    href: '/services',
    ctaLabel: 'Explore Academic Solutions',
    image: '/Projects/tech-in-air-about.webp',
    imageAlt: 'Technology workspaces and digital solutions by Tech In Air',
    highlights: ['Engineering and diploma projects', 'AI, software and technical solutions', 'Project guidance and demonstrations'],
  },
  {
    label: 'Business Solutions',
    title: 'Digital tools for growing businesses.',
    description: 'Practical web, mobile and automation services to help businesses present their work and serve customers online.',
    href: '/business-solutions',
    ctaLabel: 'Explore Business Solutions',
    image: '/Projects/tech-in-air-hero.webp',
    imageAlt: 'A cinematic Tech In Air workspace with AI, software and connected technology',
    highlights: ['Business websites and Android apps', 'E-commerce and business automation', 'Website maintenance and support'],
  },
]

const defaultTechnologies = [
  'Python', 'React', 'JavaScript', 'Android', 'Firebase', 'TensorFlow', 'OpenCV', 'GitHub',
]

const technologyIcons = {
  Python: SiPython,
  React: SiReact,
  JavaScript: SiJavascript,
  Android: SiAndroid,
  Firebase: SiFirebase,
  TensorFlow: SiTensorflow,
  OpenCV: SiOpencv,
  GitHub: SiGithub,
}

const capabilityIcons = [FiCpu, FiCode, FiSmartphone, FiBarChart2, FiEye, FiZap]
const publicPaths = new Set(['/services', '/business-solutions', '/projects', '/contact'])
const defaultFeaturedProjectIds = [12, 11, 8]

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="home-section-heading">
      {eyebrow && <p className="home-eyebrow">{eyebrow}</p>}
      <h2 className="section-heading">{title}</h2>
      {description && <p className="home-section-description">{description}</p>}
    </div>
  )
}

function SolutionImage({ src, fallback, alt }) {
  const resolvedSrc = getPublicMediaUrl(src) || fallback
  const [image, setImage] = useState(resolvedSrc)
  const [imageFailed, setImageFailed] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    setImage(resolvedSrc)
    setImageFailed(false)
    setUsingFallback(false)
  }, [resolvedSrc])

  const handleError = () => {
    if (image !== fallback) {
      setUsingFallback(true)
      setImage(fallback)
      return
    }
    setImageFailed(true)
  }

  return imageFailed
    ? <div className="solution-image-fallback" aria-hidden="true"><FiCpu /></div>
    : <img
        src={image}
        alt={usingFallback ? 'Tech In Air technology solutions' : alt}
        loading="lazy"
        onError={handleError}
      />
}

function FeaturedProjectImage({ src, alt }) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [src])

  return src && !imageFailed
    ? <img
        src={src}
        alt={alt}
        width="800"
        height="500"
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    : <div className="project-image-fallback" aria-hidden="true"><FiCode /></div>
}

function normalizeCapability(item) {
  if (Array.isArray(item)) {
    return { number: item[0], title: item[1], description: item[2] }
  }
  return typeof item === 'string' ? { title: item } : item || {}
}

function projectFromConfiguredItem(item, projectList) {
  const identifier = typeof item === 'string'
    ? item
    : getPageText(item?.slug) || getPageText(item?.projectId) || String(item?.id || '')
  const title = typeof item === 'object' && item
    ? getPageText(item.title)
    : ''
  return projectList.find((project) => (
    String(project.id) === identifier
    || String(project.slug) === identifier
    || (title && project.title === title)
  ))
}

export default function Home() {
  const reduceMotion = useReducedMotion()
  const { content } = usePublishedPage('home')
  const { data: publishedProjects } = usePublishedProjects()
  const { data: publishedServices } = usePublishedServices('business-solutions')
  const featuredSection = getPublishedSection(content, 'featured-projects')
  const capabilitySection = getPublishedSection(content, 'capabilities')
  const solutionsSection = getPublishedSection(content, 'solutions')
  const technologySection = getPublishedSection(content, 'technology-list')
  const reviewSection = getPublishedSection(content, 'reviews')
  const contactSection = getPublishedSection(content, 'cta')
  const projectList = publishedProjects === null ? projects : publishedProjects
  const serviceList = publishedServices === null ? businessServices : publishedServices
  const configuredProjects = getSectionItems(featuredSection)
    .map((item) => projectFromConfiguredItem(item, projectList))
    .filter(Boolean)
  const flaggedProjects = publishedProjects?.filter((project) => project.featured) || []
  const selectedProjects = configuredProjects.length
    ? configuredProjects.slice(0, 3)
    : publishedProjects === null
      ? defaultFeaturedProjectIds
        .map((id) => projects.find((project) => project.id === id))
        .filter(Boolean)
      : (flaggedProjects.length ? flaggedProjects : projectList).slice(0, 3)
  const configuredCapabilities = getSectionItems(capabilitySection, content?.capabilities)
  const capabilities = configuredCapabilities.length ? configuredCapabilities : defaultCapabilities
  const configuredSolutions = getSectionItems(solutionsSection, content?.solutions)
  const solutions = configuredSolutions.length ? configuredSolutions : defaultSolutions
  const technologyItems = getSectionItems(technologySection, content?.technologyList)
  const technologies = technologyItems.length ? technologyItems : defaultTechnologies
  const heading = (section, fallback) => getPageText(section?.heading, getPageText(section?.title, fallback))
  const customSections = content?.sections
  const rootCta = content?.cta && typeof content.cta === 'object' ? content.cta : {}
  const contactCta = {
    ...contactSection,
    ...rootCta,
    heading: getPageText(rootCta.heading, getPageText(contactSection?.heading, getPageText(contactSection?.title))),
    description: getPageText(rootCta.description, getPageText(contactSection?.description)),
    button: rootCta.button || contactSection?.button || contactSection?.primaryCta || contactSection?.cta,
    secondaryButton: rootCta.secondaryButton || contactSection?.secondaryButton || contactSection?.secondaryCta,
  }

  const motionProps = {
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' },
  }

  return (
    <div className="homepage">
      <Hero />

      {Array.isArray(customSections) && (
        <PublishedPageSections
          content={content}
          services={serviceList}
          projects={projectList}
          excludedTypes={['hero', 'featured-projects', 'capabilities', 'solutions', 'technology-list', 'reviews', 'cta']}
        />
      )}

      <motion.section id="solutions" className="home-section" {...motionProps}>
        <div className="container">
          <SectionHeading
            eyebrow="Solutions"
            title={heading(solutionsSection, 'Technology for learning and business.')}
            description={getPageText(solutionsSection?.description)}
          />
          <div className="home-solutions-grid">
            {solutions.map((item, index) => {
              const record = Array.isArray(item)
                ? { label: item[0], title: item[1], description: item[2], href: item[3] }
                : typeof item === 'string' ? { title: item } : item || {}
              const fallback = defaultSolutions[index] || defaultSolutions[0]
              const label = getPageText(record.label, fallback.label)
              const title = getPageText(record.title, fallback.title)
              const description = getPageText(record.description, fallback.description)
              const image = getPageText(record.image) || getPageText(record.imagePath) || (index === 0 ? solutionsSection?.image || fallback.image : fallback.image)
              const imageAlt = getPageText(record.imageAlt, getPageText(solutionsSection?.imageAlt, fallback.imageAlt))
              const href = getSafeInternalPath(record.href, publicPaths) || fallback.href
              const ctaLabel = getPageText(record.ctaLabel, fallback.ctaLabel)
              const highlights = Array.isArray(record.highlights) && record.highlights.length
                ? record.highlights.filter((highlight) => typeof highlight === 'string')
                : fallback.highlights

              return (
                <article key={record.id || title || index} className={`solution-panel ${index % 2 ? 'solution-panel--reverse' : ''}`}>
                  <div className="solution-image">
                    <SolutionImage src={image} fallback={fallback.image} alt={imageAlt} />
                  </div>
                  <div className="solution-content">
                    <p className="home-eyebrow">{label}</p>
                    <h3>{title}</h3>
                    <p className="solution-description">{description}</p>
                    <ul className="solution-highlights">
                      {highlights.map((highlight, highlightIndex) => (
                        <li key={`${highlight}-${highlightIndex}`}>{highlight}</li>
                      ))}
                    </ul>
                    <Link to={href} className="text-link">
                      {ctaLabel}<span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </motion.section>

      <motion.section id="capabilities" className="home-section home-section--surface" {...motionProps}>
        <div className="container">
          <SectionHeading
            eyebrow="Core capabilities"
            title={heading(capabilitySection, 'What we build, built around you.')}
            description={getPageText(capabilitySection?.description)}
          />
          <div className="capability-grid">
            {capabilities.map((item, index) => {
              const capability = normalizeCapability(item)
              const title = getPageText(capability.title) || getPageText(capability.name)
              const description = getPageText(capability.description)
              const Icon = capabilityIcons[index % capabilityIcons.length]
              if (!title) return null
              return (
                <motion.article
                  key={capability.id || title}
                  className="capability-item"
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                >
                  <span className="capability-icon"><Icon aria-hidden="true" /></span>
                  <div>
                    <h3>{title}</h3>
                    {description && <p>{description}</p>}
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </motion.section>

      <motion.section id="featured-projects" className="home-section" {...motionProps}>
        <div className="container">
          <SectionHeading
            eyebrow="Selected work"
            title={heading(featuredSection, 'Ideas made tangible.')}
            description={getPageText(featuredSection?.description, 'A selection of published projects across intelligent systems, software and connected technology.')}
          />
          {selectedProjects.length === 0 && (
            <p className="home-empty-state">No public projects are currently available to feature.</p>
          )}
          <div className="featured-project-grid">
            {selectedProjects.map((project) => {
              const categories = Array.isArray(project.categories)
                ? project.categories
                : [getPageText(project.category)].filter(Boolean)
              const image = getPageText(project.image) || getPublicMediaUrl(project.imagePath || project.image_paths?.[0])
              const href = getSafeInternalPath(`/projects/${project.slug || project.id}`, publicPaths) || '/projects'
              return (
                <motion.article
                  key={project.id || project.slug}
                  className="featured-project-card"
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                >
                  <Link to={href} className="featured-project-link">
                    <div className="featured-project-image">
                      <FeaturedProjectImage src={image} alt={project.title} />
                    </div>
                    <div className="featured-project-copy">
                      {categories[0] && <p className="project-category">{categories[0]}</p>}
                      <h3>{project.title}</h3>
                      {project.description && <p className="project-description">{project.description}</p>}
                      <span className="text-link">View Project<span aria-hidden="true">↗</span></span>
                    </div>
                  </Link>
                </motion.article>
              )
            })}
          </div>
          <div className="home-project-action">
            <Link to="/projects" className="secondary-button">View All Projects</Link>
          </div>
        </div>
      </motion.section>

      <motion.section id="technologies" className="home-section home-section--surface" {...motionProps}>
        <div className="container">
          <SectionHeading
            eyebrow="Technology"
            title={heading(technologySection, 'Tools we use to make ideas work.')}
            description={getPageText(technologySection?.description)}
          />
          <ul className="technology-list">
            {technologies.map((item, index) => {
              const technology = typeof item === 'string'
                ? item
                : getPageText(item?.name) || getPageText(item?.title)
              if (!technology) return null
              const Icon = technologyIcons[technology] || FiCode
              return (
                <li key={`${technology}-${index}`} className="technology-item">
                  <Icon aria-hidden="true" />
                  <span>{technology}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </motion.section>

      <div id="reviews">
        <ApprovedReviews
          limit={3}
          title={heading(reviewSection, 'What our customers say')}
          variant="home"
        />
      </div>

      <CTA content={contactCta} />
    </div>
  )
}
