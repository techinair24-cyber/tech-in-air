import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(location.state?.message ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error || !data.user) {
        setErrorMessage('Invalid email or password. Please try again.')
        return
      }

      if (data.user.app_metadata?.role !== 'admin') {
        const { error: signOutError } = await supabase.auth.signOut()
        if (signOutError) {
          console.error('Unable to sign out unauthorized user:', signOutError)
        }
        setErrorMessage('You are not authorized to access the admin area.')
        return
      }

      navigate('/admin/reviews', { replace: true })
    } catch (error) {
      console.error('Unable to sign in to the admin area:', error)
      setErrorMessage('Unable to sign in right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearError = () => {
    if (errorMessage) setErrorMessage('')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-cyan-50 px-4 py-12 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/30">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-300/40 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-black/30 sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-xl font-bold text-slate-950 shadow-md shadow-cyan-500/20">
            TA
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
            Tech in Air
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Sign in with your administrator account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearError()
              }}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-cyan-500/20"
              placeholder="admin@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                clearError()
              }}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-cyan-500/20"
              placeholder="Enter your password"
            />
          </label>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-950 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  )
}
