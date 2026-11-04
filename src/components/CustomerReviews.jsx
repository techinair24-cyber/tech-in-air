import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus, UploadCloud, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import projects from '../data/projects'
import { supabase } from '../lib/supabase'
import {
  MAX_REVIEW_PHOTOS,
  MAX_REVIEW_PHOTO_SIZE,
  REVIEW_PHOTO_BUCKET,
  REVIEW_PHOTO_MIME_TYPES,
} from '../lib/reviewPhotos'

const initialForm = {
  customerName: '',
  collegeName: '',
  education: '',
  projectName: '',
  rating: 0,
  review: '',
}

const inputClasses =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm transition duration-200 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-cyan-500/20'

export default function CustomerReviews() {
  const [form, setForm] = useState(initialForm)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [photoErrors, setPhotoErrors] = useState([])
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const photoInputRef = useRef(null)
  const photosRef = useRef(selectedPhotos)
  photosRef.current = selectedPhotos

  useEffect(() => () => {
    photosRef.current.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl))
  }, [])

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
    setMessage(null)
  }

  const addPhotos = (fileList) => {
    const files = Array.from(fileList ?? [])
    const errors = []
    const acceptedPhotos = []
    const existingSignatures = new Set(
      selectedPhotos.map(({ file }) => `${file.name}:${file.size}:${file.lastModified}`),
    )

    files.forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase()
      const mimeType = REVIEW_PHOTO_MIME_TYPES[extension]

      if (!mimeType || (file.type && file.type !== mimeType)) {
        errors.push(`${file.name}: Use a JPG, JPEG, PNG or WEBP image.`)
        return
      }

      if (file.size > MAX_REVIEW_PHOTO_SIZE) {
        errors.push(`${file.name}: Each photo must be 5 MB or smaller.`)
        return
      }

      const signature = `${file.name}:${file.size}:${file.lastModified}`
      if (existingSignatures.has(signature)) {
        errors.push(`${file.name}: This photo has already been selected.`)
        return
      }

      if (selectedPhotos.length + acceptedPhotos.length >= MAX_REVIEW_PHOTOS) {
        errors.push(`You can select no more than ${MAX_REVIEW_PHOTOS} photos per review.`)
        return
      }

      existingSignatures.add(signature)
      acceptedPhotos.push({
        id: signature,
        file,
        mimeType,
        previewUrl: URL.createObjectURL(file),
      })
    })

    setSelectedPhotos((currentPhotos) => [...currentPhotos, ...acceptedPhotos])
    setPhotoErrors(errors)
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const removePhoto = (photoId) => {
    const photo = selectedPhotos.find(({ id }) => id === photoId)
    if (photo) URL.revokeObjectURL(photo.previewUrl)
    setSelectedPhotos((currentPhotos) => currentPhotos.filter(({ id }) => id !== photoId))
  }

  const clearSelectedPhotos = () => {
    selectedPhotos.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl))
    setSelectedPhotos([])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const reviewText = form.review.trim()
    const errors = {}

    if (!form.customerName.trim()) errors.customerName = 'Please enter your name.'
    if (!form.collegeName.trim()) errors.collegeName = 'Please enter your college name.'
    if (!['Engineering', 'Diploma'].includes(form.education)) errors.education = 'Please select your education.'
    if (!form.projectName) errors.projectName = 'Please select your project.'
    if (form.rating < 1 || form.rating > 5) errors.rating = 'Please select a rating from 1 to 5 stars.'
    if (reviewText.length < 10) errors.review = 'Your review must be at least 10 characters.'
    else if (reviewText.length > 1000) errors.review = 'Your review must be no more than 1000 characters.'

    setFieldErrors(errors)
    setMessage(null)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    setUploadProgress(null)
    let reviewSaved = false
    try {
      const { data: reviewId, error } = await supabase.rpc('create_customer_review', {
        p_customer_name: form.customerName.trim(),
        p_college_name: form.collegeName.trim(),
        p_education: form.education,
        p_project_type: form.projectName,
        p_rating: form.rating,
        p_review_text: reviewText,
      })

      if (error) throw error
      if (!reviewId) throw new Error('The review submission did not return a review ID.')
      reviewSaved = true

      const uploadedPaths = []
      let failedPhotoCount = 0

      if (selectedPhotos.length > 0) {
        setUploadProgress({ completed: 0, total: selectedPhotos.length })

        for (const [index, photo] of selectedPhotos.entries()) {
          const extension = photo.file.name.split('.').pop().toLowerCase()
          const objectPath = `${reviewId}/${crypto.randomUUID()}.${extension}`
          const { error: reservationError } = await supabase.rpc('reserve_review_photo_upload', {
            p_review_id: reviewId,
            p_object_path: objectPath,
          })

          if (reservationError) {
            console.error('Unable to reserve a customer review photo:', reservationError)
            failedPhotoCount += 1
            setUploadProgress({ completed: index + 1, total: selectedPhotos.length })
            continue
          }

          const { error: uploadError } = await supabase.storage
            .from(REVIEW_PHOTO_BUCKET)
            .upload(objectPath, photo.file, {
              cacheControl: '3600',
              contentType: photo.mimeType,
              upsert: false,
            })

          if (uploadError) {
            console.error('Unable to upload a customer review photo:', uploadError)
            failedPhotoCount += 1
            const { error: releaseError } = await supabase.rpc('release_review_photo_upload', {
              p_review_id: reviewId,
              p_object_path: objectPath,
            })
            if (releaseError) {
              console.error('Unable to release a failed customer review photo upload:', releaseError)
            }
          } else {
            uploadedPaths.push(objectPath)
          }

          setUploadProgress({ completed: index + 1, total: selectedPhotos.length })
        }

        if (uploadedPaths.length > 0) {
          const { error: attachError } = await supabase.rpc('attach_review_photos', {
            p_review_id: reviewId,
            p_photo_paths: uploadedPaths,
          })
          if (attachError) throw attachError
        }
      }

      setForm(initialForm)
      setFieldErrors({})
      clearSelectedPhotos()
      setPhotoErrors([])
      setMessage(failedPhotoCount > 0
        ? {
            type: 'warning',
            text: `Your review was submitted for approval, but ${failedPhotoCount} ${failedPhotoCount === 1 ? 'photo could' : 'photos could'} not be uploaded.`,
          }
        : {
            type: 'success',
            text: 'Thank you for your review! It has been submitted for approval.',
          })
    } catch (error) {
      console.error('Unable to submit customer review:', error)
      setMessage({
        type: 'error',
        text: reviewSaved
          ? 'Your review was submitted for approval, but we could not link its photos. Please contact us if you need help.'
          : 'Unable to submit your review. Please try again.',
      })
      if (reviewSaved) {
        setForm(initialForm)
        setFieldErrors({})
        clearSelectedPhotos()
        setPhotoErrors([])
      }
    } finally {
      setIsSubmitting(false)
      setUploadProgress(null)
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
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Approved reviews may be displayed publicly with your name, project name, rating, review text and any photos you choose to share. See our{' '}
                <Link to="/privacy-policy" className="font-medium text-cyan-800 underline underline-offset-2 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">
                  Privacy Policy
                </Link>.
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
                  College Name
                  <input
                    required
                    maxLength={120}
                    value={form.collegeName}
                    onChange={(event) => updateField('collegeName', event.target.value)}
                    className={inputClasses}
                    aria-invalid={Boolean(fieldErrors.collegeName)}
                    aria-describedby={fieldErrors.collegeName ? 'college-name-error' : undefined}
                    placeholder="Enter your college name"
                  />
                  {fieldErrors.collegeName && (
                    <span id="college-name-error" className="mt-1 block text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.collegeName}
                    </span>
                  )}
                </label>

                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Education
                  <select
                    required
                    value={form.education}
                    onChange={(event) => updateField('education', event.target.value)}
                    className={`${inputClasses} text-base`}
                    aria-invalid={Boolean(fieldErrors.education)}
                    aria-describedby={fieldErrors.education ? 'education-error' : undefined}
                  >
                    <option value="" disabled className="bg-white text-base text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                      Select your education
                    </option>
                    {['Engineering', 'Diploma'].map((education) => (
                      <option
                        key={education}
                        value={education}
                        className="bg-white text-base text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                      >
                        {education}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.education && (
                    <span id="education-error" className="mt-1 block text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.education}
                    </span>
                  )}
                </label>

                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Project Name
                  <select
                    required
                    value={form.projectName}
                    onChange={(event) => updateField('projectName', event.target.value)}
                    className={`${inputClasses} text-base`}
                    aria-invalid={Boolean(fieldErrors.projectName)}
                    aria-describedby={fieldErrors.projectName ? 'project-name-error' : undefined}
                  >
                    <option value="" disabled className="bg-white text-base text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                      Select your project
                    </option>
                    {projects.map(({ id, title }) => (
                      <option
                        key={id}
                        value={title}
                        className="bg-white text-base text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                      >
                        {title}
                      </option>
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

                <section aria-labelledby="review-photos-heading">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <h4 id="review-photos-heading" className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Add Photos (Optional)
                      </h4>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Share photos of your project or experience with Tech in Air.
                      </p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {selectedPhotos.length}/{MAX_REVIEW_PHOTOS} photos
                    </span>
                  </div>

                  <div
                    onDragEnter={(event) => {
                      event.preventDefault()
                      if (!isSubmitting) setIsDraggingPhotos(true)
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) setIsDraggingPhotos(false)
                    }}
                    onDrop={(event) => {
                      event.preventDefault()
                      setIsDraggingPhotos(false)
                      if (!isSubmitting) addPhotos(event.dataTransfer.files)
                    }}
                    className={`mt-3 rounded-2xl border-2 border-dashed p-5 text-center transition-colors sm:p-7 ${
                      isDraggingPhotos
                        ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-400/10'
                        : 'border-slate-300 bg-slate-50/70 hover:border-cyan-400 dark:border-slate-700 dark:bg-slate-950/30 dark:hover:border-cyan-500'
                    }`}
                  >
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      multiple
                      disabled={isSubmitting || selectedPhotos.length >= MAX_REVIEW_PHOTOS}
                      onChange={(event) => addPhotos(event.target.files)}
                      className="sr-only"
                      aria-label="Choose review photos"
                    />
                    <UploadCloud className="mx-auto h-8 w-8 text-cyan-600 dark:text-cyan-300" aria-hidden="true" />
                    <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                      Drag and drop photos here
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      JPG, JPEG, PNG or WEBP · Up to 5 MB each
                    </p>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={isSubmitting || selectedPhotos.length >= MAX_REVIEW_PHOTOS}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-white px-4 py-2 text-sm font-semibold text-cyan-800 shadow-sm transition hover:border-cyan-500 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-cyan-200 dark:hover:bg-cyan-950/40"
                    >
                      <ImagePlus size={17} aria-hidden="true" />
                      Choose Photos
                    </button>
                  </div>

                  {selectedPhotos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {selectedPhotos.map(({ id, file, previewUrl }, index) => (
                        <figure key={id} className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                          <img
                            src={previewUrl}
                            alt={`Selected review photo ${index + 1}: ${file.name}`}
                            className="aspect-[4/3] w-full object-cover"
                          />
                          <figcaption className="truncate px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300">
                            {file.name}
                          </figcaption>
                          <button
                            type="button"
                            onClick={() => removePhoto(id)}
                            disabled={isSubmitting}
                            className="absolute right-2 top-2 rounded-full bg-slate-950/75 p-1.5 text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X size={15} />
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

                  {uploadProgress && (
                    <div className="mt-4" role="status" aria-live="polite">
                      <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                        <span>Uploading photos...</span>
                        <span>{uploadProgress.completed} of {uploadProgress.total}</span>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                        role="progressbar"
                        aria-label="Photo upload progress"
                        aria-valuemin={0}
                        aria-valuemax={uploadProgress.total}
                        aria-valuenow={uploadProgress.completed}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                          style={{ width: `${(uploadProgress.completed / uploadProgress.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {message && (
                <p
                  role={message.type === 'error' ? 'alert' : 'status'}
                  className={`mt-5 rounded-xl px-4 py-3 text-sm ${
                    message.type === 'error'
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                      : message.type === 'warning'
                        ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
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
