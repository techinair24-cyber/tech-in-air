import React from 'react'
import PageHeader from '../components/PageHeader'
import Services from '../components/Services'

export default function ServicesPage(){
  return (
    <div>
      <PageHeader title="Services" subtitle="Complete project services" />
      <section className="py-8 container">
        <Services />
      </section>
    </div>
  )
}
