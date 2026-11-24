export function formatPackagePrice(packageRecord) {
  if (packageRecord.pricing_type === 'custom' || packageRecord.price_minor === null) {
    return 'Custom quotation'
  }

  const amount = Number(packageRecord.price_minor) / 100
  if (!Number.isSafeInteger(Number(packageRecord.price_minor)) || amount < 0) return 'Contact for pricing'
  const currency = packageRecord.currency || 'INR'
  let formattedAmount

  try {
    formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(amount)
  } catch (error) {
    if (!(error instanceof RangeError)) throw error
    formattedAmount = `${currency} ${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(amount)}`
  }

  const prefix = packageRecord.pricing_type === 'starting' ? 'Starting at ' : ''
  const interval = packageRecord.billing_interval === 'month'
    ? '/month'
    : packageRecord.billing_interval === 'year' ? '/year' : ''
  return `${prefix}${formattedAmount}${interval}`
}

export function mapBusinessService(service, packages) {
  const details = service.details || {}
  const sortedPackages = packages
    .filter((item) => item.service_id === service.id && item.status === 'published' && item.available)
    .sort((first, second) => first.sort_order - second.sort_order)

  return {
    id: service.slug,
    slug: service.slug,
    title: service.name,
    shortDescription: service.short_description,
    detailedDescription: service.description,
    availability: service.enabled ? 'Available' : 'Unavailable',
    startingPrice: sortedPackages[0] ? formatPackagePrice(sortedPackages[0]) : 'Custom quotation',
    pricingUnit: sortedPackages[0]?.billing_interval || 'project',
    imagePath: service.image_path || '',
    icon: details.icon || 'store',
    targetCustomers: Array.isArray(details.targetCustomers) ? details.targetCustomers : [],
    features: Array.isArray(service.features) ? service.features : [],
    process: Array.isArray(details.process) ? details.process : [],
    previews: Array.isArray(details.previews) ? details.previews : [],
    packages: sortedPackages.map((item) => ({
      id: item.slug,
      name: item.name,
      price: formatPackagePrice(item),
      priceMinor: item.price_minor === null ? null : Number(item.price_minor),
      currency: item.currency || 'INR',
      pricingType: item.pricing_type,
      billingInterval: item.billing_interval,
      features: Array.isArray(item.features) ? item.features : [],
      limitations: Array.isArray(item.limitations) ? item.limitations : [],
    })),
    faqs: Array.isArray(service.faqs) ? service.faqs : [],
    relatedServices: Array.isArray(details.relatedServices) ? details.relatedServices : [],
  }
}
