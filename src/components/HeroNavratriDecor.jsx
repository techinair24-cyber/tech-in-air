import React from 'react'
import './HeroNavratriDecor.css'

function BrassLamp({ side }) {
  return (
    <svg className={`hero-navratri-lamp hero-navratri-lamp-${side}`} viewBox="0 0 80 150" fill="none" aria-hidden="true">
      <path className="hero-navratri-lamp-hanger" d="M40 0v12m-5 0h10" />
      <path className="hero-navratri-lamp-chain" d="M40 12v15m-3-10h6m-5 5h4" />
      <path className="hero-navratri-lamp-finial" d="m40 25-6 7 6 5 6-5-6-7Zm-4 12h8l4 7H32l4-7Z" />
      <path className="hero-navratri-lamp-flame-glow" d="M40 34c1.5 7 8 10 5.3 16.5-1.1 2.7-3.2 4.8-5.3 6-2.1-1.2-4.2-3.3-5.3-6C32 44 38.5 41 40 34Z" />
      <path className="hero-navratri-lamp-flame" d="M40 36c1 5 5 7 3.5 12-0.7 2-2 3.5-3.5 4.5-1.5-1-2.8-2.5-3.5-4.5-1.5-5 2.5-7 3.5-12Z" />
      <path className="hero-navratri-lamp-bowl" d="M21 58c5 4 33 4 38 0l-5 12c-3.5 7-9 11-14 13-5-2-10.5-6-14-13l-5-12Z" />
      <path className="hero-navratri-lamp-rim" d="M18 57c10-5 34-5 44 0-10 6-34 6-44 0Z" />
      <path className="hero-navratri-lamp-ornament" d="M27 65c8 4 18 4 26 0m-22 9c5 3 13 3 18 0m-9 9v10m-7 0h14m-17 6c5-3 15-3 20 0l-3 8H33l-3-8Zm4 14h12m-9-4v7m-5 0h16" />
      <circle className="hero-navratri-lamp-jewel" cx="40" cy="69" r="2" />
    </svg>
  )
}

export default function HeroNavratriDecor() {
  return (
    <div className="hero-navratri-decor" aria-hidden="true">
      <div className="hero-navratri-lights">
        <span className="hero-navratri-wire" />
        <span className="hero-navratri-bulb hero-navratri-bulb-one" />
        <span className="hero-navratri-bulb hero-navratri-bulb-two" />
        <span className="hero-navratri-bulb hero-navratri-bulb-three" />
        <span className="hero-navratri-bulb hero-navratri-bulb-four" />
        <span className="hero-navratri-bulb hero-navratri-bulb-five" />
        <span className="hero-navratri-bulb hero-navratri-bulb-six" />
        <span className="hero-navratri-bulb hero-navratri-bulb-seven" />
      </div>
      <span className="hero-navratri-garland hero-navratri-garland-left" />
      <span className="hero-navratri-garland hero-navratri-garland-right" />
      <BrassLamp side="left" />
      <BrassLamp side="right" />
      <span className="hero-navratri-petal hero-navratri-petal-one" />
      <span className="hero-navratri-petal hero-navratri-petal-two" />
      <span className="hero-navratri-particle hero-navratri-particle-one" />
    </div>
  )
}
