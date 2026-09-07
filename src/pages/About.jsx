import React from 'react'
import PageHeader from '../components/PageHeader'
import AboutVisual from '../components/AboutVisual'

export default function AboutPage(){
  return (
    <div>
      <PageHeader title="About" subtitle="Technology With Purpose" />
      <section className="py-12 container grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Tech in Air</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Tech in Air is a technology-focused project development initiative based in Bangalore, working across Software, Artificial Intelligence, Machine Learning, IoT and Embedded Systems.</p>
          <p className="mt-3 text-slate-600 dark:text-slate-300">We turn ideas into working technology — from concept and hardware to software, documentation and demonstrations.</p>
        </div>
        <div>
          <AboutVisual />
        </div>
      </section>
    </div>
  )
}
