import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function ReviewPhotoGallery({ photos, label = 'Customer review photos' }) {
  const [activePhoto, setActivePhoto] = useState(null)

  useEffect(() => {
    if (!activePhoto) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActivePhoto(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [activePhoto])

  if (!photos?.length) return null

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map(({ path, url }, index) => (
          <button
            key={path}
            type="button"
            onClick={() => setActivePhoto({ url, index })}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:bg-slate-800"
            aria-label={`View photo ${index + 1} of ${photos.length}`}
          >
            <img
              src={url}
              alt={`${label}, photo ${index + 1}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {activePhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${activePhoto.index + 1} of ${photos.length}`}
          onClick={() => setActivePhoto(null)}
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Close photo"
          >
            <X size={24} />
          </button>
          <img
            src={activePhoto.url}
            alt={`${label}, photo ${activePhoto.index + 1}`}
            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
