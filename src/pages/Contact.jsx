import React from 'react'
import Contact from '../components/Contact'
import PublishedPageSections from '../components/PublishedPageSections'
import { usePublishedPage } from '../lib/publicContent'
import { getPageText, getSiteSettings } from '../lib/pageContent.mjs'

export default function ContactPage(){
  const { content } = usePublishedPage('contact')
  const { content: homeContent } = usePublishedPage('home')
  const hero = content?.hero && typeof content.hero === 'object' ? content.hero : {}
  const siteSettings = getSiteSettings(homeContent)
  const contact = siteSettings.contact && typeof siteSettings.contact === 'object' ? siteSettings.contact : {}
  const intro = content?.contact && typeof content.contact === 'object' && !Array.isArray(content.contact) ? content.contact : {}

  return (
    <div>
      <header className="border-b border-[var(--border)] py-14 md:py-20">
        <div className="container grid gap-8 md:grid-cols-[1fr_0.6fr] md:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold text-[var(--accent)]">Contact Tech In Air</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">{getPageText(hero.heading, 'Have a project idea? Let’s build it.')}</h1>
          </div>
          <p className="max-w-xl leading-8 text-[var(--muted)]">
            {getPageText(hero.description, 'Share your requirements for an AI system, software application, academic project or digital business solution.')}
          </p>
        </div>
      </header>
      <PublishedPageSections content={content} excludedTypes={['hero']} />
      <section className="py-8 container">
        <Contact contact={contact} intro={intro} />
      </section>
    </div>
  )
}
