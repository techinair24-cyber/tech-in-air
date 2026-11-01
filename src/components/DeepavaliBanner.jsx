import React from 'react'
import './DeepavaliBanner.css'

function Diya({ side }) {
  return (
    <svg className={`deepavali-diya deepavali-diya-${side}`} viewBox="0 0 100 90" fill="none" aria-hidden="true">
      <ellipse className="deepavali-diya-glow" cx="50" cy="61" rx="39" ry="17" />
      <path className="deepavali-flame-halo" d="M50 8c2 11 13 16 9 27-2 5-5 8-9 10-4-2-7-5-9-10-4-11 7-16 9-27Z" />
      <path className="deepavali-flame" d="M50 11c1 9 9 13 6 22-1 4-3 6-6 8-3-2-5-4-6-8-3-9 5-13 6-22Z" />
      <path className="deepavali-flame-core" d="M50 19c.5 5 4 7 3 11-.5 2-1.5 3.5-3 4.5-1.5-1-2.5-2.5-3-4.5-1-4 2.5-6 3-11Z" />
      <path className="deepavali-diya-bowl" d="M17 51c2 17 14 27 33 27s31-10 33-27H17Z" />
      <path className="deepavali-diya-rim" d="M13 50h74M31 82h38" />
      <path className="deepavali-diya-detail" d="M33 62c5 4 10 5 17 5s12-1 17-5" />
      <circle className="deepavali-diya-jewel" cx="50" cy="73" r="2" />
    </svg>
  )
}

function Lantern({ side }) {
  return (
    <svg className={`deepavali-lantern deepavali-lantern-${side}`} viewBox="0 0 54 100" fill="none" aria-hidden="true">
      <path className="deepavali-lantern-chain" d="M27 0v15m-4 0h8" />
      <path className="deepavali-lantern-cap" d="m18 19 9-5 9 5-3 7H21l-3-7Z" />
      <path className="deepavali-lantern-glass" d="M18 28h18l5 29-14 15-14-15 5-29Z" />
      <path className="deepavali-lantern-light" d="M27 34c1 7 6 9 4 15-.8 2-2.3 4-4 5-1.7-1-3.2-3-4-5-2-6 3-8 4-15Z" />
      <path className="deepavali-lantern-frame" d="M18 28h18M14 56h26M27 72v8m-7 0h14m-11 4h8l4 8H19l4-8Z" />
    </svg>
  )
}

function Firework({ side }) {
  return (
    <div className={`deepavali-firework deepavali-firework-${side}`} aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => <span key={index} />)}
    </div>
  )
}

export default function DeepavaliBanner() {
  return (
    <section className="deepavali-banner-wrap" aria-labelledby="deepavali-greeting">
      <div className="container">
        <div className="deepavali-banner">
          <div className="deepavali-sky" aria-hidden="true">
            <div className="deepavali-light-string">
              {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
            </div>
            <div className="deepavali-marigold deepavali-marigold-left" />
            <div className="deepavali-marigold deepavali-marigold-right" />
            <Lantern side="left" />
            <Lantern side="right" />
            <Firework side="left" />
            <Firework side="right" />
            <span className="deepavali-particle deepavali-particle-one" />
            <span className="deepavali-particle deepavali-particle-two" />
            <span className="deepavali-particle deepavali-particle-three" />
            <span className="deepavali-particle deepavali-particle-four" />
            <span className="deepavali-particle deepavali-particle-five" />
            <span className="deepavali-particle deepavali-particle-six" />
            <div className="deepavali-rangoli deepavali-rangoli-left" />
            <div className="deepavali-rangoli deepavali-rangoli-right" />
          </div>

          <div className="deepavali-message">
            <span className="deepavali-brand">TECH IN AIR <span aria-hidden="true">·</span> FESTIVAL GREETINGS</span>
            <h2 id="deepavali-greeting">Happy Deepavali! <span aria-hidden="true">🪔</span></h2>
            <p className="deepavali-subtitle">May the Festival of Lights Fill Your Life with Happiness, Prosperity &amp; Success.</p>
            <p className="deepavali-wish">Wishing You and Your Family a Bright and Joyful Deepavali.</p>
          </div>

          <Diya side="left" />
          <Diya side="right" />
        </div>
      </div>
    </section>
  )
}
