import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

function isLocalIP(ip: string | null): boolean {
  if (!ip) return false // Don't assume local if no IP
  const trimmedIP = ip.trim()

  // Only match actual local/private IPs
  if (trimmedIP === '127.0.0.1' || trimmedIP === '::1' || trimmedIP === 'localhost') {
    return true
  }

  // Private IP ranges
  if (trimmedIP.startsWith('192.168.')) return true
  if (trimmedIP.startsWith('10.')) return true

  // 172.16.0.0 - 172.31.255.255 (check properly)
  if (trimmedIP.startsWith('172.')) {
    const parts = trimmedIP.split('.')
    if (parts.length >= 2) {
      const secondOctet = parseInt(parts[1], 10)
      if (secondOctet >= 16 && secondOctet <= 31) return true
    }
  }

  return false
}

async function lookupLocation(ip: string | null) {
  // Skip lookup for local IPs
  if (isLocalIP(ip)) {
    return {
      city: 'Local Development',
      country: 'Localhost',
      region: 'Dev Environment',
      latitude: null,
      longitude: null,
      isLocal: true
    }
  }

  // Skip lookup if no valid IP
  if (!ip || ip.trim() === '') {
    return null
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'nodejs-ipapi-v1.02' }
    })
    if (!res.ok) {
      console.error('IP lookup failed with status:', res.status)
      return null
    }
    const data = await res.json()
    if (data.error) {
      console.error('IP lookup error:', data.reason || data.error)
      return null
    }
    return data
  } catch (error) {
    console.error('IP lookup failed:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get IP address from headers (check multiple sources)
    // Priority: Cloudflare > X-Forwarded-For > X-Real-IP > fallback
    const cfConnectingIP = request.headers.get('cf-connecting-ip')
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')

    let ip = cfConnectingIP ||
             (forwarded ? forwarded.split(',')[0].trim() : null) ||
             realIP ||
             null

    // Log for debugging (remove in production)
    console.log('IP Detection:', { cfConnectingIP, forwarded, realIP, finalIP: ip })
    
    const geo = await lookupLocation(ip)
    const latitude = geo?.latitude ?? geo?.lat ?? (Array.isArray(geo?.ll) ? geo.ll[0] : null)
    const longitude = geo?.longitude ?? geo?.lon ?? geo?.lng ?? (Array.isArray(geo?.ll) ? geo.ll[1] : null)

    const visitorData = {
      ip,
      mode: body.mode || null,
      pathname: body.pathname || null,
      timestamp: new Date(),
      lastSeen: new Date(),
      userAgent: body.userAgent || request.headers.get('user-agent'),
      referrer: body.referrer || request.headers.get('referer'),
      screenResolution: body.screenResolution || null,
      visitorId: body.visitorId || null,
      sessionId: body.sessionId || null,
      isNewSession: body.isNewSession || false,
      city: geo?.city || geo?.city_name || null,
      country: geo?.country_name || geo?.country || geo?.country_code || null,
      region: geo?.region || geo?.region_code || geo?.region_name || geo?.state || null,
      latitude,
      longitude,
    }
    
    const db = await getDatabase()
    await db.collection('visitors').updateOne(
      { visitorId: visitorData.visitorId, sessionId: visitorData.sessionId },
      { $set: visitorData, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ success: true, ip })
  } catch (error) {
    console.error('Failed to track visitor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}
