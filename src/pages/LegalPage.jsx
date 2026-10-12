import React from 'react'
import PageHeader from '../components/PageHeader'
import { legalContent } from '../data/legalContent'

export default function LegalPage({ page }) {
  const content = legalContent[page]

  return (
    <div>
      <PageHeader title={content.title} />
      <section className="container pb-12 md:pb-16" aria-label={content.title}>
        <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200/80 bg-white/80 px-5 py-7 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-black/20 sm:px-8 md:px-10 md:py-10">
          <p className="mb-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-800 dark:text-slate-100">Last updated: </span>
            <time dateTime="2026-10-12">12 October 2026</time>
          </p>

          {content.introduction && (
            <div className="mb-8 space-y-4 text-base leading-7 text-slate-700 dark:text-slate-200">
              {content.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}

          <div className="space-y-8">
            {content.sections.map((section, index) => (
              <section key={section.title} aria-labelledby={`legal-section-${index + 1}`}>
                <h2
                  id={`legal-section-${index + 1}`}
                  className="mb-3 text-xl font-semibold leading-7 text-slate-900 dark:text-white sm:text-2xl"
                >
                  {index + 1}. {section.title}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mb-3 whitespace-pre-line break-words text-base leading-7 text-slate-700 last:mb-0 dark:text-slate-200"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="my-3 list-disc space-y-2 pl-6 text-base leading-7 text-slate-700 marker:text-cyan-700 dark:text-slate-200 dark:marker:text-cyan-300">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {section.closingParagraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mb-3 whitespace-pre-line break-words text-base leading-7 text-slate-700 last:mb-0 dark:text-slate-200"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
