import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronDown,
  MessageCircle,
  Monitor,
  Smartphone,
  ShoppingCart,
  Store,
  User,
  Wrench,
  Bot,
} from 'lucide-react'
import { businessServices, PRICING_DISCLAIMER } from '../data/businessSolutions'

const iconMap = { store: Store, user: User, cart: ShoppingCart, android: Smartphone, automation: Bot, maintenance: Wrench }

function ConceptPreview({ service, preview, index }) {
  const isMobile = service.id === 'android-development'
  const isAutomation = service.id === 'business-automation'
  const isMaintenance = service.id === 'website-maintenance'
  const isStore = service.id === 'ecommerce'

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-5 dark:from-cyan-950/50 dark:via-slate-950 dark:to-blue-950/50">
        {isMobile ? (
          <div className="h-full max-h-52 w-28 rounded-[1.35rem] border-4 border-slate-800 bg-white p-2 shadow-xl dark:border-slate-600 dark:bg-slate-900">
            <div className="mx-auto h-1 w-8 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="mt-3 h-16 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-900 dark:to-blue-900" />
            <div className="mt-3 space-y-2">
              <div className="h-2 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-2 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 grid grid-cols-2 gap-2"><div className="h-8 rounded bg-cyan-100 dark:bg-cyan-900/60" /><div className="h-8 rounded bg-slate-100 dark:bg-slate-800" /></div>
            </div>
          </div>
        ) : isAutomation ? (
          <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between"><span className="h-2 w-20 rounded bg-slate-300 dark:bg-slate-600" /><span className="h-5 w-5 rounded-full bg-cyan-400" /></div>
            <div className="mt-5 flex items-center justify-between gap-2">
              {['Enquiry', 'Route', 'Report'].map((label, itemIndex) => (
                <React.Fragment key={label}>
                  <div className="flex h-12 flex-1 flex-col items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-[10px] font-bold text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200">
                    {itemIndex + 1}<span>{label}</span>
                  </div>
                  {itemIndex < 2 && <div className="h-0.5 w-3 bg-cyan-400" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : isMaintenance ? (
          <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between"><span className="text-xs font-bold">System Health</span><span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">Healthy</span></div>
            <div className="mt-4 grid grid-cols-3 gap-2">{[92, 88, 96].map((value) => <div key={value} className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800"><div className="text-sm font-bold">{value}%</div><div className="mt-1 h-1 rounded bg-cyan-400" /></div>)}</div>
          </div>
        ) : (
          <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between"><span className="h-2 w-14 rounded bg-slate-800 dark:bg-slate-300" /><span className="h-5 w-16 rounded-full bg-slate-100 dark:bg-slate-800" /></div>
            <div className={`mt-3 h-16 rounded-lg ${isStore ? 'bg-gradient-to-r from-amber-100 to-emerald-100 dark:from-amber-950 dark:to-emerald-950' : 'bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-950 dark:to-blue-950'}`} />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((item) => <div key={item} className="h-12 rounded-md border border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"><div className="mx-auto mt-2 h-5 w-5 rounded-full bg-cyan-200 dark:bg-cyan-900" /></div>)}
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">{preview.title}</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{preview.label} - Illustrative preview</p>
      </div>
    </article>
  )
}

export default function BusinessServiceDetail({ service }) {
  const Icon = iconMap[service.icon] || Monitor
  const related = businessServices.filter((item) => service.relatedServices.includes(item.slug))

  return (
    <div className="overflow-hidden">
      <nav aria-label="Breadcrumb" className="border-b border-slate-200/70 dark:border-slate-800">
        <div className="container py-4 text-sm text-slate-500 dark:text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="hover:text-cyan-700 dark:hover:text-cyan-300">Home</Link></li>
            <li>/</li>
            <li><Link to="/business-solutions" className="hover:text-cyan-700 dark:hover:text-cyan-300">Business Solutions</Link></li>
            <li>/</li>
            <li aria-current="page" className="font-medium text-slate-800 dark:text-slate-200">{service.title}</li>
          </ol>
        </div>
      </nav>

      <section className="relative border-b border-slate-200/70 py-14 dark:border-slate-800 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.12),transparent_25%),radial-gradient(circle_at_85%_30%,rgba(59,130,246,0.10),transparent_22%)]" />
        <div className="container relative grid items-center gap-8 lg:grid-cols-[1fr_0.7fr]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"><Icon size={28} /></div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Available service</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-5xl">{service.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{service.detailedDescription}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to={`/business-solutions/quotation?service=${service.slug}&package=${service.packages[0].id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-900">
                Request a Quote <ArrowRight size={18} />
              </Link>
              <a href="https://wa.me/918310808011" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
          </motion.div>
          <div className="glass rounded-3xl p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Starting price</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{service.startingPrice}</p>
            {service.pricingUnit === 'month' && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monthly billing</p>}
            <div className="mt-5 grid gap-2">{service.features.map((feature) => <div key={feature} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300"><Check size={16} className="mt-0.5 shrink-0 text-cyan-600" />{feature}</div>)}</div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Overview</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Built for practical business needs</h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">{service.detailedDescription}</p>
            <div className="mt-6 flex flex-wrap gap-2">{service.targetCustomers.map((customer) => <span key={customer} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{customer}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-50/60 py-16 dark:border-slate-800 dark:bg-slate-950/30 md:py-20">
        <div className="container">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Pricing packages</p><h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Choose a starting package</h2></div>
          <div className={`mt-8 grid gap-5 ${service.packages.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
            {service.packages.map((pkg) => (
              <article key={pkg.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{pkg.name}</h3>
                <p className="mt-3 text-2xl font-bold text-cyan-700 dark:text-cyan-300">{pkg.price}</p>
                {service.pricingUnit === 'month' && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Monthly billing</p>}
                <ul className="mt-5 flex-1 space-y-3">{pkg.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><Check size={16} className="mt-0.5 shrink-0 text-emerald-500" /><span>{feature}</span></li>)}</ul>
                {pkg.limitations?.map((limitation) => <p key={limitation} className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{limitation}</p>)}
                <Link to={`/business-solutions/quotation?service=${service.slug}&package=${pkg.id}`} className="mt-5 inline-flex items-center justify-center rounded-xl border border-cyan-500 px-4 py-2.5 text-sm font-semibold text-cyan-800 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10">Let's Talk</Link>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-slate-500 dark:text-slate-400">{PRICING_DISCLAIMER}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Illustrative previews</p><h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Visual concepts</h2><p className="mt-3 text-slate-600 dark:text-slate-300">Concept designs only; not completed customer projects.</p></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">{service.previews.map((preview, index) => <ConceptPreview key={preview.title} service={service} preview={preview} index={index} />)}</div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-50/60 py-16 dark:border-slate-800 dark:bg-slate-950/30 md:py-20">
        <div className="container">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Development process</p><h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">How delivery progresses</h2></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{service.process.map((step, index) => <div key={step} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/70"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-300">{index + 1}</span><h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{step}</h3></div>)}</div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">FAQ</p><h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2></div>
          <div className="space-y-3">{service.faqs.map(([question, answer]) => <details key={question} className="group rounded-xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900/70"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white"><span>{question}</span><ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" /></summary><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{answer}</p></details>)}</div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-slate-200/70 py-16 dark:border-slate-800">
          <div className="container">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Related services</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">{related.map((item) => { const RelatedIcon = iconMap[item.icon] || Monitor; return <Link key={item.slug} to={`/business-solutions/${item.slug}`} className="flex items-center gap-4 rounded-xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-cyan-400 dark:border-slate-800"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"><RelatedIcon size={22} /></div><div><h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.startingPrice}</p></div></Link>})}</div>
          </div>
        </section>
      )}

      <section className="pb-16 md:pb-20">
        <div className="container rounded-3xl bg-slate-900 px-6 py-10 text-center text-white dark:bg-cyan-950/40 md:px-10">
          <h2 className="text-3xl font-bold">Have a specific requirement?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">Share your project scope and receive a quotation based on the final requirements.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={`/business-solutions/quotation?service=${service.slug}&package=${service.packages[0].id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Let's Talk <ArrowRight size={18} /></Link>
            <a href="https://wa.me/918310808011" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 font-semibold">WhatsApp <MessageCircle size={18} /></a>
          </div>
        </div>
      </section>
    </div>
  )
}
