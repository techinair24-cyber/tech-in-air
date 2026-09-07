import React from 'react'
import { X } from 'lucide-react'

export default function ProjectModal({project, onClose}){
  if(!project) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl mx-4 glass rounded-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2"><X/></button>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <img src={project.image} alt={project.title} onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/src/assets/projects/placeholder.svg'}} className="w-full h-64 object-cover rounded-md"/>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{project.title}</h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 mt-2">{project.category} • {project.status}</div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">{project.description}</p>
            <div className="mt-4">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Technologies</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.map((t,i)=>(<span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-sm dark:bg-zinc-900 dark:text-slate-200">{t}</span>))}
              </div>
            </div>
            <div className="mt-6">
              <a href={`https://wa.me/918310808011?text=${encodeURIComponent(`Hello Tech in Air, I would like to discuss a project.%0A%0AProject:%20${project.title}%0A%0APlease share details and pricing.`)}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-green-500 text-black rounded-md">Discuss Your Project</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
