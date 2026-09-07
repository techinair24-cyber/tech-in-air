import React from 'react'
import Hero from '../components/Hero'
import CapabilityStrip from '../components/CapabilityStrip'
import Services from '../components/Services'
import ProjectCard from '../components/ProjectCard'
import projects from '../data/projects'
import CTA from '../components/CTA'

export default function Home(){
  const featured = projects.slice(0,4)
  return (
    <div>
      <Hero />
      <section className="py-10">
        <div className="container">
          <CapabilityStrip />
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">About Tech in Air</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-3">We build working projects across Software, AI/ML, IoT and Embedded systems. View our featured projects below.</p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {featured.map(p=> <ProjectCard key={p.id} p={p} />)}
          </div>
          <div className="mt-4">
            <a href="/projects" className="text-cyan-600 dark:text-cyan-300">View All Projects →</a>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <h2 className="text-3xl font-semibold">Services</h2>
          <div className="mt-4">
            <Services preview />
          </div>
        </div>
      </section>

      <CTA />
    </div>
  )
}
