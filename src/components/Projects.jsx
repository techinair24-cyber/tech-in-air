
import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, ArrowUpRight, ArrowRight } from 'lucide-react'
import projectsData from '../data/projects'
import { usePublishedProjects } from '../lib/publicContent'

const fallbackImage = new URL(
  '../assets/projects/placeholder.svg',
  import.meta.url
).href

function Counter({ value }) {
  const [count, setCount] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setCount(value)
      return
    }

    let frame
    const start = performance.now()

    function animate(now) {
      const progress = Math.min((now - start) / 900, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setCount(Math.round(value * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)
  }, [value, reducedMotion])

  return <span>{count}</span>
}

function PortfolioImage({ project }) {
  const localProject = projectsData.find(
    (item) => String(item.id) === String(project.id)
  )

  const sources = [...new Set([
    project.image,
    localProject?.image,
    fallbackImage,
  ].filter(Boolean))]

  const [attempt, setAttempt] = useState(0)

  return (
    <img
      src={sources[attempt] || fallbackImage}
      alt={project.title}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (attempt < sources.length - 1) {
          setAttempt(attempt + 1)
        }
      }}
      className="portfolio-card-image"
    />
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const reducedMotion = useReducedMotion()

  const { data: publishedProjects } = usePublishedProjects()

  const projects = publishedProjects === null
    ? projectsData
    : publishedProjects

  const categories = useMemo(() => [
    'All',
    ...new Set(
      projects.flatMap((project) => project.categories || [])
    ),
  ], [projects])

  const activeFilter = categories.includes(filter)
    ? filter
    : 'All'

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesCategory =
        activeFilter === 'All' ||
        (project.categories || []).includes(activeFilter)

      const searchableText = [
        project.title,
        project.description,
        ...(project.categories || []),
        ...(project.technologies || []),
      ].filter(Boolean).join(' ').toLowerCase()

      return matchesCategory &&
        searchableText.includes(query)
    })
  }, [projects, activeFilter, search])

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
    },
    {
      label: 'Completed Projects',
      value: projects.filter(
        (p) => p.status?.toLowerCase() === 'completed'
      ).length,
    },
    {
      label: 'Technology Domains',
      value: categories.length - 1,
    },
    {
      label: 'Technologies Used',
      value: new Set(
        projects.flatMap((p) => p.technologies || [])
      ).size,
    },
  ]

  return (
    <section id="projects" className="portfolio-gallery">
      <div className="container">

        {/* PROJECT STATISTICS */}

        <div className="portfolio-statistics">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="portfolio-stat"
            >
              <strong>
                <Counter value={stat.value} />
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* SEARCH AND FILTERS */}

        <div className="portfolio-toolbar">

          <div>
            <p className="portfolio-kicker">
              PROJECT COLLECTION
            </p>
            <h2>Explore our work.</h2>
          </div>

          <div className="portfolio-search">
            <Search size={19} aria-hidden="true" />

            <input
              type="search"
              aria-label="Search projects"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        <div className="portfolio-filters">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              aria-pressed={activeFilter === category}
              onClick={() => setFilter(category)}
              className={
                activeFilter === category
                  ? 'portfolio-filter active'
                  : 'portfolio-filter'
              }
            >
              {category === 'All'
                ? 'All Projects'
                : category}
            </button>
          ))}
        </div>

        <div
          className="portfolio-results"
          aria-live="polite"
        >
          Showing {filtered.length} of {projects.length} projects
        </div>

        {/* PROJECT GALLERY */}

        <div className="portfolio-grid">

          {filtered.map((project, index) => (
            <motion.article
              key={project.id}
              initial={reducedMotion
                ? false
                : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: reducedMotion ? 0 : 0.35,
                delay: reducedMotion
                  ? 0
                  : Math.min(index * 0.04, 0.2),
              }}
              className="portfolio-card"
            >

              <Link
                to={`/projects/${project.slug || project.id}`}
                className="portfolio-card-link"
              >

                <div className="portfolio-card-visual">

                  <PortfolioImage
                    key={`${project.id}-${project.image}`}
                    project={project}
                  />

                  <span className="portfolio-card-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="portfolio-card-arrow">
                    <ArrowUpRight size={21} />
                  </span>

                </div>

                <div className="portfolio-card-content">

                  <p className="portfolio-card-category">
                    {(project.categories || [])
                      .slice(0, 3)
                      .join(' · ')}
                  </p>

                  <h3>{project.title}</h3>

                  <p className="portfolio-card-description">
                    {project.description}
                  </p>

                  <div className="portfolio-card-footer">

                    <span className="portfolio-card-status">
                      {project.status || 'Published'}
                    </span>

                    <span className="portfolio-card-action">
                      View Project
                      <ArrowRight size={16} />
                    </span>

                  </div>

                </div>

              </Link>

            </motion.article>
          ))}

        </div>

        {filtered.length === 0 && (
          <div className="portfolio-empty">
            <h3>No projects found</h3>
            <p>Try a different search or category.</p>

            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setSearch('')
                setFilter('All')
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
