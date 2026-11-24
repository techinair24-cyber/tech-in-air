import React, {useState, useEffect} from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { businessServices } from '../data/businessSolutions'

export default function Navbar(){
  const [open,setOpen] = useState(false)
  const [scrolled,setScrolled] = useState(false)
  const [businessOpen,setBusinessOpen] = useState(false)
  const [mobileBusinessOpen,setMobileBusinessOpen] = useState(false)

  useEffect(()=>{
    const onScroll = ()=> setScrolled(window.scrollY>20)
    window.addEventListener('scroll',onScroll)
    return ()=>window.removeEventListener('scroll',onScroll)
  },[])

  const links = [
    {label:'Home',href:'/'},
    {label:'About',href:'/about'},
    {label:'Services',href:'/services'},
    {label:'Business Solutions',href:'/business-solutions'},
    {label:'Projects',href:'/projects'},
    {label:'Process',href:'/process'},
    {label:'Contact',href:'/contact'}
  ]
  const location = useLocation()

  return (
    <header className={`fixed w-full z-50 top-0 transition-all duration-300 h-[76px] ${scrolled ? 'backdrop-blur-sm bg-[var(--navbar-bg)]' : 'bg-transparent'}`}>
      <div className="container flex items-center justify-between h-full">
        <div className="flex items-center gap-4 min-w-0">
          <Link to="/" className="flex items-center gap-3 shrink-0 transition-transform duration-200 hover:scale-[1.01]">
            <div className="hidden sm:flex items-center justify-center overflow-hidden shrink-0" style={{ width: 132, height: 48 }}>
              <img src="/Projects/tech-in-air-logo.jpeg" alt="Tech in Air" className="w-full h-full object-contain" style={{ maxWidth: '100%', maxHeight: '100%' }} onError={(e)=>{e.currentTarget.style.display='none'}} />
            </div>
            <div className="flex sm:hidden items-center justify-center overflow-hidden shrink-0" style={{ width: 108, height: 40 }}>
              <img src="/Projects/tech-in-air-logo.jpeg" alt="Tech in Air" className="w-full h-full object-contain" style={{ maxWidth: '100%', maxHeight: '100%' }} onError={(e)=>{e.currentTarget.style.display='none'}} />
            </div>
            <div className="text-sm font-bold tracking-wider sr-only sm:not-sr-only text-slate-900 dark:text-slate-50">TECH IN AIR</div>
          </Link>
          <div className="text-[11px] leading-4 hidden lg:block text-slate-600 dark:text-slate-300 whitespace-nowrap">Technology • AI • IoT • Software Solutions</div>
        </div>

        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {links.map(l => (
            l.label === 'Business Solutions' ? (
              <div key={l.label} className="relative" onMouseEnter={() => setBusinessOpen(true)} onMouseLeave={() => setBusinessOpen(false)}>
                <Link
                  to={l.href}
                  aria-haspopup="menu"
                  aria-expanded={businessOpen}
                  className={`inline-flex items-center gap-1 text-sm transition-all ${location.pathname.startsWith(l.href) ? 'text-cyan-600 dark:text-cyan-300 font-semibold' : 'text-slate-700 dark:text-slate-200'}`}
                  onClick={() => setBusinessOpen(false)}
                >
                  {l.label}<ChevronDown size={14} />
                </Link>
                {businessOpen && (
                  <div role="menu" className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-950">
                      {businessServices.map((service) => (
                        <Link key={service.slug} to={`/business-solutions/${service.slug}`} role="menuitem" onClick={() => setBusinessOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-200 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300">
                          {service.title}
                        </Link>
                      ))}
                      <Link to="/business-solutions/quotation" role="menuitem" onClick={() => setBusinessOpen(false)} className="mt-1 block rounded-lg border-t border-slate-100 px-3 py-2.5 text-sm font-semibold text-cyan-700 dark:border-slate-800 dark:text-cyan-300">Request a quotation</Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
            <Link
              key={l.label}
              to={l.href}
              className={`text-sm transition-all duration-200 hover:-translate-y-0.5 ${location.pathname === l.href ? 'text-cyan-600 dark:text-cyan-300 font-semibold' : 'text-slate-700 dark:text-slate-200'}`}
            >
              <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-cyan-500 after:transition-transform after:duration-200 after:content-[''] group-hover:after:scale-x-100">
                {l.label}
              </span>
            </Link>
            )
          ))}
          <Link to="/contact" className="ml-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0">Let's Talk</Link>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button className="p-2 text-slate-700 dark:text-slate-200" aria-label="menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-6">
          <div className="flex flex-col gap-4 glass p-4 rounded-md text-slate-700 dark:text-slate-200">
            {links.map((l) => l.label === 'Business Solutions' ? (
              <div key={l.label}>
                <div className="flex items-center justify-between">
                  <Link to={l.href} onClick={() => { setOpen(false); setMobileBusinessOpen(false) }} className="font-semibold transition hover:text-cyan-600 dark:hover:text-cyan-300">{l.label}</Link>
                  <button type="button" aria-label="Toggle Business Solutions menu" aria-expanded={mobileBusinessOpen} onClick={() => setMobileBusinessOpen((value) => !value)} className="p-1"><ChevronDown size={18} className={mobileBusinessOpen ? 'rotate-180' : ''} /></button>
                </div>
                {mobileBusinessOpen && (
                  <div className="mt-2 grid gap-1 border-l border-slate-200 pl-3 dark:border-slate-700">
                    {businessServices.map((service) => <Link key={service.slug} to={`/business-solutions/${service.slug}`} onClick={() => { setOpen(false); setMobileBusinessOpen(false) }} className="py-2 text-sm text-slate-600 dark:text-slate-300">{service.title}</Link>)}
                    <Link to="/business-solutions/quotation" onClick={() => { setOpen(false); setMobileBusinessOpen(false) }} className="py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">Request a quotation</Link>
                  </div>
                )}
              </div>
            ) : (
              <Link key={l.label} to={l.href} onClick={() => setOpen(false)} className="transition hover:text-cyan-600 dark:hover:text-cyan-300">{l.label}</Link>
            ))}
            <Link to="/contact" className="bg-cyan-400 text-black px-3 py-2 rounded-md inline-block font-semibold">Let's Talk</Link>
          </div>
        </div>
      )}
    </header>
  )
}
