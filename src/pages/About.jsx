import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import AboutVisual from '../components/AboutVisual'

export default function AboutPage(){
  return (
    <div>
      <PageHeader title="About" subtitle="Technology With Purpose" />
      <section className="py-12 container grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Tech in Air</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Tech in Air is a technology-focused project development initiative based in Bangalore, working across Software, Artificial Intelligence, Machine Learning, IoT and Embedded Systems.</p>
          <p className="mt-3 text-slate-600 dark:text-slate-300">We turn ideas into working technology — from concept and hardware to software, documentation and demonstrations.</p>
        </div>
        <div>
          <AboutVisual />
        </div>
      </section>

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
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">OUR PROJECT PORTFOLIO</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">From academic ideas to working technology projects.</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: '10', label: 'Total Projects' },
                { value: '6', label: 'Engineering Main Projects' },
                { value: '1', label: 'Diploma Main Project' },
                { value: '3', label: 'Other Projects' },
              ].map(({ value, label }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                  className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white/70 p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-slate-950/40"
                >
                  <div className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{label}</div>
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
