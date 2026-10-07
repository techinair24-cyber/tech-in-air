import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function ApprovedReviews() {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadApprovedReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, customer_name, project_type, rating, review_text, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!isActive) return

      if (error) {
        console.error('Unable to load approved customer reviews:', error)
        setHasError(true)
      } else {
        setReviews(data)
      }
      setIsLoading(false)
    }

    loadApprovedReviews()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              WHAT OUR CUSTOMERS SAY
            </h2>
          </div>

          {isLoading ? (
            <p className="text-center text-slate-500 dark:text-slate-400" role="status">
              Loading customer reviews...
            </p>
          ) : hasError ? (
            <p className="text-center text-slate-500 dark:text-slate-400" role="status">
              Customer reviews are unavailable right now.
            </p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400">
              Customer reviews will appear here after approval.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => {
                const rating = Math.max(1, Math.min(5, Number(review.rating) || 1))

                return (
                  <article
                    key={review.id}
                    className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-slate-950/40"
                  >
                    <div
                      className="text-lg tracking-wider text-amber-500"
                      role="img"
                      aria-label={`${rating} out of 5 stars`}
                    >
                      {'★'.repeat(rating)}
                      <span className="text-slate-300 dark:text-slate-600">
                        {'☆'.repeat(5 - rating)}
                      </span>
                    </div>
                    <p className="mt-4 flex-1 whitespace-pre-wrap break-words leading-7 text-slate-700 dark:text-slate-200">
                      {review.review_text}
                    </p>
                    <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {review.customer_name}
                      </p>
                      <p className="mt-1 text-sm text-cyan-800 dark:text-cyan-300">
                        {review.project_type}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
