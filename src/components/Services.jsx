import React from 'react'
import { motion } from 'framer-motion'
import services from '../data/services'
import ServiceCard from './ServiceCard'

export default function Services({preview=false}){
  const list = preview ? services.slice(0,3) : services
  return (
    <section id="services" className="py-12">
      <div className="container">
        <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.35}}>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">What We Do</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">From an idea on paper to a working project.</p>
        </motion.div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((s,i)=> (
            <motion.div key={s.id} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.35, delay:i*0.07}}>
              <ServiceCard service={s} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
