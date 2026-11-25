import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="container py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">404</p>
      <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-[var(--muted)]">This page does not exist or is no longer available.</p>
      <Link to="/" className="primary-button mt-6 inline-flex">Return to home</Link>
    </section>
  )
}
