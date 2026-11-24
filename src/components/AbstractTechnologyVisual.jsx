import React from 'react'
import { motion } from 'framer-motion'

export default function AbstractTechnologyVisual() {
  return (
    <div className="technology-visual" aria-hidden="true">
      <div className="technology-visual-glow" />
      <motion.svg
        viewBox="0 0 760 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <defs>
          <linearGradient id="tiaFlow" x1="80" y1="80" x2="680" y2="450" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2997FF" stopOpacity="0.2" />
            <stop offset="0.48" stopColor="#0071E3" stopOpacity="0.9" />
            <stop offset="1" stopColor="#2997FF" stopOpacity="0.18" />
          </linearGradient>
          <filter id="tiaSoft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <motion.ellipse cx="380" cy="280" rx="238" ry="92" transform="rotate(-12 380 280)" stroke="url(#tiaFlow)" strokeWidth="26" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.72 }} transition={{ duration: 1.8, delay: 0.1, ease: 'easeInOut' }} />
        <motion.ellipse cx="380" cy="280" rx="238" ry="92" transform="rotate(52 380 280)" stroke="#0071E3" strokeOpacity="0.26" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.35, ease: 'easeInOut' }} />
        <motion.ellipse cx="380" cy="280" rx="238" ry="92" transform="rotate(102 380 280)" stroke="#2997FF" strokeOpacity="0.18" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.5, ease: 'easeInOut' }} />
        <motion.circle cx="380" cy="280" r="84" stroke="#0071E3" strokeOpacity="0.12" strokeWidth="1" fill="#0071E3" fillOpacity="0.025" animate={{ r: [78, 88, 78], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} />
        {[
          [176, 310], [268, 354], [348, 276], [452, 230],
          [544, 178], [620, 124], [402, 132], [224, 214]
        ].map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 7 : 4.5}
            fill="#0071E3"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.35, 0.9, 0.35], scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: 3.2, delay: index * 0.14, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <circle cx="392" cy="286" r="70" fill="#0071E3" fillOpacity="0.08" filter="url(#tiaSoft)" />
      </motion.svg>
    </div>
  )
}
