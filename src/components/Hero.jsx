import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero(){
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="home" className="relative isolate min-h-[calc(100vh-7rem)] overflow-hidden pb-16 pt-12 md:pb-20 md:pt-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_35%,rgba(41,151,255,0.12),transparent_32%)]" />
      <div className="container grid items-center gap-10 md:grid-cols-12">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, staggerChildren: 0.08 }}
          className="md:col-span-6"
        >
          <motion.p variants={fadeUp} className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">AI. Software. Digital Solutions.</motion.p>
          <motion.h1 variants={fadeUp} className="max-w-3xl text-[clamp(3.2rem,7vw,6.7rem)] font-bold leading-[0.92] tracking-[-0.065em]">Intelligence<br />Meets Innovation.</motion.h1>
          <motion.p variants={fadeUp} className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)] md:text-xl">We design and build intelligent software, AI systems and digital products that turn ambitious ideas into working solutions.</motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="primary-button">Let's Talk</Link>
            <Link to="/projects" className="secondary-button">Explore Our Work</Link>
          </motion.div>
        </motion.div>
        <div className="md:col-span-6">
          <motion.div initial={{opacity:0,y:20,scale:0.98}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.55,ease:'easeOut'}} className="w-full">
            <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
              <img src="/Projects/tech-in-air-hero.png" alt="Tech in Air software and AI project portfolio" className="h-[320px] w-full object-cover md:h-[520px]"/>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
