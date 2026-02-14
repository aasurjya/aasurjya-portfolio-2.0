import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

const ALLOWED_EVENTS = new Set([
  'project_video_play',
  'project_link_click',
  'contact_email_click',
  'contact_phone_click',
  'social_link_click',
  'resume_download',
  'journey_button_click',
  'mode_switch',
])

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let body: Record<string, unknown>

    if (contentType.includes('application/json')) {
      body = await request.json()
    } else {
      // sendBeacon may send as text/plain with JSON body
      const text = await request.text()
      body = JSON.parse(text)
    }

    const { visitorId, sessionId, eventType, eventTarget, metadata, pathname, mode, timestamp } = body as {
      visitorId?: string
      sessionId?: string
      eventType?: string
      eventTarget?: string
      metadata?: Record<string, string>
      pathname?: string
      mode?: string
      timestamp?: string
    }

    if (!visitorId || !sessionId) {
      return NextResponse.json({ success: false, error: 'Missing visitor identity' }, { status: 400 })
    }

    if (!eventType || !ALLOWED_EVENTS.has(eventType)) {
      return NextResponse.json({ success: false, error: 'Invalid event type' }, { status: 400 })
    }

    const db = await getDatabase()

    await db.collection('interaction_events').insertOne({
      visitorId,
      sessionId,
      eventType,
      eventTarget: eventTarget || '',
      metadata: metadata || {},
      pathname: pathname || '/',
      mode: mode || null,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to record interaction event:', error)
    return NextResponse.json({ success: false, error: 'Failed to record event' }, { status: 500 })
  }
}
