import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AbstractTechnologyVisual from './AbstractTechnologyVisual'
import { getPublicMediaUrl, usePublishedPage } from '../lib/publicContent'
import { getPageText, getSafeInternalPath } from '../lib/pageContent.mjs'

const publicPaths = new Set(['/contact', '/projects', '/services', '/business-solutions', '/business-solutions/quotation'])

export default function Hero(){
  const reduceMotion = useReducedMotion()
  const { content } = usePublishedPage('home')
  const hero = content?.hero && typeof content.hero === 'object' && !Array.isArray(content.hero) ? content.hero : {}
  const heroImage = getPublicMediaUrl(hero.image || hero.imagePath)
  const heroImageAlt = getPageText(hero.imageAlt, 'Technology solutions by Tech In Air')
  const [heroImageFailed, setHeroImageFailed] = useState(false)
  const primaryCta = hero.primaryCta && typeof hero.primaryCta === 'object' ? hero.primaryCta : {}
  const secondaryCta = hero.secondaryCta && typeof hero.secondaryCta === 'object' ? hero.secondaryCta : {}
  const primaryHref = getSafeInternalPath(primaryCta.href, publicPaths) || '/business-solutions'
  const secondaryHref = getSafeInternalPath(secondaryCta.href, publicPaths) || '/projects'
  const showHeroImage = Boolean(heroImage && !heroImageFailed)

  useEffect(() => {
    setHeroImageFailed(false)
  }, [heroImage])

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="home" className="hero-immersive">
      <div className="container hero-layout">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          transition={{ duration: reduceMotion ? 0 : 0.45, staggerChildren: reduceMotion ? 0 : 0.08 }}
          className="hero-copy"
        >
          <motion.div variants={fadeUp} className="hero-branding">
            <p className="hero-brand">{getPageText(hero.eyebrow, 'Tech In Air')}</p>
            <p className="hero-tagline">{getPageText(hero.tagline, 'Tech Made Simple')}</p>
          </motion.div>
          <motion.h1 variants={fadeUp} className="hero-heading">{getPageText(hero.title, 'Your ideas. Our technology.')}</motion.h1>
          <motion.p variants={fadeUp} className="hero-description">{getPageText(hero.description, 'Intelligent software, AI and digital solutions built for the real world.')}</motion.p>
          <motion.div variants={fadeUp} className="hero-actions">
            <Link to={primaryHref} className="primary-button">{getPageText(primaryCta.label, 'Explore Solutions')}</Link>
            <Link to={secondaryHref} className="secondary-button">{getPageText(secondaryCta.label, 'Explore Our Work')}</Link>
          </motion.div>
        </motion.div>
        <div className="hero-visual-column">
          {showHeroImage
            ? <img
                key={heroImage}
                src={heroImage}
                alt={heroImageAlt}
                loading="eager"
                className="hero-published-image"
                onError={() => setHeroImageFailed(true)}
              />
            : <AbstractTechnologyVisual />}
        </div>
      </div>
    </section>
  )
}
