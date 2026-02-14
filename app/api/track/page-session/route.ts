import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let body: Record<string, unknown>

    if (contentType.includes('application/json')) {
      body = await request.json()
    } else {
      const text = await request.text()
      body = JSON.parse(text)
    }

    const { pathname, visibleTimeMs, totalTimeMs, scrollDepth, mode, visitorId, sessionId } = body as {
      pathname?: string
      visibleTimeMs?: number
      totalTimeMs?: number
      scrollDepth?: number
      mode?: string
      visitorId?: string
      sessionId?: string
    }

    if (!visitorId || !sessionId) {
      return NextResponse.json({ success: false, error: 'Missing visitor identity' }, { status: 400 })
    }

    if (typeof visibleTimeMs !== 'number' || visibleTimeMs < 0) {
      return NextResponse.json({ success: false, error: 'Invalid visibleTimeMs' }, { status: 400 })
    }

    const db = await getDatabase()

    await db.collection('page_sessions').insertOne({
      visitorId,
      sessionId,
      pathname: pathname || '/',
      mode: mode || null,
      visibleTimeMs: Math.round(visibleTimeMs),
      totalTimeMs: Math.round(totalTimeMs || 0),
      scrollDepth: Math.min(Math.max(Math.round(scrollDepth || 0), 0), 100),
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to record page session:', error)
    return NextResponse.json({ success: false, error: 'Failed to record page session' }, { status: 500 })
  }
}
