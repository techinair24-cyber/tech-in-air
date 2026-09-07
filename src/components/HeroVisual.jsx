import React from 'react'
import { motion } from 'framer-motion'

export default function HeroVisual(){
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="glass rounded-lg p-6">
      <svg viewBox="0 0 800 480" className="w-full h-72 md:h-96" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="hg" x1="0" x2="1">
            <stop offset="0" stopColor="#00d2ff" stopOpacity="0.95"/>
            <stop offset="1" stopColor="#a66dff" stopOpacity="0.9"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" rx="12" fill="rgba(6,12,20,0.1)" />
        <g transform="translate(60,80)">
          <rect x="0" y="0" width="220" height="120" rx="10" fill="#071126" stroke="url(#hg)" strokeWidth="1" />
          <rect x="12" y="12" width="196" height="96" rx="6" fill="#071726" />
        </g>
        <g transform="translate(320,60)">
          <circle cx="0" cy="0" r="8" fill="#00e0ff" />
          <circle cx="120" cy="20" r="6" fill="#a66dff" />
          <path d="M0 0 L120 20 L200 80" stroke="rgba(173,216,230,0.4)" strokeWidth="1.5" fill="none" />
        </g>
        <g transform="translate(520,180)">
          <circle cx="0" cy="0" r="4" fill="#fff" opacity="0.9" />
          <circle cx="30" cy="-10" r="5" fill="#00d2ff" />
          <circle cx="60" cy="6" r="6" fill="#a66dff" />
        </g>
      </svg>
    </motion.div>
  )
}
