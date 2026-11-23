import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Briefcase,
  Check,
  ChevronDown,
  Code2,
  CreditCard,
  Globe2,
  MessageCircle,
  Monitor,
  ShoppingCart,
  Smartphone,
  Store,
  User,
  Wrench,
} from 'lucide-react'
import { businessServices, comingSoonServices } from '../data/businessSolutions'

const inputClasses =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm transition duration-200 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-cyan-500/20'

const iconMap = {
  store: Store,
  user: User,
  cart: ShoppingCart,
  android: Smartphone,
  automation: Bot,
  maintenance: Wrench,
}

const faqs = [
  ['What is included in the starting price?', 'The starting price covers the base package features listed on this page. The exact scope and deliverables are confirmed in a custom quotation.'],
  ['Can I request additional features?', 'Yes. Booking systems, databases, integrations, additional pages and other features can be quoted separately based on your requirements.'],
  ['Are domain and hosting included?', 'Domain registration, hosting, third-party subscriptions and related charges may cost extra unless confirmed otherwise in the quotation.'],
  ['How long does development take?', 'The timeline depends on scope, content availability and the selected features. A suitable timeline is confirmed after reviewing requirements.'],
  ['Can I request design changes?', 'Design changes can be discussed within the agreed project scope. Significant changes may affect the quotation and timeline.'],
  ['Do you provide support after delivery?', 'Post-delivery support terms are confirmed in the project quotation. Website maintenance services can also be discussed after launch.'],
  ['How do payments work?', 'Payment stages, methods and terms are confirmed in the quotation and should be agreed before development begins.'],
  ['Can I request a customized quotation?', 'Yes. Use the enquiry form or WhatsApp button to share your requirements and receive a quotation based on them.'],
]

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-slate-600 dark:text-slate-300">{description}</p>}
    </div>
  )
}

