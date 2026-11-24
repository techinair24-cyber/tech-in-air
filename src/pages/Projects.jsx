import React from 'react'
import PageHeader from '../components/PageHeader'
import Projects from '../components/Projects'
import PublishedPageSections from '../components/PublishedPageSections'
import { usePublishedPage, usePublishedProjects } from '../lib/publicContent'
import { getPageText } from '../lib/pageContent.mjs'

export default function ProjectsPage(){
  const { title, content } = usePublishedPage('projects')
  const { data: projects } = usePublishedProjects()
  const hero = content?.hero && typeof content.hero === 'object' ? content.hero : {}

  return (
    <div>
      <PageHeader title={getPageText(hero.heading, title || 'Projects')} subtitle={getPageText(hero.description, 'Our portfolio')} />
      <section className="py-8 container">
        <Projects />
      </section>
      <PublishedPageSections content={content} projects={projects || []} excludedTypes={['hero']} />
    </div>
  )
}
