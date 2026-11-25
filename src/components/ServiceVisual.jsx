
import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getPublicMediaUrl } from '../lib/publicContent'

const serviceImages = {
  'business-website': '/Projects/business-website.webp',
  'portfolio-website': '/Projects/portfolio-website.webp',
  ecommerce: '/Projects/ecommerce.webp',
  'android-development': '/Projects/android-development.webp',
  'business-automation': '/Projects/business-automation.webp',
  'website-maintenance': '/Projects/website-maintenance.webp',
}

const fallbackImage = '/Projects/homepage-business-premium.webp'

function ServiceImage({ slug, title, image }) {
  const [attempt, setAttempt] = useState(0)

  const sources = [...new Set([
    image ? getPublicMediaUrl(image) || image : null,
    serviceImages[slug],
    fallbackImage,
  ].filter(Boolean))]

  const source = sources[attempt]

  if (!source) {
    return (
      <div className="service-visual-placeholder">
        <span>{title}</span>
      </div>
    )
  }

  return (
    <img
      key={source}
      src={source}
      alt={title}
      loading="lazy"
      decoding="async"
      onError={() => setAttempt((current) => current + 1)}
    />
  )
}

export default function ServiceVisual({ slug, title, image }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4 }}
      className="premium-service-visual"
    >
      <ServiceImage
        key={`${slug}-${image || ''}`}
        slug={slug}
        title={title}
        image={image}
      />
    </motion.div>
  )
}
