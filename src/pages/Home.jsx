import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import CTA from '../components/CTA'
import ApprovedReviews from '../components/ApprovedReviews'
import PublishedPageSections from '../components/PublishedPageSections'
import projects from '../data/projects'
import { getPageText, getPublishedSection, getSafeInternalPath, getSectionItems } from '../lib/pageContent.mjs'
import { usePublishedPage, usePublishedProjects, usePublishedServices } from '../lib/publicContent'
import ProjectPlaceholder from '../assets/projects/placeholder.svg'
import { businessServices } from '../data/businessSolutions'
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

const defaultCapabilities = [
  ['01', 'Artificial Intelligence & Machine Learning', 'Models and intelligent systems that learn, classify and assist decisions.'],
  ['02', 'Software & Web Development', 'Modern applications and responsive digital products built for real use.'],
  ['03', 'Mobile Application Development', 'Purposeful Android experiences with clean interfaces and reliable integrations.'],
  ['04', 'Data Science & Computer Vision', 'Turn visual and structured data into clear, practical outcomes.'],
  ['05', 'Business Automation', 'Connected workflows that reduce repetitive work and improve operations.'],
]

const defaultSolutions = [
  { label: 'Academic Solutions', title: 'Project development with clarity.', description: 'Technical project support across software, AI, machine learning and demonstrations.', href: '/services', ctaLabel: 'Explore Academic Solutions' },
  { label: 'Business Solutions', title: 'Digital systems for growing teams.', description: 'Websites, applications and automation designed around operational needs.', href: '/business-solutions', ctaLabel: 'Explore Business Solutions' },
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

export default function Home() {
  const { content } = usePublishedPage('home')
  const { data: publishedProjects } = usePublishedProjects()
  const { data: publishedServices } = usePublishedServices('business-solutions')
  const featuredSection = getPublishedSection(content, 'featured-projects')
  const capabilitySection = getPublishedSection(content, 'capabilities')
  const solutionsSection = getPublishedSection(content, 'solutions')
  const technologySection = getPublishedSection(content, 'technology-list')
  const reviewSection = getPublishedSection(content, 'reviews')
  const projectList = publishedProjects === null ? projects : publishedProjects
  const serviceList = publishedServices === null ? businessServices : publishedServices
  const featuredProjectIds = [11, 8, 2, 3, 6, 9]
  const selected = publishedProjects === null
    ? featuredProjectIds.map((id) => projects.find((project) => project.id === id)).filter(Boolean)
    : (publishedProjects.filter((project) => project.featured).length
      ? publishedProjects.filter((project) => project.featured)
      : publishedProjects).slice(0, 6)
  const capabilities = getSectionItems(capabilitySection, content?.capabilities || defaultCapabilities)
  const solutions = getSectionItems(solutionsSection, content?.solutions || defaultSolutions)
  const technologyItems = getSectionItems(technologySection, content?.technologyList || [
    'Python', 'React', 'JavaScript', 'Android', 'Firebase', 'TensorFlow', 'OpenCV', 'GitHub',
  ])
  const getHeading = (section, fallback) => getPageText(section?.heading, fallback)
  const publicPaths = new Set(['/services', '/business-solutions', '/projects', '/contact'])
  const projectPlaceholder = ProjectPlaceholder

  return (
    <div>
      <Hero />
      <PublishedPageSections
        content={content}
        services={serviceList}
        projects={projectList}
        excludedTypes={['hero', 'featured-projects', 'capabilities', 'solutions', 'technology-list', 'reviews']}
      />

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-10 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Featured Work</p>
              <h2 className="section-heading">{getHeading(featuredSection, 'Our Featured Projects')}</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[var(--muted)] md:justify-self-end">
              {getPageText(featuredSection?.description, 'Explore selected AI, software and digital solutions developed by Tech In Air.')}
            </p>
          </div>

          {selected.length === 0 && <p className="text-[var(--muted)]">No public projects are currently featured.</p>}
          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }}
                transition={{ duration: 0.45, delay: index * 0.04, ease: 'easeOut' }}
                className=""
              >
                <Link to={`/projects/${project.id}`} className="group block">
                  <div className="aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-[var(--surface)]">
                    <motion.img
                      src={project.image || projectPlaceholder}
                      alt={project.title}
                      loading="lazy"
                      initial={{ scale: 1.025 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = projectPlaceholder
                      }}
                    />
                  </div>
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{project.categories.slice(0, 2).join(' · ')}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight md:text-2xl">{project.title}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{project.description}</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-[var(--foreground)]">View Project →</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="mt-12">
            <Link to="/projects" className="secondary-button">View All Projects</Link>
          </div>
        </div>
      </section>

      <section className="surface-section py-20 md:py-28">
        <div className="container">
          <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Capabilities</p>
          <h2 className="section-heading">{getHeading(capabilitySection, 'What We Do')}</h2>
          <div className="mt-12 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {capabilities.map((item, index) => {
              const capability = Array.isArray(item)
                ? { number: item[0], title: item[1], description: item[2] }
                : typeof item === 'string' ? { title: item } : item || {}
              const capabilityTitle = getPageText(capability.title) || getPageText(capability.name)
              const capabilityDescription = getPageText(capability.description)
              const capabilityNumber = getPageText(capability.number, String(index + 1).padStart(2, '0'))
              return (
              <motion.article
                key={capability.id || capabilityTitle || index}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35 }}
                className="grid gap-3 py-7 md:grid-cols-[70px_0.75fr_1fr] md:items-start md:gap-6"
              >
                <span className="text-sm font-semibold text-[var(--accent)]">{capabilityNumber}</span>
                <h3 className="text-xl font-semibold md:text-2xl">{capabilityTitle}</h3>
                {capabilityDescription && <p className="max-w-xl leading-7 text-[var(--muted)]">{capabilityDescription}</p>}
              </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Solutions</p>
          <h2 className="section-heading">{getHeading(solutionsSection, 'Solutions Built for You')}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {solutions.map((item, index) => {
              const solution = Array.isArray(item)
                ? { label: item[0], title: item[1], description: item[2], href: item[3] }
                : typeof item === 'string' ? { title: item } : item || {}
              const title = getPageText(solution.title)
              const label = getPageText(solution.label, title)
              const description = getPageText(solution.description)
              const ctaLabel = getPageText(solution.ctaLabel, 'Explore solution')
              const href = getSafeInternalPath(solution.href, publicPaths) || (index === 0 ? '/services' : '/business-solutions')
              return (
                <Link key={solution.id || title || index} to={href} className="group border-t border-[var(--border)] pt-6">
                  {label && <p className="text-sm text-[var(--muted)]">{label}</p>}
                  {title && <h3 className="mt-4 text-3xl font-semibold">{title}</h3>}
                  {description && <p className="mt-4 max-w-lg leading-7 text-[var(--muted)]">{description}</p>}
                  <span className="mt-7 inline-flex items-center font-semibold text-[var(--accent)]">{ctaLabel} <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="surface-section py-20 md:py-24">
        <div className="container">
          <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Technologies</p>
          <h2 className="text-3xl font-semibold md:text-5xl">{getHeading(technologySection, 'Technologies We Work With')}</h2>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3 lg:grid-cols-5">
            {technologyItems.map((item, index) => {
              const technology = typeof item === 'string' ? item : getPageText(item?.name) || getPageText(item?.title)
              const Icon = technologyIcons[technology]
              return (
              <div key={technology} className="flex min-h-28 items-center gap-3 bg-[var(--card)] px-5 transition-colors hover:bg-[var(--surface)]">
                {Icon && <Icon className="h-7 w-7 shrink-0 text-[var(--accent)]" aria-hidden="true" />}
                <span className="font-semibold">{technology}</span>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      <div id="reviews"><ApprovedReviews limit={3} title={getHeading(reviewSection, 'What Our Customers Say')} /></div>
      <CTA content={content?.cta} />
    </div>
  )
}
