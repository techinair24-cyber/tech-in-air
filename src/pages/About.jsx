
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  FiArrowUpRight,
  FiTarget,
  FiEye,
  FiCpu,
  FiCode,
  FiSmartphone,
  FiBarChart2,
  FiZap,
  FiMessageSquare,
  FiLayers,
  FiCheckCircle,
  FiPackage,
} from 'react-icons/fi'

import PublishedPageSections from '../components/PublishedPageSections'
import projects from '../data/projects'
import {
  getPublicMediaUrl,
  usePublishedPage,
  usePublishedProjects,
} from '../lib/publicContent'
import { getPageText } from '../lib/pageContent.mjs'

const expertise = [
  {
    icon: FiCpu,
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Intelligent systems for prediction, classification and practical decision-making.',
  },
  {
    icon: FiCode,
    title: 'Software & Web Development',
    description: 'Responsive websites and dependable software built around real requirements.',
  },
  {
    icon: FiSmartphone,
    title: 'Android Application Development',
    description: 'Modern mobile applications with intuitive interfaces and reliable integrations.',
  },
  {
    icon: FiBarChart2,
    title: 'Data Science',
    description: 'Transforming complex information into meaningful and actionable insights.',
  },
  {
    icon: FiEye,
    title: 'Computer Vision',
    description: 'Intelligent image recognition, visual analysis and monitoring solutions.',
  },
  {
    icon: FiZap,
    title: 'Business Automation',
    description: 'Simplifying everyday operations through connected digital workflows.',
  },
]

const process = [
  {
    number: '01',
    icon: FiMessageSquare,
    title: 'Discuss',
    description: 'Understand the idea, goals and requirements.',
  },
  {
    number: '02',
    icon: FiLayers,
    title: 'Plan',
    description: 'Choose the right technology and development approach.',
  },
  {
    number: '03',
    icon: FiCode,
    title: 'Develop',
    description: 'Build and integrate the required solution.',
  },
  {
    number: '04',
    icon: FiCheckCircle,
    title: 'Test',
    description: 'Validate functionality and prepare demonstrations.',
  },
  {
    number: '05',
    icon: FiPackage,
    title: 'Deliver',
    description: 'Provide the solution, documentation and support.',
  },
]

function AnimatedCounter({ value, reduceMotion }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!visible) return

    if (reduceMotion || value === 0) {
      setCount(value)
      return
    }

    let frame
    let start
    const duration = 1100

    const animate = (timestamp) => {
      if (start === undefined) start = timestamp

      const progress = Math.min(
        (timestamp - start) / duration,
        1
      )

      const eased = 1 - Math.pow(1 - progress, 3)

      setCount(Math.round(value * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)
  }, [value, visible, reduceMotion])

  return (
    <motion.span
      className="about-counter"
      onViewportEnter={() => setVisible(true)}
      viewport={{ once: true }}
      aria-label={String(value)}
    >
      <span aria-hidden="true">{count}</span>
    </motion.span>
  )
}

