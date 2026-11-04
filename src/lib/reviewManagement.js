import { supabase } from './supabase'
import { MAX_REVIEW_PHOTO_SIZE, REVIEW_PHOTO_BUCKET, REVIEW_PHOTO_MIME_TYPES } from './reviewPhotos'

export async function manageReview(action, payload = {}) {
  const { data, error } = await supabase.functions.invoke('review-management', {
    body: { action, ...payload },
  })

  if (error) {
    if (error.context instanceof Response) {
      const responseBody = await error.context.json()
      throw new Error(responseBody.error || error.message)
    }
    throw error
  }

  if (!data) throw new Error('The review service returned no response.')
  return data
}

export async function uploadReviewPhotos({
  role,
  editToken,
  reviewId,
  files,
  keepPhotoPaths = [],
  failFast = false,
  onProgress,
}) {
  const actionPrefix = role === 'admin' ? 'admin' : 'customer'
  const uploadedPaths = []
  let failedPhotoCount = 0

  for (const [index, file] of files.entries()) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    const mimeType = REVIEW_PHOTO_MIME_TYPES[extension]
    let objectPath = ''

    try {
      const prepared = await manageReview(`${actionPrefix}-prepare-upload`, {
        ...(role === 'admin' ? { reviewId } : { editToken }),
        mimeType,
        fileSize: file.size,
        keepPhotoPaths,
      })
      objectPath = prepared.objectPath

      const { error } = await supabase.storage
        .from(REVIEW_PHOTO_BUCKET)
        .uploadToSignedUrl(objectPath, prepared.signedUploadToken, file, {
          cacheControl: '3600',
          contentType: mimeType,
          upsert: false,
        })
      if (error) throw error
      uploadedPaths.push(objectPath)
    } catch (error) {
      console.error('Unable to upload a customer review photo:', error)
      failedPhotoCount += 1
      if (objectPath) {
        try {
          await manageReview(`${actionPrefix}-cancel-upload`, {
            ...(role === 'admin' ? { reviewId } : { editToken }),
            objectPath,
          })
        } catch (cleanupError) {
          console.error('Unable to clean up an incomplete review photo upload:', cleanupError)
        }
      }

      if (failFast) {
        await cancelReviewPhotoUploads({ role, editToken, reviewId, objectPaths: uploadedPaths })
        throw error
      }
    } finally {
      onProgress?.(index + 1, files.length)
    }
  }

  return { uploadedPaths, failedPhotoCount }
}

export async function cancelReviewPhotoUploads({ role, editToken, reviewId, objectPaths }) {
  const actionPrefix = role === 'admin' ? 'admin' : 'customer'
  for (const objectPath of objectPaths) {
    await manageReview(`${actionPrefix}-cancel-upload`, {
      ...(role === 'admin' ? { reviewId } : { editToken }),
      objectPath,
    })
  }
}

export function getReviewPhotoError(file) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  const mimeType = REVIEW_PHOTO_MIME_TYPES[extension]
  if (!mimeType || (file.type && file.type !== mimeType)) {
    return 'Use a JPG, JPEG, PNG or WEBP image.'
  }
  if (file.size > MAX_REVIEW_PHOTO_SIZE) return 'Each photo must be 5 MB or smaller.'
  return ''
}
