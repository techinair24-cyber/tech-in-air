import React from 'react'
import { Link } from 'react-router-dom'
import { getPageText, getSafeInternalPath } from '../lib/pageContent.mjs'

const publicPaths = new Set(['/contact', '/business-solutions/quotation', '/business-solutions', '/projects'])

export default function CTA({ content = {} }){
  const settings = content && typeof content === 'object' && !Array.isArray(content) ? content : {}
  const button = settings.button && typeof settings.button === 'object' ? settings.button : {}
  const href = getSafeInternalPath(button.href, publicPaths) || '/contact'
  return (
    <section className="py-16 md:py-24">
      <div className="container flex flex-col items-start justify-between gap-8 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-8 md:flex-row md:items-center md:p-12">
        <div>
          <h3 className="text-3xl font-bold md:text-5xl">{getPageText(settings.heading, 'Your Idea. Our Expertise.')}</h3>
          <p className="mt-3 text-[var(--muted)]">{getPageText(settings.description, "Let's build the next useful technology solution.")}</p>
        </div>
        <div>
          <Link to={href} className="primary-button whitespace-nowrap">{getPageText(button.label, "Let's Talk")}</Link>
        </div>
      </div>
    </section>
  )
}
