import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude } = await request.json()

    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1'

    const db = await getDatabase()

    await db.collection('visitors').updateOne(
      { ip },
      {
        $set: {
          latitude,
          longitude,
          precise: true,
          preciseTimestamp: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to store precise location:', error)
    return NextResponse.json({ success: false, error: 'Failed to store precise location' }, { status: 500 })
  }
}
