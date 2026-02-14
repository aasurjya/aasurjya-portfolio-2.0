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

    const { durations, visitorId, sessionId, mode, pathname } = body as {
      durations?: Array<{ sectionId: string; durationMs: number }>
      visitorId?: string
      sessionId?: string
      mode?: string
      pathname?: string
    }

    if (!Array.isArray(durations) || durations.length === 0) {
      return NextResponse.json({ success: false, error: 'No durations provided' }, { status: 400 })
    }

    if (!visitorId || !sessionId) {
      return NextResponse.json({ success: false, error: 'Missing visitor identity' }, { status: 400 })
    }

    const sanitized = durations
      .filter((item) => item?.sectionId && typeof item.durationMs === 'number' && item.durationMs > 0)
      .map((item) => ({
        sectionId: item.sectionId,
        durationMs: item.durationMs,
      }))

    if (!sanitized.length) {
      return NextResponse.json({ success: false, error: 'Invalid durations' }, { status: 400 })
    }

    const db = await getDatabase()
    const now = new Date()

    await db.collection('section_durations').insertMany(
      sanitized.map((entry) => ({
        visitorId,
        sessionId,
        sectionId: entry.sectionId,
        durationMs: entry.durationMs,
        mode: mode || null,
        pathname: pathname || null,
        timestamp: now,
      }))
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to record section durations:', error)
    return NextResponse.json({ success: false, error: 'Failed to record section durations' }, { status: 500 })
  }
}
