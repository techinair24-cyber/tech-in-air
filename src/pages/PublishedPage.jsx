import React from 'react'
import { useLocation } from 'react-router-dom'
import PublishedPageSections from '../components/PublishedPageSections'
import { getPublicMediaUrl, usePublishedPage, usePublishedProjects, usePublishedServices } from '../lib/publicContent'
import { getPageText } from '../lib/pageContent.mjs'

export default function PublishedPage() {
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\/+|\/+$/g, '')
  const { title, content, loading, error } = usePublishedPage(slug)
  const { data: services } = usePublishedServices('business-solutions')
  const { data: projects } = usePublishedProjects()
  const hero = content?.hero && typeof content.hero === 'object' && !Array.isArray(content.hero) ? content.hero : {}
  const hasHeroSection = Array.isArray(content?.sections) && content.sections.some((section) => section?.type === 'hero')
  const image = getPublicMediaUrl(hero.image || hero.imagePath)

  if (loading) return <p className="container py-16 text-[var(--muted)]" role="status">Loading published page…</p>
  if (!content) {
    return (
      <section className="container py-16">
        <h1 className="text-3xl font-semibold">{error ? 'Page content is temporarily unavailable' : 'Page not found'}</h1>
        <p className="mt-3 text-[var(--muted)]">{error ? 'Please try again shortly.' : 'This page is not currently published.'}</p>
      </section>
    )
  }

  return (
    <article>
      {!hasHeroSection && (
        <header className="border-b border-[var(--border)] py-16 md:py-24">
          <div className={`container grid gap-8 ${image ? 'md:grid-cols-[1fr_0.7fr]' : ''} md:items-center`}>
            <div>
              <p className="mb-4 text-sm font-semibold text-[var(--accent)]">{getPageText(hero.eyebrow, title)}</p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">{getPageText(hero.heading, getPageText(hero.title, title))}</h1>
              {getPageText(hero.description) && <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{hero.description}</p>}
            </div>
            {image && <img src={image} alt={getPageText(hero.imageAlt)} loading="lazy" className="max-h-96 w-full rounded-2xl border border-[var(--border)] object-cover" />}
          </div>
        </header>
      )}
      {error && <p className="container pt-5 text-sm text-[var(--muted)]" role="status">Showing the last successfully loaded version. Some content may be out of date.</p>}
      <PublishedPageSections content={content} services={services || []} projects={projects || []} />
    </article>
  )
}
