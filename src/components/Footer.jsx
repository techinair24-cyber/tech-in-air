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
  const currentYear = new Date().getFullYear()
  const copyright = typeof footer.copyright === 'string' && footer.copyright.trim()
    ? footer.copyright.replace(/\b(?:19|20)\d{2}\b/g, String(currentYear))
    : `© ${currentYear} Tech In Air. All rights reserved.`

  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div className="site-footer-brand">
          <Link to="/" className="site-footer-logo-link" aria-label={`${brandName} home`}>
            <img src={logo} alt={brandName} width="224" height="160" loading="lazy" />
          </Link>
          <p className="site-footer-tagline">{tagline}</p>
          {typeof footer.description === 'string' && footer.description.trim() && (
            <p className="site-footer-description">{footer.description}</p>
          )}
        </div>
        <div className="site-footer-column">
          <h2>Explore</h2>
          <ul>
            {exploreLinks.map((item) => <li key={item.href}><Link to={item.href}>{item.label}</Link></li>)}
          </ul>
        </div>
        <div className="site-footer-column">
          <h2>Contact</h2>
          <address>
            <p>{location}</p>
            <p><a href={emailHref}>{email.replace(/^mailto:/, '')}</a></p>
            <p><a href={phoneHref}>{phone}</a></p>
            <p><a href={instagram} target="_blank" rel="noreferrer">Instagram</a></p>
          </address>
        </div>
        <div className="site-footer-column">
          <h2>Legal</h2>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="container site-footer-bottom">{copyright}</div>
    </footer>
  )
}
