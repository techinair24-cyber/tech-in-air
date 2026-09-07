import React from 'react'
import PageHeader from '../components/PageHeader'
import Projects from '../components/Projects'

export default function ProjectsPage(){
  return (
    <div>
      <PageHeader title="Projects" subtitle="Our portfolio" />
      <section className="py-8 container">
        <Projects />
      </section>
    </div>
  )
}
