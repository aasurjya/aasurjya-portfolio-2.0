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

export async function trackVisitor(options: TrackVisitorOptions = {}) {
  if (typeof window === 'undefined') return false

  try {
    const identity = getVisitorIdentity()

    // Get IP-based geolocation (server will handle this)
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

    // Optionally get precise geolocation if available
    if ('geolocation' in navigator && identity.visitorId) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
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
        },
        () => {
          // Silent fail - user denied permission
        }
      )
    }

    return response.ok
  } catch (error) {
    console.error('Failed to track visitor:', error)
    return false
  }
}
