import React from 'react'
import { motion } from 'framer-motion'

export default function PageHeader({title, subtitle}){
  return (
    <header className="border-b border-[var(--border)] py-14 md:py-20">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-slate-600 dark:text-slate-300 mt-2 text-base md:text-lg">{subtitle}</p>}
        </motion.div>
      </div>
    </header>
  )
}
