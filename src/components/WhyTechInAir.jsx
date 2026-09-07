import React from 'react'

const points = [
  {title:'End-to-End Support',desc:'From concept to demonstration.'},
  {title:'Multiple Technology Domains',desc:'AI, ML, IoT, software, Android and embedded systems.'},
  {title:'Practical Development',desc:'Focus on working systems rather than theory alone.'},
  {title:'Clear Explanation',desc:'Technical concepts explained understandably.'},
  {title:'Project Documentation',desc:'Support for reports and presentation materials.'},
  {title:'Hardware + Software',desc:'Ability to work across both digital software and physical systems.'}
]

export default function WhyTechInAir(){
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-semibold">Why Work With Tech in Air?</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {points.map((p,i)=>(
            <div key={i} className="glass p-4 rounded-md">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-300 mt-2">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
