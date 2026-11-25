
import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import projects from '../data/projects'
import { usePublishedProjects } from '../lib/publicContent'

const fallbackSrc = new URL(
  '../assets/projects/placeholder.svg',
  import.meta.url
).href

function ProjectImage({ project }) {
  const localProject = projects.find(
    (item) => String(item.id) === String(project.id)
  )

  const sources = [...new Set([
    project.image,
    localProject?.image,
    fallbackSrc,
  ].filter(Boolean))]

  const [attempt, setAttempt] = useState(0)

  return (
    <img
      src={sources[attempt] || fallbackSrc}
      alt={project.title}
      decoding="async"
      onError={() => {
        if (attempt < sources.length - 1) {
          setAttempt(attempt + 1)
        }
      }}
    />
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const reducedMotion = useReducedMotion()

  const {
    data: publishedProjects,
    loading,
  } = usePublishedProjects()

  const projectList = publishedProjects === null
    ? projects
    : publishedProjects

  const project = projectList.find(
    (p) => String(p.id) === String(id) ||
      p.slug === id
  )

  if (!project) {
    return (
      <div className="container py-20">
        <h1 className="text-3xl font-semibold">
          {loading
            ? 'Loading project…'
            : 'Project not found'}
        </h1>

        <Link
          to="/projects"
          className="secondary-button mt-6"
        >
          Back to Projects
        </Link>
      </div>
    )
  }

  const categories = Array.isArray(project.categories)
    ? project.categories
    : project.category
      ? [project.category]
      : []

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : []

  const whatsappMessage = encodeURIComponent(
    `Hello Tech in Air, I would like to discuss the project ${project.title}.`
  )

  return (
    <div className="project-detail-premium">

      <div className="container">

        <Link
          to="/projects"
          className="project-back-link"
        >
          <ArrowLeft size={17} />
          All Projects
        </Link>

        {/* PROJECT HEADER */}

        <motion.header
          className="project-detail-header"
          initial={reducedMotion
            ? false
            : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.4,
          }}
        >

          <p className="portfolio-kicker">
            PROJECT SHOWCASE
          </p>

          <div className="project-detail-categories">
            {categories.map((category) => (
              <span key={category}>{category}</span>
            ))}
          </div>

          <h1>{project.title}</h1>

        </motion.header>

        {/* IMAGE AND OVERVIEW */}

        <div className="project-detail-grid">

          <motion.div
            className="project-detail-image"
            initial={reducedMotion
              ? false
              : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.45,
            }}
          >
            <ProjectImage
              key={`${project.id}-${project.image}`}
              project={project}
            />
          </motion.div>

          <div className="project-overview">

            <p className="portfolio-kicker">
              PROJECT OVERVIEW
            </p>

            <h2>About the project.</h2>

            <p className="project-overview-description">
              {project.description}
            </p>

            <div className="project-information">

              <div>
                <span>Project Status</span>
                <strong>
                  {project.status || 'Published'}
                </strong>
              </div>

              <div>
                <span>Technology Domains</span>
                <strong>
                  {categories.join(' · ') || 'Technology'}
                </strong>
              </div>

              <div>
                <span>Developed by</span>
                <strong>Tech In Air</strong>
              </div>

            </div>

          </div>

        </div>

        {/* TECHNOLOGY STACK */}

        {technologies.length > 0 && (
          <section className="project-tech-section">

            <p className="portfolio-kicker">
              TOOLS & TECHNOLOGIES
            </p>

            <h2>Technology stack.</h2>

            <div className="project-tech-list">
              {technologies.map((technology) => (
                <span key={technology}>
                  {technology}
                </span>
              ))}
            </div>

          </section>
        )}

        {/* CONTACT CTA */}

        <section className="project-detail-cta">

          <div>
            <p className="portfolio-kicker">
              BUILD WITH TECH IN AIR
            </p>

            <h2>Have a similar project idea?</h2>

            <p>
              Discuss your requirements and explore
              the right technical solution.
            </p>
          </div>

          <div className="project-detail-actions">

            <a
              href={`https://wa.me/918310808011?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button"
            >
              Discuss Your Project
              <ArrowUpRight size={18} />
            </a>

            <Link
              to="/projects"
              className="secondary-button"
            >
              Explore More Projects
            </Link>

          </div>

        </section>

      </div>

    </div>
  )
}
