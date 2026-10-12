import projects from './projects'
import { legalContent } from './legalContent'

const MAX_CONTEXT_LENGTH = 11500
const STOP_WORDS = new Set([
  'about',
  'are',
  'can',
  'could',
  'does',
  'for',
  'from',
  'have',
  'help',
  'how',
  'into',
  'is',
  'me',
  'please',
  'tell',
  'that',
  'the',
  'this',
  'what',
  'when',
  'where',
  'which',
  'with',
  'would',
])

const BUSINESS_CONTEXT = [
  'Business: Tech in Air',
  'Email: tech.in.air24@gmail.com',
  'WhatsApp: +91 83108 08011 (https://wa.me/918310808011)',
  'Instagram: https://www.instagram.com/tech_in_air_ka',
  'Services: project development, project explanation, documentation, reports, PPTs, demonstrations and hardware setup.',
  'Pricing: customers must contact Tech in Air for a quote. Do not invent prices.',
].join('\n')

const normalize = (value) =>
  value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

const getQueryWords = (query) =>
  normalize(query)
    .split(/\s+/)
    .map((word) => word.replace(/ies$/, 'y').replace(/s$/, '').replace(/able$/, ''))
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))

const scoreText = (words, value) => {
  const normalizedValue = normalize(value)
  return words.reduce((score, word) => score + (normalizedValue.includes(word) ? 1 : 0), 0)
}

const getProjectContext = (query, words) => {
  const normalizedQuery = normalize(query)
  const genericProjectQuestion =
    /\b(projects?|technologies|technology|tech stack|completed|progress|portfolio)\b/i.test(query) ||
    /ಯೋಜನೆ|ತಂತ್ರಜ್ಞಾನ/.test(query)

  const rankedProjects = projects
    .map((project) => {
      const titleMatch = normalizedQuery.includes(normalize(project.title))
      const score =
        (titleMatch ? 10 : 0) +
        scoreText(words, `${project.title} ${project.categories.join(' ')} ${project.technologies.join(' ')}`) * 2 +
        scoreText(words, project.description)

      return { project, score }
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)

  const selectedProjects = genericProjectQuestion
    ? projects
    : rankedProjects.slice(0, 4).map(({ project }) => project)

  if (selectedProjects.length === 0) return ''

  return [
    'Relevant website project data (source: project catalog):',
    ...selectedProjects.map(({ title, description, status, categories, technologies }) =>
      [
        `Project: ${title}`,
        `Description: ${description}`,
        `Status: ${status}`,
        `Categories: ${categories.join(', ')}`,
        `Technologies: ${technologies.join(', ')}`,
      ].join('\n')
    ),
  ].join('\n\n')
}

const getLegalContext = (query, words, maxLength) => {
  const asksPrivacy =
    /\bprivacy\b|\breviews?\b|\bpersonal data\b|\bpersonal information\b|\bdata\b|\bcollected\b|\bcollection\b/i.test(
      query
    ) ||
    /ಗೌಪ್ಯತೆ|ಖಾಸಗಿ ಮಾಹಿತಿ|ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ/.test(query)
  const asksTerms =
    /\bterms?\b|\bconditions?\b|\brefund\w*\b|\bpayment\w*\b|\badvanc\w*\b|\bcancel\w*\b|\bpricing\b|\bdelivery\b|\bsupport\b/i.test(
      query
    ) ||
    /\bprices?\b|\bcosts?\b|\bcharges?\b|\bquote\b/i.test(query) ||
    /ಮರುಪಾವತಿ|ಪಾವತಿ|ಬೆಲೆ|ನಿಯಮ|ಷರತ್ತು/.test(query)
  const asksLegalOverview =
    /\bpolic(y|ies)\b|\blegal\b|\bterms and conditions\b/i.test(query) ||
    /ನೀತಿ|ಕಾನೂನು/.test(query)

  const selectedDocuments = Object.values(legalContent).filter((document) => {
    if (document.title === 'Privacy Policy') return asksPrivacy
    if (document.title === 'Terms & Conditions') return asksTerms || asksLegalOverview
    return false
  })

  if (asksLegalOverview && !asksPrivacy && !asksTerms) {
    selectedDocuments.push(legalContent.privacyPolicy)
  }

  const sections = selectedDocuments.flatMap((document) => {
    return document.sections.map((section, index) => {
      const sectionText = [
        section.title,
        ...(section.paragraphs || []),
        ...(section.bullets || []),
        ...(section.closingParagraphs || []),
      ].join(' ')

      return {
        document,
        section,
        index,
        score: scoreText(words, section.title) * 4 + scoreText(words, sectionText),
      }
    })
  })

  if (sections.length === 0) return ''

  const relevantSections = sections.filter(({ score }) => score > 0)
  const selectedSections = (relevantSections.length > 0 ? relevantSections : sections)
    .sort((left, right) => right.score - left.score || left.index - right.index)
  const legalHeader =
    'Relevant published legal content (quoted from the website policy sources; do not extend or infer beyond it):'
  let legalText = legalHeader
  if (legalText.length > maxLength) return ''
  const includedDocuments = new Set()

  for (const { document, section } of selectedSections) {
    const documentIntroduction = includedDocuments.has(document.title)
      ? ''
      : [document.title, ...(document.introduction || [])].join('\n')
    const sectionText = [
      `${document.title} — ${section.title}`,
      ...(section.paragraphs || []),
      ...(section.bullets || []).map((bullet) => `- ${bullet}`),
      ...(section.closingParagraphs || []),
    ].join('\n')
    const addition = [documentIntroduction, sectionText].filter(Boolean).join('\n\n')

    if (legalText.length + 2 + addition.length > maxLength) continue

    legalText += `\n\n${addition}`
    includedDocuments.add(document.title)
  }

  return legalText === legalHeader ? '' : legalText
}

export function buildTechieContext(query = '', history = []) {
  const previousContext = Array.isArray(history)
    ? history
        .filter(
          (item) =>
            item &&
            ['user', 'model'].includes(item.role) &&
            typeof item.text === 'string'
        )
        .slice(-4)
        .map((item) => item.text)
        .join(' ')
    : ''
  const contextualQuery = `${previousContext} ${query}`.trim()
  const words = getQueryWords(contextualQuery)
  const parts = [BUSINESS_CONTEXT]
  const projectContext = getProjectContext(contextualQuery, words)
  if (projectContext) parts.push(projectContext)

  let context = ''
  for (const part of parts) {
    const separator = context ? '\n\n' : ''
    if (context.length + separator.length + part.length > MAX_CONTEXT_LENGTH) continue
    context += `${separator}${part}`
  }

  const legalContext = getLegalContext(
    contextualQuery,
    words,
    MAX_CONTEXT_LENGTH - context.length - 2
  )
  if (legalContext && context.length + 2 + legalContext.length <= MAX_CONTEXT_LENGTH) {
    context += `\n\n${legalContext}`
  }

  return context
}
