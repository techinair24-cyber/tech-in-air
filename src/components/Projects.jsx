import React, {useState, useMemo} from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import projectsData from '../data/projects'
import ProjectCard from './ProjectCard'

const categories = ['All','AI / ML','AI / Machine Learning','Android / Software','IoT / Communication','Embedded / Robotics','Deep Learning / AI']

export default function Projects(){
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(()=>{
    if(filter==='All') return projectsData
    return projectsData.filter(p=> Array.isArray(p.categories) && p.categories.includes(filter))
  },[filter])

  return (
    <section id="projects" className="py-12">
      <div className="container">
        <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.35}}>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Our Projects</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">A growing portfolio of software, AI, IoT and embedded technology projects.</p>
        </motion.div>

        <div className="mt-4 flex flex-wrap gap-3">
          {['All','AI / ML','Software','Android','IoT','Embedded','Deep Learning'].map((c, index) => (
            <motion.button
              key={c}
              initial={{opacity:0,y:10}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true}}
              transition={{delay:index*0.04,duration:0.25}}
              onClick={()=>setFilter(c)}
              className={`px-3 py-1 rounded-md transition-all duration-200 hover:-translate-y-0.5 ${filter===c? 'bg-cyan-400 text-black':'glass text-sm text-slate-700 dark:text-slate-200'}`}
            >
              {c}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, index) => (
            <motion.div key={p.id} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.35, delay:index*0.06}}>
              <ProjectCard p={p} />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link to="/projects" className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-md inline-block">View All Projects</Link>
        </div>
      </div>
    </section>
  )
}
