import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus, UploadCloud, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import projects from '../data/projects'
import {
  MAX_REVIEW_PHOTOS,
  MAX_REVIEW_PHOTO_SIZE,
  REVIEW_PHOTO_MIME_TYPES,
} from '../lib/reviewPhotos'
import { cancelReviewPhotoUploads, manageReview, uploadReviewPhotos } from '../lib/reviewManagement'

const initialForm = {
  customerName: '',
  customerType: '',
  collegeName: '',
  education: '',
  projectName: '',
  companyName: '',
  serviceName: '',
  rating: 0,
  review: '',
}

const serviceOptions = [
  'Business Website',
  'Portfolio Website',
  'E-commerce Solutions',
  'Android App Development',
  'Business Automation',
  'Website Maintenance',
  'Other Services',
]

const inputClasses =
  'mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--foreground)] transition duration-200 placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20'

export default function CustomerReviews() {
  const [form, setForm] = useState(initialForm)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [photoErrors, setPhotoErrors] = useState([])
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [copyStatus, setCopyStatus] = useState('')
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
    const activePhotoCount = selectedPhotos.length
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

      if (activePhotoCount + acceptedPhotos.length >= MAX_REVIEW_PHOTOS) {
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

    if (!form.customerName.trim()) {
      errors.customerName = 'Please enter your name.'
    }

    if (!['Student', 'Business', 'Individual'].includes(form.customerType)) {
      errors.customerType = 'Please select your customer type.'
    }

    if (form.customerType === 'Student') {
      if (!form.collegeName.trim()) {
        errors.collegeName = 'Please enter your college name.'
      }

      if (!['Engineering', 'Diploma'].includes(form.education)) {
        errors.education = 'Please select your education.'
      }

      if (!form.projectName) {
        errors.projectName = 'Please select your project.'
      }
    }

    if (['Business', 'Individual'].includes(form.customerType)) {
      if (!form.serviceName) {
        errors.serviceName = 'Please select the service used.'
      }
    }

    if (form.rating < 1 || form.rating > 5) {
      errors.rating = 'Please select a rating from 1 to 5 stars.'
    }

    if (reviewText.length < 10) {
      errors.review = 'Your review must be at least 10 characters.'
    } else if (reviewText.length > 1000) {
      errors.review = 'Your review must be no more than 1000 characters.'
    }

    setFieldErrors(errors)
    setMessage(null)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    setUploadProgress(null)
    let reviewSaved = false
    let createdEditLink = ''
    try {
      const { editToken } = await manageReview('create', {
        customerName: form.customerName.trim(),
        customerType: form.customerType,
        collegeName: form.customerType === 'Student'
          ? form.collegeName.trim()
          : null,
        education: form.customerType === 'Student'
          ? form.education
          : null,
        projectName: form.customerType === 'Student'
          ? form.projectName
          : null,
        companyName: form.customerType === 'Business'
          ? form.companyName.trim() || null
          : null,
        serviceName: form.customerType !== 'Student'
          ? form.serviceName
          : null,
        rating: form.rating,
        reviewText,
      })
      if (!editToken) throw new Error('The review submission did not return an edit link.')
      reviewSaved = true
      const nextEditLink = `${window.location.origin}/review/edit#${editToken}`
      createdEditLink = nextEditLink
      setCopyStatus('')

      let failedPhotoCount = 0

      if (selectedPhotos.length > 0) {
        setUploadProgress({ completed: 0, total: selectedPhotos.length })
        const { uploadedPaths, failedPhotoCount: uploadFailures } = await uploadReviewPhotos({
          role: 'customer',
          editToken,
          files: selectedPhotos.map(({ file }) => file),
          onProgress: (completed, total) => setUploadProgress({ completed, total }),
        })
        failedPhotoCount = uploadFailures

        if (uploadedPaths.length > 0) {
          try {
            await manageReview('customer-save', {
              editToken,
              customerName: form.customerName.trim(),
              customerType: form.customerType,
              collegeName: form.customerType === 'Student'
                ? form.collegeName.trim()
                : null,
              education: form.customerType === 'Student'
                ? form.education
                : null,
              projectName: form.customerType === 'Student'
                ? form.projectName
                : null,
              companyName: form.customerType === 'Business'
                ? form.companyName.trim() || null
                : null,
              serviceName: form.customerType !== 'Student'
                ? form.serviceName
                : null,
              rating: form.rating,
              reviewText,
              keepPhotoPaths: [],
              newPhotoPaths: uploadedPaths,
            })
          } catch (photoSaveError) {
            console.error('Unable to link uploaded customer review photos:', photoSaveError)
            failedPhotoCount += uploadedPaths.length
            await cancelReviewPhotoUploads({
              role: 'customer',
              editToken,
              objectPaths: uploadedPaths,
            }).catch((cleanupError) => {
              console.error('Unable to clean up unlinked customer review photos:', cleanupError)
            })
          }
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
            editLink: nextEditLink,
          }
        : {
            type: 'success',
            text: 'Thank you for your review! It has been submitted for approval.',
            editLink: nextEditLink,
          })
    } catch (error) {
      console.error('Unable to submit customer review:', error)
      setMessage({
        type: 'error',
        text: reviewSaved
          ? 'Your review was submitted for approval, but we could not link its photos. Please contact us if you need help.'
          : 'Unable to submit your review. Please try again.',
        editLink: createdEditLink || undefined,
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
    <section id="customer-reviews" className="customer-review-form">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full min-w-0"
        >
          <div className="customer-review-form-content">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Write a Review</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Your review will be shared only after it has been approved.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Approved reviews may be displayed publicly with your name, customer type, applicable college or company information, project or service name, rating, review text and any photos you choose to share. See our{' '}
                <Link to="/privacy-policy" className="font-medium text-cyan-800 underline underline-offset-2 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">
                  Privacy Policy
                </Link>.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="customer-review-fields">
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

                <label className="text-sm font-medium text-[var(--foreground)]">
                  Customer Type *

                  <select
                    required
                    value={form.customerType}
                    className={inputClasses}
                    aria-invalid={Boolean(fieldErrors.customerType)}
                    onChange={(event) => {
                      const customerType = event.target.value

                      setForm((current) => ({
                        ...current,
                        customerType,
                        collegeName: '',
                        education: '',
                        projectName: '',
                        companyName: '',
                        serviceName: '',
                      }))

                      setFieldErrors({})
                      setMessage(null)
                    }}
                  >
                    <option value="" disabled>
                      Select customer type
                    </option>

                    <option value="Student">
                      Student
                    </option>

                    <option value="Business">
                      Business / Company
                    </option>

                    <option value="Individual">
                      Individual Customer
                    </option>
                  </select>

                  {fieldErrors.customerType && (
                    <span className="mt-1 block text-sm text-red-500">
                      {fieldErrors.customerType}
                    </span>
                  )}
                </label>

                {/* STUDENT CUSTOMER FIELDS */}

                {form.customerType === 'Student' && (
                  <>
                    <label className="text-sm font-medium text-[var(--foreground)]">
                      College Name *

                      <input
                        required
                        maxLength={120}
                        value={form.collegeName}
                        onChange={(event) =>
                          updateField('collegeName', event.target.value)
                        }
                        className={inputClasses}
                        placeholder="Enter your college name"
                        aria-invalid={Boolean(fieldErrors.collegeName)}
                      />

                      {fieldErrors.collegeName && (
                        <span className="mt-1 block text-sm text-red-500">
                          {fieldErrors.collegeName}
                        </span>
                      )}
                    </label>

                    <label className="text-sm font-medium text-[var(--foreground)]">
                      Education *

                      <select
                        required
                        value={form.education}
                        onChange={(event) =>
                          updateField('education', event.target.value)
                        }
                        className={inputClasses}
                        aria-invalid={Boolean(fieldErrors.education)}
                      >
                        <option value="" disabled>
                          Select your education
                        </option>

                        <option value="Engineering">
                          Engineering
                        </option>

                        <option value="Diploma">
                          Diploma
                        </option>
                      </select>

                      {fieldErrors.education && (
                        <span className="mt-1 block text-sm text-red-500">
                          {fieldErrors.education}
                        </span>
                      )}
                    </label>

                    <label className="customer-review-full text-sm font-medium text-[var(--foreground)]">
                      Academic Project *

                      <select
                        required
                        value={form.projectName}
                        onChange={(event) =>
                          updateField('projectName', event.target.value)
                        }
                        className={inputClasses}
                        aria-invalid={Boolean(fieldErrors.projectName)}
                      >
                        <option value="" disabled>
                          Select your project
                        </option>

                        {projects.map(({ id, title }) => (
                          <option key={id} value={title}>
                            {title}
                          </option>
                        ))}
                      </select>

                      {fieldErrors.projectName && (
                        <span className="mt-1 block text-sm text-red-500">
                          {fieldErrors.projectName}
                        </span>
                      )}
                    </label>
                  </>
                )}

                {/* BUSINESS CUSTOMER FIELDS */}

                {form.customerType === 'Business' && (
                  <label className="customer-review-full text-sm font-medium text-[var(--foreground)]">
                    Business / Company Name (Optional)

                    <input
                      maxLength={120}
                      value={form.companyName}
                      onChange={(event) =>
                        updateField('companyName', event.target.value)
                      }
                      className={inputClasses}
                      placeholder="Enter your business name"
                    />
                  </label>
                )}

                {/* BUSINESS AND INDIVIDUAL SERVICES */}

                {['Business', 'Individual'].includes(form.customerType) && (
                  <label className="customer-review-full text-sm font-medium text-[var(--foreground)]">
                    Service Used *

                    <select
                      required
                      value={form.serviceName}
                      onChange={(event) =>
                        updateField('serviceName', event.target.value)
                      }
                      className={inputClasses}
                      aria-invalid={Boolean(fieldErrors.serviceName)}
                    >
                      <option value="" disabled>
                        Select the service used
                      </option>

                      {serviceOptions.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>

                    {fieldErrors.serviceName && (
                      <span className="mt-1 block text-sm text-red-500">
                        {fieldErrors.serviceName}
                      </span>
                    )}
                  </label>
                )}

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

                <label className="customer-review-full text-sm font-medium text-slate-700 dark:text-slate-200">
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
                <div
                  role={message.type === 'error' ? 'alert' : 'status'}
                  className={`mt-5 rounded-xl px-4 py-3 text-sm ${
                    message.type === 'error'
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                      : message.type === 'warning'
                        ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  }`}
                >
                  <p>{message.text}</p>
                  {message.editLink && (
                    <div className="mt-3 rounded-lg border border-emerald-700/15 bg-white/70 p-3 dark:border-emerald-300/15 dark:bg-slate-950/30">
                      <p className="font-semibold">Save this private link to edit your review later.</p>
                      <p className="mt-1 break-all text-xs">{message.editLink}</p>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(message.editLink)
                            setCopyStatus('Edit link copied.')
                          } catch (copyError) {
                            console.error('Unable to copy the customer review edit link:', copyError)
                            setCopyStatus('Unable to copy automatically. Select and copy the link above.')
                          }
                        }}
                        className="mt-2 rounded-lg border border-current/20 px-3 py-1.5 text-xs font-semibold transition hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        Copy Edit Link
                      </button>
                      {copyStatus && <p className="mt-1 text-xs">{copyStatus}</p>}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-button customer-review-submit disabled:cursor-not-allowed disabled:opacity-60"
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
