import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero(){
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="home" className="pt-8 pb-12 md:pt-10">
      <div className="container grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, staggerChildren: 0.08 }}
          className="md:col-span-5"
        >
          <motion.h1 variants={fadeUp} className="font-extrabold leading-tight text-slate-900 dark:text-white" style={{fontSize:'clamp(2.6rem,5vw,4rem)'}}>Building Technology That Brings Ideas to Life.</motion.h1>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-600 dark:text-slate-300">Tech in Air develops innovative Software, AI/ML, IoT and Embedded Systems projects for academic and real-world applications.</motion.p>
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-4">
            <Link to="/contact" className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-md font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">Start Your Project</Link>
            <Link to="/projects" className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-100 bg-white/60 dark:bg-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">Explore Projects</Link>
          </motion.div>
        </motion.div>
        <div className="md:col-span-7">
          <motion.div initial={{opacity:0,y:20,scale:0.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.55,ease:'easeOut'}} className="w-full">
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-black/30 hover:shadow-2xl transition-transform duration-500 bg-white/50 dark:bg-transparent">
              <img src="/Projects/tech-in-air-hero.png" alt="Tech in Air hero" className="w-full h-[300px] md:h-[420px] lg:h-[500px] object-cover object-center transform transition-transform duration-500 hover:scale-105"/>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
