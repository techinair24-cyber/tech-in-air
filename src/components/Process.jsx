import React from 'react'

const steps = [
  {num:'01',title:'Discuss',desc:'Understand the project idea, requirements and objectives.'},
  {num:'02',title:'Plan',desc:'Define the technology stack, architecture and implementation approach.'},
  {num:'03',title:'Develop',desc:'Build the software, AI model, hardware or complete project system.'},
  {num:'04',title:'Test & Demo',desc:'Test the system and prepare the project for demonstration.'},
  {num:'05',title:'Deliver',desc:'Provide the developed project along with the required documentation and presentation support.'}
]

export default function Process(){
  return (
    <section id="process" className="py-12">
      <div className="container">
        <h2 className="text-3xl font-semibold">From Idea to Implementation</h2>
        <div className="mt-6 grid md:grid-cols-5 gap-4">
          {steps.map(s=> (
            <div key={s.num} className="glass p-4 rounded-md text-center">
              <div className="text-sm text-cyan-300 font-bold">{s.num}</div>
              <div className="font-semibold mt-2">{s.title}</div>
              <div className="text-sm text-gray-300 mt-2">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
