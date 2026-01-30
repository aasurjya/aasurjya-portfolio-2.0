export async function trackVisitor() {
  try {
    // Get IP-based geolocation (server will handle this)
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      }),
    })

    // Optionally get precise geolocation if available
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await fetch('/api/track/precise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
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
