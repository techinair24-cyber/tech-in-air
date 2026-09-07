import React from 'react'
import PageHeader from '../components/PageHeader'
import Contact from '../components/Contact'

export default function ContactPage(){
  return (
    <div>
      <PageHeader title="Contact" subtitle="Have a project idea? Let's build it." />
      <section className="py-8 container">
        <Contact />
      </section>
    </div>
  )
}
