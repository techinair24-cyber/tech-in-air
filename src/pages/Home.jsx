import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import CTA from '../components/CTA'
import ApprovedReviews from '../components/ApprovedReviews'
import projects from '../data/projects'

export default function Home() {
  const featuredProjectIds = [11, 8, 2, 3, 6, 9]
  const selected = featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean)

  return (
    <div>
      <Hero />

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-10 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Featured Work</p>
              <h2 className="section-heading">Our Featured Projects</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[var(--muted)] md:justify-self-end">
              Explore selected AI, software and digital solutions developed by Tech In Air.
            </p>
          </div>

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
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      initial={{ scale: 1.025 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
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
          <h2 className="section-heading">What We Do</h2>
          <div className="mt-12 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {[
              ['01', 'Artificial Intelligence & Machine Learning', 'Models and intelligent systems that learn, classify and assist decisions.'],
              ['02', 'Software & Web Development', 'Modern applications and responsive digital products built for real use.'],
              ['03', 'Mobile Application Development', 'Purposeful Android experiences with clean interfaces and reliable integrations.'],
              ['04', 'Data Science & Computer Vision', 'Turn visual and structured data into clear, practical outcomes.'],
              ['05', 'Business Automation', 'Connected workflows that reduce repetitive work and improve operations.'],
            ].map(([number, title, description]) => (
              <motion.article
                key={number}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35 }}
                className="grid gap-3 py-7 md:grid-cols-[70px_0.75fr_1fr] md:items-start md:gap-6"
              >
                <span className="text-sm font-semibold text-[var(--accent)]">{number}</span>
                <h3 className="text-xl font-semibold md:text-2xl">{title}</h3>
                <p className="max-w-xl leading-7 text-[var(--muted)]">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Solutions</p>
          <h2 className="section-heading">Solutions Built for You</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Link to="/services" className="group border-t border-[var(--border)] pt-6">
              <p className="text-sm text-[var(--muted)]">Academic Solutions</p>
              <h3 className="mt-4 text-3xl font-semibold">Project development with clarity.</h3>
              <p className="mt-4 max-w-lg leading-7 text-[var(--muted)]">Technical project support across software, AI, machine learning and demonstrations.</p>
              <span className="mt-7 inline-flex items-center font-semibold text-[var(--accent)]">Explore Academic Solutions <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></span>
            </Link>
            <Link to="/business-solutions" className="group border-t border-[var(--border)] pt-6">
              <p className="text-sm text-[var(--muted)]">Business Solutions</p>
              <h3 className="mt-4 text-3xl font-semibold">Digital systems for growing teams.</h3>
              <p className="mt-4 max-w-lg leading-7 text-[var(--muted)]">Websites, applications and automation designed around operational needs.</p>
              <span className="mt-7 inline-flex items-center font-semibold text-[var(--accent)]">Explore Business Solutions <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-section py-20 md:py-24">
        <div className="container">
          <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Technologies</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Technologies We Work With</h2>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
            {['Python', 'React', 'JavaScript', 'Android', 'Machine Learning', 'Computer Vision', 'Firebase', 'MATLAB'].map((technology) => (
              <span key={technology} className="text-lg font-medium text-[var(--foreground)]">{technology}</span>
            ))}
          </div>
        </div>
      </section>

      <div id="reviews"><ApprovedReviews limit={3} /></div>
      <CTA />
    </div>
  )
}
