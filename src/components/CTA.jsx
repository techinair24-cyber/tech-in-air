import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getPageText, getSafeInternalPath } from '../lib/pageContent.mjs'

const publicPaths = new Set(['/contact', '/business-solutions/quotation', '/business-solutions', '/projects'])

export default function CTA({ content = {} }){
  const reduceMotion = useReducedMotion()
  const settings = content && typeof content === 'object' && !Array.isArray(content) ? content : {}
  const button = settings.button && typeof settings.button === 'object' ? settings.button : {}
  const secondaryButton = settings.secondaryButton && typeof settings.secondaryButton === 'object'
    ? settings.secondaryButton
    : {}
  const href = getSafeInternalPath(button.href, publicPaths) || '/contact'
  const secondaryHref = getSafeInternalPath(secondaryButton.href, publicPaths)
  return (
    <motion.section
      id="contact-cta"
      className="home-cta-section"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' }}
    >
      <div className="container">
        <div className="home-cta">
          <div className="home-cta-copy">
            <p className="home-eyebrow">Have an idea?</p>
            <h2>{getPageText(settings.heading, "Let's build something remarkable.")}</h2>
            <p>{getPageText(settings.description, "Tell us your idea. We'll help turn it into a practical technology solution.")}</p>
          </div>
          <div className="home-cta-actions">
            <Link to={href} className="primary-button whitespace-nowrap">{getPageText(button.label, 'Start a Conversation')}</Link>
            {secondaryHref && (
              <Link to={secondaryHref} className="secondary-button whitespace-nowrap">
                {getPageText(secondaryButton.label, 'Explore Our Work')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
