import React from 'react'
import { Cpu, Zap, Smartphone, Wifi, Server } from 'lucide-react'

const items = [
  {label:'AI & ML',icon:Zap},
  {label:'IoT',icon:Wifi},
  {label:'Software',icon:Cpu},
  {label:'Android',icon:Smartphone},
  {label:'Embedded Systems',icon:Server},
  {label:'Project Development',icon:Zap}
]

export default function CapabilityStrip(){
  return (
    <div className="py-6">
      <div className="container flex flex-wrap gap-4 justify-center">
        {items.map((it,idx)=>{
          const Icon = it.icon
          return (
            <div key={idx} className="glass px-4 py-3 rounded-md flex items-center gap-3">
              <Icon size={18} />
              <div className="text-sm font-medium">{it.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
