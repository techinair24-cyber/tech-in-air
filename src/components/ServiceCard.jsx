import React from 'react'
import { motion } from 'framer-motion'
import { Code, Lightbulb, FileText, Presentation, MonitorPlay, Cpu } from 'lucide-react'

const ICONS = [Code, Lightbulb, FileText, Presentation, MonitorPlay, Cpu]

export default function ServiceCard({service, index}){
  const Icon = ICONS[index%ICONS.length]
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} className="glass p-6 rounded-lg border border-slate-200/80 dark:border-slate-700/80 hover:border-cyan-300/70 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ rotate: 8, scale: 1.05 }} transition={{ type: 'spring', stiffness: 240, damping: 14 }} className="p-3 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-md text-white shadow-sm"><Icon/></motion.div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{service.title}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{service.description}</div>
        </div>
      </div>
    </motion.div>
  )
}
