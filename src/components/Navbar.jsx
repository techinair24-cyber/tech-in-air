import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { businessServices } from '../data/businessSolutions'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Solutions', href: '/business-solutions', dropdown: true },
    { label: 'Projects', href: '/projects' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href) => {
    if (href === '/#reviews') return location.pathname === '/' && location.hash === '#reviews'
    if (href === '/business-solutions') return location.pathname.startsWith('/business-solutions')
    return location.pathname === href
  }

  return (
    <header className={`fixed top-0 z-50 h-[72px] w-full transition-all duration-300 ${scrolled ? 'border-b border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur-xl' : 'bg-[var(--bg)]'}`}>
      <div className="container flex h-full items-center justify-between">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Tech in Air home">
          <img src="/Logo/TA%20logo.png" alt="" className="h-11 w-11 object-contain" />
          <span className="text-[15px] font-bold tracking-[-0.02em] text-[var(--foreground)]">Tech in Air</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            link.dropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                <Link
                  to={link.href}
                  aria-haspopup="menu"
                  aria-expanded={solutionsOpen}
                  className={`relative inline-flex items-center gap-1 py-6 text-[14px] transition-colors ${isActive(link.href) ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}
                  onClick={() => setSolutionsOpen(false)}
                >
                  {link.label}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`} />
                  {isActive(link.href) && <motion.span layoutId="nav-active" className="absolute bottom-3 left-0 h-px w-full bg-[var(--accent)]" />}
                </Link>
                <AnimatePresence>
                  {solutionsOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-2"
                    >
                      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                        <Link to="/services" role="menuitem" onClick={() => setSolutionsOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">Academic Solutions</Link>
                        <Link to="/business-solutions" role="menuitem" onClick={() => setSolutionsOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">Business Solutions</Link>
                        <div className="my-1 border-t border-[var(--border)]" />
                        {businessServices.map((service) => (
                          <Link key={service.slug} to={`/business-solutions/${service.slug}`} role="menuitem" onClick={() => setSolutionsOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]">
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link key={link.label} to={link.href} className={`relative py-6 text-[14px] transition-colors ${isActive(link.href) ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>
                {link.label}
                {isActive(link.href) && <motion.span layoutId="nav-active" className="absolute bottom-3 left-0 h-px w-full bg-[var(--accent)]" />}
              </Link>
            )
          ))}
          <Link to="/contact" className="primary-button !min-h-10 px-5 py-2 text-[14px]">Let's Talk</Link>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-[var(--foreground)]" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="border-t border-[var(--border)] bg-[var(--bg)] px-6 py-5 md:hidden"
          >
            <div className="mx-auto flex max-w-xl flex-col gap-1">
              {links.map((link) => (
                link.dropdown ? (
                  <div key={link.label}>
                    <div className="flex items-center justify-between">
                      <Link to={link.href} onClick={() => { setOpen(false); setMobileSolutionsOpen(false) }} className={`py-3 text-[15px] ${isActive(link.href) ? 'font-semibold text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>{link.label}</Link>
                      <button type="button" aria-label="Toggle Solutions menu" aria-expanded={mobileSolutionsOpen} onClick={() => setMobileSolutionsOpen((current) => !current)} className="grid h-10 w-10 place-items-center text-[var(--foreground)]">
                        <ChevronDown size={18} className={`transition-transform duration-200 ${mobileSolutionsOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    <AnimatePresence>
                      {mobileSolutionsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="mb-2 ml-3 grid gap-1 border-l border-[var(--border)] pl-4">
                            <Link to="/services" onClick={() => { setOpen(false); setMobileSolutionsOpen(false) }} className="py-2 text-sm font-semibold text-[var(--foreground)]">Academic Solutions</Link>
                            <Link to="/business-solutions" onClick={() => { setOpen(false); setMobileSolutionsOpen(false) }} className="py-2 text-sm font-semibold text-[var(--foreground)]">Business Solutions</Link>
                            {businessServices.map((service) => (
                              <Link key={service.slug} to={`/business-solutions/${service.slug}`} onClick={() => { setOpen(false); setMobileSolutionsOpen(false) }} className="py-2 text-sm text-[var(--muted)]">{service.title}</Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={link.label} to={link.href} onClick={() => setOpen(false)} className={`py-3 text-[15px] ${isActive(link.href) ? 'font-semibold text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>{link.label}</Link>
                )
              ))}
              <Link to="/contact" onClick={() => setOpen(false)} className="primary-button mt-3 w-full">Let's Talk</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
