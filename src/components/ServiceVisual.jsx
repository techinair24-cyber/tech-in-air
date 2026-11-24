import React from 'react'
import { motion } from 'framer-motion'

export default function ServiceVisual({ slug, title }) {
  const isMobile = slug === 'android-development'
  const isStore = slug === 'ecommerce'
  const isAutomation = slug === 'business-automation'
  const isMaintenance = slug === 'website-maintenance'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)]"
      aria-label={`${title} illustrative concept`}
    >
      <div className="absolute left-[10%] top-[15%] h-[70%] w-[80%] rounded-[1.1rem] border border-[var(--border)] bg-[var(--card)] p-[4%] shadow-[0_24px_60px_rgba(0,113,227,0.10)]">
        {isMobile ? (
          <div className="mx-auto h-full w-[32%] min-w-24 rounded-[1.4rem] border-[5px] border-[var(--foreground)] bg-[var(--surface)] p-2">
            <div className="mx-auto h-1 w-8 rounded-full bg-[var(--muted)]" />
            <div className="mt-3 aspect-[4/3] rounded-lg bg-[var(--accent)]" />
            <div className="mt-3 space-y-2">
              <div className="h-2 w-full rounded bg-[var(--border)]" />
              <div className="h-2 w-4/5 rounded bg-[var(--border)]" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-8 rounded bg-[var(--surface-strong)]" />
                <div className="h-8 rounded bg-[var(--surface-strong)]" />
              </div>
            </div>
          </div>
        ) : isAutomation ? (
          <div className="flex h-full items-center justify-center gap-[3%]">
            {['Enquiry', 'Process', 'Report'].map((label, index) => (
              <React.Fragment key={label}>
                <div className="flex aspect-square w-[20%] flex-col items-center justify-center rounded-full border border-[var(--border)] text-xs font-semibold">
                  <span className="text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="mt-1">{label}</span>
                </div>
                {index < 2 && <div className="h-px w-[8%] bg-[var(--accent)]" />}
              </React.Fragment>
            ))}
          </div>
        ) : isMaintenance ? (
          <div className="grid h-full grid-cols-[1fr_0.45fr] gap-[4%]">
            <div className="rounded-lg border border-[var(--border)] p-[5%]">
              <div className="h-3 w-1/3 rounded bg-[var(--foreground)]" />
              <div className="mt-[8%] h-2 w-full rounded bg-[var(--border)]" />
              <div className="mt-2 h-2 w-4/5 rounded bg-[var(--border)]" />
              <div className="mt-[12%] h-2 w-[70%] rounded bg-[var(--accent)]" />
            </div>
            <div className="grid grid-rows-3 gap-[8%]">
              {[92, 88, 96].map((value) => (
                <div key={value} className="grid place-items-center rounded-lg border border-[var(--border)] text-xs font-semibold">{value}%</div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid h-full grid-cols-[0.65fr_1fr] gap-[4%]">
            <div className="rounded-lg border border-[var(--border)] p-[5%]">
              <div className="h-3 w-1/2 rounded bg-[var(--foreground)]" />
              <div className="mt-[12%] h-2 w-full rounded bg-[var(--border)]" />
              <div className="mt-2 h-2 w-4/5 rounded bg-[var(--border)]" />
            </div>
            <div className="grid grid-cols-2 gap-[5%]">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                  {isStore && item === 0 && <div className="h-full rounded-lg bg-[var(--accent)] opacity-20" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
