import React, { useState } from 'react'
import { motion } from 'framer-motion'
import projects from '../data/projects'
import { supabase } from '../lib/supabase'

const initialForm = {
  customerName: '',
  projectName: '',
  rating: 0,
  review: '',
}

const inputClasses =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm transition duration-200 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-cyan-500/20'

export default function CustomerReviews() {
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
    setMessage(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const reviewText = form.review.trim()
    const errors = {}

    if (!form.customerName.trim()) errors.customerName = 'Please enter your name.'
    if (!form.projectName) errors.projectName = 'Please select your project.'
    if (form.rating < 1 || form.rating > 5) errors.rating = 'Please select a rating from 1 to 5 stars.'
    if (reviewText.length < 10) errors.review = 'Your review must be at least 10 characters.'
    else if (reviewText.length > 1000) errors.review = 'Your review must be no more than 1000 characters.'

    setFieldErrors(errors)
    setMessage(null)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('reviews').insert({
        customer_name: form.customerName.trim(),
        project_type: form.projectName,
        rating: form.rating,
        review_text: reviewText,
        status: 'pending',
      })

      if (error) {
        console.error('Unable to submit customer review:', error)
        setMessage({
          type: 'error',
          text: 'Unable to submit your review. Please try again.',
        })
        return
      }

      setForm(initialForm)
      setFieldErrors({})
      setMessage({
        type: 'success',
        text: 'Thank you for your review! It has been submitted for approval.',
      })
    } catch (error) {
      console.error('Unable to submit customer review:', error)
      setMessage({
        type: 'error',
        text: 'Unable to submit your review. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="customer-reviews" className="py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              WHAT OUR CUSTOMERS SAY
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Share your experience with Tech in Air.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-black/20 md:p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Write a Review</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Your review will be shared only after it has been approved.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Customer Name
                  <input
                    required
                    maxLength={120}
                    autoComplete="name"
                    value={form.customerName}
                    onChange={(event) => updateField('customerName', event.target.value)}
                    className={inputClasses}
                    aria-invalid={Boolean(fieldErrors.customerName)}
                    aria-describedby={fieldErrors.customerName ? 'customer-name-error' : undefined}
                    placeholder="Your name"
                  />
                  {fieldErrors.customerName && (
                    <span id="customer-name-error" className="mt-1 block text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.customerName}
                    </span>
                  )}
                </label>

                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Project Name
                  <select
                    required
                    value={form.projectName}
                    onChange={(event) => updateField('projectName', event.target.value)}
                    className={inputClasses}
                    aria-invalid={Boolean(fieldErrors.projectName)}
                    aria-describedby={fieldErrors.projectName ? 'project-name-error' : undefined}
                  >
                    <option value="" disabled>Select your project</option>
                    {projects.map(({ id, title }) => (
                      <option key={id} value={title}>{title}</option>
                    ))}
                  </select>
                  {fieldErrors.projectName && (
                    <span id="project-name-error" className="mt-1 block text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.projectName}
                    </span>
                  )}
                </label>

                <fieldset
                  aria-describedby={fieldErrors.rating ? 'rating-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.rating)}
                >
                  <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Rating <span className="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
                  </legend>
                  <div className="mt-2 flex items-center gap-1" role="group" aria-label="Rating, 1 to 5 stars">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => updateField('rating', rating)}
                        className="rounded-md p-1 text-3xl leading-none transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                        aria-pressed={form.rating === rating}
                      >
                        <span className={rating <= form.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}>
                          {rating <= form.rating ? '★' : '☆'}
                        </span>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">
                      {form.rating ? `${form.rating} of 5` : 'Choose a rating'}
                    </span>
                  </div>
                  {fieldErrors.rating && (
                    <span id="rating-error" className="mt-1 block text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.rating}
                    </span>
                  )}
                </fieldset>

                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Review
                  <textarea
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={5}
                    value={form.review}
                    onChange={(event) => updateField('review', event.target.value)}
                    className={`${inputClasses} min-h-[140px] resize-y`}
                    aria-invalid={Boolean(fieldErrors.review)}
                    aria-describedby={fieldErrors.review ? 'review-error review-count' : 'review-count'}
                    placeholder="Tell us about your experience with Tech in Air."
                  />
                  <span id="review-count" className="mt-1 block text-right text-xs text-slate-500 dark:text-slate-400">
                    {form.review.length}/1000 characters
                  </span>
                  {fieldErrors.review && (
                    <span id="review-error" className="mt-1 block text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.review}
                    </span>
                  )}
                </label>
              </div>

              {message && (
                <p
                  role={message.type === 'error' ? 'alert' : 'status'}
                  className={`mt-5 rounded-xl px-4 py-3 text-sm ${
                    message.type === 'error'
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  }`}
                >
                  {message.text}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
