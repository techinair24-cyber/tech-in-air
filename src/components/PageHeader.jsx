import React from 'react'
import { motion } from 'framer-motion'

export default function PageHeader({title, subtitle}){
  return (
    <header className="pt-4 pb-6 md:pt-6 md:pb-8 bg-gradient-to-b from-slate-200/40 to-transparent dark:from-black/5 dark:to-transparent">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-slate-600 dark:text-slate-300 mt-2 text-base md:text-lg">{subtitle}</p>}
        </motion.div>
      </div>
    </header>
  )
}
