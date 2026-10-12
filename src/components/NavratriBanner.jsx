import React from 'react'
import './NavratriBanner.css'

function Diya() {
  return (
    <svg className="navratri-diya" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <path className="navratri-flame-halo" d="M36 7c1.5 6.1 8 9.3 5.7 16.2-1.1 3.3-3.2 4.8-5.7 5.6-2.5-.8-4.6-2.3-5.7-5.6C28 16.3 34.5 13.1 36 7Z" />
      <path className="navratri-flame" d="M36 7c1.5 6.1 8 9.3 5.7 16.2-1.1 3.3-3.2 4.8-5.7 5.6-2.5-.8-4.6-2.3-5.7-5.6C28 16.3 34.5 13.1 36 7Z" />
      <path className="navratri-flame-core" d="M36 14c.7 3.6 3.7 5.4 2.8 8.7-.4 1.5-1.4 2.7-2.8 3.5-1.4-.8-2.4-2-2.8-3.5-.9-3.3 2.1-5.1 2.8-8.7Z" />
      <path className="navratri-diya-bowl" d="M13 39c1.7 12 10.7 20 23 20s21.3-8 23-20H13Z" />
      <path className="navratri-diya-rim" d="M10 38h52M22 62h28" />
      <path className="navratri-diya-detail" d="M25 46c2.3 2.2 5.9 3.5 11 3.5s8.7-1.3 11-3.5" />
    </svg>
  )
}

function GarbaDancer({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 96" fill="none" aria-hidden="true">
      <circle className="navratri-dancer-skin" cx="32" cy="12" r="6" />
      <path className="navratri-dancer-hair" d="M26 12c0-8 12-10 14-1l-2 5-2-6-3 5-2-5-3 4-2-2Z" />
      <path className="navratri-dancer-arm" d="M25 28C18 25 13 17 8 9m31 19c8-3 13-11 18-19" />
      <path className="navratri-dancer-sleeve" d="m23 25 5 5-4 7-6-5m23-7-5 5 4 7 6-5" />
      <path className="navratri-dancer-blouse" d="m26 27 6-3 6 3 5 13H21l5-13Z" />
      <path className="navratri-dancer-skirt" d="M22 39h20c3 15 9 29 17 40-16 12-38 12-54 0 8-11 14-25 17-40Z" />
      <path className="navratri-dancer-skirt-band" d="M18 55c9 5 19 5 28 0M14 67c11 6 25 6 36 0M9 78c14 7 32 7 46 0" />
      <path className="navratri-dancer-hem" d="M7 80c16 11 34 11 50 0" />
      <path className="navratri-dancer-dupatta" d="M40 28c8 7 9 19 15 28m-37-22c-4 8-4 14-7 20" />
      <path className="navratri-dancer-jewelry" d="M27 20c3 2 7 2 10 0M30 29h4m-4 6h4" />
      <path className="navratri-dancer-leg" d="m26 82-2 10m14-10 2 10" />
    </svg>
  )
}

export default function NavratriBanner() {
  return (
    <section className="navratri-banner-wrap" aria-labelledby="navratri-greeting">
      <div className="container">
        <div className="navratri-banner">
          <div className="navratri-hanging-decor" aria-hidden="true">
            <span className="navratri-garland navratri-garland-one" />
            <span className="navratri-garland navratri-garland-two" />
            <span className="navratri-garland navratri-garland-three" />
            <span className="navratri-garland navratri-garland-four" />
            <span className="navratri-garland navratri-garland-five" />
            <span className="navratri-garland navratri-garland-six" />
            <span className="navratri-light-wire" />
            <span className="navratri-fairy-light navratri-light-one" />
            <span className="navratri-fairy-light navratri-light-two" />
            <span className="navratri-fairy-light navratri-light-three" />
            <span className="navratri-fairy-light navratri-light-four" />
            <span className="navratri-fairy-light navratri-light-five" />
            <span className="navratri-fairy-light navratri-light-six" />
          </div>
          <span className="navratri-particle navratri-particle-one" aria-hidden="true" />
          <span className="navratri-particle navratri-particle-two" aria-hidden="true" />
          <span className="navratri-particle navratri-particle-three" aria-hidden="true" />
          <span className="navratri-particle navratri-particle-four" aria-hidden="true" />
          <span className="navratri-petal navratri-petal-one" aria-hidden="true" />
          <span className="navratri-petal navratri-petal-two" aria-hidden="true" />
          <span className="navratri-petal navratri-petal-three" aria-hidden="true" />
          <span className="navratri-toran navratri-toran-left" aria-hidden="true" />
          <GarbaDancer className="navratri-dancer navratri-dancer-left" />
          <GarbaDancer className="navratri-dancer navratri-dancer-right" />
          <div className="navratri-side-diya navratri-side-diya-left"><Diya /></div>
          <div className="navratri-message">
            <span className="navratri-kicker">Nine nights of light</span>
            <h2 id="navratri-greeting">Happy Navratri</h2>
            <p>Wishing you joy, strength, and new beginnings.</p>
          </div>
          <div className="navratri-side-diya navratri-side-diya-right"><Diya /></div>
          <span className="navratri-toran navratri-toran-right" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
