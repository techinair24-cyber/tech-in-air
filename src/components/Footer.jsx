import React from 'react'
import { Link } from 'react-router-dom'
import { getPublicMediaUrl, usePublishedPage } from '../lib/publicContent'
import { getSafeExternalUrl, getSafeInternalPath, getSiteSettings } from '../lib/pageContent.mjs'

const publicFooterPaths = new Set([
  '/', '/about', '/services', '/business-solutions', '/projects', '/reviews', '/contact',
  '/privacy-policy', '/terms-and-conditions',
])

export default function Footer(){
  const { content } = usePublishedPage('home')
  const settings = getSiteSettings(content)
  const brand = settings.brand && typeof settings.brand === 'object' ? settings.brand : {}
  const contact = settings.contact && typeof settings.contact === 'object' ? settings.contact : {}
  const footer = settings.footer && typeof settings.footer === 'object' ? settings.footer : {}
  const brandName = typeof brand.name === 'string' && brand.name.trim() ? brand.name : 'Tech in Air'
  const logo = getPublicMediaUrl(brand.footerLogoPath || brand.logoPath || brand.logo) || '/Logo/Tech%20in%20Air%20Logo.png'
  const location = typeof contact.location === 'string' && contact.location.trim() ? contact.location : 'Bangalore, Karnataka, India'
  const email = typeof contact.email === 'string' && contact.email.trim() ? contact.email : 'tech.in.air24@gmail.com'
  const emailHref = getSafeExternalUrl(email.startsWith('mailto:') ? email : `mailto:${email}`) || 'mailto:tech.in.air24@gmail.com'
  const phone = typeof contact.phone === 'string' && contact.phone.trim() ? contact.phone : '+91 8310808011'
  const phoneHref = getSafeExternalUrl(`tel:${phone.replace(/[^\d+]/g, '')}`) || 'tel:+918310808011'
  const instagram = getSafeExternalUrl(contact.instagramUrl) || 'https://www.instagram.com/tech_in_air_ka'
  const configuredExploreLinks = Array.isArray(footer.exploreLinks)
    ? footer.exploreLinks.map((item) => ({
      label: typeof item?.label === 'string' ? item.label.trim() : '',
      href: getSafeInternalPath(item?.href, publicFooterPaths),
    })).filter((item) => item.label && item.href)
    : []
  const exploreLinks = configuredExploreLinks.length ? configuredExploreLinks : [
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Business Solutions', href: '/business-solutions' },
    { label: 'Academic Solutions', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ]
  const tagline = typeof brand.tagline === 'string' && brand.tagline.trim() ? brand.tagline : 'Tech Made Simple'
  const copyright = typeof footer.copyright === 'string' && footer.copyright.trim()
    ? footer.copyright
    : '© 2023 Tech In Air. All rights reserved.'

  return (
    <footer className="mt-16 border-t border-[var(--border)] py-12">
      <div className="container grid gap-10 md:grid-cols-4">
        <div>
          <img src={logo} alt={brandName} className="h-24 w-48 object-contain" />
          <p className="mt-3 text-sm font-medium text-[var(--muted)]">{tagline}</p>
          {typeof footer.description === 'string' && <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--muted)]">{footer.description}</p>}
        </div>
        <div>
          <div className="font-semibold">Explore</div>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            {exploreLinks.map((item) => <li key={item.href}><Link to={item.href} className="hover:text-[var(--accent)]">{item.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <p>{location}</p>
            <p><a href={emailHref} className="hover:text-[var(--accent)]">{email.replace(/^mailto:/, '')}</a></p>
            <p><a href={phoneHref} className="hover:text-[var(--accent)]">{phone}</a></p>
            <p><a href={instagram} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">Instagram</a></p>
          </div>
        </div>
        <div>
          <div className="font-semibold">Legal</div>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li><Link to="/privacy-policy" className="hover:text-[var(--accent)]">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-[var(--accent)]">Terms &amp; Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mt-10 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
        {copyright}
      </div>
    </footer>
  )
}
