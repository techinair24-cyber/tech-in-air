import React from 'react'
import ApprovedReviews from '../components/ApprovedReviews'
import CustomerReviews from '../components/CustomerReviews'

export default function ReviewsPage() {
  return (
    <div>
      <header className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="container">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Customer Experiences</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl">Real experiences from people who have worked with Tech In Air.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Read approved feedback and share your own experience after working with us.
          </p>
        </div>
      </header>

      <ApprovedReviews />

      <section className="border-t border-[var(--border)] py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Write a Review</p>
            <h2 className="text-3xl font-semibold md:text-5xl">Share your experience</h2>
          </div>
          <CustomerReviews />
        </div>
      </section>
    </div>
  )
}
