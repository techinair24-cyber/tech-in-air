import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function OpeningAnimation() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let shouldShow = false

    try {
      shouldShow = !sessionStorage.getItem('tia-opening-seen')
    } catch {
      shouldShow = true
    }

    if (!shouldShow) return undefined

    setVisible(true)
    try {
      sessionStorage.setItem('tia-opening-seen', '1')
    } catch {}

    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 300 : 900)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-[var(--bg)]"
          aria-label="Tech in Air"
        >
          <motion.img
            src="/Logo/Tech%20in%20Air%20Logo.png"
            alt="Tech in Air"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="h-28 w-72 object-contain sm:h-32 sm:w-96"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
