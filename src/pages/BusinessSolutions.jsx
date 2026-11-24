import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { businessServices } from '../data/businessSolutions'
import ServiceVisual from '../components/ServiceVisual'

export default function BusinessSolutionsPage() {
  return (
    <div>
      <header className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold text-[var(--accent)]">Business Solutions</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">Digital systems for growing businesses.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Websites, mobile applications, e-commerce solutions and practical automation designed around real business needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#services" className="primary-button">Explore Services</a>
              <Link to="/business-solutions/quotation" className="secondary-button">Let's Talk</Link>
            </div>
          </div>
          <ServiceVisual slug="business-website" title="Business digital solutions" />
        </div>
      </header>

      <section id="services" className="scroll-mt-28 py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Our Services</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Choose the right digital foundation.</h2>
          <div className="mt-12 space-y-16">
            {businessServices.map((service, index) => (
              <motion.article key={service.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.42 }} className={`grid gap-8 lg:grid-cols-2 lg:items-center ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <ServiceVisual slug={service.slug} title={service.title} />
                <div className="max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Starting from</p>
                  <p className="mt-2 text-2xl font-semibold">{service.startingPrice}</p>
                  <h3 className="mt-5 text-3xl font-semibold">{service.title}</h3>
                  <p className="mt-4 leading-7 text-[var(--muted)]">{service.shortDescription}</p>
                  <Link to={`/business-solutions/${service.slug}`} className="mt-7 inline-flex items-center font-semibold text-[var(--foreground)]">
                    Explore Service <ArrowRight size={17} className="ml-2" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] py-16 md:py-24">
        <div className="container flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Start a project</p>
            <h2 className="text-3xl font-semibold md:text-5xl">Have a business idea? Let's build it.</h2>
          </div>
          <Link to="/business-solutions/quotation" className="primary-button">Let's Talk</Link>
        </div>
      </section>
    </div>
  )
}
