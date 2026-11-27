export const PROJECT_CLASSIFICATIONS = [
  'Engineering Main Project',
  'Diploma Main Project',
  'Competition Project',
  'Business Project',
]

export function normalizeProjectCategories(categories) {
  if (!Array.isArray(categories)) return []

  return [...new Set(
    categories
      .filter((category) => typeof category === 'string' && category.trim())
      .map((category) => {
        const normalized = category.trim()
        return normalized.toLowerCase() === 'android'
          ? 'Android App'
          : normalized
      })
  )]
}

export function isProjectClassification(value) {
  return PROJECT_CLASSIFICATIONS.includes(value)
}

export function getProjectClassification(project) {
  if (typeof project.classification === 'string' && project.classification.trim()) {
    return isProjectClassification(project.classification.trim())
      ? project.classification.trim()
      : null
  }

  const classifications = new Set(
    [
      ...(Array.isArray(project.categories) ? project.categories : []),
      project.category,
    ].filter(isProjectClassification)
  )

  return classifications.size === 1
    ? classifications.values().next().value
    : null
}

export function getProjectStatistics(projects) {
  const uniqueProjects = []
  const seenIds = new Set()
  const seenObjects = new Set()

  projects.forEach((project) => {
    const identity = project.id != null
      ? `id:${project.id}`
      : project.slug != null
        ? `slug:${project.slug}`
        : null

    if (identity !== null) {
      if (seenIds.has(identity)) return
      seenIds.add(identity)
    } else {
      if (seenObjects.has(project)) return
      seenObjects.add(project)
    }

    uniqueProjects.push(project)
  })

  const statistics = {
    total: uniqueProjects.length,
    engineering: 0,
    diploma: 0,
    competition: 0,
    business: 0,
  }

  const statisticKeys = {
    'Engineering Main Project': 'engineering',
    'Diploma Main Project': 'diploma',
    'Competition Project': 'competition',
    'Business Project': 'business',
  }

  uniqueProjects.forEach((project) => {
    const key = statisticKeys[getProjectClassification(project)]
    if (key) statistics[key] += 1
  })

  return statistics
}

export function getProjectFilterCategories(projects) {
  const projectCategories = projects.flatMap((project) =>
    normalizeProjectCategories([
      ...(Array.isArray(project.categories) ? project.categories : []),
      project.category,
    ])
  )

  return ['All', ...new Set(
    projectCategories.filter((category) =>
      category.toLowerCase() !== 'software' &&
      !isProjectClassification(category)
    )
  )]
}
