import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, visitorId, sessionId } = await request.json()

    if (!visitorId || !sessionId) {
      return NextResponse.json({ success: false, error: 'Missing visitor identifiers' }, { status: 400 })
    }

    const db = await getDatabase()

    await db.collection('visitors').updateOne(
      { visitorId, sessionId },
      {
        $set: {
          latitude,
          longitude,
          precise: true,
          preciseTimestamp: new Date(),
        },
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to store precise location:', error)
    return NextResponse.json({ success: false, error: 'Failed to store precise location' }, { status: 500 })
  }
}
