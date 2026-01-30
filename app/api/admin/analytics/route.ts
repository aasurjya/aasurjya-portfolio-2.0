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

    // Get all visitors, excluding local development
    const allVisitors = await visitors.find({
      $and: [
        { city: { $ne: 'Local Development' } },
        { country: { $ne: 'Localhost' } }
      ]
    }).toArray()

    // Calculate analytics
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - 7)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const totalVisitors = allVisitors.length
    const todayVisitors = allVisitors.filter(v =>
      new Date(v.timestamp) >= today
    ).length
    const yesterdayVisitors = allVisitors.filter(v => {
      const vDate = new Date(v.timestamp)
      return vDate >= yesterday && vDate < today
    }).length
    const weeklyVisitors = allVisitors.filter(v =>
      new Date(v.timestamp) >= thisWeek
    ).length
    const monthlyVisitors = allVisitors.filter(v =>
      new Date(v.timestamp) >= thisMonth
    ).length

    // Unique visitors (by visitorId)
    const uniqueVisitorIds = new Set(allVisitors.map(v => v.visitorId).filter(Boolean))
    const uniqueVisitors = uniqueVisitorIds.size

    // Sessions count
    const uniqueSessions = new Set(allVisitors.map(v => v.sessionId).filter(Boolean)).size

    // Growth rate (compared to yesterday)
    const growthRate = yesterdayVisitors > 0
      ? Math.round(((todayVisitors - yesterdayVisitors) / yesterdayVisitors) * 100)
      : todayVisitors > 0 ? 100 : 0

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

    // Geographic hierarchy: Country → State → City
    const geoHierarchy: Record<string, {
      count: number
      states: Record<string, {
        count: number
        cities: Record<string, number>
      }>
    }> = {}

    allVisitors.forEach(v => {
      const country = v.country || 'Unknown'
      const state = v.region || 'Unknown'
      const city = v.city || 'Unknown'

      if (!geoHierarchy[country]) {
        geoHierarchy[country] = { count: 0, states: {} }
      }
      geoHierarchy[country].count++

      if (!geoHierarchy[country].states[state]) {
        geoHierarchy[country].states[state] = { count: 0, cities: {} }
      }
      geoHierarchy[country].states[state].count++

      if (!geoHierarchy[country].states[state].cities[city]) {
        geoHierarchy[country].states[state].cities[city] = 0
      }
      geoHierarchy[country].states[state].cities[city]++
    })

    // Convert to array format sorted by count
    const geographyData = Object.entries(geoHierarchy)
      .map(([country, data]) => ({
        country,
        count: data.count,
        states: Object.entries(data.states)
          .map(([state, stateData]) => ({
            state,
            count: stateData.count,
            cities: Object.entries(stateData.cities)
              .map(([city, count]) => ({ city, count }))
              .sort((a, b) => b.count - a.count)
          }))
          .sort((a, b) => b.count - a.count)
      }))
      .sort((a, b) => b.count - a.count)

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
        timestamp: new Date(v.timestamp).toISOString(),
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

    // Hourly distribution (for today)
    const hourlyDistribution = Array(24).fill(0)
    allVisitors.forEach(v => {
      const vDate = new Date(v.timestamp)
      if (vDate >= today) {
        hourlyDistribution[vDate.getHours()]++
      }
    })

    // Device/Screen resolution breakdown
    const screenSizes: Record<string, number> = {}
    allVisitors.forEach(v => {
      if (v.screenResolution) {
        const width = parseInt(v.screenResolution.split('x')[0])
        let category = 'Desktop'
        if (width < 768) category = 'Mobile'
        else if (width < 1024) category = 'Tablet'
        screenSizes[category] = (screenSizes[category] || 0) + 1
      }
    })

    // Referrer breakdown
    const referrerCounts: Record<string, number> = {}
    allVisitors.forEach(v => {
      let source = 'Direct'
      if (v.referrer) {
        try {
          const url = new URL(v.referrer)
          source = url.hostname.replace('www.', '')
        } catch {
          source = v.referrer.slice(0, 30) || 'Direct'
        }
      }
      referrerCounts[source] = (referrerCounts[source] || 0) + 1
    })
    const topReferrers = Object.entries(referrerCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Get section durations for time spent analysis
    const sectionDurations = await db.collection('section_durations').find({}).toArray()

    // Aggregate time spent by pathname
    const pageTimeData: Record<string, { totalMs: number; sessions: Set<string> }> = {}
    sectionDurations.forEach(d => {
      const path = d.pathname || '/'
      if (!pageTimeData[path]) {
        pageTimeData[path] = { totalMs: 0, sessions: new Set() }
      }
      pageTimeData[path].totalMs += d.durationMs || 0
      if (d.sessionId) pageTimeData[path].sessions.add(d.sessionId)
    })

    // Pathname breakdown with time spent
    const pathCounts: Record<string, number> = {}
    allVisitors.forEach(v => {
      const path = v.pathname || '/'
      pathCounts[path] = (pathCounts[path] || 0) + 1
    })

    const topPages = Object.entries(pathCounts)
      .map(([path, count]) => {
        const timeData = pageTimeData[path]
        const avgTimeMs = timeData && timeData.sessions.size > 0
          ? Math.round(timeData.totalMs / timeData.sessions.size)
          : 0
        return { path, count, avgTimeMs, totalTimeMs: timeData?.totalMs || 0 }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Section engagement data
    const sectionTimeData: Record<string, { totalMs: number; views: number }> = {}
    sectionDurations.forEach(d => {
      const section = d.sectionId || 'unknown'
      if (!sectionTimeData[section]) {
        sectionTimeData[section] = { totalMs: 0, views: 0 }
      }
      sectionTimeData[section].totalMs += d.durationMs || 0
      sectionTimeData[section].views++
    })

    const sectionEngagement = Object.entries(sectionTimeData)
      .map(([section, data]) => ({
        section,
        avgTimeMs: data.views > 0 ? Math.round(data.totalMs / data.views) : 0,
        totalTimeMs: data.totalMs,
        views: data.views
      }))
      .sort((a, b) => b.totalTimeMs - a.totalTimeMs)

    return NextResponse.json({
      totalVisitors,
      todayVisitors,
      yesterdayVisitors,
      weeklyVisitors,
      monthlyVisitors,
      uniqueVisitors,
      uniqueSessions,
      growthRate,
      modeBreakdown,
      topCountries,
      topCities,
      visitsOverTime,
      recentVisits,
      locations,
      hourlyDistribution,
      screenSizes: Object.entries(screenSizes).map(([device, count]) => ({ device, count })),
      topReferrers,
      topPages,
      geographyData,
      sectionEngagement
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
