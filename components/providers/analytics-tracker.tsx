'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackVisitor, trackSectionDurations } from '@/lib/analytics'
import { useMode } from '@/components/providers/mode-provider'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const { mode } = useMode()
  const trackedPathsRef = useRef<Set<string>>(new Set())
  const sectionEntryTimes = useRef<Record<string, number>>({})
  const bufferedDurations = useRef<{ sectionId: string; durationMs: number }[]>([])
  const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const sections = ['about', 'projects', 'skills', 'contact']

  const flushDurations = async () => {
    if (!bufferedDurations.current.length) return
    const payload = [...bufferedDurations.current]
    bufferedDurations.current = []
    await trackSectionDurations(payload, { mode, pathname })
  }

  useEffect(() => {
    if (!pathname) return
    const key = `${pathname}:${mode ?? 'default'}`

    if (trackedPathsRef.current.has(key)) {
      console.log('[Analytics] Already tracked:', key)
      return
    }

    console.log('[Analytics] Starting tracking for:', key)
    trackVisitor({ mode, pathname })
    trackedPathsRef.current.add(key)
  }, [pathname, mode])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          if (!sections.includes(id)) return

          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            sectionEntryTimes.current[id] = performance.now()
          } else if (sectionEntryTimes.current[id]) {
            const duration = performance.now() - sectionEntryTimes.current[id]
            delete sectionEntryTimes.current[id]
            bufferedDurations.current.push({ sectionId: id, durationMs: duration })
          }
        })

        if (bufferedDurations.current.length >= 5) {
          flushDurations()
        } else {
          if (flushTimeoutRef.current) clearTimeout(flushTimeoutRef.current)
          flushTimeoutRef.current = setTimeout(() => flushDurations(), 5000)
        }
      },
      { threshold: [0.4, 0.5, 0.6] }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        sections.forEach((id) => {
          if (sectionEntryTimes.current[id]) {
            const duration = performance.now() - sectionEntryTimes.current[id]
            delete sectionEntryTimes.current[id]
            bufferedDurations.current.push({ sectionId: id, durationMs: duration })
          }
        })
        flushDurations()
      }
    }

    window.addEventListener('beforeunload', flushDurations)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      observer.disconnect()
      window.removeEventListener('beforeunload', flushDurations)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (flushTimeoutRef.current) clearTimeout(flushTimeoutRef.current)
      flushDurations()
    }
  }, [mode, pathname])

  return null
}
