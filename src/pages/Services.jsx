
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Cpu,
  Code2,
  Smartphone,
  Eye,
  CircuitBoard,
  GraduationCap,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

import projects from '../data/projects'
import services from '../data/services'
import PublishedPageSections from '../components/PublishedPageSections'

import {
  getPublicMediaUrl,
  usePublishedPage,
  usePublishedProjects,
  usePublishedServices,
} from '../lib/publicContent'

import { getPageText } from '../lib/pageContent.mjs'

const domains = [
  {
    icon: Cpu,
    title: 'Artificial Intelligence & Machine Learning',
    shortTitle: 'AI & ML',
    description: 'Classification, prediction, analytics and practical AI applications.',
    technologies: ['Python', 'Machine Learning', 'TensorFlow'],
  },
  {
    icon: Code2,
    title: 'Software & Web Development',
    shortTitle: 'Software & Web',
    description: 'Reliable applications and responsive web systems.',
    technologies: ['React', 'JavaScript', 'Python'],
  },
  {
    icon: Smartphone,
    title: 'Android Applications',
    shortTitle: 'Android',
    description: 'Mobile interfaces and functional app workflows.',
    technologies: ['Android Studio', 'Kotlin', 'Firebase'],
  },
  {
    icon: Eye,
    title: 'Data Science & Computer Vision',
    shortTitle: 'Data & Vision',
    description: 'Image analysis, data processing and visual intelligence.',
    technologies: ['OpenCV', 'Python', 'Data Analytics'],
  },
  {
    icon: CircuitBoard,
    title: 'IoT & Embedded Systems',
    shortTitle: 'IoT & Embedded',
    description: 'Supporting sensor, hardware and connected-system projects.',
    technologies: ['Arduino', 'ESP32', 'Sensors'],
  },
  {
    icon: GraduationCap,
    title: 'Diploma & Engineering Projects',
    shortTitle: 'Academic Projects',
    description: 'Technical implementation and guidance aligned to academic requirements.',
    technologies: ['Planning', 'Development', 'Demonstration'],
  },
]

const fallbackImage = '/Projects/homepage-academic-premium.webp'
const domainImages = [
  '/Projects/Holographic AI Brain Over Chip-1.png',
  '/Projects/Cinematic Developer Workspace Glow-2.png',
  '/Projects/android-development.webp',
  '/Projects/Computer Vision Fruit Detection Lab-3.png',
  '/Projects/IoT Engineering Workshop Prototype Lab-4.png',
  '/Projects/Collaborative Robotics Lab Workshop-5.png',
]