function ScrollToEnquiry(serviceId, packageId) {
  const event = new CustomEvent('tech-in-air:prefill-enquiry', {
    detail: { serviceId, packageId },
  })
  window.dispatchEvent(event)
  document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function EnquiryForm() {
  const [form, setForm] = useState({
    name: '',
    organization: '',
    phone: '',
    email: '',
    serviceId: '',
    packageId: '',
    businessType: '',
    features: '',
    budget: '',
    timeline: '',
    requirements: '',
    consent: false,
  })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

  React.useEffect(() => {
    const onPrefill = (event) => {
      const { serviceId, packageId } = event.detail || {}
      setForm((current) => ({ ...current, serviceId: serviceId || '', packageId: packageId || '' }))
    }
    window.addEventListener('tech-in-air:prefill-enquiry', onPrefill)
    return () => window.removeEventListener('tech-in-air:prefill-enquiry', onPrefill)
  }, [])

  const selectedService = useMemo(
    () => businessServices.find((service) => service.id === form.serviceId),
    [form.serviceId],
  )

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setNotice('')
  }

  const handleServiceChange = (value) => {
    setForm((current) => ({ ...current, serviceId: value, packageId: '' }))
    setErrors((current) => ({ ...current, serviceId: '', packageId: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!form.phone.trim()) {
      nextErrors.phone = 'Please enter a contact phone number.'
    } else {
      const digits = form.phone.replace(/\D/g, '')
      if (!/^[+\d][\d\s().-]*$/.test(form.phone) || digits.length < 7 || digits.length > 15) {
        nextErrors.phone = 'Enter a valid phone number, including country code if outside India.'
      }
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!form.serviceId) nextErrors.serviceId = 'Please select a service.'
    if (!form.packageId) nextErrors.packageId = 'Please select a package.'
    if (!form.consent) nextErrors.consent = 'Please acknowledge the enquiry consent.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const service = businessServices.find((item) => item.id === form.serviceId)
    const pkg = service?.packages.find((item) => item.id === form.packageId)
    const message = [
      'Hello Tech In Air, I would like to request a quote.',
      '',
      `Customer name: ${form.name.trim()}`,
      `Business / organization: ${form.organization.trim() || 'Not provided'}`,
      `Contact phone: ${form.phone.trim()}`,
      `Email: ${form.email.trim() || 'Not provided'}`,
      `Service: ${service?.title || ''}`,
      `Package: ${pkg?.name || ''}`,
      `Business type: ${form.businessType.trim() || 'Not provided'}`,
      `Required features: ${form.features.trim() || 'Not provided'}`,
      `Estimated budget: ${form.budget.trim() || 'Not provided'}`,
      `Preferred timeline: ${form.timeline.trim() || 'Not provided'}`,
      `Additional requirements: ${form.requirements.trim() || 'Not provided'}`,
    ].join('\n')

    window.open(`https://wa.me/918310808011?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setNotice('WhatsApp has been opened with your enquiry. Press Send in WhatsApp to contact Tech In Air.')
  }

  return (
    <form id="enquiry" onSubmit={handleSubmit} noValidate className="scroll-mt-28 rounded-3xl border border-slate-200/80 bg-slate-50/90 p-5 shadow-lg shadow-slate-200/60 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-black/20 md:p-7">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">Customer enquiry</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Request a Custom Quotation</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Complete the details below. You will review and send the prepared message in WhatsApp.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Customer name <span aria-hidden="true">*</span>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClasses} placeholder="Your name" aria-invalid={Boolean(errors.name)} aria-describedby="name-error" />
          {errors.name && <span id="name-error" className="mt-1 block text-xs text-red-600 dark:text-red-400">{errors.name}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Business or organization name
          <input value={form.organization} onChange={(e) => update('organization', e.target.value)} className={inputClasses} placeholder="Business name" />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Contact phone number <span aria-hidden="true">*</span>
          <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClasses} placeholder="+91 98765 43210" aria-invalid={Boolean(errors.phone)} />
          {errors.phone && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{errors.phone}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Email address
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClasses} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />
          {errors.email && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{errors.email}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Service <span aria-hidden="true">*</span>
          <select value={form.serviceId} onChange={(e) => handleServiceChange(e.target.value)} className={inputClasses} aria-invalid={Boolean(errors.serviceId)}>
            <option value="">Select a service</option>
            {businessServices.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
          </select>
          {errors.serviceId && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{errors.serviceId}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Package <span aria-hidden="true">*</span>
          <select value={form.packageId} onChange={(e) => update('packageId', e.target.value)} className={inputClasses} disabled={!selectedService} aria-invalid={Boolean(errors.packageId)}>
            <option value="">Select a package</option>
            {selectedService?.packages.map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.price}</option>)}
          </select>
          {errors.packageId && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{errors.packageId}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Business type
          <input value={form.businessType} onChange={(e) => update('businessType', e.target.value)} className={inputClasses} placeholder="Retail, restaurant, freelancer, etc." />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Estimated budget
          <input value={form.budget} onChange={(e) => update('budget', e.target.value)} className={inputClasses} placeholder="Your approximate budget" />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200 md:col-span-2">
          Required features
          <textarea value={form.features} onChange={(e) => update('features', e.target.value)} className={`${inputClasses} min-h-24`} placeholder="List the features or integrations you need" />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200 md:col-span-2">
          Preferred completion timeline
          <input value={form.timeline} onChange={(e) => update('timeline', e.target.value)} className={inputClasses} placeholder="For example, 3-4 weeks" />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200 md:col-span-2">
          Additional project requirements
          <textarea value={form.requirements} onChange={(e) => update('requirements', e.target.value)} className={`${inputClasses} min-h-28`} placeholder="Add any other details, pages, content or preferences" />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
        <input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} className="mt-1 h-4 w-4 accent-cyan-500" aria-invalid={Boolean(errors.consent)} />
        <span>I consent to Tech In Air using this information only to respond to and discuss this enquiry. <span aria-hidden="true">*</span></span>
      </label>
      {errors.consent && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.consent}</p>}
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Privacy notice: This form does not store or transmit your details to a database. It prepares a WhatsApp message for you to review and send. Do not include passwords or confidential information.</p>

      {notice && <p role="status" className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-100">{notice}</p>}

      <button type="submit" className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <MessageCircle size={18} />
        Continue in WhatsApp
      </button>
    </form>
  )
}

export default function BusinessSolutionsPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-slate-200/70 py-16 dark:border-slate-800 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_85%_30%,rgba(59,130,246,0.12),transparent_25%)]" />
        <div className="container relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Tech Made Simple</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-6xl">Digital Solutions for Your Business</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">From professional websites to online stores, Tech In Air helps businesses, startups and professionals build their digital presence with affordable, reliable technology solutions.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#services" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-900 transition-all hover:-translate-y-0.5">
                Explore Services <ArrowRight size={18} />
              </a>
              <button type="button" onClick={() => document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/70 px-5 py-3 font-semibold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white">
                Get a Quote
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="glass relative mx-auto w-full max-w-xl rounded-3xl p-5 md:p-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-950">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="ml-3 h-3 w-32 rounded-full bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="mt-4 grid grid-cols-[1fr_2fr] gap-4">
                <div className="rounded-xl bg-slate-900 p-4 text-white dark:bg-slate-800">
                  <div className="h-3 w-16 rounded bg-cyan-300" />
                  <div className="mt-5 space-y-2"><div className="h-2 w-full rounded bg-slate-600" /><div className="h-2 w-3/4 rounded bg-slate-600" /><div className="h-2 w-1/2 rounded bg-slate-600" /></div>
                </div>
                <div>
                  <div className="h-24 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-950 dark:to-blue-950" />
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((item) => <div key={item} className="h-14 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900" />)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="scroll-mt-28 py-14 md:py-20">
        <div className="container">
          <SectionHeading eyebrow="Business services" title="Choose the Right Digital Solution" description="Three available services for customer enquiries, plus solutions planned for a later launch." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {businessServices.map((service) => {
              const Icon = iconMap[service.icon]
              return (
                <motion.article key={service.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"><Icon size={24} /></div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">{service.status}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.description}</p>
                  <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">Starting at</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{service.startingPrice}</p>
                  <button type="button" onClick={() => ScrollToEnquiry(service.id, service.packages[0].id)} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 dark:bg-cyan-400 dark:text-slate-950">
                    Get a Quote <ArrowRight size={16} />
                  </button>
                </motion.article>
              )
            })}
            {comingSoonServices.map((service) => {
              const Icon = service.id === 'android-app' ? Smartphone : service.id === 'automation' ? Bot : Wrench
              return (
                <article key={service.id} className="flex flex-col rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 dark:border-slate-700 dark:bg-slate-950/40">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Icon size={24} /></div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">Coming Soon</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.description}</p>
                  <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">Pricing and orders: not available yet</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-50/60 py-14 dark:border-slate-800 dark:bg-slate-950/30 md:py-20">
        <div className="container">
          <SectionHeading eyebrow="Packages" title="Transparent Starting Prices" description="Final pricing depends on your requirements. Domain, hosting, third-party subscriptions, payment processing fees and additional features may cost extra." />
          <div className="mt-10 space-y-10">
            {businessServices.map((service) => (
              <div key={service.id}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Available</p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{service.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Starting at <strong className="text-lg text-slate-900 dark:text-white">{service.startingPrice}</strong></p>
                </div>
                <div className={`grid gap-5 ${service.packages.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
                  {service.packages.map((pkg) => (
                    <article key={pkg.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{pkg.name}</h4>
                      <p className="mt-3 text-2xl font-bold text-cyan-700 dark:text-cyan-300">{pkg.price}</p>
                      <ul className="mt-5 flex-1 space-y-3">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><Check size={16} className="mt-0.5 shrink-0 text-emerald-500" /><span>{feature}</span></li>
                        ))}
                      </ul>
                      {pkg.note && <p className="mt-5 rounded-lg bg-slate-100 px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{pkg.note}</p>}
                      <button type="button" onClick={() => ScrollToEnquiry(service.id, pkg.id)} className="mt-5 rounded-xl border border-cyan-500 px-4 py-2.5 text-sm font-semibold text-cyan-800 transition-all hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10">Get a Quote</button>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container">
          <SectionHeading eyebrow="Concept previews" title="Explore Website Designs" description="These are sample categories and lightweight design concepts, not completed customer projects." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { title: 'Business Website', accent: 'from-cyan-100 to-blue-100 dark:from-cyan-950 dark:to-blue-950', icon: Briefcase, bars: 3 },
              { title: 'Portfolio Website', accent: 'from-violet-100 to-cyan-100 dark:from-violet-950 dark:to-cyan-950', icon: User, bars: 4 },
              { title: 'E-Commerce Website', accent: 'from-amber-100 to-emerald-100 dark:from-amber-950 dark:to-emerald-950', icon: ShoppingCart, bars: 6 },
            ].map(({ title, accent, icon: Icon, bars }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-950/70">
                <div className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${accent} p-4`}>
                  <div className="h-full rounded-lg border border-white/70 bg-white/70 p-3 shadow-sm dark:border-slate-600/50 dark:bg-slate-900/70">
                    <div className="flex items-center justify-between"><Icon size={18} className="text-slate-700 dark:text-slate-200" /><span className="h-2 w-16 rounded bg-slate-300 dark:bg-slate-600" /></div>
                    <div className="mt-4 h-16 rounded-lg bg-slate-200/80 dark:bg-slate-700/70" />
                    <div className="mt-3 grid grid-cols-3 gap-2">{Array.from({ length: bars }).slice(0, 3).map((_, index) => <div key={index} className="h-10 rounded-md border border-slate-200 bg-white/90 dark:border-slate-700 dark:bg-slate-800" />)}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Sample concept</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-50/60 py-14 dark:border-slate-800 dark:bg-slate-950/30 md:py-20">
        <div className="container">
          <SectionHeading eyebrow="How we work" title="From Requirement to Delivery" description="Work begins only after the quotation and terms are accepted." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['1', 'Choose a Service', 'Globe2'],
              ['2', 'Select a Package', 'Briefcase'],
              ['3', 'Submit Requirements', 'MessageCircle'],
              ['4', 'Receive a Custom Quotation', 'CreditCard'],
              ['5', 'Confirm Scope and Payment Terms', 'Check'],
              ['6', 'Development and Testing', 'Code2'],
              ['7', 'Delivery and Support', 'Monitor'],
            ].map(([number, title, iconName], index) => {
              const Icon = { Globe2, Briefcase, MessageCircle, CreditCard, Check, Code2, Monitor }[iconName]
              return (
                <motion.div key={number} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.035 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-300">{number}</span><Icon size={20} className="text-slate-400" /></div>
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{title}</h3>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">Questions</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Important details are confirmed clearly in a quotation before work begins.</p>
          </div>
          <div className="space-y-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900/70">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white"><span>{question}</span><ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" /></summary>
                <p className="mt-3 pr-8 text-sm leading-6 text-slate-600 dark:text-slate-300">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="container">
          <EnquiryForm />
        </div>
      </section>
    </div>
  )
}


