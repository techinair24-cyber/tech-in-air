import React from 'react'
import { motion } from 'framer-motion'

export default function AboutVisual(){
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-2 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60 dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-black/20 dark:ring-slate-700/80"
    >
      <img
        src="/Projects/tech-in-air-about.png"
        alt="Tech in Air company overview"
        className="h-[300px] w-full rounded-xl object-cover shadow-md md:h-[360px] lg:h-[390px]"
        loading="lazy"
      />
    </motion.div>
  )
}
