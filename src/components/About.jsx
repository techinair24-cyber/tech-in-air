import React from 'react'

export default function About(){
  return (
    <section id="about" className="py-12">
      <div className="container grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Technology With Purpose</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Tech in Air is a technology-focused project development initiative based in Bangalore, working across Software, Artificial Intelligence, Machine Learning, IoT and Embedded Systems.</p>
          <p className="mt-3 text-slate-600 dark:text-slate-300">The goal is simple: turn ideas into working technology. From concept development and hardware setup to software implementation, documentation and project demonstrations, Tech in Air provides end-to-end support for technology projects.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-3 py-1 glass rounded-full text-sm text-slate-700 dark:text-slate-200">Software Development</span>
            <span className="px-3 py-1 glass rounded-full text-sm text-slate-700 dark:text-slate-200">AI & Machine Learning</span>
            <span className="px-3 py-1 glass rounded-full text-sm text-slate-700 dark:text-slate-200">IoT Solutions</span>
            <span className="px-3 py-1 glass rounded-full text-sm text-slate-700 dark:text-slate-200">Embedded Systems</span>
            <span className="px-3 py-1 glass rounded-full text-sm text-slate-700 dark:text-slate-200">Android Applications</span>
          </div>
        </div>
        <div>
          <div className="glass rounded-lg p-6">
            <div className="h-56 bg-gradient-to-br from-cyan-500/10 to-purple-600/8 rounded-md flex items-center justify-center">
              <div className="text-center text-sm text-slate-600 dark:text-slate-300">Futuristic technology visual / card</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
