import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const reviewStatuses = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
]

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300',
  approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300',
  rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-400/10 dark:text-rose-300',
}

function formatSubmittedDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [activeStatus, setActiveStatus] = useState('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [activeReviewId, setActiveReviewId] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const loadReviews = useCallback(async () => {
    setIsLoading(true)
    setFeedback(null)

    const { data, error } = await supabase
      .from('reviews')
      .select('id, customer_name, project_type, rating, review_text, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Unable to load customer reviews:', error)
      setFeedback({ type: 'error', text: `Unable to load reviews: ${error.message}` })
      setIsLoading(false)
      return
    }

    setReviews(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const visibleReviews = useMemo(
    () => reviews.filter((review) => review.status === activeStatus),
    [reviews, activeStatus],
  )

  const updateReviewStatus = async (review, nextStatus, actionLabel) => {
    setActiveReviewId(review.id)
    setFeedback(null)

    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ status: nextStatus })
        .eq('id', review.id)
        .select('id, status')
        .maybeSingle()

      if (error) throw error
      if (!data) {
        throw new Error('No review was updated. It may no longer exist or you may not have permission.')
      }

      setReviews((currentReviews) =>
        currentReviews.map((currentReview) =>
          currentReview.id === review.id
            ? { ...currentReview, status: data.status }
            : currentReview,
        ),
      )
      setFeedback({ type: 'success', text: `Review ${actionLabel.toLowerCase()} successfully.` })
    } catch (error) {
      console.error(`Unable to ${actionLabel.toLowerCase()} customer review:`, error)
      setFeedback({ type: 'error', text: `Unable to ${actionLabel.toLowerCase()} review: ${error.message}` })
    } finally {
      setActiveReviewId(null)
    }
  }

  const deleteReview = async (review) => {
    const confirmed = window.confirm(
      `Permanently delete the review from ${review.customer_name}? This cannot be undone.`,
    )
    if (!confirmed) return

    setActiveReviewId(review.id)
    setFeedback(null)

    try {
      const { data, error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', review.id)
        .select('id')
        .maybeSingle()

      if (error) throw error
      if (!data) {
        throw new Error('No review was deleted. It may no longer exist or you may not have permission.')
      }

      setReviews((currentReviews) => currentReviews.filter((currentReview) => currentReview.id !== review.id))
      setFeedback({ type: 'success', text: 'Review permanently deleted.' })
    } catch (error) {
      console.error('Unable to delete customer review:', error)
      setFeedback({ type: 'error', text: `Unable to delete review: ${error.message}` })
    } finally {
      setActiveReviewId(null)
    }
  }

  const renderActions = (review) => {
    const buttonClass =
      'rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'
    const isBusy = activeReviewId === review.id

    return (
      <div className="flex flex-wrap gap-2">
        {review.status === 'pending' && (
          <>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => updateReviewStatus(review, 'approved', 'Approve')}
              className={`${buttonClass} bg-emerald-600 text-white hover:bg-emerald-700`}
            >
              Approve
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => updateReviewStatus(review, 'rejected', 'Reject')}
              className={`${buttonClass} bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:hover:bg-amber-400/20`}
            >
              Reject
            </button>
          </>
        )}
        {review.status === 'approved' && (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => updateReviewStatus(review, 'rejected', 'Hide')}
            className={`${buttonClass} bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:hover:bg-amber-400/20`}
          >
            Hide
          </button>
        )}
        {review.status === 'rejected' && (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => updateReviewStatus(review, 'approved', 'Approve')}
            className={`${buttonClass} bg-emerald-600 text-white hover:bg-emerald-700`}
          >
            Approve
          </button>
        )}
        <button
          type="button"
          disabled={isBusy}
          onClick={() => deleteReview(review)}
          className={`${buttonClass} border border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10`}
        >
          {isBusy ? 'Working...' : 'Delete'}
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-cyan-50 px-4 py-8 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
              Tech in Air · Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Customer Reviews
            </h1>
          </div>
          <button
            type="button"
            onClick={loadReviews}
            disabled={isLoading || activeReviewId !== null}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </header>

        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800" role="tablist" aria-label="Review status">
          {reviewStatuses.map(({ id, label }) => {
            const count = reviews.filter((review) => review.status === id).length
            const isActive = activeStatus === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`reviews-tab-${id}`}
                aria-selected={isActive}
                aria-controls="reviews-panel"
                onClick={() => setActiveStatus(id)}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-cyan-500 text-cyan-800 dark:text-cyan-300'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {label}
                <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-cyan-100 dark:bg-cyan-400/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {feedback && (
          <p
            role={feedback.type === 'error' ? 'alert' : 'status'}
            className={`mb-5 rounded-xl px-4 py-3 text-sm ${
              feedback.type === 'error'
                ? 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300'
                : 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300'
            }`}
          >
            {feedback.text}
          </p>
        )}

        <section
          id="reviews-panel"
          role="tabpanel"
          aria-labelledby={`reviews-tab-${activeStatus}`}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-10 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
              Loading reviews...
            </div>
          ) : visibleReviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                No {activeStatus} reviews.
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Reviews with this status will appear here.
              </p>
            </div>
          ) : (
            visibleReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {review.customer_name}
                      </h2>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[review.status] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                        {review.status}
                      </span>
                    </div>
                    <p className="mt-1 break-words text-sm font-medium text-cyan-800 dark:text-cyan-300">
                      {review.project_type}
                    </p>
                    <p className="mt-3 text-lg tracking-wide text-amber-500" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                      {'★'.repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}
                      <span className="text-slate-300 dark:text-slate-600">
                        {'★'.repeat(Math.max(0, 5 - Math.min(5, Number(review.rating) || 0)))}
                      </span>
                      <span className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {review.rating}/5
                      </span>
                    </p>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-200">
                      {review.review_text}
                    </p>
                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                      Submitted {formatSubmittedDate(review.created_at)}
                    </p>
                  </div>
                  <div className="shrink-0 border-t border-slate-100 pt-4 dark:border-slate-800 lg:border-0 lg:pt-0">
                    {renderActions(review)}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  )
}
