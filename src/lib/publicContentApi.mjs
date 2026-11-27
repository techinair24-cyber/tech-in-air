import { mapBusinessService } from './publicContentModel.mjs'
import {
  getProjectClassification,
  isProjectClassification,
  normalizeProjectCategories,
} from './projectModel.mjs'

export function createPublicContentApi(
  client,
  getPublicMediaUrl = () => '',
  localProjects = []
) {
  return {
    async fetchPublishedPage(slug) {
      if (!client || !slug) return null
      const { data, error } = await client
        .from('site_pages')
        .select('slug, title, published_content, published_seo')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()
      if (error) throw error
      return data
    },

    async fetchPublishedAnnouncements(displayLocation) {
      if (!client) return null
      const now = new Date().toISOString()
      const locations = displayLocation === 'sitewide' ? ['sitewide'] : ['sitewide', displayLocation]
      const { data, error } = await client
        .from('announcements')
        .select('id, title, content, display_location, starts_at, ends_at, priority')
        .eq('status', 'published')
        .in('display_location', locations)
        .lte('starts_at', now)
        .or(`ends_at.is.null,ends_at.gt.${now}`)
        .order('priority', { ascending: false })
        .limit(3)
      if (error) throw error
      return data || []
    },

    async fetchPublishedOffers() {
      if (!client) return null
      const now = new Date().toISOString()
      const { data, error } = await client
        .from('offers')
        .select('id, title, description, discount_type, discount_value, banner_content')
        .eq('status', 'active')
        .lte('starts_at', now)
        .or(`ends_at.is.null,ends_at.gt.${now}`)
        .order('starts_at', { ascending: false })
        .limit(3)
      if (error) throw error
      return data || []
    },

    async fetchPublishedServices(categorySlug) {
      if (!client) return null
      const { data: category, error: categoryError } = await client
        .from('service_categories')
        .select('id')
        .eq('slug', categorySlug)
        .eq('status', 'published')
        .maybeSingle()
      if (categoryError) throw categoryError
      if (!category) return []

      const { data: serviceRows, error: serviceError } = await client
        .from('services')
        .select('id, category_id, slug, name, short_description, description, image_path, features, faqs, details, enabled, sort_order')
        .eq('category_id', category.id)
        .eq('status', 'published')
        .eq('enabled', true)
        .order('sort_order', { ascending: true })
      if (serviceError) throw serviceError
      if (!serviceRows?.length) return []

      const serviceIds = serviceRows.map((service) => service.id)
      const { data: packageRows, error: packageError } = await client
        .from('service_packages')
        .select('id, service_id, slug, name, pricing_type, price_minor, currency, billing_interval, features, limitations, sort_order, status, available')
        .in('service_id', serviceIds)
        .eq('status', 'published')
        .eq('available', true)
        .order('sort_order', { ascending: true })
      if (packageError) throw packageError

      return serviceRows.map((service) => ({
        ...mapBusinessService(service, packageRows || []),
        image: getPublicMediaUrl(service.image_path),
      }))
    },

    async fetchPublishedProjects() {
      if (!client) return null
      const { data, error } = await client
        .from('portfolio_projects')
        .select('id, slug, title, category, categories, description, technologies, image_paths, sort_order, featured, completed_at')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
      if (error) throw error

      return (data || []).map((project) => {
        const imagePath = Array.isArray(project.image_paths)
          ? project.image_paths.find((path) => typeof path === 'string')
          : null
        const projectClassification = getProjectClassification(project)
        const categories = normalizeProjectCategories([
          ...(Array.isArray(project.categories) ? project.categories : []),
          project.category,
        ]).filter((category) => !isProjectClassification(category))
        const localProject = localProjects.find(
          (item) => item.title.trim().toLowerCase() === project.title.trim().toLowerCase()
        )
        const completed =
          Boolean(project.completed_at) ||
          localProject?.status?.toLowerCase() === 'completed'
        const primaryCategory = normalizeProjectCategories([project.category])[0]
        return {
          id: project.slug,
          slug: project.slug,
          title: project.title,
          category: primaryCategory && !isProjectClassification(primaryCategory)
            ? primaryCategory
            : categories[0] || '',
          categories,
          classification: projectClassification,
          description: project.description,
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
          image: getPublicMediaUrl(imagePath),
          featured: project.featured === true,
          status: completed ? 'Completed' : 'Published',
        }
      })
    },
  }
}
