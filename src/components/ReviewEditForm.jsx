import React, { useEffect, useRef, useState } from 'react'
import projects from '../data/projects'
import { MAX_REVIEW_PHOTOS } from '../lib/reviewPhotos'
import { getReviewPhotoError } from '../lib/reviewManagement'

const inputClasses =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm transition duration-200 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-cyan-500/20'

function getInitialForm(review) {
  return {
    customerName: review.customer_name ?? review.customerName ?? '',
    collegeName: review.college_name ?? review.collegeName ?? '',
    education: review.education ?? '',
    projectName: review.project_type ?? review.projectName ?? '',
    rating: Number(review.rating) || 0,
    reviewText: review.review_text ?? review.reviewText ?? '',
  }
}

export default function ReviewEditForm({
  review,
  photos = [],
  title = 'Edit Review',
  saveLabel = 'Save Changes',
  isSaving = false,
  onCancel,
  onSave,
}) {
  const [form, setForm] = useState(() => getInitialForm(review))
  const [photoItems, setPhotoItems] = useState(() =>
    photos.map((photo) => ({ ...photo, existing: true })),
  )
  const [errors, setErrors] = useState({})
  const [photoErrors, setPhotoErrors] = useState([])
  const photoInputRef = useRef(null)
  const photoItemsRef = useRef(photoItems)
  photoItemsRef.current = photoItems

  useEffect(() => () => {
    photoItemsRef.current.filter((photo) => !photo.existing).forEach(({ url }) => URL.revokeObjectURL(url))
  }, [])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const addPhotos = (fileList) => {
    const acceptedPhotos = []
    const nextErrors = []
    Array.from(fileList ?? []).forEach((file) => {
      const error = getReviewPhotoError(file)
      if (error) {
        nextErrors.push(`${file.name}: ${error}`)
        return
      }
      if (photoItems.length + acceptedPhotos.length >= MAX_REVIEW_PHOTOS) {
        nextErrors.push(`You can select no more than ${MAX_REVIEW_PHOTOS} photos per review.`)
        return
      }
      acceptedPhotos.push({
        id: `${file.name}:${file.size}:${file.lastModified}:${crypto.randomUUID()}`,
        file,
        url: URL.createObjectURL(file),
        existing: false,
      })
    })
    setPhotoItems((current) => [...current, ...acceptedPhotos])
    setPhotoErrors(nextErrors)
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const removePhoto = (photoId) => {
    const removed = photoItems.find(({ id, path }) => (id ?? path) === photoId)
    if (removed && !removed.existing) URL.revokeObjectURL(removed.url)
    setPhotoItems((current) => current.filter(({ id, path }) => (id ?? path) !== photoId))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.customerName.trim()) nextErrors.customerName = 'Please enter the customer name.'
    if (!form.collegeName.trim()) nextErrors.collegeName = 'Please enter the college name.'
    if (!['Engineering', 'Diploma'].includes(form.education)) nextErrors.education = 'Please select an education.'
    if (!form.projectName) nextErrors.projectName = 'Please select a project.'
    if (!form.rating || form.rating < 1 || form.rating > 5) nextErrors.rating = 'Please select a rating from 1 to 5.'
    if (form.reviewText.trim().length < 10 || form.reviewText.trim().length > 1000) {
      nextErrors.reviewText = 'Review text must be between 10 and 1000 characters.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave({
      form: { ...form, customerName: form.customerName.trim(), collegeName: form.collegeName.trim(), reviewText: form.reviewText.trim() },
      keepPhotoPaths: photoItems.filter((photo) => photo.existing).map(({ path }) => path),
      newPhotos: photoItems.filter((photo) => !photo.existing).map(({ file }) => file),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <header>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Update review details and manage its photos.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Customer Name
          <input
            required
            maxLength={120}
            value={form.customerName}
            onChange={(event) => updateField('customerName', event.target.value)}
            className={inputClasses}
            aria-invalid={Boolean(errors.customerName)}
          />
          {errors.customerName && <span className="mt-1 block text-sm text-red-600 dark:text-red-400">{errors.customerName}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          College Name
          <input
            required
            maxLength={120}
            value={form.collegeName}
            onChange={(event) => updateField('collegeName', event.target.value)}
            className={inputClasses}
          />
          {errors.collegeName && <span className="mt-1 block text-sm text-red-600 dark:text-red-400">{errors.collegeName}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Education
          <select
            required
            value={form.education}
            onChange={(event) => updateField('education', event.target.value)}
            className={inputClasses}
          >
            <option value="" disabled>Select your education</option>
            <option value="Engineering">Engineering</option>
            <option value="Diploma">Diploma</option>
          </select>
          {errors.education && <span className="mt-1 block text-sm text-red-600 dark:text-red-400">{errors.education}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Project Name
          <select
            required
            value={form.projectName}
            onChange={(event) => updateField('projectName', event.target.value)}
            className={inputClasses}
          >
            <option value="" disabled>Select your project</option>
            {projects.map(({ id, title: projectTitle }) => (
              <option key={id} value={projectTitle}>{projectTitle}</option>
            ))}
          </select>
          {errors.projectName && <span className="mt-1 block text-sm text-red-600 dark:text-red-400">{errors.projectName}</span>}
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">Star Rating</legend>
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => updateField('rating', rating)}
              className="rounded-md p-1 text-3xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
              aria-pressed={form.rating === rating}
            >
              <span className={rating <= form.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}>
                {rating <= form.rating ? '★' : '☆'}
              </span>
            </button>
          ))}
          {errors.rating && <span className="ml-2 text-sm text-red-600 dark:text-red-400">{errors.rating}</span>}
        </div>
      </fieldset>

      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        Review Text
        <textarea
          required
          minLength={10}
          maxLength={1000}
          rows={5}
          value={form.reviewText}
          onChange={(event) => updateField('reviewText', event.target.value)}
          className={`${inputClasses} min-h-[130px] resize-y`}
        />
        <span className="mt-1 block text-right text-xs text-slate-500 dark:text-slate-400">
          {form.reviewText.length}/1000 characters
        </span>
        {errors.reviewText && <span className="mt-1 block text-sm text-red-600 dark:text-red-400">{errors.reviewText}</span>}
      </label>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Customer Photos</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">JPG, PNG or WEBP · Up to 5 MB each</p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{photoItems.length}/{MAX_REVIEW_PHOTOS} photos</span>
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          disabled={isSaving || photoItems.length >= MAX_REVIEW_PHOTOS}
          onChange={(event) => addPhotos(event.target.files)}
          className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-100 file:px-3 file:py-2 file:font-semibold file:text-cyan-900 dark:text-slate-300 dark:file:bg-cyan-400/10 dark:file:text-cyan-200"
          aria-label="Add review photos"
        />
        {photoItems.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photoItems.map((photo, index) => (
              <figure key={photo.id ?? photo.path} className="relative min-w-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <img
                  src={photo.url}
                  alt={`Review photo ${index + 1}`}
                  className="aspect-[4/3] w-full object-cover"
                />
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => removePhoto(photo.id ?? photo.path)}
                  className="absolute right-2 top-2 rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-50"
                  aria-label={`Remove review photo ${index + 1}`}
                >
                  Remove
                </button>
              </figure>
            ))}
          </div>
        )}
        {photoErrors.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {photoErrors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        )}
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : saveLabel}
        </button>
      </div>
    </form>
  )
}
