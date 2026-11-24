import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import BusinessServiceDetail from '../components/BusinessServiceDetail'
import { businessServices, PRICING_DISCLAIMER } from '../data/businessSolutions'
import { usePublishedPage, usePublishedServices } from '../lib/publicContent'

export default function BusinessServiceDetailPage() {
  const { serviceSlug } = useParams()
  const { data: publishedServices, loading } = usePublishedServices('business-solutions')
  const { content } = usePublishedPage('business-solutions')
  const serviceList = publishedServices === null ? businessServices : publishedServices
  const service = serviceList.find((item) => item.slug === serviceSlug)

  if (!service && loading) return <p className="container py-12 text-[var(--muted)]" role="status">Loading published service…</p>
  if (!service) return <Navigate to="/business-solutions" replace />
  return <BusinessServiceDetail service={service} pricingDisclaimer={content?.pricingDisclaimer || PRICING_DISCLAIMER} />
}
