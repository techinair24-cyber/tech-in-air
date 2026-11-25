import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function AbstractTechnologyVisual() {
  const reduceMotion = useReducedMotion()
  const signalTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 3.8, repeat: Infinity, ease: 'linear' }

  return (
    <div className="technology-visual" aria-hidden="true">
      <motion.svg
        viewBox="0 0 640 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: 'easeOut' }}
      >
        <defs>
          <linearGradient id="processorSurface" x1="196" y1="145" x2="438" y2="376" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--surface-strong)" />
            <stop offset="1" stopColor="var(--surface)" />
          </linearGradient>
          <filter id="processorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <path d="M320 84V153M320 367V438M143 260H198M442 260H497M194 130L231 168M409 352L446 390M446 130L409 168M231 352L194 390" stroke="#2997FF" strokeOpacity="0.48" strokeWidth="1.5" />
        <path d="M320 84H274V104M320 438H368V416M143 260H118V224M497 260H522V296M194 130H162V109M446 390H478V411M446 130H478V109M194 390H162V411" stroke="var(--border)" strokeWidth="1.5" />
        <circle cx="320" cy="260" r="125" fill="#2997FF" fillOpacity="0.1" filter="url(#processorGlow)" />

        <motion.path d="M320 84V153M143 260H198M497 260H442M320 438V367" stroke="#2997FF" strokeWidth="1.5" strokeOpacity="0.68" initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.18 }} />
        <motion.circle
          r="3.5"
          fill="#2997FF"
          animate={reduceMotion ? { cx: 247, cy: 260 } : { cx: [202, 247], cy: [260, 260] }}
          transition={signalTransition}
        />
        <motion.circle
          r="3.5"
          fill="#2997FF"
          animate={reduceMotion ? { cx: 320, cy: 186 } : { cx: [320, 320], cy: [150, 186] }}
          transition={signalTransition}
        />

        <rect x="198" y="153" width="244" height="214" rx="22" fill="url(#processorSurface)" stroke="#2997FF" strokeOpacity="0.55" strokeWidth="1.5" />
        <rect x="215" y="170" width="210" height="180" rx="14" stroke="var(--border)" strokeWidth="1" />
        <path d="M243 219H276M364 219H397M243 302H276M364 302H397M320 188V205M320 315V332" stroke="#2997FF" strokeOpacity="0.72" strokeWidth="2" strokeLinecap="round" />
        <rect x="276" y="205" width="88" height="110" rx="12" fill="#0068D9" fillOpacity="0.16" stroke="#2997FF" strokeOpacity="0.72" />
        <path d="M296 236H344M296 252H344M296 268H333M296 284H338" stroke="#2997FF" strokeOpacity="0.72" strokeWidth="3" strokeLinecap="round" />
        <text x="320" y="339" fill="var(--foreground)" fontSize="10" fontWeight="600" letterSpacing="2" textAnchor="middle">INTELLIGENT CORE</text>

        <g fill="var(--surface)" stroke="#2997FF" strokeOpacity="0.66">
          <rect x="245" y="56" width="64" height="32" rx="9" />
          <rect x="88" y="244" width="62" height="32" rx="9" />
          <rect x="490" y="244" width="62" height="32" rx="9" />
          <rect x="287" y="432" width="66" height="32" rx="9" />
          <rect x="126" y="92" width="72" height="32" rx="9" />
          <rect x="442" y="396" width="78" height="32" rx="9" />
          <rect x="442" y="92" width="78" height="32" rx="9" />
          <rect x="126" y="396" width="72" height="32" rx="9" />
        </g>
        <g fill="var(--foreground)" fontSize="10" fontWeight="600" letterSpacing="1.1" textAnchor="middle">
          <text x="277" y="76">AI</text>
          <text x="119" y="264">ML</text>
          <text x="521" y="264">DATA</text>
          <text x="320" y="452">IoT</text>
          <text x="162" y="112">SOFTWARE</text>
          <text x="481" y="416">APPLICATIONS</text>
          <text x="481" y="112">APPS</text>
          <text x="162" y="416">DATA</text>
        </g>
        <g fill="#2997FF">
          <circle cx="320" cy="84" r="3" />
          <circle cx="143" cy="260" r="3" />
          <circle cx="497" cy="260" r="3" />
          <circle cx="320" cy="438" r="3" />
          <circle cx="194" cy="130" r="3" />
          <circle cx="446" cy="390" r="3" />
          <circle cx="446" cy="130" r="3" />
          <circle cx="194" cy="390" r="3" />
        </g>
      </motion.svg>
    </div>
  )
}
