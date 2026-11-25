
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Projects from '../components/Projects'
import PublishedPageSections from '../components/PublishedPageSections'
import {
  usePublishedPage,
  usePublishedProjects,
} from '../lib/publicContent'
import { getPageText } from '../lib/pageContent.mjs'
import projectsData from '../data/projects'

export default function ProjectsPage() {
  const { title, content } = usePublishedPage('projects')
  const { data: projects } = usePublishedProjects()
  const reducedMotion = useReducedMotion()

  const hero = content?.hero &&
    typeof content.hero === 'object'
    ? content.hero
    : {}

  return (
    <div className="portfolio-premium">

      <header className="portfolio-hero">

        <div className="container">

          <motion.div
            initial={reducedMotion
              ? false
              : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.45,
            }}
          >

            <p className="portfolio-kicker">
              TECH IN AIR · OUR PORTFOLIO
            </p>

            <h1>
              {getPageText(
                hero.heading,
                title || 'Ideas into Reality.'
              )}
            </h1>

            <p className="portfolio-hero-description">
              {getPageText(
                hero.description,
                'Explore our practical work across artificial intelligence, software, electronics and intelligent engineering systems.'
              )}
            </p>

          </motion.div>

        </div>

      </header>

      <Projects />

      <PublishedPageSections
        content={content}
        projects={projects === null
          ? projectsData
          : projects}
        excludedTypes={['hero']}
      />

    </div>
  )
}
