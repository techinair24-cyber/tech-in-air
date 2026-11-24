import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import CapabilityStrip from '../components/CapabilityStrip'
import Services from '../components/Services'
import CTA from '../components/CTA'
import ApprovedReviews from '../components/ApprovedReviews'
import projects from '../data/projects'

export default function Home(){
  return (
    <div>
      <Hero />
      <section className="surface-section py-16 md:py-24">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Selected work</p>
              <h2 className="section-heading mt-4">Built for impact.</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[var(--muted)] md:justify-self-end">Explore a focused portfolio of AI, software, mobile and intelligent technology projects.</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {projects.slice(2, 6).map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.38, delay: index * 0.05 }}
                className="group overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)]"
              >
                <Link to={`/projects/${project.id}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden bg-[var(--surface)]">
                    <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="text-sm font-semibold text-[var(--accent)]">{project.categories.slice(0, 2).join(' / ')}</p>
                    <h3 className="mt-3 text-2xl font-bold leading-tight">{project.title}</h3>
                    <p className="mt-3 line-clamp-3 leading-7 text-[var(--muted)]">{project.description}</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/projects" className="secondary-button">View All Projects</Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Our expertise</p>
          <h2 className="section-heading mt-4">Technology, made useful.</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Artificial Intelligence', 'Machine learning, predictive systems and computer vision.'],
              ['Software Development', 'Reliable applications designed around real business needs.'],
              ['Web Development', 'Fast, accessible and future-ready digital experiences.'],
              ['Mobile Applications', 'Purposeful Android products with clean user experiences.'],
              ['Data Science', 'Turn complex information into clear, practical decisions.'],
              ['Business Automation', 'Streamline operations with connected digital workflows.']
            ].map(([title, description]) => (
              <article key={title} className="bg-[var(--card)] p-7 md:p-9">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-section py-16 md:py-24">
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Our solutions</p>
          <h2 className="section-heading mt-4">From learning to business.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Link to="/services" className="group rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-8 transition-transform duration-200 hover:-translate-y-1 md:p-10">
              <p className="text-sm font-semibold text-[var(--accent)]">Academic Solutions</p>
              <h3 className="mt-5 text-3xl font-bold">Project development with clarity.</h3>
              <p className="mt-4 max-w-lg leading-8 text-[var(--muted)]">Software, AI, ML and technical project support from concept through demonstration.</p>
              <span className="mt-8 inline-block font-semibold">Explore Academic Solutions →</span>
            </Link>
            <Link to="/business-solutions" className="group rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-8 transition-transform duration-200 hover:-translate-y-1 md:p-10">
              <p className="text-sm font-semibold text-[var(--accent)]">Business Solutions</p>
              <h3 className="mt-5 text-3xl font-bold">Digital systems for growing teams.</h3>
              <p className="mt-4 max-w-lg leading-8 text-[var(--muted)]">Websites, applications and automation built to help businesses operate better.</p>
              <span className="mt-8 inline-block font-semibold">Explore Business Solutions →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Technologies</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">Modern tools. Practical engineering.</h2>
          <div className="mt-10 flex flex-wrap gap-3">
            {['Python', 'React', 'JavaScript', 'Android', 'Machine Learning', 'Computer Vision', 'Firebase', 'MATLAB', 'Arduino', 'IoT'].map((technology) => (
              <span key={technology} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold">{technology}</span>
            ))}
          </div>
        </div>
      </section>

      <div id="reviews"><ApprovedReviews /></div>

      <CTA />
    </div>
  )
}
