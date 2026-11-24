import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AbstractTechnologyVisual from './AbstractTechnologyVisual'
import { getPublicMediaUrl, usePublishedPage } from '../lib/publicContent'
import { getPageText, getSafeInternalPath } from '../lib/pageContent.mjs'

const publicPaths = new Set(['/contact', '/projects', '/services', '/business-solutions', '/business-solutions/quotation'])

export default function Hero(){
  const { content } = usePublishedPage('home')
  const hero = content?.hero && typeof content.hero === 'object' && !Array.isArray(content.hero) ? content.hero : {}
  const heroImage = getPublicMediaUrl(hero.image || hero.imagePath)
  const heroImageAlt = getPageText(hero.imageAlt)
  const primaryCta = hero.primaryCta && typeof hero.primaryCta === 'object' ? hero.primaryCta : {}
  const secondaryCta = hero.secondaryCta && typeof hero.secondaryCta === 'object' ? hero.secondaryCta : {}
  const primaryHref = getSafeInternalPath(primaryCta.href, publicPaths) || '/contact'
  const secondaryHref = getSafeInternalPath(secondaryCta.href, publicPaths) || '/projects'
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="home" className="hero-immersive relative isolate overflow-hidden">
      <div className="hero-visual-layer"><AbstractTechnologyVisual /></div>
      {heroImage && <img src={heroImage} alt={heroImageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />}
      <div className="container relative z-10 flex min-h-[680px] items-center justify-center py-20 text-center md:min-h-[760px]">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, staggerChildren: 0.08 }}
          className="mx-auto max-w-5xl"
        >
          <motion.p variants={fadeUp} className="mb-5 text-sm font-semibold text-[var(--foreground)]">{getPageText(hero.eyebrow, 'Tech In Air')}</motion.p>
          <motion.p variants={fadeUp} className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">{getPageText(hero.tagline, 'Tech Made Simple')}</motion.p>
          <motion.h1 variants={fadeUp} className="hero-heading">{getPageText(hero.title, 'Building Intelligent Technology.')}</motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">{getPageText(hero.description, 'We develop intelligent software, AI-powered applications and digital solutions that transform ideas into real-world technology.')}</motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to={primaryHref} className="primary-button">{getPageText(primaryCta.label, "Let's Talk")}</Link>
            <Link to={secondaryHref} className="secondary-button">{getPageText(secondaryCta.label, 'Explore Our Work')}</Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
