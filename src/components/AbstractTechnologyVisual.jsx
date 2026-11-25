
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const defaultImage =
  '/Projects/homepage-hero-premium.webp'

export default function AbstractTechnologyVisual({
  src = defaultImage,
  alt = 'A sculptural neural processor core with glass components and electric-blue lighting',
  onError,
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative isolate w-full">

      {/* Ambient blue illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,119,255,0.24), transparent 72%)',
          filter: 'blur(35px)',
        }}
      />

      {/* Floating visual container */}
      <motion.div
        initial={false}
        animate={
          reduceMotion
            ? { y: 0 }
            : { y: [0, -6, 0] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        className="relative w-full"
      >

        {/* Premium image frame */}
        <motion.div
          className="technology-visual group relative overflow-hidden"
          initial={false}
          whileHover={
            reduceMotion
              ? undefined
              : { scale: 1.015 }
          }
          transition={{
            duration: reduceMotion ? 0 : 0.4,
            ease: 'easeOut',
          }}
          style={{
            border: '1px solid rgba(41,151,255,0.35)',
            borderRadius: '16px',
            boxShadow:
              '0 24px 70px rgba(0,0,0,0.22), 0 0 32px rgba(0,110,255,0.12)',
          }}
        >

          {/* Main technology image */}
          <img
            src={src}
            alt={alt}
            width="1448"
            height="1086"
            sizes="(min-width: 768px) 48vw, 100vw"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={onError}
            className="block h-auto w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.035]"
          />

          {/* Cinematic edge shading */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.03) 45%, rgba(0,5,15,0.22) 100%)',
            }}
          />

          {/* Subtle glass reflection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.07), transparent 35%)',
            }}
          />

          {/* Illuminated top edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[15%] right-[15%] top-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, #2997ff, transparent)',
              boxShadow:
                '0 0 12px rgba(41,151,255,0.7)',
            }}
          />

        </motion.div>
      </motion.div>

      {/* Reflection underneath the visual */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 left-[15%] right-[15%] -z-10 h-8 rounded-full"
        style={{
          background: 'rgba(0,119,255,0.15)',
          filter: 'blur(22px)',
        }}
      />

    </div>
  )
}
