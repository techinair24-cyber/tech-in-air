import React from 'react'
import { Link } from 'react-router-dom'

export default function CTA(){
  return (
    <section className="py-16 md:py-24">
      <div className="container flex flex-col items-start justify-between gap-8 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-8 md:flex-row md:items-center md:p-12">
        <div>
          <h3 className="text-3xl font-bold md:text-5xl">Your Idea. Our Expertise.</h3>
          <p className="mt-3 text-[var(--muted)]">Let's build the next useful technology solution.</p>
        </div>
        <div>
          <Link to="/contact" className="primary-button whitespace-nowrap">Let's Talk</Link>
        </div>
      </div>
    </section>
  )
}
