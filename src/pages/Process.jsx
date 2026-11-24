import React from 'react'
import PageHeader from '../components/PageHeader'
import PublishedPageSections from '../components/PublishedPageSections'
import { usePublishedPage } from '../lib/publicContent'
import { getPageText } from '../lib/pageContent.mjs'

export default function ProcessPage(){
  const { title, content } = usePublishedPage('process')
  const hero = content?.hero && typeof content.hero === 'object' ? content.hero : {}
  const configuredSteps = Array.isArray(content?.steps)
    ? content.steps.filter((step) => step && typeof step === 'object' && !Array.isArray(step))
    : null
  const steps = configuredSteps || [
    {id:1,title:'Discuss',desc:'Understand the project idea, requirements and objectives.'},
    {id:2,title:'Plan',desc:'Define the technology stack, architecture and implementation approach.'},
    {id:3,title:'Develop',desc:'Build the software, AI model, hardware or complete project system.'},
    {id:4,title:'Test & Demo',desc:'Test the system and prepare the project for demonstration.'},
    {id:5,title:'Deliver',desc:'Provide the developed project along with documentation and presentation.'}
  ]

  return (
    <div>
      <PageHeader title={getPageText(hero.heading, title || 'Process')} subtitle={getPageText(hero.description, 'From Idea to Implementation')} />
      <PublishedPageSections content={content} excludedTypes={['hero']} />
      <section className="py-8 container">
        <div className="space-y-6">
          {steps.map((s, index)=> (
            <div key={s.id || s.title || index} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold">{String(s.number || s.id || index + 1).padStart(2,'0')}</div>
              <div>
                <div className="font-semibold text-lg text-slate-900 dark:text-white">{getPageText(s.title) || getPageText(s.name)}</div>
                <div className="text-slate-600 dark:text-slate-300 mt-1">{getPageText(s.desc) || getPageText(s.description)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
