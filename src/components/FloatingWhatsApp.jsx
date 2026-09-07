import React from 'react'
import { MessageCircle } from 'lucide-react'

export default function FloatingWhatsApp(){
  return (
    <a aria-label="Chat with Tech in Air" href="https://wa.me/918310808011" target="_blank" rel="noreferrer" className="fixed right-4 bottom-4 z-50">
      <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shadow-lg animate-pulse-slow" style={{boxShadow:'0 10px 30px rgba(0,0,0,0.5)'}}>
        <MessageCircle color="white" />
      </div>
    </a>
  )
}
