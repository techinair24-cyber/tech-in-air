import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AbstractTechnologyVisual from './AbstractTechnologyVisual'

export default function Hero(){
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="home" className="hero-immersive relative isolate overflow-hidden">
      <div className="hero-visual-layer"><AbstractTechnologyVisual /></div>
      <div className="container relative z-10 flex min-h-[680px] items-center justify-center py-20 text-center md:min-h-[760px]">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, staggerChildren: 0.08 }}
          className="mx-auto max-w-5xl"
        >
          <motion.p variants={fadeUp} className="mb-6 text-sm font-semibold text-[var(--accent)]">AI · Software · Digital Solutions</motion.p>
          <motion.h1 variants={fadeUp} className="hero-heading">Building Intelligent Technology.</motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">We create AI-powered software, modern applications and digital solutions that turn ideas into reality.</motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="primary-button">Let's Talk</Link>
            <Link to="/projects" className="secondary-button">Explore Our Work</Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
