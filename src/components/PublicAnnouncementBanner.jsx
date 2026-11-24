import { useState } from 'react'
import { X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { usePublishedAnnouncements } from '../lib/publicContent'

function getDisplayLocation(pathname) {
  if (pathname === '/') return 'home'
  if (pathname === '/services') return 'services'
  if (pathname === '/contact') return 'contact'
  return 'sitewide'
}

export default function PublicAnnouncementBanner() {
  const { pathname } = useLocation()
  const announcements = usePublishedAnnouncements(getDisplayLocation(pathname))
  const [dismissed, setDismissed] = useState([])
  const visible = announcements.filter((announcement) => !dismissed.includes(announcement.id))

  if (!visible.length) return null

  return (
    <aside className="mx-auto mb-5 w-full max-w-7xl space-y-2 px-4 sm:px-6 lg:px-8" aria-label="Announcements">
      {visible.map((announcement) => (
        <div key={announcement.id} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)]">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{announcement.title}</p>
            <p className="mt-1 whitespace-pre-line text-sm text-[var(--muted)]">{announcement.content}</p>
          </div>
          <button type="button" className="shrink-0 rounded-md p-1 text-[var(--muted)] hover:bg-[var(--bg)]" onClick={() => setDismissed((current) => [...current, announcement.id])} aria-label={`Dismiss ${announcement.title}`}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
    </aside>
  )
}
