import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get IP address from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    
    // Basic visitor tracking without geoip dependency
    const visitorData = {
      ip,
      mode: body.mode || null,
      timestamp: new Date(),
      userAgent: body.userAgent || request.headers.get('user-agent'),
      referrer: body.referrer || request.headers.get('referer'),
      screenResolution: body.screenResolution || null,
    }
    
    // Log visitor data (can be extended with database integration later)
    console.log('Visitor tracked:', visitorData)
    
    return NextResponse.json({ success: true, ip })
  } catch (error) {
    console.error('Failed to track visitor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}
