import React, { useState } from 'react'
import { FaPaperPlane, FaWhatsapp } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const inputClasses =
  'mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--foreground)] transition duration-200 placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'AI / ML', desc: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    const text = `Name: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0AProject Type: ${form.type}%0ADescription: ${form.desc}`
    const url = `https://wa.me/918310808011?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
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
            <option>AI / ML</option>
            <option>Software</option>
            <option>Android</option>
            <option>IoT</option>
            <option>Embedded</option>
            <option>Robotics</option>
            <option>Other</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Project Description
          <textarea
            value={form.desc}
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
          className="primary-button px-4 py-2.5"
        >
          <FaPaperPlane className="text-sm" />
          Send Project Enquiry
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
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        Please review our <Link to="/terms-and-conditions" className="font-medium text-cyan-800 underline underline-offset-2 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">Terms &amp; Conditions</Link> before sending your project enquiry.
      </p>
    </form>
  )
}
