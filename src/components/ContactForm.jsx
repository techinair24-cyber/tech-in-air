import React, { useState } from 'react'
import { FaPaperPlane, FaWhatsapp } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { submitPublicEnquiry } from '../lib/publicEnquiry'
import { usePublishedServices } from '../lib/publicContent'

const inputClasses =
  'mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--foreground)] transition duration-200 placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20'

export default function ContactForm() {
  const { data: academicServices } = usePublishedServices('academic-solutions')
  const { data: businessServices } = usePublishedServices('business-solutions')
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'AI / ML', desc: '' })
  const [consent, setConsent] = useState(false)
  const [requestState, setRequestState] = useState({ status: 'idle', message: '', whatsappUrl: '' })
  const serviceOptions = [...new Set([
    'AI / ML', 'Software', 'Android', 'IoT', 'Embedded', 'Robotics',
    ...(academicServices || []).map((service) => service.title),
    ...(businessServices || []).map((service) => service.title),
    'Other',
  ])]

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!consent || requestState.status === 'loading' || requestState.status === 'accepted') return

    setRequestState({ status: 'loading', message: '', whatsappUrl: '' })
    try {
      await submitPublicEnquiry({
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        organization: '',
        serviceRequested: form.type,
        requirements: form.desc,
        source: 'website',
      })
      const text = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nProject Type: ${form.type}\nDescription: ${form.desc}`
      setRequestState({
        status: 'accepted',
        message: 'Your enquiry has been received. You can also continue the conversation on WhatsApp.',
        whatsappUrl: `https://wa.me/918310808011?text=${encodeURIComponent(text)}`,
      })
    } catch (error) {
      setRequestState({ status: 'error', message: error.message, whatsappUrl: '' })
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
      <div className="mb-5">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Send your project brief</h3>
      </div>

      <div className="grid gap-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Name
          <input
            required
            maxLength={120}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClasses}
            placeholder="Your name"
          />
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Email
          <input
            required
            maxLength={254}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClasses}
            placeholder="you@example.com"
          />
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Phone / WhatsApp
          <input
            required
            type="tel"
            minLength={5}
            maxLength={40}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClasses}
            placeholder="+91 98765 43210"
          />
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Project Type
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputClasses}
          >
            {serviceOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Project Description
          <textarea
            value={form.desc}
            maxLength={5000}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className={`${inputClasses} min-h-[120px] resize-y`}
            rows={5}
            placeholder="Tell us about your project idea, goals, timeline, and requirements."
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={!consent || requestState.status === 'loading' || requestState.status === 'accepted'}
          className="primary-button px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaPaperPlane className="text-sm" />
          {requestState.status === 'loading' ? 'Sending enquiry…' : requestState.status === 'accepted' ? 'Enquiry received' : 'Send Project Enquiry'}
        </button>

        <a
          href="https://wa.me/918310808011"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 active:translate-y-0"
        >
          <FaWhatsapp className="text-sm" />
          WhatsApp Us
        </a>
      </div>
      <label className="mt-4 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required className="mt-1 h-4 w-4 accent-cyan-600" />
        <span>I consent to Tech In Air storing these details to respond to my project enquiry.</span>
      </label>
      {requestState.message && (
        <div role={requestState.status === 'error' ? 'alert' : 'status'} className={`mt-4 rounded-lg px-3 py-2 text-sm ${requestState.status === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'}`}>
          {requestState.message}
          {requestState.whatsappUrl && <a href={requestState.whatsappUrl} target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold underline">Continue via WhatsApp</a>}
        </div>
      )}
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        Please review our <Link to="/terms-and-conditions" className="font-medium text-cyan-800 underline underline-offset-2 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">Terms &amp; Conditions</Link> before sending your project enquiry.
      </p>
    </form>
  )
}
