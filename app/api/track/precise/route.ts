import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

async function reverseGeocode(lat: number, lng: number) {
  try {
    // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          'User-Agent': 'aasurjya-portfolio/1.0',
          'Accept-Language': 'en'
        }
      }
    )

    if (!res.ok) {
      console.error('Reverse geocode failed:', res.status)
      return null
    }

    const data = await res.json()
    const address = data.address || {}

    return {
      city: address.city || address.town || address.village || address.municipality || null,
      region: address.state || address.county || null,
      country: address.country || null
    }
  } catch (error) {
    console.error('Reverse geocode error:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, visitorId, sessionId } = await request.json()

    if (!visitorId || !sessionId) {
      return NextResponse.json({ success: false, error: 'Missing visitor identifiers' }, { status: 400 })
    }

    // Reverse geocode to get city/country from coordinates
    const geoData = await reverseGeocode(latitude, longitude)
    console.log('[Precise] Reverse geocoded:', geoData)

    const db = await getDatabase()

    const updateData: Record<string, unknown> = {
      latitude,
      longitude,
      precise: true,
      preciseTimestamp: new Date(),
    }

    // Only update location names if reverse geocoding succeeded
    if (geoData) {
      if (geoData.city) updateData.city = geoData.city
      if (geoData.region) updateData.region = geoData.region
      if (geoData.country) updateData.country = geoData.country
    }

    await db.collection('visitors').updateOne(
      { visitorId, sessionId },
      { $set: updateData }
    )

    return NextResponse.json({ success: true, location: geoData })
  } catch (error) {
    console.error('Failed to store precise location:', error)
    return NextResponse.json({ success: false, error: 'Failed to store precise location' }, { status: 500 })
  }
}
