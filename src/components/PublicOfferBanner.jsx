import { Link } from 'react-router-dom'
import { getPublicMediaUrl, usePublishedOffers } from '../lib/publicContent'
import { getPageText, getSafeExternalUrl, getSafeInternalPath } from '../lib/pageContent.mjs'

const publicPaths = new Set(['/business-solutions/quotation', '/business-solutions', '/contact'])

export default function PublicOfferBanner() {
  const offers = usePublishedOffers()
  if (!offers.length) return null

  return (
    <aside className="mx-auto mb-5 w-full max-w-7xl space-y-2 px-4 sm:px-6 lg:px-8" aria-label="Current offers">
      {offers.map((offer) => {
        const banner = offer.banner_content && typeof offer.banner_content === 'object' ? offer.banner_content : {}
        const image = getPublicMediaUrl(banner.imagePath || banner.image_path)
        const discountLabel = getPageText(banner.discountLabel)
          || getPageText(banner.discount_label)
          || (offer.discount_type === 'percentage' ? `${offer.discount_value}% off` : '')
        const href = getSafeInternalPath(banner.ctaHref || banner.cta_href, publicPaths)
          || getSafeExternalUrl(banner.ctaHref || banner.cta_href)
          || '/business-solutions/quotation'
        const label = getPageText(banner.ctaLabel) || getPageText(banner.cta_label, 'Request a quotation')
        return (
          <div key={offer.id} className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] sm:flex-row sm:items-center">
            {image && <img src={image} alt="" loading="lazy" className="h-16 w-24 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {offer.title}
                {discountLabel && <span className="ml-2 text-[var(--accent)]">{discountLabel}</span>}
              </p>
              {offer.description && <p className="mt-1 whitespace-pre-line text-sm text-[var(--muted)]">{offer.description}</p>}
            </div>
            {href.startsWith('/')
              ? <Link to={href} className="shrink-0 text-sm font-semibold text-[var(--accent)] hover:underline">{label}</Link>
              : <a href={href} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-semibold text-[var(--accent)] hover:underline">{label}</a>}
          </div>
        )
      })}
    </aside>
  )
}
