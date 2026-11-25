import React from 'react'
import { motion } from 'framer-motion'
import { Languages } from 'lucide-react'
import { SiWhatsapp, SiInstagram, SiGmail } from 'react-icons/si'
import { FiArrowUpRight } from 'react-icons/fi'
import ContactForm from './ContactForm'
import { getPageText, getSafeExternalUrl } from '../lib/pageContent.mjs'

export default function Contact({ contact = {}, intro = {} }) {
  const phone = typeof contact.phone === 'string' && contact.phone.trim() ? contact.phone : '+91 8310808011'
  const phoneDigits = phone.replace(/\D/g, '') || '918310808011'
  const whatsapp = getSafeExternalUrl(contact.whatsappUrl) || `https://wa.me/${phoneDigits}`
  const rawEmail = typeof contact.email === 'string' && contact.email.trim() ? contact.email : 'tech.in.air24@gmail.com'
  const email = rawEmail.replace(/^mailto:/i, '')
  const emailHref = getSafeExternalUrl(rawEmail.startsWith('mailto:') ? rawEmail : `mailto:${rawEmail}`) || 'mailto:tech.in.air24@gmail.com'
  const instagram = getSafeExternalUrl(contact.instagramUrl) || 'https://www.instagram.com/tech_in_air_ka'
  const contactLinks = [
    {
      href: whatsapp,
      label: typeof contact.whatsappLabel === 'string' ? contact.whatsappLabel : 'Chat on WhatsApp',
      meta: phone,
      icon: SiWhatsapp,
      accent: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
      cardClass: 'border-emerald-200/80 hover:border-emerald-300 dark:border-emerald-500/30 dark:hover:border-emerald-400/60',
      textClass: 'text-emerald-700 dark:text-emerald-300',
      target: '_blank',
      rel: 'noreferrer',
    },
    {
      href: emailHref,
      label: 'Email Us',
      meta: email,
      icon: SiGmail,
      accent: 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400',
      cardClass: 'border-red-200/80 hover:border-red-300 dark:border-red-500/30 dark:hover:border-red-400/60',
      textClass: 'text-red-700 dark:text-red-300',
    },
    {
      href: instagram,
      label: typeof contact.instagramLabel === 'string' ? contact.instagramLabel : 'Follow Tech in Air',
      meta: typeof contact.instagramHandle === 'string' ? contact.instagramHandle : '@tech_in_air_ka',
      icon: SiInstagram,
      accent: 'bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-500/30 dark:bg-pink-500/10 dark:text-pink-400',
      cardClass: 'border-pink-200/80 hover:border-pink-300 dark:border-pink-500/30 dark:hover:border-pink-400/60',
      textClass: 'text-pink-700 dark:text-pink-300',
      target: '_blank',
      rel: 'noreferrer',
    },
  ]

  return (
    <section id="contact" className="py-8 md:py-10">
      <div className="container grid gap-8 md:grid-cols-2 md:items-start">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="space-y-5"
        >
          <div className="mb-2 overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)]">
            <img
              src="/Images/contact-workspace.png"
              alt="Tech in Air technology development workspace"
              className="aspect-[16/8] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {getPageText(intro.heading, "Let's Discuss Your Requirements.")}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              {getPageText(
                intro.description,
                'Whether you need an academic project, a business website, an Android application or a custom technology solution, we are here to help.'
              )}
            </p>
          </div>

          <div className="grid gap-3">
            {contactLinks.map(({ href, label, meta, icon: Icon, accent, cardClass, textClass, target, rel }, index) => (
              <motion.a
                key={label}
                href={href}
                target={target}
                rel={rel}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className={`group flex items-center justify-between gap-4 rounded-2xl border bg-slate-50/80 px-4 py-3.5 shadow-sm shadow-slate-200/60 transition-all duration-200 hover:shadow-md hover:shadow-slate-200/70 dark:bg-slate-900/60 dark:shadow-black/15 dark:hover:shadow-black/25 ${cardClass}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${accent}`}>
                    <Icon className="text-lg" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{label}</div>
                    <div className={`mt-0.5 text-sm ${textClass}`}>{meta}</div>
                  </div>
                </div>

                <FiArrowUpRight className="flex-shrink-0 text-base text-slate-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-slate-300" />
              </motion.a>
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-[var(--accent)]">
                <Languages size={23} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Multilingual Support
                </h3>

                <p className="text-sm text-[var(--muted)]">
                  Speak in your preferred language.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { name: '\u0C95\u0CA8\u0CCD\u0CA8\u0CA1', english: 'Kannada' },
                { name: '\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02', english: 'Malayalam' },
                { name: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD', english: 'Tamil' },
                { name: '\u0939\u093F\u0928\u094D\u0926\u0940', english: 'Hindi' },
                { name: 'English', english: 'English' },
              ].map((language) => (
                <div
                  key={language.english}
                  title={language.english}
                  className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2 text-sm font-medium text-[var(--foreground)]"
                >
                  {language.name}
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Discuss your project or business requirements
              comfortably in any of these five languages.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  )
}
