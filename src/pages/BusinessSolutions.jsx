
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  User,
  ShoppingCart,
  Smartphone,
  Workflow,
  Wrench,
  Briefcase,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

import { businessServices } from '../data/businessSolutions'
import ServiceVisual from '../components/ServiceVisual'
import PublishedPageSections from '../components/PublishedPageSections'

import {
  getPublicMediaUrl,
  usePublishedPage,
  usePublishedServices,
} from '../lib/publicContent'

import {
  getPageText,
  getSafeInternalPath,
} from '../lib/pageContent.mjs'

const publicPaths = new Set([
  '/contact',
  '/business-solutions/quotation',
  '/business-solutions',
  '/projects',
])

const serviceIcons = {
  'business-website': Globe,
  'portfolio-website': User,
  ecommerce: ShoppingCart,
  'android-development': Smartphone,
  'business-automation': Workflow,
  'website-maintenance': Wrench,
}

const fallbackImage = '/Projects/homepage-business-premium.webp'

function BusinessImage({ image, title }) {
  const [failedImage, setFailedImage] = useState(null)

  const source = getPublicMediaUrl(image) || fallbackImage
  const currentImage = failedImage === source
    ? fallbackImage
    : source

  return (
    <img
      src={currentImage}
      alt={title}
      decoding="async"
      onError={(event) => {
        if (currentImage !== fallbackImage) {
          setFailedImage(source)
        } else {
          event.currentTarget.style.visibility = 'hidden'
        }
      }}
      onLoad={(event) => {
        event.currentTarget.style.visibility = 'visible'
      }}
    />
  )
}

