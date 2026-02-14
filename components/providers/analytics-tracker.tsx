'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { trackVisitor, trackSectionDurations, trackPageSession, trackEvent, getVisitorIdentity } from '@/lib/analytics'
import { useMode } from '@/components/providers/mode-provider'

function sendBeaconJSON(url: string, data: unknown): boolean {
  try {
    const json = JSON.stringify(data)
    const blob = new Blob([json], { type: 'application/json' })
    return navigator.sendBeacon(url, blob)
  } catch {
    return false
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const { mode } = useMode()
  const trackedPathsRef = useRef<Set<string>>(new Set())
  const sectionEntryTimes = useRef<Record<string, number>>({})
  const bufferedDurations = useRef<{ sectionId: string; durationMs: number }[]>([])
  const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const sections = ['category-hero', 'about', 'resume', 'projects', 'publications', 'contact']

  // Page-level timing refs
  const pageEntryTime = useRef<number>(0)
  const visibleTimeMs = useRef<number>(0)
  const lastVisibleStart = useRef<number>(0)
  const maxScrollPercent = useRef<number>(0)
  const isCurrentlyVisible = useRef<boolean>(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const flushDurations = useCallback(async () => {
    if (!bufferedDurations.current.length) return
    const payload = [...bufferedDurations.current]
    bufferedDurations.current = []
    await trackSectionDurations(payload, { mode, pathname })
  }, [mode, pathname])

  const flushPageSession = useCallback(async () => {
    const now = performance.now()

    // Accumulate any remaining visible time
    if (isCurrentlyVisible.current && lastVisibleStart.current > 0) {
      visibleTimeMs.current += now - lastVisibleStart.current
      lastVisibleStart.current = now
    }

    const totalTime = now - pageEntryTime.current
    const visibleTime = visibleTimeMs.current

    // Only send if the user spent at least 500ms on the page
    if (visibleTime < 500) return

    console.log('[Analytics] Flushing page session:', {
      pathname,
      visibleTimeMs: Math.round(visibleTime),
      totalTimeMs: Math.round(totalTime),
      scrollDepth: maxScrollPercent.current,
    })

    await trackPageSession({
      pathname: pathname || '/',
      visibleTimeMs: visibleTime,
      totalTimeMs: totalTime,
      scrollDepth: maxScrollPercent.current,
      mode,
    })
  }, [pathname, mode])

  // Global click delegation for [data-track-event] elements
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const tracked = target.closest('[data-track-event]') as HTMLElement | null
      if (!tracked) return

      const eventType = tracked.getAttribute('data-track-event') || ''
      const eventTarget = tracked.getAttribute('data-track-target') || ''

      // Collect data-track-meta-* attributes
      const meta: Record<string, string> = {}
      for (const attr of Array.from(tracked.attributes)) {
        if (attr.name.startsWith('data-track-meta-')) {
          const key = attr.name.replace('data-track-meta-', '')
          meta[key] = attr.value
        }
      }

      trackEvent(eventType, eventTarget, Object.keys(meta).length > 0 ? meta : undefined)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  // Track visitor on route/mode change
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

  // Page-level timing + scroll depth + section observers
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initialize page timing
    const now = performance.now()
    pageEntryTime.current = now
    visibleTimeMs.current = 0
    lastVisibleStart.current = now
    maxScrollPercent.current = 0
    isCurrentlyVisible.current = !document.hidden

    if (document.hidden) {
      lastVisibleStart.current = 0
    }

    // Scroll depth tracking — works with mouse wheel, trackpad, keyboard, touch
    let scrollRafId: number | null = null
    const updateScrollDepth = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (docHeight <= 0) return
      const percent = Math.round((scrollTop / docHeight) * 100)
      if (percent > maxScrollPercent.current) {
        maxScrollPercent.current = percent
      }
    }

    const handleScroll = () => {
      updateScrollDepth()
    }

    // Also capture wheel events — on macOS trackpad, momentum scroll fires wheel
    // events continuously but the scroll event can lag behind
    const handleWheel = () => {
      if (scrollRafId !== null) return
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null
        updateScrollDepth()
      })
    }

    // Section intersection observer
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
    observerRef.current = observer

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    // Visibility change handler — pauses/resumes timing
    const handleVisibility = () => {
      const nowMs = performance.now()

      if (document.hidden) {
        // Tab became hidden — accumulate visible time and pause
        if (isCurrentlyVisible.current && lastVisibleStart.current > 0) {
          visibleTimeMs.current += nowMs - lastVisibleStart.current
        }
        isCurrentlyVisible.current = false
        lastVisibleStart.current = 0

        // Flush section durations for sections that were in view
        sections.forEach((id) => {
          if (sectionEntryTimes.current[id]) {
            const duration = nowMs - sectionEntryTimes.current[id]
            delete sectionEntryTimes.current[id]
            bufferedDurations.current.push({ sectionId: id, durationMs: duration })
          }
        })
        flushDurations()
      } else {
        // Tab became visible — resume timing
        isCurrentlyVisible.current = true
        lastVisibleStart.current = nowMs

        // Re-check sections that might be in view
        sections.forEach((id) => {
          const el = document.getElementById(id)
          if (el) {
            const rect = el.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            const visibleRatio = Math.max(0,
              Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
            ) / rect.height
            if (visibleRatio >= 0.4) {
              sectionEntryTimes.current[id] = nowMs
            }
          }
        })
      }
    }

    // Before unload — use sendBeacon (fetch is cancelled on unload)
    const handleBeforeUnload = () => {
      const identity = getVisitorIdentity()
      if (!identity.visitorId || !identity.sessionId) return

      // Flush buffered section durations via sendBeacon
      // Also include any sections currently in view
      const nowMs = performance.now()
      sections.forEach((id) => {
        if (sectionEntryTimes.current[id]) {
          const duration = nowMs - sectionEntryTimes.current[id]
          delete sectionEntryTimes.current[id]
          bufferedDurations.current.push({ sectionId: id, durationMs: duration })
        }
      })

      if (bufferedDurations.current.length > 0) {
        const durPayload = [...bufferedDurations.current]
        bufferedDurations.current = []
        sendBeaconJSON('/api/track/sections', {
          durations: durPayload,
          mode: mode ?? null,
          pathname: pathname ?? window.location.pathname,
          visitorId: identity.visitorId,
          sessionId: identity.sessionId,
        })
      }

      // Flush page session via sendBeacon
      if (isCurrentlyVisible.current && lastVisibleStart.current > 0) {
        visibleTimeMs.current += nowMs - lastVisibleStart.current
        lastVisibleStart.current = nowMs
      }

      const visibleTime = visibleTimeMs.current
      if (visibleTime >= 500) {
        sendBeaconJSON('/api/track/page-session', {
          pathname: pathname || '/',
          visibleTimeMs: visibleTime,
          totalTimeMs: nowMs - pageEntryTime.current,
          scrollDepth: maxScrollPercent.current,
          mode: mode ?? null,
          visitorId: identity.visitorId,
          sessionId: identity.sessionId,
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchmove', handleWheel, { passive: true })
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibility)

    // Capture initial scroll position
    updateScrollDepth()

    return () => {
      observer.disconnect()
      observerRef.current = null
      if (scrollRafId !== null) cancelAnimationFrame(scrollRafId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchmove', handleWheel)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (flushTimeoutRef.current) clearTimeout(flushTimeoutRef.current)
      flushDurations()
      flushPageSession()
    }
  }, [mode, pathname, flushDurations, flushPageSession])

  return null
}
