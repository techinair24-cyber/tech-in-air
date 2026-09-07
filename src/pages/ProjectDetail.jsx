import React from 'react'
import { useParams, Link } from 'react-router-dom'
import projects from '../data/projects'

export default function ProjectDetail(){
  const { id } = useParams()
  const project = projects.find(p=> String(p.id)===String(id))
  if(!project) return <div className="container py-8">Project not found</div>

  const src = project.image

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={src} alt={project.title} className="w-full rounded-lg object-cover h-80" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src=new URL(`../assets/projects/${project.image.split('/').pop().replace(/\.[^.]+$/,'')}-fallback.svg`, import.meta.url).href}} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.title}</h1>
          <div className="mt-2 text-sm text-cyan-600 dark:text-cyan-300">
            {Array.isArray(project.categories) ? project.categories.join(' • ') : project.category} • {project.status}
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{project.description}</p>
          <div className="mt-4">
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">Technologies</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.technologies.map(t=> <span key={t} className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-700 opacity-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">{t}</span>)}
            </div>
          </div>
          <div className="mt-6">
            <a className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-md" href={`https://wa.me/918310808011?text=Hello%20Tech%20in%20Air%2C%20I%20would%20like%20to%20discuss%20the%20project%20${encodeURIComponent(project.title)}`}>Discuss Your Project</a>
            <Link to="/projects" className="ml-3 text-sm text-slate-600 dark:text-slate-300">Back to projects</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
