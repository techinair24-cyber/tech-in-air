import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import BusinessServiceDetail from '../components/BusinessServiceDetail'
import { businessServices } from '../data/businessSolutions'

export default function BusinessServiceDetailPage() {
  const { serviceSlug } = useParams()
  const service = businessServices.find((item) => item.slug === serviceSlug)

  if (!service) return <Navigate to="/business-solutions" replace />
  return <BusinessServiceDetail service={service} />
}
