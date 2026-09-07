import React from 'react'
import PageHeader from '../components/PageHeader'

export default function ProcessPage(){
  const steps = [
    {id:1,title:'Discuss',desc:'Understand the project idea, requirements and objectives.'},
    {id:2,title:'Plan',desc:'Define the technology stack, architecture and implementation approach.'},
    {id:3,title:'Develop',desc:'Build the software, AI model, hardware or complete project system.'},
    {id:4,title:'Test & Demo',desc:'Test the system and prepare the project for demonstration.'},
    {id:5,title:'Deliver',desc:'Provide the developed project along with documentation and presentation.'}
  ]

  return (
    <div>
      <PageHeader title="Process" subtitle="From Idea to Implementation" />
      <section className="py-8 container">
        <div className="space-y-6">
          {steps.map(s=> (
            <div key={s.id} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold">{String(s.id).padStart(2,'0')}</div>
              <div>
                <div className="font-semibold text-lg text-slate-900 dark:text-white">{s.title}</div>
                <div className="text-slate-600 dark:text-slate-300 mt-1">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
