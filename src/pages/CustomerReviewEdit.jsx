import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ReviewEditForm from '../components/ReviewEditForm'
import { cancelReviewPhotoUploads, manageReview, uploadReviewPhotos } from '../lib/reviewManagement'

function getEditToken() {
  return window.location.hash.slice(1)
}

export default function CustomerReviewEdit() {
  const navigate = useNavigate()
  const [editToken] = useState(getEditToken)
  const [review, setReview] = useState(null)
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [editorVersion, setEditorVersion] = useState(0)
  const isMounted = useRef(true)

  const loadReview = useCallback(async () => {
    if (!editToken) {
      setMessage({ type: 'error', text: 'This edit link is missing its private access token.' })
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await manageReview('customer-load', { editToken })
      if (isMounted.current) {
        setReview(data.review)
        setPhotos(data.photos)
        setMessage(null)
      }
    } catch (error) {
      console.error('Unable to load the customer review for editing:', error)
      if (isMounted.current) {
        setMessage({ type: 'error', text: error.message || 'This edit link is invalid or expired.' })
      }
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }, [editToken])

  useEffect(() => {
    isMounted.current = true
    loadReview()
    return () => { isMounted.current = false }
  }, [loadReview])

  const saveReview = async ({ form, keepPhotoPaths, newPhotos }) => {
    setIsSaving(true)
    setMessage(null)
    let uploadedPaths = []
    try {
      const uploadResult = await uploadReviewPhotos({
        role: 'customer',
        editToken,
        files: newPhotos,
        keepPhotoPaths,
        failFast: true,
      })
      uploadedPaths = uploadResult.uploadedPaths
      const result = await manageReview('customer-save', {
        editToken,
        ...form,
        keepPhotoPaths,
        newPhotoPaths: uploadedPaths,
      })
      setReview(result.review)
      let photoRefreshFailed = false
      if (result.photoCleanupWarning) {
        setMessage({ type: 'warning', text: 'Your review was saved, but removed photo cleanup could not be completed.' })
      }
      try {
        const latestReview = await manageReview('customer-load', { editToken })
        setReview(latestReview.review)
        setPhotos(latestReview.photos)
      } catch (photoLoadError) {
        console.error('Unable to reload customer review photos after saving:', photoLoadError)
        setPhotos([])
        photoRefreshFailed = true
        setMessage({ type: 'warning', text: 'Your review was saved, but its photos could not be refreshed. Reload this page to try again.' })
      }
      setEditorVersion((current) => current + 1)
      if (!result.photoCleanupWarning && !photoRefreshFailed) {
        setMessage({
          type: 'success',
          text: result.review.status === 'pending' && review.status === 'approved'
            ? 'Your changes were saved and submitted for approval.'
            : 'Your review changes were saved.',
        })
      }
    } catch (error) {
      console.error('Unable to save customer review changes:', error)
      if (uploadedPaths.length > 0) {
        try {
          await cancelReviewPhotoUploads({ role: 'customer', editToken, objectPaths: uploadedPaths })
        } catch (cleanupError) {
          console.error('Unable to clean up unlinked customer review photos:', cleanupError)
        }
      }
      setMessage({ type: 'error', text: error.message || 'Unable to save your review. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-cyan-50 px-4 py-10 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/20 sm:px-6">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900/80 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
          Tech in Air · Customer Review
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Edit Your Review
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          This private link grants access only to the review it was created for. Keep it safe and do not share it.
        </p>
        {review && (
          <p className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold capitalize text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
            Current status: {review.status}
          </p>
        )}

        {message && (
          <div
            role={message.type === 'error' ? 'alert' : 'status'}
            className={`mt-5 flex gap-2 rounded-xl px-4 py-3 text-sm ${
              message.type === 'error'
                ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                : message.type === 'warning'
                  ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
            }`}
          >
            {message.type === 'error'
              ? <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              : <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />}
            <span>{message.text}</span>
          </div>
        )}

        {isLoading ? (
          <p className="py-10 text-center text-sm text-slate-600 dark:text-slate-300">Loading your review...</p>
        ) : review ? (
          <div className="mt-6">
            <ReviewEditForm
              key={editorVersion}
              review={review}
              photos={photos}
              isSaving={isSaving}
              onCancel={() => navigate('/')}
              onSave={saveReview}
            />
          </div>
        ) : null}
      </section>
    </main>
  )
}
