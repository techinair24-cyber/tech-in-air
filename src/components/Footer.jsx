import React from 'react'

export default function Footer(){
  return (
    <footer className="py-10 mt-12 border-t border-slate-200 dark:border-gray-900">
      <div className="container grid md:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div style={{width:132,height:48}} className="overflow-hidden flex items-center shrink-0">
              <img src="/Projects/tech-in-air-logo.jpeg" alt="Tech in Air" className="h-full w-full object-contain" onError={(e)=>{e.currentTarget.style.display='none'}} />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">TECH IN AIR</div>
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-2">Technology • AI • IoT • Software Solutions</div>
            </div>
          </div>
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">Services</div>
          <ul className="mt-2 text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>Project Development</li>
            <li>Project Explanation</li>
            <li>Documentation</li>
            <li>PPT</li>
            <li>Project Demo</li>
            <li>Hardware Setup</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">Explore</div>
          <ul className="mt-2 text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">Contact</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-2">Bangalore, Karnataka, India</div>
          <div className="mt-2"><a href="mailto:tech.in.air24@gmail.com">tech.in.air24@gmail.com</a></div>
          <div className="mt-1">+91 8310808011</div>
          <div className="mt-2"><a href="https://www.instagram.com/tech_in_air_ka" target="_blank" rel="noreferrer">Instagram</a></div>
        </div>
      </div>
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">© 2026 Tech in Air. All rights reserved.</div>
    </footer>
  )
}
