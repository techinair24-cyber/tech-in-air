import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AbstractTechnologyVisual from './AbstractTechnologyVisual'
import { getPublicMediaUrl, usePublishedPage } from '../lib/publicContent'
import { getPageText, getSafeInternalPath } from '../lib/pageContent.mjs'

const publicPaths = new Set(['/contact', '/projects', '/services', '/business-solutions', '/business-solutions/quotation'])
const defaultHeroImage = '/Projects/tech-in-air-hero.webp'

export default function Hero(){
  const reduceMotion = useReducedMotion()
  const { content } = usePublishedPage('home')
  const hero = content?.hero && typeof content.hero === 'object' && !Array.isArray(content.hero) ? content.hero : {}
  const publishedHeroImage = getPublicMediaUrl(hero.image || hero.imagePath)
  const [heroImage, setHeroImage] = useState(publishedHeroImage || defaultHeroImage)
  const [heroImageFailed, setHeroImageFailed] = useState(false)
  const [usingDefaultHeroFallback, setUsingDefaultHeroFallback] = useState(!publishedHeroImage)
  const primaryCta = hero.primaryCta && typeof hero.primaryCta === 'object' ? hero.primaryCta : {}
  const secondaryCta = hero.secondaryCta && typeof hero.secondaryCta === 'object' ? hero.secondaryCta : {}
  const primaryHref = getSafeInternalPath(primaryCta.href, publicPaths) || '/business-solutions'
  const secondaryHref = getSafeInternalPath(secondaryCta.href, publicPaths) || '/projects'
  const defaultHeroAlt = 'A cinematic Tech In Air workspace with AI, software and connected technology'
  const heroImageAlt = usingDefaultHeroFallback ? defaultHeroAlt : getPageText(hero.imageAlt, defaultHeroAlt)
  const heroBrand = getPageText(hero.eyebrow, getPageText(hero.brand, 'Tech In Air'))
  const heroTitle = getPageText(hero.title, getPageText(hero.heading, 'Your ideas. Our technology.'))
  const showHeroImage = !heroImageFailed

  useEffect(() => {
    setHeroImage(publishedHeroImage || defaultHeroImage)
    setHeroImageFailed(false)
    setUsingDefaultHeroFallback(!publishedHeroImage)
  }, [publishedHeroImage])

  const handleHeroImageError = () => {
    if (heroImage !== defaultHeroImage) {
      setUsingDefaultHeroFallback(true)
      setHeroImage(defaultHeroImage)
      return
    }
    setHeroImageFailed(true)
  }

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
            <p className="hero-brand">{heroBrand}</p>
            <p className="hero-tagline">{getPageText(hero.tagline, 'Tech Made Simple')}</p>
          </motion.div>
          <motion.h1 variants={fadeUp} className="hero-heading">{heroTitle}</motion.h1>
          <motion.p variants={fadeUp} className="hero-description">{getPageText(hero.description, 'Intelligent software, AI and digital solutions built for the real world.')}</motion.p>
          <motion.div variants={fadeUp} className="hero-actions">
            <Link to={primaryHref} className="primary-button">{getPageText(primaryCta.label, 'Explore Solutions')}</Link>
            <Link to={secondaryHref} className="secondary-button">{getPageText(secondaryCta.label, 'Explore Our Work')}</Link>
          </motion.div>
        </motion.div>
        <div className="hero-visual-column">
          {showHeroImage
            ? <AbstractTechnologyVisual
                key={heroImage}
                src={heroImage}
                alt={heroImageAlt}
                onError={handleHeroImageError}
              />
            : <div className="hero-image-fallback" aria-hidden="true" />}
        </div>
      </div>
    </section>
  )
}
