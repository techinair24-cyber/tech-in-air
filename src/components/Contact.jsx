import React from 'react'
import { motion } from 'framer-motion'
import { SiWhatsapp, SiInstagram, SiGmail } from 'react-icons/si'
import { FiArrowUpRight } from 'react-icons/fi'
import ContactForm from './ContactForm'

const contactLinks = [
  {
    href: 'https://wa.me/918310808011',
    label: 'Chat on WhatsApp',
    meta: '+91 8310808011',
    icon: SiWhatsapp,
    accent: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
    cardClass: 'border-emerald-200/80 hover:border-emerald-300 dark:border-emerald-500/30 dark:hover:border-emerald-400/60',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    target: '_blank',
    rel: 'noreferrer',
  },
  {
    href: 'mailto:tech.in.air24@gmail.com',
    label: 'Email Us',
    meta: 'tech.in.air24@gmail.com',
    icon: SiGmail,
    accent: 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400',
    cardClass: 'border-red-200/80 hover:border-red-300 dark:border-red-500/30 dark:hover:border-red-400/60',
    textClass: 'text-red-700 dark:text-red-300',
  },
  {
    href: 'https://www.instagram.com/tech_in_air_ka',
    label: 'Follow Tech in Air',
    meta: '@tech_in_air_ka',
    icon: SiInstagram,
    accent: 'bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-500/30 dark:bg-pink-500/10 dark:text-pink-400',
    cardClass: 'border-pink-200/80 hover:border-pink-300 dark:border-pink-500/30 dark:hover:border-pink-400/60',
    textClass: 'text-pink-700 dark:text-pink-300',
    target: '_blank',
    rel: 'noreferrer',
  },
]

export default function Contact() {
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
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Have a Project Idea? Let's Build It.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Tell us about your project idea, requirements or technology challenge. Tech in Air can help turn the concept into a working project.
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
