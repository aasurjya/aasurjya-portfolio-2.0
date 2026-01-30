import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import geoip from 'geoip-lite'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get IP address from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    
    // Get geolocation from IP
    const geo = geoip.lookup(ip)
    
    const db = await getDatabase()
    const visitors = db.collection('visitors')
    
    const visitorData = {
      ip,
      city: geo?.city || 'Unknown',
      country: geo?.country || 'Unknown',
      region: geo?.region || 'Unknown',
      latitude: geo?.ll?.[0] || null,
      longitude: geo?.ll?.[1] || null,
      mode: body.mode || null,
      timestamp: new Date(),
      userAgent: body.userAgent || request.headers.get('user-agent'),
      referrer: body.referrer || request.headers.get('referer'),
      screenResolution: body.screenResolution || null,
    }
    
    await visitors.insertOne(visitorData)
    
    return NextResponse.json({ success: true, location: geo?.city || 'Unknown' })
  } catch (error) {
    console.error('Failed to track visitor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}
