import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ReviewPhotoGallery from './ReviewPhotoGallery'
import { createReviewPhotoUrls } from '../lib/reviewPhotos'

export default function ApprovedReviews({ limit }) {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadApprovedReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, customer_name, college_name, education, project_type, rating, review_text, photo_paths, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        if (!isActive) return
        console.error('Unable to load approved customer reviews:', error)
        setHasError(true)
      } else {
        const reviewsWithPhotos = await Promise.all(data.map(async (review) => {
          try {
            const photos = await createReviewPhotoUrls(review.photo_paths)
            return { ...review, photos }
          } catch (photoError) {
            console.error(`Unable to load photos for approved review ${review.id}:`, photoError)
            return { ...review, photos: [], photoError: true }
          }
        }))

        if (!isActive) return
        setReviews(typeof limit === 'number' ? reviewsWithPhotos.slice(0, limit) : reviewsWithPhotos)
      }
      setIsLoading(false)
    }

    loadApprovedReviews()

    return () => {
      isActive = false
    }
  }, [])

  if (isLoading || (!hasError && reviews.length === 0)) return null

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Customer Experiences</p>
              <h2 className="text-3xl font-semibold md:text-5xl">What Our Customers Say</h2>
            </div>
            {typeof limit === 'number' && (
              <Link to="/reviews" className="secondary-button w-fit">Read All Reviews</Link>
            )}
          </div>

          {hasError ? (
            <p className="text-center text-slate-500 dark:text-slate-400" role="status">
              Customer reviews are unavailable right now.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => {
                const rating = Math.max(1, Math.min(5, Number(review.rating) || 1))

                return (
                  <article
                    key={review.id}
                    className="flex h-full flex-col rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-6 transition-transform duration-200 hover:-translate-y-1"
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
                    <ReviewPhotoGallery photos={review.photos} label={`Photos from ${review.customer_name}'s review`} />
                    {review.photoError && (
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400" role="status">
                        Review photos are temporarily unavailable.
                      </p>
                    )}
                    <div className="mt-6 border-t border-[var(--border)] pt-4">
                      <p className="break-words font-semibold text-slate-900 dark:text-white">
                        {review.customer_name}
                      </p>
                      {review.college_name && (
                        <p className="mt-1 break-words text-sm text-cyan-800 dark:text-cyan-300">
                          {review.college_name}
                        </p>
                      )}
                      {review.education && (
                        <span className="mt-2 inline-flex max-w-full break-words rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-300">
                          {review.education}
                        </span>
                      )}
                      <p className="mt-1 break-words text-sm text-cyan-800 dark:text-cyan-300">
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
