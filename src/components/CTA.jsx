
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, Sparkles } from 'lucide-react'

import {
  getPageText,
  getSafeInternalPath
} from '../lib/pageContent.mjs'

const publicPaths = new Set([
  '/contact',
  '/business-solutions/quotation',
  '/business-solutions',
  '/projects'
])

export default function CTA({ content = {} }) {
  const reduceMotion = useReducedMotion()

  const settings =
    content &&
    typeof content === 'object' &&
    !Array.isArray(content)
      ? content
      : {}

  const button =
    settings.button &&
    typeof settings.button === 'object'
      ? settings.button
      : {}

  const secondaryButton =
    settings.secondaryButton &&
    typeof settings.secondaryButton === 'object'
      ? settings.secondaryButton
      : {}

  const href =
    getSafeInternalPath(button.href, publicPaths) ||
    '/contact'

  const secondaryHref =
    getSafeInternalPath(
      secondaryButton.href,
      publicPaths
    )

  return (
    <motion.section
      id="contact-cta"
      aria-labelledby="contact-cta-title"
      className="home-cta-section"
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 24 }
      }
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true,
        amount: 0.15
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <div className="container">

        <div
          className="home-cta relative isolate overflow-hidden"
          style={{
            border: '1px solid rgba(41,151,255,0.25)',
            borderRadius: '16px'
          }}
        >

          {/* Technical background grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                'linear-gradient(rgba(41,151,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(41,151,255,0.07) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage:
                'linear-gradient(90deg, transparent, black)'
            }}
          />

          {/* Ambient illumination */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-40 -z-10 h-[500px] w-[500px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(0,119,255,0.20), transparent 70%)',
              filter: 'blur(35px)'
            }}
          />

          {/* Decorative orbital design */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-1/2 -z-10 hidden h-[420px] w-[420px] -translate-y-1/2 lg:block"
          >
            {[0, 1, 2, 3].map((ring) => (
              <div
                key={ring}
                className="absolute rounded-full border border-blue-500/15"
                style={{
                  inset: `${ring * 35}px`
                }}
              />
            ))}

            <motion.div
              className="absolute inset-0"
              animate={
                reduceMotion
                  ? { rotate: 0 }
                  : { rotate: 360 }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 35,
                      repeat: Infinity,
                      ease: 'linear'
                    }
              }
            >
              <span
                className="absolute left-1/2 top-0 h-2.5 w-2.5 rounded-full bg-blue-400"
                style={{
                  boxShadow:
                    '0 0 18px rgba(41,151,255,0.8)'
                }}
              />
            </motion.div>
          </div>

          {/* Illuminated top edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[10%] right-[10%] top-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, #2997ff, transparent)'
            }}
          />

          {/* Main CTA content */}
          <div className="home-cta-copy relative z-10">

            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-blue-500/25 bg-blue-500/10">
                <Sparkles
                  size={19}
                  className="text-[var(--accent)]"
                  aria-hidden="true"
                />
              </span>

              <p className="home-eyebrow !mb-0">
                {getPageText(
                  settings.eyebrow,
                  'Have an idea?'
                )}
              </p>
            </div>

            <h2 id="contact-cta-title">
              {getPageText(
                settings.heading,
                "Let's build something remarkable."
              )}
            </h2>

            <p className="mt-4 max-w-xl leading-relaxed">
              {getPageText(
                settings.description,
                "Tell us your idea. We'll help turn it into a practical technology solution."
              )}
            </p>

          </div>

          {/* CTA buttons */}
          <div className="home-cta-actions relative z-10">

            <Link
              to={href}
              className="primary-button group gap-3"
            >
              {getPageText(
                button.label,
                'Start a Conversation'
              )}

              <ArrowUpRight
                size={19}
                aria-hidden="true"
                className="transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              />
            </Link>

            {secondaryHref && (
              <Link
                to={secondaryHref}
                className="secondary-button group gap-3"
              >
                {getPageText(
                  secondaryButton.label,
                  'Explore Our Work'
                )}

                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                />
              </Link>
            )}

          </div>

        </div>
      </div>
    </motion.section>
  )
}
