import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

function isLocalIP(ip: string | null): boolean {
  if (!ip) return true
  return ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' ||
         ip.startsWith('192.168.') || ip.startsWith('10.') ||
         ip.startsWith('172.16.') || ip.startsWith('172.17.') ||
         ip.startsWith('172.18.') || ip.startsWith('172.19.') ||
         ip.startsWith('172.2') || ip.startsWith('172.3')
}

async function lookupLocation(ip: string | null) {
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
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.error) return null
    return data
  } catch (error) {
    console.error('IP lookup failed:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get IP address from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    
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