function AcademicImage({ source, title, hero = false }) {
  const [failedSource, setFailedSource] = useState(null)

  const resolved = getPublicMediaUrl(source) || source || ''

  const currentSource =
    resolved && failedSource !== resolved
      ? resolved
      : hero && failedSource !== fallbackImage
        ? fallbackImage
        : ''

  if (!currentSource) {
    return (
      <div className="academic-image-fallback">
        <Cpu size={48} aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={currentSource}
      alt={title}
      loading={hero ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => {
        if (currentSource === fallbackImage) {
          setFailedSource(fallbackImage)
        } else {
          setFailedSource(resolved)
        }
      }}
    />
  )
}

export default function ServicesPage() {
  const reduceMotion = useReducedMotion()
  const [activeDomain, setActiveDomain] = useState(0)

  const { content } = usePublishedPage('academic-solutions')

  const { data: academicServiceRecords } =
    usePublishedServices('academic-solutions')

  const { data: publishedProjects } = usePublishedProjects()

  const hero =
    content?.hero && typeof content.hero === 'object'
      ? content.hero
      : {}

  const pageServices = Array.isArray(content?.services)
    ? content.services
        .filter(
          (service) =>
            service &&
            typeof service === 'object' &&
            typeof service.title === 'string'
        )
        .map((service) => ({
          id: service.id || service.title,
          title: service.title,
          description: getPageText(service.description),
        }))
    : services

  const academicServices =
    academicServiceRecords === null ||
    academicServiceRecords.length === 0
      ? pageServices
      : academicServiceRecords.map((service) => ({
          id: service.id,
          title: service.title,
          description:
            service.shortDescription || service.detailedDescription,
        }))

  const academicProjects =
    publishedProjects === null
      ? [11, 8, 9, 2, 4, 12]
          .map((id) => projects.find((project) => project.id === id))
          .filter(Boolean)
      : publishedProjects.slice(0, 6)

  const selectedDomain = domains[activeDomain]

  const reveal = {
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduceMotion ? 0 : 0.45 },
  }

  return (
    <div className="academic-premium">

      {/* CINEMATIC ACADEMIC HERO */}

      <header className="academic-hero">
        <div className="container">

          <motion.div className="academic-hero-copy" {...reveal}>
            <p className="solutions-kicker">
              Engineering · Innovation · Technology
            </p>

            <h1>
              {getPageText(
                hero.heading,
                'Imagine. Develop. Innovate.'
              )}
            </h1>

            <p className="solutions-intro">
              {getPageText(
                hero.description,
                'AI, software and engineering project development with clear planning, technical guidance and demonstration support.'
              )}
            </p>

            <div className="solutions-actions">
              <Link to="/contact" className="primary-button">
                Discuss Your Project
                <ArrowUpRight size={18} />
              </Link>

              <a href="#academic-domains" className="secondary-button">
                Explore Technology Domains
              </a>
            </div>
          </motion.div>

          <motion.div className="academic-hero-image" {...reveal}>
            <AcademicImage
              source={hero.image || hero.imagePath || fallbackImage}
              title={getPageText(
                hero.imageAlt,
                'Advanced engineering and robotics laboratory'
              )}
              hero
            />

            <div className="academic-image-caption">
              <GraduationCap size={28} />
              <div>
                <strong>From Concept to Creation</strong>
                <span>Practical engineering. Meaningful learning.</span>
              </div>
            </div>
          </motion.div>

        </div>
      </header>

      <PublishedPageSections
        content={content}
        services={academicServices}
        projects={publishedProjects || projects}
        serviceBasePath={null}
        excludedTypes={['hero']}
      />

      {/* INTERACTIVE TECHNOLOGY DOMAINS */}

      <section
        id="academic-domains"
        className="solutions-section scroll-mt-28"
      >
        <div className="container">

          <motion.div className="solutions-heading academic-centered" {...reveal}>
            <p className="solutions-kicker">Project Development</p>
            <h2>Choose your technology domain.</h2>
            <p className="solutions-intro">
              Explore the technologies that can bring your ideas to life.
            </p>
          </motion.div>

          <div className="academic-domain-grid">
            {domains.map((domain, index) => {
              const Icon = domain.icon

              return (
                <button
                  key={domain.title}
                  type="button"
                  aria-pressed={activeDomain === index}
                  onClick={() => setActiveDomain(index)}
                  className={`academic-domain-button ${
                    activeDomain === index ? 'is-active' : ''
                  }`}
                >
                  <Icon size={30} aria-hidden="true" />
                  <strong>{domain.shortTitle}</strong>
                  <span>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>

          <motion.article
            key={activeDomain}
            className="academic-domain-preview"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
          >
            <div className="academic-domain-image">
              <AcademicImage
                key={activeDomain}
                source={domainImages[activeDomain]}
                title={selectedDomain.title}
              />
            </div>

            <div>
              <p className="solutions-kicker">
                Selected Technology Domain
              </p>

              <h3>{selectedDomain.title}</h3>

              <p className="solutions-intro">
                {selectedDomain.description}
              </p>

              <div className="academic-technology-tags">
                {selectedDomain.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>

              <Link to="/contact" className="academic-text-link">
                Discuss a Project
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </motion.article>

        </div>
      </section>

      {/* STUDENT SUPPORT */}

      <section className="solutions-section academic-support">
        <div className="container academic-support-grid">

          <motion.div {...reveal}>
            <p className="solutions-kicker">Student Support</p>
            <h2>Clarity at every stage.</h2>
            <p className="solutions-intro">
              Technical guidance to help you understand,
              develop and demonstrate your project.
            </p>
          </motion.div>

          <div className="academic-support-items">
            {academicServices.length === 0 && (
              <p className="solutions-intro">
                No academic services are currently published.
              </p>
            )}

            {academicServices.map((service) => (
              <motion.article
                key={service.id || service.title}
                {...reveal}
              >
                <CheckCircle2 size={23} aria-hidden="true" />

                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </section>

      {/* PROJECT JOURNEY */}

      <section className="solutions-section">
        <div className="container">

          <div className="solutions-heading academic-centered">
            <p className="solutions-kicker">Your Project Journey</p>
            <h2>From idea to demonstration.</h2>
          </div>

          <div className="academic-journey-grid">
            {[
              ['01', 'Discuss', 'Understand the project idea.'],
              ['02', 'Plan', 'Select the technical approach.'],
              ['03', 'Develop', 'Implement the working system.'],
              ['04', 'Demonstrate', 'Test, explain and demonstrate.'],
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

      {/* FEATURED PROJECTS */}

      <section className="solutions-section">
        <div className="container">

          <div className="academic-project-heading">
            <div>
              <p className="solutions-kicker">
                Featured Academic Projects
              </p>
              <h2>Explore real project work.</h2>
            </div>

            <Link to="/projects" className="secondary-button">
              View All Projects
              <ArrowRight size={17} />
            </Link>
          </div>

          {academicProjects.length === 0 && (
            <p className="solutions-intro">
              No featured projects are currently available.
            </p>
          )}

          <div className="academic-project-grid">
            {academicProjects.map((project) => (
              <motion.article key={project.id} {...reveal}>
                <Link
                  to={`/projects/${project.slug || project.id}`}
                  className="academic-project-link"
                >
                  <div className="academic-project-image">
                    <AcademicImage
                      source={
                        project.image ||
                        project.imagePath ||
                        project.image_paths?.[0]
                      }
                      title={project.title}
                    />
                  </div>

                  <p className="solutions-kicker">
                    {Array.isArray(project.categories)
                      ? project.categories.slice(0, 2).join(' · ')
                      : getPageText(project.category)}
                  </p>

                  <div className="academic-project-title">
                    <h3>{project.title}</h3>
                    <ArrowUpRight size={21} aria-hidden="true" />
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

        </div>
      </section>

      {/* ACADEMIC CTA */}

      <section className="solutions-section">
        <div className="container">
          <motion.div className="solutions-final-cta" {...reveal}>
            <div>
              <p className="solutions-kicker">Your Next Step</p>
              <h2>Tell us what you want to build.</h2>
              <p className="solutions-intro">
                Explore your idea with practical technical guidance.
              </p>
            </div>

            <Link to="/contact" className="primary-button">
              Discuss Your Project
              <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
