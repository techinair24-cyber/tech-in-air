import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import projects from '../data/projects'
import services from '../data/services'
import PublishedPageSections from '../components/PublishedPageSections'
import { usePublishedPage, usePublishedProjects, usePublishedServices } from '../lib/publicContent'
import { getPageText } from '../lib/pageContent.mjs'

export default function ServicesPage() {
  const { content } = usePublishedPage('academic-solutions')
  const { data: academicServiceRecords } = usePublishedServices('academic-solutions')
  const { data: publishedProjects } = usePublishedProjects()
  const hero = content?.hero && typeof content.hero === 'object' ? content.hero : {}
  const pageServices = Array.isArray(content?.services)
    ? content.services.filter((service) => service && typeof service === 'object' && typeof service.title === 'string')
      .map((service) => ({
        id: service.id || service.title,
        title: service.title,
        description: getPageText(service.description),
      }))
    : services
  const academicServices = academicServiceRecords === null || academicServiceRecords.length === 0
    ? pageServices
    : academicServiceRecords.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.shortDescription || service.detailedDescription,
    }))
  const academicProjects = publishedProjects === null
    ? [11, 8, 9, 2, 4, 12].map((id) => projects.find((project) => project.id === id)).filter(Boolean)
    : publishedProjects.slice(0, 6)

  return (
    <div>
      <header className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold text-[var(--accent)]">Academic Solutions</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">{getPageText(hero.heading, 'Turn your academic ideas into working technology.')}</h1>
          </div>
          <div>
            <p className="max-w-xl text-lg leading-8 text-[var(--muted)]">
              {getPageText(hero.description, 'AI, software and engineering project development with clear planning, technical guidance and demonstration support.')}
            </p>
            <Link to="/contact" className="primary-button mt-8">Let's Talk</Link>
          </div>
        </div>
      </header>

      <PublishedPageSections content={content} services={academicServices} projects={publishedProjects || projects} serviceBasePath={null} excludedTypes={['hero']} />

      <section className="py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Project Development</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Support for your complete project journey.</h2>
          <div className="mt-12 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {[
              ['Artificial Intelligence & Machine Learning', 'Classification, prediction, analytics and practical AI applications.'],
              ['Software & Web Development', 'Reliable applications and responsive web systems.'],
              ['Android Applications', 'Mobile interfaces and functional app workflows.'],
              ['Data Science & Computer Vision', 'Image analysis, data processing and visual intelligence.'],
              ['IoT & Embedded Systems', 'Supporting sensor, hardware and connected-system projects.'],
              ['Diploma & Engineering Projects', 'Technical implementation aligned to academic requirements.'],
            ].map(([title, description], index) => (
              <motion.article key={title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.32, delay: index * 0.03 }} className="grid gap-3 py-7 md:grid-cols-[70px_0.75fr_1fr] md:gap-6">
                <span className="text-sm font-semibold text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="leading-7 text-[var(--muted)]">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-section py-16 md:py-24">
        <div className="container grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold text-[var(--accent)]">Student Support</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Clarity at every stage.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {academicServices.length === 0 && <p className="text-[var(--muted)]">No academic services are currently published.</p>}
            {academicServices.map((service) => (
              <article key={service.id || service.title} className="border-t border-[var(--border)] pt-5">
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Featured Academic Projects</p>
              <h2 className="text-3xl font-semibold md:text-5xl">Explore relevant work.</h2>
            </div>
            <Link to="/projects" className="secondary-button w-fit">View All Projects</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {academicProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="group">
                <div className="aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-[var(--surface)]">
                  <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{project.categories.slice(0, 2).join(' · ')}</p>
                <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container flex flex-col items-start justify-between gap-8 border-t border-[var(--border)] pt-12 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Next Step</p>
            <h2 className="text-3xl font-semibold md:text-5xl">Tell us what you want to build.</h2>
          </div>
          <Link to="/contact" className="primary-button">Let's Talk</Link>
        </div>
      </section>
    </div>
  )
}
