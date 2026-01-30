import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

async function lookupLocation(ip: string | null) {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return null
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
      city: geo?.city || null,
      country: geo?.country_name || geo?.country || null,
      region: geo?.region || geo?.region_code || geo?.region_name || null,
      latitude: geo?.ll ? geo.ll[0] : null,
      longitude: geo?.ll ? geo.ll[1] : null,
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
