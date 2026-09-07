import React from 'react'
import { Link } from 'react-router-dom'

function fallbackFor(image){
  try{
    const parts = image.split('/').pop().split('.')
    const name = parts.slice(0,-1).join('.')
    return new URL(`../assets/projects/${name}-fallback.svg`, import.meta.url).href
  }catch(e){
    return new URL(`../assets/projects/placeholder.svg`, import.meta.url).href
  }
}

export default function ProjectCard({p, onOpen}){
  const filename = (()=>{
    try{
      const f = p.image.split('/').pop()
      const base = f.replace(/\.[^.]+$/, '')
      return `${base}.png` // map to public/Projects PNG as requested
    }catch(e){
      return ''
    }
  })()

  const src = filename ? `/Projects/${filename}` : fallbackFor(p.image)

  const handleError = (e)=>{
    e.currentTarget.onerror = null
    e.currentTarget.src = fallbackFor(p.image)
  }

  return (
    <article className="bg-white dark:bg-[#041017] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-md shadow-slate-200/70 dark:shadow-black/20 hover:shadow-xl transition-transform transform hover:-translate-y-1">
      <div className="w-full" style={{aspectRatio:'16/9'}}>
        <img src={src} alt={p.title} onError={handleError} className="w-full h-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 pointer-events-none" style={{mixBlendMode:'overlay'}} />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            {Array.isArray(p.categories) ? p.categories.map(c=> (
              <span key={c} className="opacity-100 rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-700 dark:border-cyan-400/25 dark:bg-slate-900/80 dark:text-sky-100">{c}</span>
            )) : <span className="opacity-100 rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-700 dark:border-cyan-400/25 dark:bg-slate-900/80 dark:text-sky-100">{p.category||''}</span>}
          </div>
          <div className={`rounded-full border px-2 py-1 text-[10px] font-medium ${p.status==='In Progress' ? 'border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-400 dark:bg-amber-300 dark:text-slate-900' : 'border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-400 dark:text-slate-900'}`}>{p.status.toUpperCase()}</div>
        </div>
        <h3 className="font-semibold mt-3 text-lg text-slate-900 dark:text-white">{p.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{p.description.substring(0,140)}{p.description.length>140?'...':''}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.technologies && p.technologies.map(t=> <span key={t} className="opacity-100 rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">{t}</span>)}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Link to={`/projects/${p.id}`} className="text-sm px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-md font-semibold">View Project</Link>
        </div>
      </div>
    </article>
  )
}
