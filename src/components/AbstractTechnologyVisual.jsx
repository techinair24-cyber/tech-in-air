import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const defaultImage = '/Projects/homepage-hero-premium.webp'

export default function AbstractTechnologyVisual({
  src = defaultImage,
  alt = 'A sculptural neural processor core with glass components and electric-blue lighting',
  onError,
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="technology-visual"
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' }}
    >
      <img
        src={src}
        alt={alt}
        width="1448"
        height="1086"
        sizes="(min-width: 768px) 48vw, 100vw"
        loading="eager"
        fetchpriority="high"
        onError={onError}
      />
    </motion.div>
  )
}
