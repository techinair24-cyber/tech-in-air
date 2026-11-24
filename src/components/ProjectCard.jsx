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
  const src = p.image || fallbackFor(p.image)

  const handleError = (e)=>{
    e.currentTarget.onerror = null
    e.currentTarget.src = fallbackFor(p.image)
  }

  return (
    <article className="group overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)]">
      <div className="relative w-full overflow-hidden" style={{aspectRatio:'16/9'}}>
        <img src={src} alt={p.title} onError={handleError} className="w-full h-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 pointer-events-none" style={{mixBlendMode:'overlay'}} />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            {Array.isArray(p.categories) ? p.categories.slice(0, 2).join(' · ') : p.category || ''}
          </div>
          <div className={`rounded-full border px-2 py-1 text-[10px] font-medium ${p.status==='In Progress' ? 'border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-400 dark:bg-amber-300 dark:text-slate-900' : 'border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-400 dark:text-slate-900'}`}>{p.status.toUpperCase()}</div>
        </div>
        <h3 className="font-semibold mt-3 text-lg text-slate-900 dark:text-white">{p.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{p.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <Link to={`/projects/${p.id}`} className="primary-button !min-h-10 px-4 py-2 text-sm">View Project</Link>
        </div>
      </div>
    </article>
  )
}
