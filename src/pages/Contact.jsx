import React from 'react'
import PageHeader from '../components/PageHeader'
import Contact from '../components/Contact'

export default function ContactPage(){
  return (
    <div>
      <header className="border-b border-[var(--border)] py-14 md:py-20">
        <div className="container grid gap-8 md:grid-cols-[1fr_0.6fr] md:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold text-[var(--accent)]">Contact Tech In Air</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">Have a project idea? Let's build it.</h1>
          </div>
          <p className="max-w-xl leading-8 text-[var(--muted)]">
            Share your requirements for an AI system, software application, academic project or digital business solution.
          </p>
        </div>
      </header>
      <section className="py-8 container">
        <Contact />
      </section>
    </div>
  )
}
