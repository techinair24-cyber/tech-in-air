import React from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import CapabilityStrip from '../components/CapabilityStrip'
import Services from '../components/Services'
import CTA from '../components/CTA'

export default function Home(){
  return (
    <div>
      <Hero />
      <section className="py-10">
        <div className="container">
          <CapabilityStrip />
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <h2 className="text-3xl font-semibold">Services</h2>
          <div className="mt-4">
            <Services preview />
          </div>
        </div>
      </section>

      <CTA />

      <section className="py-12 md:py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="glass rounded-2xl p-6 md:p-10"
          >
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">OUR PROJECT PORTFOLIO</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">From academic ideas to working technology projects.</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: '10', description: 'Total Projects', prominent: true },
                { title: '6', description: 'Engineering Main Projects', prominent: true },
                { title: '1', description: 'Diploma Main Project', prominent: true },
                { title: '3', description: 'Other Projects', prominent: true },
              ].map(({ title, description, prominent }, index) => (
                <motion.div
                  key={description}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                  className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white/70 p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-slate-950/40"
                >
                  <div className={`${prominent ? 'text-5xl' : 'text-xl'} font-bold tracking-tight text-slate-900 dark:text-white`}>
                    {title}
                  </div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 text-center">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Have a project idea?</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-300">Let's turn it into a working project.</p>
              </div>
              <Link
                to="/contact"
                className="rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5"
              >
                Start Your Project
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
