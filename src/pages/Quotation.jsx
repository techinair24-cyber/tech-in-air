import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, MessageCircle } from 'lucide-react'
import { businessServices, PRICING_DISCLAIMER } from '../data/businessSolutions'

const inputClasses =
  'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:ring-cyan-500/20'

export default function QuotationPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryService = searchParams.get('service')
  const queryPackage = searchParams.get('package')
  const initialService = businessServices.find((item) => item.slug === queryService) || businessServices[0]
  const initialPackage = queryPackage === 'custom'
    ? { id: 'custom' }
    : initialService.packages.find((item) => item.id === queryPackage) || initialService.packages[0]

  const [step, setStep] = useState(1)
  const [serviceId, setServiceId] = useState(initialService.slug)
  const [packageId, setPackageId] = useState(initialPackage.id)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState({})
  const [details, setDetails] = useState({
    name: '', organization: '', phone: '', email: '', businessCategory: '', features: '',
    budget: '', timeline: '', requirements: '', websiteUrl: '', appPurpose: '', workflow: '',
  })
  const customPackage = {
    id: 'custom',
    name: 'Custom Requirement',
    price: 'Custom quotation',
    features: ['Requirements and scope finalized after consultation'],
  }

  const selectedService = useMemo(
    () => businessServices.find((item) => item.slug === serviceId) || businessServices[0],
    [serviceId],
  )
  const selectedPackage = useMemo(
    () => packageId === 'custom'
      ? customPackage
      : selectedService.packages.find((item) => item.id === packageId) || selectedService.packages[0],
    [selectedService, packageId],
  )

  const updateDetail = (field, value) => {
    setDetails((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleServiceChange = (slug) => {
    const service = businessServices.find((item) => item.slug === slug) || businessServices[0]
    setServiceId(service.slug)
    setPackageId(service.packages[0].id)
    setSearchParams({ service: service.slug, package: service.packages[0].id })
  }

  const handlePackageChange = (id) => {
    setPackageId(id)
    setSearchParams({ service: serviceId, package: id })
  }

  const validateStepOne = () => {
    const nextErrors = {}
    if (!selectedService) nextErrors.service = 'Please select a service.'
    if (!selectedPackage) nextErrors.package = 'Please select a package.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateStepTwo = () => {
    const nextErrors = {}
    if (!details.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!details.phone.trim()) {
      nextErrors.phone = 'Please enter a phone number.'
    } else {
      const digits = details.phone.replace(/\D/g, '')
      if (digits.length < 7 || digits.length > 15) nextErrors.phone = 'Enter a valid phone number.'
    }
    if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) nextErrors.email = 'Enter a valid email address.'
    if (serviceId === 'website-maintenance' && details.websiteUrl.trim() && !/^https?:\/\//i.test(details.websiteUrl.trim())) {
      nextErrors.websiteUrl = 'Enter a complete URL starting with http:// or https://.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submitWhatsApp = () => {
    if (!consent) {
      setErrors({ consent: 'Please provide consent before continuing.' })
      return
    }

    const lines = [
      'Hello Tech In Air, I would like to request a quote.',
      '',
      `Service: ${selectedService.title}`,
      `Package: ${selectedPackage.name}`,
      `Starting price: ${selectedPackage.price}`,
      '',
      `Customer name: ${details.name.trim()}`,
      `Business / organization: ${details.organization.trim() || 'Not provided'}`,
      `Phone number: ${details.phone.trim()}`,
      `Email: ${details.email.trim() || 'Not provided'}`,
      `Business category: ${details.businessCategory.trim() || 'Not provided'}`,
      `Required features: ${details.features.trim() || 'Not provided'}`,
      `Estimated budget: ${details.budget.trim() || 'Not provided'}`,
      `Preferred timeline: ${details.timeline.trim() || 'Not provided'}`,
      `Additional requirements: ${details.requirements.trim() || 'Not provided'}`,
    ]
    if (serviceId === 'website-maintenance') lines.push(`Existing website URL: ${details.websiteUrl.trim() || 'Not provided'}`)
    if (serviceId === 'android-development') lines.push(`Application purpose: ${details.appPurpose.trim() || 'Not provided'}`)
    if (serviceId === 'business-automation') lines.push(`Current workflow and automation requirements: ${details.workflow.trim() || 'Not provided'}`)
    lines.push('', 'I consent to Tech In Air using this information to respond to this enquiry.')

    window.open(`https://wa.me/918310808011?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="overflow-hidden py-10 md:py-16">
      <div className="container max-w-5xl">
        <Link to="/business-solutions" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300"><ArrowLeft size={16} /> Back to Business Solutions</Link>
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">Project enquiry</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Request a Custom Quotation</h1>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2" aria-label="Quotation steps">
          {[1, 2, 3].map((number) => (
            <button key={number} type="button" onClick={() => number < step && setStep(number)} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold ${step === number ? 'border-cyan-500 bg-cyan-50 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-300' : 'border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400'}`}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current/10">{step > number ? <Check size={14} /> : number}</span>
              <span className="hidden sm:inline">{number === 1 ? 'Service' : number === 2 ? 'Requirements' : 'Review'}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 md:p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Select your service and package</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Service
                  <select value={serviceId} onChange={(event) => handleServiceChange(event.target.value)} className={inputClasses}>
                    {businessServices.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>)}
                  </select>
                  {errors.service && <span className="mt-1 block text-xs text-red-600">{errors.service}</span>}
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Package
                  <select value={selectedPackage.id} onChange={(event) => handlePackageChange(event.target.value)} className={inputClasses}>
                    {selectedService.packages.map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
                    <option value="custom">Custom Requirement</option>
                  </select>
                  {errors.package && <span className="mt-1 block text-xs text-red-600">{errors.package}</span>}
                </label>
              </div>
              <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-500/20 dark:bg-cyan-500/10">
                <p className="text-sm text-slate-500 dark:text-slate-400">Selected package</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{selectedPackage.name}</h3>
                <p className="mt-2 text-2xl font-bold text-cyan-700 dark:text-cyan-300">{selectedPackage.price}</p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{selectedPackage.features.slice(0, 4).join(' • ')}</p>
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-500 dark:text-slate-400">{PRICING_DISCLAIMER}</p>
              <div className="mt-6 flex justify-end"><button type="button" onClick={() => validateStepOne() && setStep(2)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-900">Continue <ArrowRight size={18} /></button></div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Tell us about your requirements</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Customer name *
                  <input value={details.name} onChange={(event) => updateDetail('name', event.target.value)} className={inputClasses} placeholder="Your name" />{errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Business or organization name
                  <input value={details.organization} onChange={(event) => updateDetail('organization', event.target.value)} className={inputClasses} placeholder="Business name" />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Phone number *
                  <input value={details.phone} onChange={(event) => updateDetail('phone', event.target.value)} className={inputClasses} placeholder="+91 83108 08011" />{errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone}</span>}
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email address
                  <input type="email" value={details.email} onChange={(event) => updateDetail('email', event.target.value)} className={inputClasses} placeholder="you@example.com" />{errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Business category
                  <input value={details.businessCategory} onChange={(event) => updateDetail('businessCategory', event.target.value)} className={inputClasses} placeholder="Retail, restaurant, clinic, etc." />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Estimated budget
                  <input value={details.budget} onChange={(event) => updateDetail('budget', event.target.value)} className={inputClasses} placeholder="Approximate budget" />
                </label>
                {serviceId === 'website-maintenance' && (
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">Existing website URL
                    <input value={details.websiteUrl} onChange={(event) => updateDetail('websiteUrl', event.target.value)} className={inputClasses} placeholder="https://yourwebsite.com" />{errors.websiteUrl && <span className="mt-1 block text-xs text-red-600">{errors.websiteUrl}</span>}
                  </label>
                )}
                {serviceId === 'android-development' && (
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">Application purpose
                    <textarea value={details.appPurpose} onChange={(event) => updateDetail('appPurpose', event.target.value)} className={`${inputClasses} min-h-24`} placeholder="Describe the users and purpose of the application" />
                  </label>
                )}
                {serviceId === 'business-automation' && (
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">Current workflow and automation requirements
                    <textarea value={details.workflow} onChange={(event) => updateDetail('workflow', event.target.value)} className={`${inputClasses} min-h-24`} placeholder="Describe the repetitive work and desired workflow" />
                  </label>
                )}
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">Required features
                  <textarea value={details.features} onChange={(event) => updateDetail('features', event.target.value)} className={`${inputClasses} min-h-24`} placeholder="List pages, integrations or features you need" />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">Preferred completion timeline
                  <input value={details.timeline} onChange={(event) => updateDetail('timeline', event.target.value)} className={inputClasses} placeholder="For example, 3-4 weeks" />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">Additional requirements
                  <textarea value={details.requirements} onChange={(event) => updateDetail('requirements', event.target.value)} className={`${inputClasses} min-h-28`} placeholder="Add any other project details" />
                </label>
              </div>
              <div className="mt-6 flex justify-between"><button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"><ArrowLeft size={17} /> Back</button><button type="button" onClick={() => validateStepTwo() && setStep(3)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-900">Review <ArrowRight size={18} /></button></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Review and submit</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800"><p className="text-xs font-bold uppercase text-slate-500">Service</p><p className="mt-2 font-semibold text-slate-900 dark:text-white">{selectedService.title}</p><p className="mt-4 text-xs font-bold uppercase text-slate-500">Package</p><p className="mt-2 font-semibold text-slate-900 dark:text-white">{selectedPackage.name}</p><p className="mt-4 text-xs font-bold uppercase text-slate-500">Starting price</p><p className="mt-2 text-xl font-bold text-cyan-700 dark:text-cyan-300">{selectedPackage.price}</p></div>
                <div className="rounded-xl border border-slate-200 p-5 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300"><p><strong>Customer:</strong> {details.name}</p><p className="mt-2"><strong>Organization:</strong> {details.organization || 'Not provided'}</p><p className="mt-2"><strong>Phone:</strong> {details.phone}</p><p className="mt-2"><strong>Email:</strong> {details.email || 'Not provided'}</p><p className="mt-2"><strong>Category:</strong> {details.businessCategory || 'Not provided'}</p></div>
                <div className="md:col-span-2 rounded-xl border border-slate-200 p-5 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300"><p><strong>Features:</strong> {details.features || 'Not provided'}</p><p className="mt-2"><strong>Budget:</strong> {details.budget || 'Not provided'}</p><p className="mt-2"><strong>Timeline:</strong> {details.timeline || 'Not provided'}</p><p className="mt-2"><strong>Additional requirements:</strong> {details.requirements || 'Not provided'}</p>{serviceId === 'website-maintenance' && <p className="mt-2"><strong>Website URL:</strong> {details.websiteUrl || 'Not provided'}</p>} {serviceId === 'android-development' && <p className="mt-2"><strong>App purpose:</strong> {details.appPurpose || 'Not provided'}</p>} {serviceId === 'business-automation' && <p className="mt-2"><strong>Workflow:</strong> {details.workflow || 'Not provided'}</p>}</div>
              </div>
              <label className="mt-5 flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"><input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); setErrors({}) }} className="mt-1 h-4 w-4 accent-cyan-500" /><span>I consent to Tech In Air using this information only to respond to and discuss this enquiry. *</span></label>
              {errors.consent && <p className="mt-2 text-xs text-red-600">{errors.consent}</p>}
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Your details are not stored in a database. WhatsApp will open with the prepared enquiry for you to review and send.</p>
              <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row"><button type="button" onClick={() => setStep(2)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"><ArrowLeft size={17} /> Edit details</button><button type="button" onClick={submitWhatsApp} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-900"><MessageCircle size={18} /> Send Enquiry via WhatsApp</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
