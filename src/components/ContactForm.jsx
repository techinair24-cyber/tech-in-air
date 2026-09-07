import React, { useState } from 'react'
import { FaPaperPlane, FaWhatsapp } from 'react-icons/fa6'

const inputClasses =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm transition duration-200 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-cyan-500/20'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'AI / ML', desc: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    const text = `Name: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0AProject Type: ${form.type}%0ADescription: ${form.desc}`
    const url = `https://wa.me/918310808011?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200/80 bg-slate-50/90 p-5 shadow-lg shadow-slate-200/60 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-black/20 md:p-6">
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
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
    </form>
  )
}
