import { supabase } from './supabase'

export const REVIEW_PHOTO_BUCKET = 'review-photos'
export const MAX_REVIEW_PHOTOS = 5
export const MAX_REVIEW_PHOTO_SIZE = 5 * 1024 * 1024
export const REVIEW_PHOTO_MIME_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

export async function createReviewPhotoUrls(paths, expiresIn = 60) {
  return Promise.all(
    (paths ?? []).map(async (path) => {
      const { data, error } = await supabase.storage
        .from(REVIEW_PHOTO_BUCKET)
        .createSignedUrl(path, expiresIn)

      if (error) throw error
      return { path, url: data.signedUrl }
    }),
  )
}
