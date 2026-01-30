import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'

export async function GET(request: NextRequest) {
  try {
    // Verify auth token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const db = await getDatabase()
    const visitors = db.collection('visitors')

    // Get all visitors
    const allVisitors = await visitors.find({}).toArray()

    // Calculate analytics
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const totalVisitors = allVisitors.length
    const todayVisitors = allVisitors.filter(v => 
      new Date(v.timestamp) >= today
    ).length

    // Mode breakdown
    const modeBreakdown = {
      phd: allVisitors.filter(v => v.mode === 'phd').length,
      xr: allVisitors.filter(v => v.mode === 'xr').length,
      fullstack: allVisitors.filter(v => v.mode === 'fullstack').length,
    }

    // Top countries
    const countryCounts: Record<string, number> = {}
    allVisitors.forEach(v => {
      const country = v.country || 'Unknown'
      countryCounts[country] = (countryCounts[country] || 0) + 1
    })
    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Top cities
    const cityCounts: Record<string, number> = {}
    allVisitors.forEach(v => {
      const city = v.city || 'Unknown'
      cityCounts[city] = (cityCounts[city] || 0) + 1
    })
    const topCities = Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Visits over time (last 7 days)
    const visitsOverTime = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const count = allVisitors.filter(v => {
        const vDate = new Date(v.timestamp)
        return vDate >= date && vDate < nextDate
      }).length
      
      visitsOverTime.push({
        date: date.toLocaleDateString(),
        count
      })
    }

    // Recent visits
    const recentVisits = allVisitors
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)
      .map(v => ({
        timestamp: new Date(v.timestamp).toLocaleString(),
        city: v.city || 'Unknown',
        country: v.country || 'Unknown',
        mode: v.mode
      }))

    // Locations for map
    const locations = allVisitors
      .filter(v => v.latitude && v.longitude)
      .map(v => ({
        lat: v.latitude,
        lng: v.longitude,
        city: v.city || 'Unknown'
      }))

    return NextResponse.json({
      totalVisitors,
      todayVisitors,
      modeBreakdown,
      topCountries,
      topCities,
      visitsOverTime,
      recentVisits,
      locations
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
