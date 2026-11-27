import assert from 'node:assert/strict'
import test from 'node:test'
import projects from '../data/projects.js'
import {
  getProjectClassification,
  getProjectFilterCategories,
  getProjectStatistics,
  normalizeProjectCategories,
} from './projectModel.mjs'

test('normalizes Android category names without dropping other categories', () => {
  assert.deepEqual(
    normalizeProjectCategories(['Software', 'Android', 'Android App', '', null]),
    ['Software', 'Android App']
  )
})

test('excludes Software and project classifications from technical filters', () => {
  assert.deepEqual(getProjectFilterCategories([
    {
      categories: [
        'Software',
        'Android',
        'Engineering Main Project',
      ],
    },
    { categories: ['AI / ML'] },
  ]), ['All', 'Android App', 'AI / ML'])
})

test('recognizes each of the four approved classifications exactly', () => {
  const classifications = [
    'Engineering Main Project',
    'Diploma Main Project',
    'Competition Project',
    'Business Project',
  ]

  classifications.forEach((classification) => {
    assert.equal(
      getProjectClassification({ classification }),
      classification
    )
  })
})

test('counts one classification per project and deduplicates repeated project records', () => {
  const project = {
    id: 'engineering-1',
    classification: 'Engineering Main Project',
    category: 'Engineering Main Project',
    categories: [
      'Engineering Main Project',
      'Engineering Main Project',
      'AI / ML',
    ],
  }

  assert.equal(getProjectClassification(project), 'Engineering Main Project')
  assert.deepEqual(getProjectStatistics([project, { ...project }]), {
    total: 1,
    engineering: 1,
    diploma: 0,
    competition: 0,
    business: 0,
  })
})

test('leaves unknown or conflicting classifications uncounted', () => {
  const unknown = {
    id: 'unknown',
    classification: 'Other Project',
    categories: ['Business Project'],
  }
  const conflicting = {
    id: 'conflicting',
    categories: ['Engineering Main Project', 'Diploma Main Project'],
  }

  assert.equal(getProjectClassification(unknown), null)
  assert.equal(getProjectClassification(conflicting), null)
  assert.deepEqual(getProjectStatistics([unknown, conflicting]), {
    total: 2,
    engineering: 0,
    diploma: 0,
    competition: 0,
    business: 0,
  })
})

test('calculates statistics dynamically from project metadata', () => {
  const classifiedProjects = [
    'Engineering Main Project',
    'Diploma Main Project',
    'Competition Project',
    'Business Project',
  ].map((classification, index) => ({
    id: `project-${index}`,
    classification,
  }))

  assert.deepEqual(getProjectStatistics(classifiedProjects), {
    total: 4,
    engineering: 1,
    diploma: 1,
    competition: 1,
    business: 1,
  })

  assert.deepEqual(getProjectStatistics([
    ...classifiedProjects,
    { id: 'project-4', classification: 'Engineering Main Project' },
  ]), {
    total: 5,
    engineering: 2,
    diploma: 1,
    competition: 1,
    business: 1,
  })
})

test('local fallback data contains the approved five-counter breakdown', () => {
  assert.deepEqual(getProjectStatistics(projects), {
    total: 12,
    engineering: 9,
    diploma: 1,
    competition: 1,
    business: 1,
  })
  assert.ok(projects.every((project) => project.status === 'Completed'))
  assert.ok(projects.every((project) =>
    !(project.categories || []).some((category) =>
      [
        'Engineering Main Project',
        'Diploma Main Project',
        'Competition Project',
        'Business Project',
      ].includes(category)
    )
  ))
})
