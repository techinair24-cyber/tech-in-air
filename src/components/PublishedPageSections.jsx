import React from 'react'
import { Link } from 'react-router-dom'
import { getPublicMediaUrl } from '../lib/publicContent'
import { getPageText, getSafeExternalUrl, getSafeInternalPath, getSectionItems } from '../lib/pageContent.mjs'
import ApprovedReviews from './ApprovedReviews'

const internalPaths = new Set([
  '/', '/about', '/services', '/business-solutions', '/projects', '/reviews', '/contact',
  '/business-solutions/quotation',
])

function ActionLink({ item, fallbackPath }) {
  const href = getSafeInternalPath(item?.href, internalPaths) || getSafeExternalUrl(item?.href) || fallbackPath
  if (!href) return null
  const label = getPageText(item?.label, 'Learn more')
  const className = 'inline-flex items-center rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]'
  return href.startsWith('/')
    ? <Link to={href} className={className}>{label}</Link>
    : <a href={href} target={href.startsWith('mailto:') || href.startsWith('tel:') ? undefined : '_blank'} rel="noreferrer" className={className}>{label}</a>
}

function SectionImage({ src, alt = '' }) {
  const image = getPublicMediaUrl(src)
  if (!image) return null
  return <img src={image} alt={getPageText(alt)} loading="lazy" className="h-full w-full rounded-2xl border border-[var(--border)] object-cover" />
}

function ItemCard({ item, fallbackPath }) {
  const record = typeof item === 'string' ? { title: item } : item || {}
  const image = getPageText(record.image) || getPageText(record.imagePath)
  const title = getPageText(record.title) || getPageText(record.name)
  const description = getPageText(record.description)
  const quote = getPageText(record.quote)
  const author = getPageText(record.author)
  const price = getPageText(record.price)
  const features = Array.isArray(record.features) ? record.features.filter((feature) => typeof feature === 'string' || typeof feature === 'number') : []
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      {image && <div className="aspect-[16/10]"><SectionImage src={image} alt={getPageText(record.imageAlt) || getPageText(record.title)} /></div>}
      <div className="p-5">
        {(typeof record.value === 'string' || typeof record.value === 'number') && <p className="text-3xl font-semibold text-[var(--accent)]">{record.value}</p>}
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {description && <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>}
        {quote && <blockquote className="mt-2 text-sm leading-6 text-[var(--muted)]">“{quote}”</blockquote>}
        {author && <p className="mt-3 text-xs font-semibold text-[var(--muted)]">{author}</p>}
        {price && <p className="mt-3 text-lg font-semibold">{price}</p>}
        {features.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
            {features.map((feature, index) => <li key={`${feature}-${index}`}>{feature}</li>)}
          </ul>
        )}
        {record.href && <div className="mt-4"><ActionLink item={record} fallbackPath={fallbackPath} /></div>}
      </div>
    </article>
  )
}

