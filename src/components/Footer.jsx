import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="mt-16 border-t border-[var(--border)] py-12">
      <div className="container grid gap-10 md:grid-cols-4">
        <div>
          <img src="/Logo/Tech%20in%20Air%20Logo.png" alt="Tech in Air" className="h-24 w-48 object-contain" />
          <p className="mt-3 text-sm font-medium text-[var(--muted)]">Tech Made Simple</p>
        </div>
        <div>
          <div className="font-semibold">Explore</div>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li><Link to="/about" className="hover:text-[var(--accent)]">About</Link></li>
            <li><Link to="/projects" className="hover:text-[var(--accent)]">Projects</Link></li>
            <li><Link to="/business-solutions" className="hover:text-[var(--accent)]">Business Solutions</Link></li>
            <li><Link to="/services" className="hover:text-[var(--accent)]">Academic Solutions</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--accent)]">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <p>Bangalore, Karnataka, India</p>
            <p><a href="mailto:tech.in.air24@gmail.com" className="hover:text-[var(--accent)]">tech.in.air24@gmail.com</a></p>
            <p>+91 8310808011</p>
            <p><a href="https://www.instagram.com/tech_in_air_ka" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">Instagram</a></p>
          </div>
        </div>
        <div>
          <div className="font-semibold">Legal</div>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li><Link to="/privacy-policy" className="hover:text-[var(--accent)]">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-[var(--accent)]">Terms &amp; Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mt-10 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
        © 2023 Tech In Air. All rights reserved.
      </div>
    </footer>
  )
}
