const VISITOR_KEY = 'aasurjya_visitor_id'
const SESSION_KEY = 'aasurjya_session_id'
const SESSION_TRACKED_KEY = 'aasurjya_session_tracked'

const generateId = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2)

export function getVisitorIdentity() {
  if (typeof window === 'undefined') {
    return { visitorId: null, sessionId: null }
  }

  let visitorId = localStorage.getItem(VISITOR_KEY)
  if (!visitorId) {
    visitorId = generateId()
    localStorage.setItem(VISITOR_KEY, visitorId)
  }

  let sessionId = sessionStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = generateId()
    sessionStorage.setItem(SESSION_KEY, sessionId)
    sessionStorage.removeItem(SESSION_TRACKED_KEY)
  }

  const isNewSession = sessionStorage.getItem(SESSION_TRACKED_KEY) !== 'true'
  if (isNewSession) {
    sessionStorage.setItem(SESSION_TRACKED_KEY, 'true')
  }

  return { visitorId, sessionId, isNewSession }
}

interface TrackVisitorOptions {
  mode?: string | null
  pathname?: string
}

interface SectionDurationEntry {
  sectionId: string
  durationMs: number
}

export async function trackVisitor(options: TrackVisitorOptions = {}) {
  if (typeof window === 'undefined') return false

  try {
    const identity = getVisitorIdentity()
    console.log('[Analytics] Tracking visitor:', { visitorId: identity.visitorId, isNewSession: identity.isNewSession })

    const response = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        mode: options.mode ?? null,
        pathname: options.pathname ?? window.location.pathname,
        visitorId: identity.visitorId,
        sessionId: identity.sessionId,
        isNewSession: identity.isNewSession,
      }),
    })

    if ('geolocation' in navigator && identity.visitorId) {
      console.log('[Analytics] Requesting geolocation permission...')
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('[Analytics] Geolocation granted, sending precise location...')
          try {
            await fetch('/api/track/precise', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                visitorId: identity.visitorId,
                sessionId: identity.sessionId,
              }),
            })
          } catch (err) {
            console.error('Failed to send precise location:', err)
          }
        },
        (error) => {
          console.warn('Geolocation permission denied or unavailable:', error.message)
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      )
    }

    return response.ok
  } catch (error) {
    console.error('Failed to track visitor:', error)
    return false
  }
}

interface PageSessionData {
  pathname: string
  visibleTimeMs: number
  totalTimeMs: number
  scrollDepth: number
  mode?: string | null
}

export async function trackPageSession(data: PageSessionData) {
  if (typeof window === 'undefined') return false

  try {
    const identity = getVisitorIdentity()
    if (!identity.visitorId || !identity.sessionId) return false

    await fetch('/api/track/page-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        visitorId: identity.visitorId,
        sessionId: identity.sessionId,
      })
    })

    return true
  } catch (error) {
    console.error('Failed to record page session:', error)
    return false
  }
}

export function trackEvent(
  eventType: string,
  eventTarget: string,
  metadata?: Record<string, string>
): void {
  if (typeof window === 'undefined') return

  try {
    const identity = getVisitorIdentity()
    if (!identity.visitorId || !identity.sessionId) return

    const payload = JSON.stringify({
      visitorId: identity.visitorId,
      sessionId: identity.sessionId,
      eventType,
      eventTarget,
      metadata: metadata || {},
      pathname: window.location.pathname,
      mode: document.documentElement.getAttribute('data-mode') || null,
      timestamp: new Date().toISOString(),
    })

    const blob = new Blob([payload], { type: 'application/json' })
    const sent = navigator.sendBeacon?.('/api/track/events', blob)

    if (!sent) {
      fetch('/api/track/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // Fire and forget — never block the UI
  }
}

export async function trackSectionDurations(
  durations: SectionDurationEntry[],
  options: TrackVisitorOptions = {}
) {
  if (typeof window === 'undefined') return false
  if (!durations.length) return false

  try {
    const identity = getVisitorIdentity()
    if (!identity.visitorId || !identity.sessionId) return false

    await fetch('/api/track/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durations,
        mode: options.mode ?? null,
        pathname: options.pathname ?? window.location.pathname,
        visitorId: identity.visitorId,
        sessionId: identity.sessionId,
      })
    })

    return true
  } catch (error) {
    console.error('Failed to record section durations:', error)
    return false
  }
}
