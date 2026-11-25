
import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Quote,
  Star,
  GraduationCap,
  Briefcase,
} from 'lucide-react'

import { isSupabaseConfigured, supabase } from '../lib/supabase'
import ReviewPhotoGallery from './ReviewPhotoGallery'
import { createReviewPhotoUrls } from '../lib/reviewPhotos'

function getInitials(name) {
  if (typeof name !== 'string' || !name.trim()) {
    return '?'
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

function ReviewRating({ rating }) {
  const value = Math.max(
    1,
    Math.min(5, Math.round(Number(rating) || 1))
  )

  return (
    <div
      className="flex items-center gap-1.5"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={17}
          strokeWidth={1.6}
          fill={index < value ? '#F5B942' : 'none'}
          color={index < value ? '#F5B942' : 'var(--muted)'}
          aria-hidden="true"
        />
      ))}

      <span
        className="ml-2 text-sm font-semibold text-[var(--foreground)]"
        aria-hidden="true"
      >
        {value}.0
      </span>
    </div>
  )
}

export default function ApprovedReviews({
  limit,
  title = 'What Our Customers Say',
  variant,
}) {
  const isHomepage = variant === 'home'
  const isReviewsPage = variant === 'reviews'
  const reduceMotion = useReducedMotion()

  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const hasLimit =
    Number.isInteger(limit) && limit > 0

  useEffect(() => {
    let isActive = true

    const loadApprovedReviews = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        if (!isSupabaseConfigured) {
          throw new Error('Supabase is not configured')
        }

        let query = supabase
          .from('reviews')
          .select(
            'id, customer_name, college_name, education, project_type, rating, review_text, photo_paths, created_at'
          )
          .eq('status', 'approved')
          .order('created_at', { ascending: false })

        if (hasLimit) {
          query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        if (!isActive) return

        const reviewsWithPhotos = await Promise.all(
          (data || []).map(async (review) => {
            try {
              const photos = await createReviewPhotoUrls(
                review.photo_paths
              )

              return {
                ...review,
                photos,
              }
            } catch (photoError) {
              console.error(
                `Unable to load photos for review ${review.id}:`,
                photoError
              )

              return {
                ...review,
                photos: [],
                photoError: true,
              }
            }
          })
        )

        if (!isActive) return

        setReviews(reviewsWithPhotos)
      } catch (error) {
        if (!isActive) return

        console.error(
          'Unable to load approved customer reviews:',
          error
        )

        setHasError(true)
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadApprovedReviews()

    return () => {
      isActive = false
    }
  }, [limit, hasLimit, retryCount])

  const validRatings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) =>
      Number.isFinite(rating) &&
      rating >= 1 &&
      rating <= 5
    )

  const averageRating = validRatings.length
    ? validRatings.reduce((sum, rating) => sum + rating, 0)
      / validRatings.length
    : 0

  if (isLoading) {
    return isReviewsPage ? (
      <div className="container py-12 text-center text-[var(--muted)]">
        Loading customer reviews...
      </div>
    ) : null
  }

  if (!hasError && reviews.length === 0) {
    return isReviewsPage ? (
      <div className="container py-12 text-center text-[var(--muted)]">
        No approved customer reviews yet.
      </div>
    ) : null
  }

  return (
    <section
      className={
        isHomepage
          ? 'home-review-section relative isolate overflow-hidden'
          : 'relative isolate py-12 md:py-16'
      }
    >

      {/* Subtle ambient background */}
      {isHomepage && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 85% 15%, rgba(41,151,255,0.08), transparent 55%)',
          }}
        />
      )}

      <div className="container">

        {/* Section heading */}
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 18 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
          }}
          className={`mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${
            isHomepage ? 'home-review-heading' : ''
          }`}
        >
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[var(--accent)]"
              />

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Customer Experiences
              </p>
            </div>

            <h2 className="section-heading">
              {title}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
              Real experiences and feedback shared by
              our customers.
            </p>
          </div>

          {hasLimit && (
            <Link
              to="/reviews"
              className="secondary-button group w-fit gap-3"
            >
              Read All Reviews

              <ArrowUpRight
                size={17}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </motion.div>

        {isReviewsPage && !hasError && (
          <div className="reviews-rating-overview">
            <div className="reviews-rating-score">
              <strong>{averageRating.toFixed(1)}</strong>

              <div className="reviews-rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={22}
                    color="#F5B942"
                    fill={
                      star <= Math.round(averageRating)
                        ? '#F5B942'
                        : 'none'
                    }
                  />
                ))}
              </div>

              <span>Average customer rating</span>
            </div>

            <div className="reviews-rating-distribution">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = validRatings.filter(
                  (value) => value === rating
                ).length

                const percentage = validRatings.length
                  ? (count / validRatings.length) * 100
                  : 0

                return (
                  <div
                    key={rating}
                    className="reviews-rating-row"
                  >
                    <span>{rating} ★</span>

                    <div className="reviews-rating-track">
                      <div
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span>{count}</span>
                  </div>
                )
              })}
            </div>

            <div className="reviews-total-count">
              <strong>{reviews.length}</strong>
              <span>Approved customer reviews</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {hasError ? (
          <div
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-10 text-center"
            role="status"
          >
            <p className="text-[var(--muted)]">
              Customer reviews are temporarily unavailable.
            </p>

            <button
              type="button"
              className="secondary-button mt-5"
              onClick={() =>
                setRetryCount((previous) => previous + 1)
              }
            >
              Try Again
            </button>
          </div>
        ) : (
          <div
            className={`grid items-stretch gap-6 ${
              isReviewsPage
                ? 'reviews-customer-grid md:grid-cols-2'
                : 'md:grid-cols-2 lg:grid-cols-3'
            } ${isHomepage ? 'home-review-grid' : ''}`}
          >
            {reviews.map((review, index) => {
              const reviewText =
                typeof review.review_text === 'string'
                  ? review.review_text
                  : ''

              const customerName =
                review.customer_name || 'Customer'

              const hasLongReview =
                reviewText.length > 300

              return (
                <motion.article
                  key={review.id}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 20 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -4 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    delay: reduceMotion
                      ? 0
                      : Math.min(index % 3, 2) * 0.08,
                  }}
                  className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-300 hover:border-blue-500/40 md:p-7 ${
                    isHomepage ? 'home-review-card' : ''
                  }`}
                >

                  {/* Decorative illuminated edge */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-6 right-6 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, #2997ff, transparent)',
                    }}
                  />

                  {/* Rating and quotation icon */}
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <ReviewRating rating={review.rating} />

                    <Quote
                      size={34}
                      strokeWidth={1.2}
                      aria-hidden="true"
                      className="shrink-0 text-[var(--accent)] opacity-40"
                    />
                  </div>

                  {/* Customer review */}
                  <div className="flex-1">
                    {isHomepage && hasLongReview ? (
                      <details className="group/review">
                        <summary className="cursor-pointer list-none">
                          <span className="block whitespace-pre-wrap break-words text-sm leading-7 text-[var(--foreground)] group-open/review:hidden">
                            {reviewText.slice(0, 300)}...
                          </span>

                          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] group-open/review:hidden">
                            Read full review
                            <ArrowUpRight
                              size={13}
                              aria-hidden="true"
                            />
                          </span>

                          <span className="hidden text-xs font-semibold text-[var(--accent)] group-open/review:inline">
                            Show less
                          </span>
                        </summary>

                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[var(--foreground)]">
                          {reviewText}
                        </p>
                      </details>
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[var(--foreground)]">
                        {reviewText}
                      </p>
                    )}

                    {/* Genuine customer photographs */}
                    <div className="mt-5">
                      <ReviewPhotoGallery
                        photos={review.photos}
                        label={`Photos from ${customerName}'s review`}
                      />
                    </div>

                    {review.photoError && (
                      <p
                        className="mt-3 text-xs text-[var(--muted)]"
                        role="status"
                      >
                        Review photos are temporarily unavailable.
                      </p>
                    )}
                  </div>

                  {/* Customer information */}
                  <div className="mt-7 border-t border-[var(--border)] pt-5">
                    <div className="flex items-start gap-3">

                      {/* Initials avatar */}
                      <div
                        aria-hidden="true"
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-sm font-bold text-[var(--accent)]"
                      >
                        {getInitials(customerName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words font-semibold text-[var(--foreground)]">
                          {customerName}
                        </p>

                        {review.college_name && (
                          <p className="mt-1 break-words text-xs leading-5 text-[var(--muted)]">
                            {review.college_name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Education and project details */}
                    {(review.education ||
                      review.project_type) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {review.education && (
                          <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--muted)]">
                            <GraduationCap
                              size={14}
                              aria-hidden="true"
                              className="shrink-0 text-[var(--accent)]"
                            />

                            <span className="min-w-0 break-words">
                              {review.education}
                            </span>
                          </span>
                        )}

                        {review.project_type && (
                          <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--muted)]">
                            <Briefcase
                              size={13}
                              aria-hidden="true"
                              className="shrink-0 text-[var(--accent)]"
                            />

                            <span className="min-w-0 break-words">
                              {review.project_type}
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
