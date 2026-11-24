import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Check,
  MessageCircle,
  Monitor,
  ShoppingCart,
  Smartphone,
  Store,
  User,
  Wrench,
} from 'lucide-react'
import { businessServices } from '../data/businessSolutions'

const iconMap = { store: Store, user: User, cart: ShoppingCart, android: Smartphone, automation: Bot, maintenance: Wrench }

export default function BusinessSolutionsPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-slate-200/70 py-16 dark:border-slate-800 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(34,211,238,0.12),transparent_24%),radial-gradient(circle_at_88%_28%,rgba(59,130,246,0.12),transparent_24%)]" />
        <div className="container relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">Tech Made Simple</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-6xl">
              Grow Your Business with Smart Digital Solutions
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Tech In Air helps businesses, startups, shops and professionals establish their digital presence through affordable websites, mobile applications and intelligent automation solutions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#services" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5">
                Explore Services <ArrowRight size={18} />
              </a>
              <Link to="/business-solutions/quotation" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-5 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white">
                Request a Quote
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="relative mx-auto w-full max-w-xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/40">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 h-2.5 w-32 rounded-full bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="mt-4 grid grid-cols-[1.5fr_0.55fr] gap-4">
                <div>
                  <div className="h-28 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 p-4 dark:from-cyan-950 dark:to-blue-950">
                    <div className="h-3 w-20 rounded bg-slate-800 dark:bg-slate-300" />
                    <div className="mt-4 h-2 w-32 rounded bg-slate-400/70" />
                    <div className="mt-2 h-2 w-24 rounded bg-slate-400/70" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((item) => <div key={item} className="h-16 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900"><div className="h-2 w-8 rounded bg-cyan-400" /><div className="mt-3 h-2 w-full rounded bg-slate-200 dark:bg-slate-700" /></div>)}
                  </div>
                </div>
                <div className="rounded-[1.5rem] border-4 border-slate-800 bg-slate-100 p-2 dark:border-slate-600 dark:bg-slate-900">
                  <div className="mx-auto h-1 w-8 rounded-full bg-slate-400" />
                  <div className="mt-3 h-16 rounded-lg bg-gradient-to-br from-cyan-200 to-blue-200 dark:from-cyan-900 dark:to-blue-900" />
                  <div className="mt-3 space-y-2"><div className="h-2 rounded bg-slate-300 dark:bg-slate-700" /><div className="h-2 w-4/5 rounded bg-slate-300 dark:bg-slate-700" /></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="scroll-mt-28 py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">Our digital services</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Solutions for every stage of growth</h2>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {businessServices.map((service, index) => {
              const Icon = iconMap[service.icon] || Monitor
              return (
                <motion.article key={service.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.035 }} className="flex min-h-[290px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-cyan-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"><Icon size={24} /></div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">Available</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.shortDescription}</p>
                  <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">{service.pricingUnit === 'month' ? 'Starting at' : 'Starting from'}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{service.startingPrice}</p>
                  <Link to={`/business-solutions/${service.slug}`} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-cyan-400 dark:text-slate-950">
                    Explore Service <ArrowRight size={16} />
                  </Link>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-50/60 py-16 dark:border-slate-800 dark:bg-slate-950/30 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">Why choose Tech In Air?</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Clear service. Practical execution.</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {['Affordable pricing', 'Customized development', 'Responsive designs', 'Transparent quotations', 'Direct communication', 'Deployment assistance'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/70">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"><Check size={17} /></span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container rounded-3xl bg-slate-900 px-6 py-10 text-center text-white dark:bg-cyan-950/40 md:px-10">
          <h2 className="text-3xl font-bold">Have a Business Idea? Let's Build It.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">Discuss your requirement and receive a clear, project-specific quotation.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/business-solutions/quotation" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Let's Talk <ArrowRight size={18} /></Link>
            <a href="https://wa.me/918310808011" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 font-semibold">WhatsApp <MessageCircle size={18} /></a>
          </div>
        </div>
      </section>
    </div>
  )
}
