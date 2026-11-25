
import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, Cpu } from 'lucide-react'

import AbstractTechnologyVisual from './AbstractTechnologyVisual'
import {
  getPublicMediaUrl,
  usePublishedPage
} from '../lib/publicContent'
import {
  getPageText,
  getSafeInternalPath
} from '../lib/pageContent.mjs'

const publicPaths = new Set([
  '/contact',
  '/projects',
  '/services',
  '/business-solutions',
  '/business-solutions/quotation'
])

const defaultHeroImage =
  '/Projects/homepage-hero-premium.webp'

const defaultHeroAlt =
  'Advanced neural processor with electric-blue lighting'

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const { content } = usePublishedPage('home')

  const hero =
    content?.hero &&
    typeof content.hero === 'object' &&
    !Array.isArray(content.hero)
      ? content.hero
      : {}

  const publishedHeroImage = getPublicMediaUrl(
    hero.image || hero.imagePath
  )

  const [heroImage, setHeroImage] = useState(
    publishedHeroImage || defaultHeroImage
  )

  const [heroImageFailed, setHeroImageFailed] =
    useState(false)

  const primaryCta =
    hero.primaryCta &&
    typeof hero.primaryCta === 'object'
      ? hero.primaryCta
      : {}

  const secondaryCta =
    hero.secondaryCta &&
    typeof hero.secondaryCta === 'object'
      ? hero.secondaryCta
      : {}

  const primaryHref =
    getSafeInternalPath(primaryCta.href, publicPaths) ||
    '/business-solutions'

  const secondaryHref =
    getSafeInternalPath(secondaryCta.href, publicPaths) ||
    '/projects'

  const heroBrand = getPageText(
    hero.eyebrow,
    getPageText(hero.brand, 'Tech In Air')
  )

  const heroTitle = getPageText(
    hero.title,
    getPageText(
      hero.heading,
      'Your ideas. Our technology.'
    )
  )

  const heroDescription = getPageText(
    hero.description,
    'We build intelligent software, AI-powered applications and digital solutions that transform ideas into reality.'
  )

  const heroImageAlt =
    heroImage === defaultHeroImage
      ? defaultHeroAlt
      : getPageText(hero.imageAlt, defaultHeroAlt)

  useEffect(() => {
    setHeroImage(
      publishedHeroImage || defaultHeroImage
    )
    setHeroImageFailed(false)
  }, [publishedHeroImage])

  const handleHeroImageError = () => {
    if (heroImage !== defaultHeroImage) {
      setHeroImage(defaultHeroImage)
      return
    }

    setHeroImageFailed(true)
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
        delayChildren: reduceMotion ? 0 : 0.08
      }
    }
  }

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 24
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <section
      id="home"
      className="hero-immersive relative isolate"
      aria-labelledby="hero-title"
    >
      {/* Ambient background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute -right-24 top-0 h-[600px] w-[600px] rounded-full blur-[150px]"
          style={{
            background:
              'radial-gradient(circle, rgba(0,110,255,0.16), transparent 70%)'
          }}
        />

        <div
          className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(41,151,255,0.09), transparent 70%)'
          }}
        />
      </div>

      <div className="container hero-layout">

        {/* Hero content */}
        <motion.div
          className="hero-copy"
          variants={containerVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          <motion.div
            variants={fadeUp}
            className="hero-branding"
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-[2px] w-9 bg-[var(--accent)]"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Technology & Innovation
              </span>
            </div>

            <p className="hero-brand">
              {heroBrand}
            </p>

            <p className="hero-tagline">
              {getPageText(
                hero.tagline,
                'Tech Made Simple'
              )}
            </p>
          </motion.div>

          <motion.h1
            id="hero-title"
            variants={fadeUp}
            className="hero-heading"
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="hero-description"
          >
            {heroDescription}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="hero-actions"
          >
            <Link
              to={primaryHref}
              className="primary-button group gap-3"
            >
              {getPageText(
                primaryCta.label,
                'Explore Solutions'
              )}

              <ArrowUpRight
                size={19}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              to={secondaryHref}
              className="secondary-button group gap-3"
            >
              {getPageText(
                secondaryCta.label,
                'Explore Our Work'
              )}

              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          {/* Technology signature */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[var(--border)] pt-5"
          >
            {[
              'Artificial Intelligence',
              'Software',
              'Digital Solutions'
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                />

                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Cinematic technology visual */}
        <motion.div
          className="hero-visual-column"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.96,
                  x: 20
                }
          }
          animate={{
            opacity: 1,
            scale: 1,
            x: 0
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.9,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div className="relative w-full">

            {!heroImageFailed ? (
              <AbstractTechnologyVisual
                key={heroImage}
                src={heroImage}
                alt={heroImageAlt}
                onError={handleHeroImageError}
              />
            ) : (
              <div
                className="hero-image-fallback grid place-items-center"
                role="img"
                aria-label="Technology processor illustration"
              >
                <Cpu
                  size={96}
                  strokeWidth={1}
                  className="text-[var(--accent)]"
                  aria-hidden="true"
                />
              </div>
            )}

            {/* Decorative corner details */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 z-10 h-8 w-8 border-l-2 border-t-2 border-blue-400"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 z-10 h-8 w-8 border-b-2 border-r-2 border-blue-400"
            />

            {/* Floating technology label */}
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 12 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduceMotion ? 0 : 0.6,
                duration: reduceMotion ? 0 : 0.5
              }}
              className="absolute bottom-4 left-4 z-20 flex items-center gap-3 rounded-lg border border-white/15 bg-[#050b15]/90 px-4 py-3 text-white shadow-xl backdrop-blur-xl sm:-left-4 sm:bottom-8"
            >
              <div className="grid h-10 w-10 place-items-center rounded-md border border-blue-400/30 bg-blue-500/10">
                <Cpu
                  size={21}
                  className="text-blue-400"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                  Tech In Air
                </p>

                <p className="mt-1 text-xs font-semibold">
                  Intelligent Technology
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