export default function BusinessSolutionsPage() {
  const reduceMotion = useReducedMotion()
  const { content } = usePublishedPage('business-solutions')
  const { data: publishedServices } =
    usePublishedServices('business-solutions')

  const [selectedSlug, setSelectedSlug] = useState(null)

  const hero =
    content?.hero && typeof content.hero === 'object'
      ? content.hero
      : {}

  const serviceList =
    publishedServices === null
      ? businessServices
      : publishedServices

  const selectedService =
    serviceList.find((service) => service.slug === selectedSlug)
    || serviceList[0]

  const primaryCta =
    hero.primaryCta && typeof hero.primaryCta === 'object'
      ? hero.primaryCta
      : {}

  const secondaryCta =
    hero.secondaryCta && typeof hero.secondaryCta === 'object'
      ? hero.secondaryCta
      : {}

  const primaryHref = getSafeInternalPath(
    primaryCta.href,
    publicPaths
  )

  const secondaryHref = getSafeInternalPath(
    secondaryCta.href,
    publicPaths
  )

  const reveal = {
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduceMotion ? 0 : 0.45 },
  }

  const price = getPageText(
    selectedService?.startingPrice,
    String(selectedService?.startingPrice ?? '')
  ).replace(/^starting\s+from\s*:?\s*/i, '')
   .replace(/^from\s*:?\s*/i, '')

  return (
    <div className="business-premium">

      {/* BUSINESS HERO */}

      <header className="business-hero">
        <div className="container business-hero-grid">

          <motion.div {...reveal}>
            <p className="solutions-kicker">
              Tech In Air for Business
            </p>

            <h1>
              {getPageText(
                hero.heading,
                'Your Business. Digitally Transformed.'
              )}
            </h1>

            <p className="solutions-intro">
              {getPageText(
                hero.description,
                'Websites, mobile applications, e-commerce solutions and practical automation designed around real business needs.'
              )}
            </p>

            <div className="solutions-actions">
              {primaryHref ? (
                <Link to={primaryHref} className="primary-button">
                  {getPageText(primaryCta.label, 'Explore Services')}
                  <ArrowUpRight size={18} />
                </Link>
              ) : (
                <a href="#services" className="primary-button">
                  {getPageText(primaryCta.label, 'Explore Services')}
                  <ArrowRight size={18} />
                </a>
              )}

              <Link
                to={secondaryHref || '/business-solutions/quotation'}
                className="secondary-button"
              >
                {getPageText(secondaryCta.label, 'Get a Quotation')}
              </Link>
            </div>
          </motion.div>

          <motion.div className="business-hero-image" {...reveal}>
            <BusinessImage
              image={hero.image || hero.imagePath}
              title={getPageText(
                hero.imageAlt,
                'Modern digital business workspace'
              )}
            />

            <div className="business-image-caption">
              <Briefcase size={24} />
              <div>
                <strong>Built for Business</strong>
                <span>Technology that works for you.</span>
              </div>
            </div>
          </motion.div>

        </div>
      </header>

      <PublishedPageSections
        content={content}
        services={serviceList}
        serviceBasePath="/business-solutions"
        excludedTypes={['hero']}
      />

      {/* INTERACTIVE SERVICE CATALOGUE */}

      <section id="services" className="solutions-section scroll-mt-28">
        <div className="container">

          <motion.div className="solutions-heading" {...reveal}>
            <p className="solutions-kicker">Our Services</p>
            <h2>Find the right solution for your business.</h2>
            <p className="solutions-intro">
              Explore our services, starting prices and available plans.
            </p>
          </motion.div>

          {serviceList.length === 0 ? (
            <p className="solutions-intro">
              No business services are currently published.
            </p>
          ) : (
            <div className="business-catalogue">

              <nav
                className="business-service-menu"
                aria-label="Business service selection"
              >
                {serviceList.map((service, index) => {
                  const Icon =
                    serviceIcons[service.slug] || Briefcase

                  const active =
                    selectedService?.slug === service.slug

                  return (
                    <button
                      key={service.id || service.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedSlug(service.slug)}
                      className={`business-service-option ${
                        active ? 'is-active' : ''
                      }`}
                    >
                      <Icon size={23} aria-hidden="true" />

                      <span>
                        <small>
                          SERVICE {String(index + 1).padStart(2, '0')}
                        </small>
                        <strong>{service.title}</strong>
                      </span>

                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  )
                })}
              </nav>

              {selectedService && (
                <motion.article
                  key={selectedService.slug}
                  className="business-service-preview"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3 }}
                >

                  <div className="business-preview-visual">
                    <ServiceVisual
                      slug={selectedService.slug}
                      title={selectedService.title}
                      image={selectedService.image}
                    />
                  </div>

                  <div className="business-preview-copy">
                    <p className="solutions-kicker">
                      Business Solution
                    </p>

                    <h3>{selectedService.title}</h3>

                    <p className="solutions-intro">
                      {selectedService.shortDescription}
                    </p>

                    {price && (
                      <div className="business-price">
                        <span>Starting from</span>
                        <strong>{price}</strong>
                      </div>
                    )}

                    <div className="solutions-actions">
                      <Link
                        to={`/business-solutions/${selectedService.slug}`}
                        className="primary-button"
                      >
                        View Plans & Pricing
                        <ArrowUpRight size={18} />
                      </Link>

                      <Link
                        to="/business-solutions/quotation"
                        className="secondary-button"
                      >
                        Request Quotation
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )}

            </div>
          )}

        </div>
      </section>

      {/* BUSINESS APPROACH */}

      <section className="solutions-section business-approach">
        <div className="container">

          <div className="solutions-heading">
            <p className="solutions-kicker">Our Approach</p>
            <h2>From business requirements to digital solutions.</h2>
          </div>

          <div className="business-approach-grid">
            {[
              ['01', 'Understand', 'Discuss your business, customers and requirements.'],
              ['02', 'Recommend', 'Choose a suitable service and development plan.'],
              ['03', 'Develop', 'Design, build and test your digital solution.'],
              ['04', 'Deliver', 'Prepare the solution for use and provide agreed support.'],
            ].map(([number, title, description]) => (
              <motion.article key={number} {...reveal}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </motion.article>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}

      <section className="solutions-section">
        <div className="container">
          <motion.div className="solutions-final-cta" {...reveal}>
            <div>
              <p className="solutions-kicker">Start a Project</p>
              <h2>Have a business idea? Let's build it.</h2>
              <p className="solutions-intro">
                Tell us your requirements and explore the right solution.
              </p>
            </div>

            <Link
              to="/business-solutions/quotation"
              className="primary-button"
            >
              Get a Quotation
              <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

