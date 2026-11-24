import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import projects from '../data/projects'

export default function AboutPage() {
  const engineeringCount = projects.filter((project) => project.categories?.includes('Engineering Main Project')).length

  return (
    <div>
      <header className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold text-[var(--accent)]">About Tech In Air</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">Technology With Purpose.</h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[var(--muted)]">
            Tech In Air is an AI and software technology company in Bangalore, helping students, businesses and innovators turn practical ideas into working digital solutions.
          </p>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="container grid gap-8 md:grid-cols-2">
          <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[1.25rem] bg-[var(--surface)] p-8 md:p-10">
            <p className="text-sm font-semibold text-[var(--accent)]">Our Mission</p>
            <h2 className="mt-5 text-3xl font-semibold md:text-4xl">Make technology accessible, practical and meaningful.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
              Our mission is to develop reliable AI-powered software, innovative digital solutions and technical services that help students, businesses and individuals turn ideas into reality.
            </p>
          </motion.article>
          <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="border-t border-[var(--border)] pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-10">
            <p className="text-sm font-semibold text-[var(--accent)]">Our Vision</p>
            <h2 className="mt-5 text-3xl font-semibold md:text-4xl">Become a trusted technology partner for thoughtful innovation.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
              Our vision is to be recognized for innovation, quality and accessible digital solutions that empower individuals and businesses through artificial intelligence, software development and emerging technologies.
            </p>
          </motion.article>
        </div>
      </section>

      <section className="surface-section py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Our expertise</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Specialized in building modern digital systems.</h2>
          <div className="mt-10 grid gap-8 border-t border-[var(--border)] pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Artificial Intelligence & Machine Learning',
              'Software & Web Development',
              'Android Application Development',
              'Data Science & Computer Vision',
              'Business Automation',
            ].map((item) => (
              <h3 key={item} className="text-xl font-semibold">{item}</h3>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Our Achievements</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Work across software and intelligent technology.</h2>
          <div className="mt-12 grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {[
              [projects.length, 'Completed project entries'],
              [projects.filter((project) => project.categories?.some((category) => ['AI / ML', 'Deep Learning'].includes(category))).length, 'AI and ML projects'],
              [projects.filter((project) => project.categories?.includes('Software') || project.categories?.includes('Android')).length, 'Software and mobile projects'],
              [engineeringCount, 'Engineering main projects'],
            ].map(([value, label]) => (
              <div key={label} className="border-l border-[var(--border)] pl-5 first:border-l-0 first:pl-0 md:first:border-l md:first:pl-5">
                <p className="text-4xl font-semibold md:text-6xl">{value}</p>
                <p className="mt-3 max-w-40 text-sm leading-6 text-[var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-section py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-sm font-semibold text-[var(--accent)]">How We Work</p>
          <h2 className="text-3xl font-semibold md:text-5xl">From idea to implementation.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-5">
            {[
              ['01', 'Discuss', 'Understand the idea and requirements.'],
              ['02', 'Plan', 'Choose the approach and technology.'],
              ['03', 'Develop', 'Build and integrate the solution.'],
              ['04', 'Test & Demonstrate', 'Validate and prepare the working system.'],
              ['05', 'Deliver', 'Provide the project, documentation and support.'],
            ].map(([number, title, description]) => (
              <motion.article key={number} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
                <p className="text-sm font-semibold text-[var(--accent)]">{number}</p>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container flex flex-col items-start justify-between gap-8 border-t border-[var(--border)] pt-12 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Customer Experience</p>
            <h2 className="text-3xl font-semibold md:text-5xl">Let's Build Something Together.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/reviews" className="secondary-button">Read All Reviews</Link>
            <Link to="/contact" className="primary-button">Let's Talk</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
