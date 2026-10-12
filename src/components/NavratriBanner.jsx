import React from 'react'
import './NavratriBanner.css'

function Diya() {
  return (
    <svg className="navratri-diya" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <path className="navratri-flame" d="M36 7c1.5 6.1 8 9.3 5.7 16.2-1.1 3.3-3.2 4.8-5.7 5.6-2.5-.8-4.6-2.3-5.7-5.6C28 16.3 34.5 13.1 36 7Z" />
      <path className="navratri-diya-bowl" d="M13 39c1.7 12 10.7 20 23 20s21.3-8 23-20H13Z" />
      <path className="navratri-diya-rim" d="M10 38h52M22 62h28" />
      <path className="navratri-diya-detail" d="M25 46c2.3 2.2 5.9 3.5 11 3.5s8.7-1.3 11-3.5" />
    </svg>
  )
}

export default function NavratriBanner() {
  return (
    <section className="navratri-banner-wrap" aria-labelledby="navratri-greeting">
      <div className="container">
        <div className="navratri-banner">
          <span className="navratri-flower navratri-flower-left" aria-hidden="true" />
          <div className="navratri-side-diya navratri-side-diya-left"><Diya /></div>
          <div className="navratri-message">
            <span className="navratri-kicker">Nine nights of light</span>
            <h2 id="navratri-greeting">Happy Navratri</h2>
            <p>Wishing you joy, strength, and new beginnings.</p>
          </div>
          <div className="navratri-side-diya navratri-side-diya-right"><Diya /></div>
          <span className="navratri-flower navratri-flower-right" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