function PublishedSection({ section, services, projects, serviceBasePath }) {
  const title = getPageText(section.heading) || getPageText(section.title)
  const description = getPageText(section.description) || getPageText(section.content) || getPageText(section.text)
  const items = getSectionItems(section)
  const image = getPageText(section.image) || getPageText(section.imagePath)
  const classes = section.type === 'cta'
    ? 'rounded-3xl bg-slate-900 px-6 py-10 text-white dark:bg-cyan-950/40 md:px-10'
    : ''

  if (section.type === 'reviews') {
    return <ApprovedReviews limit={3} title={title || undefined} />
  }

  if (section.type === 'hero' || section.type === 'text' || section.type === 'cta') {
    return (
      <section className="py-12 md:py-16">
        <div className={`container ${image ? 'grid gap-8 md:grid-cols-2 md:items-center' : ''} ${classes}`}>
          <div>
            {getPageText(section.eyebrow) && <p className="text-sm font-semibold text-[var(--accent)]">{getPageText(section.eyebrow)}</p>}
            {title && <h2 className="mt-2 text-3xl font-semibold md:text-5xl">{title}</h2>}
            {description && <p className="mt-4 max-w-3xl whitespace-pre-line leading-7 text-[var(--muted)]">{description}</p>}
            {(section.primaryCta || section.cta || section.secondaryCta) && (
              <div className="mt-6 flex flex-wrap gap-3">
                <ActionLink item={section.primaryCta || section.cta} fallbackPath="/contact" />
                {section.secondaryCta && <ActionLink item={section.secondaryCta} />}
              </div>
            )}
          </div>
          {image && <div className="aspect-[16/10]"><SectionImage src={image} alt={getPageText(section.imageAlt, title)} /></div>}
        </div>
      </section>
    )
  }

  if (section.type === 'image-text') {
    return (
      <section className="py-12 md:py-16">
        <div className="container grid gap-8 md:grid-cols-2 md:items-center">
          <div className="aspect-[16/10]"><SectionImage src={section.image || section.imagePath} alt={section.imageAlt || title || ''} /></div>
          <div>
            {title && <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>}
            {description && <p className="mt-4 whitespace-pre-line leading-7 text-[var(--muted)]">{description}</p>}
            {section.cta && <div className="mt-5"><ActionLink item={section.cta} fallbackPath="/contact" /></div>}
          </div>
        </div>
      </section>
    )
  }

  if (section.type === 'faq') {
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          {title && <h2 className="section-heading">{title}</h2>}
          <div className="mt-6 space-y-3">
            {items.map((item, index) => {
              const record = typeof item === 'string'
                ? { question: item }
                : Array.isArray(item) ? { question: item[0], answer: item[1] } : item || {}
              const question = getPageText(record.question) || getPageText(record.title)
              const answer = getPageText(record.answer)
              return <details key={`${question || 'faq'}-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4">
                <summary className="cursor-pointer font-semibold">{question}</summary>
                {answer && <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{answer}</p>}
              </details>
            })}
          </div>
        </div>
      </section>
    )
  }

  if (section.type === 'service-cards' || section.type === 'pricing-table') {
    const cards = items.length ? items : services
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          {title && <h2 className="section-heading">{title}</h2>}
          {description && <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{description}</p>}
          {cards.length === 0 && <p className="mt-6 text-sm text-[var(--muted)]">No published services are available right now.</p>}
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((service, index) => {
              const record = typeof service === 'string' ? { title: service } : service || {}
              const slug = record.slug || record.id
              const href = getPageText(record.href) || (slug && serviceBasePath ? `${serviceBasePath}/${slug}` : null)
              return <ItemCard key={record.id || slug || index} item={{ ...record, href: href || undefined }} fallbackPath="/business-solutions/quotation" />
            })}
          </div>
        </div>
      </section>
    )
  }

  if (section.type === 'project-cards' || section.type === 'featured-projects') {
    const cards = items.length
      ? items
      : (projects || []).filter((project) => section.type !== 'featured-projects' || project.featured).slice(0, 6)
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          {title && <h2 className="section-heading">{title}</h2>}
          {description && <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{description}</p>}
          {cards.length === 0 && <p className="mt-6 text-sm text-[var(--muted)]">No published projects are available right now.</p>}
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((project, index) => {
              const record = typeof project === 'string' ? { title: project } : project || {}
              const slug = getPageText(record.slug) || getPageText(record.id)
              return <ItemCard key={slug || index} item={{ ...record, href: getPageText(record.href) || (slug ? `/projects/${slug}` : undefined) }} />
            })}
          </div>
        </div>
      </section>
    )
  }

  if (section.type === 'contact') {
    return (
      <section className="py-12 md:py-16">
        <div className="container rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
          {title && <h2 className="section-heading">{title}</h2>}
          {description && <p className="mt-3 leading-7 text-[var(--muted)]">{description}</p>}
          <div className="mt-5 flex flex-wrap gap-3">{items.map((item, index) => <ActionLink key={item?.href || index} item={item} />)}</div>
        </div>
      </section>
    )
  }

  if (section.type === 'gallery') {
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          {title && <h2 className="section-heading">{title}</h2>}
          {items.length === 0 && <p className="mt-6 text-sm text-[var(--muted)]">No public images are available right now.</p>}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => {
              const record = typeof item === 'string' ? { image: item } : item || {}
              return <div key={record.image || index} className="aspect-[4/3]"><SectionImage src={record.image || record.path} alt={record.alt || ''} /></div>
            })}
          </div>
        </div>
      </section>
    )
  }

  if (section.type === 'statistics' || section.type === 'testimonials' || section.type === 'feature-grid'
    || section.type === 'capabilities' || section.type === 'solutions' || section.type === 'technology-list') {
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          {title && <h2 className="section-heading">{title}</h2>}
          {description && <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{description}</p>}
          {items.length === 0 && <p className="mt-6 text-sm text-[var(--muted)]">No published content is available in this section.</p>}
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => {
              const record = Array.isArray(item)
                ? section.type === 'statistics'
                  ? { value: item[0], title: item[1], description: item[2] }
                  : { quote: item[0], author: item[1] }
                : item
              return <ItemCard key={record?.id || record?.title || record?.name || index} item={record} />
            })}
          </div>
        </div>
      </section>
    )
  }

  return null
}

export default function PublishedPageSections({
  content,
  services = [],
  projects = [],
  serviceBasePath = '/business-solutions',
  excludedTypes = [],
}) {
  if (!Array.isArray(content?.sections)) return null

  return content.sections.map((section, index) => {
    if (!section || excludedTypes.includes(section.type)) return null
    return <PublishedSection key={`${section.type}-${section.id || index}`} section={section} services={services} projects={projects} serviceBasePath={serviceBasePath} />
  })
}
