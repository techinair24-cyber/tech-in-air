import React from 'react'
import { Link } from 'react-router-dom'

export default function CTA(){
  return (
    <section className="py-12">
      <div className="container glass rounded-lg p-8 flex items-center justify-between gap-6 flex-col md:flex-row">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to build something with Tech in Air?</h3>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Contact us for project enquiries and pricing.</p>
        </div>
        <div>
          <Link to="/contact" className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-md font-semibold">Let's Talk</Link>
        </div>
      </div>
    </section>
  )
}