export default function AboutPage() {
  const reduceMotion = useReducedMotion()
  const { content } = usePublishedPage('about')
  const { data: publishedProjects } = usePublishedProjects()

  const hero =
    content?.hero && typeof content.hero === 'object'
      ? content.hero
      : {}

  const mission =
    content?.mission && typeof content.mission === 'object'
      ? content.mission
      : {}

  const vision =
    content?.vision && typeof content.vision === 'object'
      ? content.vision
      : {}

  const projectList =
    publishedProjects === null ? projects : publishedProjects

  const engineeringProjects = projectList.filter(
    (project) =>
      project.categories?.includes('Engineering Main Project')
  )

  const diplomaProjects = projectList.filter(
    (project) =>
      !project.categories?.includes('Engineering Main Project') &&
      project.categories?.includes('Diploma Main Project')
  )

  const engineeringCount = engineeringProjects.length
  const diplomaCount = diplomaProjects.length

  const otherCount =
    projectList.length - engineeringCount - diplomaCount

  const achievements = [
    [projectList.length, 'Total Projects'],
    [engineeringCount, 'Engineering Main Projects'],
    [diplomaCount, 'Diploma Main Projects'],
    [otherCount, 'Other Projects'],
  ]

  const fallbackImage = '/Projects/homepage-hero-premium.webp'

  const heroImage =
    getPublicMediaUrl(hero.image || hero.imagePath) ||
    fallbackImage

  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [heroImage])

  const reveal = {
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: {
      duration: reduceMotion ? 0 : 0.5,
      ease: 'easeOut',
    },
  }

  return (
    <div className="about-premium">

      {/* HERO */}

      <header className="about-hero">
        <div className="container about-hero-grid">

          <motion.div className="about-hero-copy" {...reveal}>
            <p className="about-eyebrow">
              About Tech In Air
            </p>

            <h1>
              {getPageText(
                hero.heading,
                'Technology With Purpose.'
              )}
            </h1>

            <p className="about-hero-description">
              {getPageText(
                hero.description,
                'Tech In Air is an independent technology initiative based in Bangalore, helping students, businesses and innovators turn practical ideas into working digital solutions.'
              )}
            </p>

            <div className="about-brand-signature">
              <span />
              Tech Made Simple.
            </div>

            <div className="about-hero-actions">
              <Link to="/projects" className="primary-button">
                Explore Our Work
                <FiArrowUpRight aria-hidden="true" />
              </Link>

              <Link to="/contact" className="secondary-button">
                Contact Us
              </Link>
            </div>
          </motion.div>

          <motion.div className="about-hero-visual" {...reveal}>
            {!imageFailed ? (
              <img
                src={heroImage}
                alt={getPageText(
                  hero.imageAlt,
                  'Technology and intelligent digital innovation'
                )}
                loading="eager"
                decoding="async"
                onError={(event) => {
                  if (
                    event.currentTarget.getAttribute('src') !==
                    fallbackImage
                  ) {
                    event.currentTarget.src = fallbackImage
                  } else {
                    setImageFailed(true)
                  }
                }}
              />
            ) : (
              <div className="about-image-fallback">
                <FiCpu aria-hidden="true" />
              </div>
            )}

            <div className="about-visual-caption">
              <span>TECH IN AIR</span>
              <strong>Ideas. Innovation. Impact.</strong>
            </div>
          </motion.div>

        </div>
      </header>

      {/* ACHIEVEMENTS */}

      <section className="about-achievements">
        <div className="container">

          <div className="about-stat-grid">
            {achievements.map(([value, label]) => (
              <div key={label} className="about-stat">
                <AnimatedCounter
                  value={value}
                  reduceMotion={reduceMotion}
                />
                <p>{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ADMIN PUBLISHED CONTENT */}

      <PublishedPageSections
        content={content}
        projects={projectList}
        excludedTypes={['hero']}
      />

      {/* MISSION AND VISION */}

      <section className="about-section">
        <div className="container">

          <motion.div className="about-section-heading" {...reveal}>
            <p className="about-eyebrow">Our Purpose</p>
            <h2>Driven by meaningful innovation.</h2>
          </motion.div>

          <div className="about-purpose-grid">

            <motion.article className="about-purpose-item" {...reveal}>
              <div className="about-purpose-top">
                <span className="about-icon">
                  <FiTarget aria-hidden="true" />
                </span>
                <span className="about-index">01</span>
              </div>

              <p className="about-eyebrow">Our Mission</p>

              <h3>
                {getPageText(
                  mission.heading,
                  'Make technology accessible, practical and meaningful.'
                )}
              </h3>

              <p className="about-body-text">
                {getPageText(
                  mission.description,
                  'Our mission is to develop reliable AI-powered software, innovative digital solutions and technical services that help students, businesses and individuals turn ideas into reality.'
                )}
              </p>
            </motion.article>

            <motion.article className="about-purpose-item" {...reveal}>
              <div className="about-purpose-top">
                <span className="about-icon">
                  <FiEye aria-hidden="true" />
                </span>
                <span className="about-index">02</span>
              </div>

              <p className="about-eyebrow">Our Vision</p>

              <h3>
                {getPageText(
                  vision.heading,
                  'Become a trusted technology partner for thoughtful innovation.'
                )}
              </h3>

              <p className="about-body-text">
                {getPageText(
                  vision.description,
                  'Our vision is to be recognized for innovation, quality and accessible digital solutions that empower individuals and businesses through artificial intelligence, software development and emerging technologies.'
                )}
              </p>
            </motion.article>

          </div>
        </div>
      </section>

      {/* EXPERTISE */}

      <section className="about-section about-surface">
        <div className="container">

          <motion.div className="about-section-heading" {...reveal}>
            <p className="about-eyebrow">Our Expertise</p>
            <h2>Technology that turns ideas into reality.</h2>
            <p className="about-body-text">
              Combining modern tools, practical engineering
              and intelligent software development.
            </p>
          </motion.div>

          <div className="about-expertise-grid">
            {expertise.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.article
                  key={item.title}
                  className="about-expertise-item"
                  {...reveal}
                >
                  <div className="about-purpose-top">
                    <span className="about-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="about-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.article>
              )
            })}
          </div>

        </div>
      </section>

      {/* DEVELOPMENT PROCESS */}

      <section className="about-section">
        <div className="container">

          <motion.div className="about-section-heading" {...reveal}>
            <p className="about-eyebrow">How We Work</p>
            <h2>From idea to implementation.</h2>
            <p className="about-body-text">
              A clear and structured approach to building
              practical technology.
            </p>
          </motion.div>

          <div className="about-process-grid">
            {process.map((step) => {
              const Icon = step.icon

              return (
                <motion.article
                  key={step.number}
                  className="about-process-step"
                  {...reveal}
                >
                  <div className="about-process-icon">
                    <Icon aria-hidden="true" />
                  </div>

                  <p className="about-eyebrow">
                    STEP {step.number}
                  </p>

                  <h3>{step.title}</h3>
                  <p className="about-process-description">
                    {step.description}
                  </p>
                </motion.article>
              )
            })}
          </div>

        </div>
      </section>

      {/* CONTACT CTA */}

      <section className="about-section">
        <div className="container">

          <motion.div className="about-contact-cta" {...reveal}>
            <div>
              <p className="about-eyebrow">
                Let's Connect
              </p>

              <h2>Let's Build Something Together.</h2>

              <p>
                Have an idea, academic project or business
                requirement? Let's explore what we can create.
              </p>
            </div>

            <div className="about-cta-actions">
              <Link to="/contact" className="primary-button">
                Let's Talk
                <FiArrowUpRight aria-hidden="true" />
              </Link>

              <Link to="/reviews" className="secondary-button">
                Read Customer Reviews
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  )
}
