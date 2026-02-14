import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is required')
  return secret
}

export async function GET(request: NextRequest) {
  try {
    // Verify auth token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      jwt.verify(token, getJwtSecret())
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Parse date range from query params (default: last 30 days)
    const { searchParams } = new URL(request.url)
    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')

    const now = new Date()
    const defaultFrom = new Date(now)
    defaultFrom.setDate(defaultFrom.getDate() - 30)
    defaultFrom.setHours(0, 0, 0, 0)

    const fromDate = fromParam ? new Date(fromParam) : defaultFrom
    const toDate = toParam ? new Date(toParam) : now

    const dateFilter = { timestamp: { $gte: fromDate, $lte: toDate } }

    const db = await getDatabase()
    const visitors = db.collection('visitors')

    // Get visitors within date range, excluding local development
    const allVisitors = await visitors.find({
      $and: [
        { city: { $ne: 'Local Development' } },
        { country: { $ne: 'Localhost' } },
        dateFilter
      ]
    }).toArray()

    // Calculate analytics
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

    // Mode breakdown (merge legacy 'phd' visits into 'xr')
    const modeBreakdown = {
      xr: allVisitors.filter(v => v.mode === 'xr' || v.mode === 'phd').length,
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

    // Get page sessions for accurate page-level timing
    const pageSessions = await db.collection('page_sessions').find(dateFilter).toArray()

    // Aggregate page-level time and scroll depth by pathname
    const pageSessionData: Record<string, { totalVisibleMs: number; totalScrollDepth: number; count: number }> = {}
    pageSessions.forEach(ps => {
      const path = ps.pathname || '/'
      if (!pageSessionData[path]) {
        pageSessionData[path] = { totalVisibleMs: 0, totalScrollDepth: 0, count: 0 }
      }
      pageSessionData[path].totalVisibleMs += ps.visibleTimeMs || 0
      pageSessionData[path].totalScrollDepth += ps.scrollDepth || 0
      pageSessionData[path].count++
    })

    // Scroll depth distribution (site-wide milestones)
    const totalPageSessions = pageSessions.length
    const scrollDepthDistribution = [
      { depth: 25, count: pageSessions.filter(ps => (ps.scrollDepth || 0) >= 25).length },
      { depth: 50, count: pageSessions.filter(ps => (ps.scrollDepth || 0) >= 50).length },
      { depth: 75, count: pageSessions.filter(ps => (ps.scrollDepth || 0) >= 75).length },
      { depth: 100, count: pageSessions.filter(ps => (ps.scrollDepth || 0) >= 100).length },
    ]

    // Pathname breakdown with time spent (from page_sessions)
    const pathCounts: Record<string, number> = {}
    allVisitors.forEach(v => {
      const path = v.pathname || '/'
      pathCounts[path] = (pathCounts[path] || 0) + 1
    })

    const topPages = Object.entries(pathCounts)
      .map(([path, count]) => {
        const psData = pageSessionData[path]
        const avgTimeMs = psData && psData.count > 0
          ? Math.round(psData.totalVisibleMs / psData.count)
          : 0
        const avgScrollDepth = psData && psData.count > 0
          ? Math.round(psData.totalScrollDepth / psData.count)
          : 0
        return { path, count, avgTimeMs, avgScrollDepth, totalTimeMs: psData?.totalVisibleMs || 0 }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Section engagement data (still from section_durations)
    const sectionDurations = await db.collection('section_durations').find(dateFilter).toArray()

    const sectionTimeData: Record<string, { totalMs: number; views: number; sessions: Set<string> }> = {}
    sectionDurations.forEach(d => {
      const section = d.sectionId || 'unknown'
      if (!sectionTimeData[section]) {
        sectionTimeData[section] = { totalMs: 0, views: 0, sessions: new Set() }
      }
      sectionTimeData[section].totalMs += d.durationMs || 0
      sectionTimeData[section].views++
      if (d.sessionId) sectionTimeData[section].sessions.add(d.sessionId)
    })

    const sectionEngagement = Object.entries(sectionTimeData)
      .map(([section, data]) => ({
        section,
        avgTimeMs: data.views > 0 ? Math.round(data.totalMs / data.views) : 0,
        totalTimeMs: data.totalMs,
        views: data.views
      }))
      .sort((a, b) => b.totalTimeMs - a.totalTimeMs)

    // --- Interaction Events ---
    const interactionEvents = await db.collection('interaction_events').find(dateFilter).toArray()

    // Top events by type
    const eventTypeCounts: Record<string, number> = {}
    interactionEvents.forEach(ev => {
      const t = ev.eventType || 'unknown'
      eventTypeCounts[t] = (eventTypeCounts[t] || 0) + 1
    })
    const topEvents = Object.entries(eventTypeCounts)
      .map(([eventType, count]) => ({ eventType, count }))
      .sort((a, b) => b.count - a.count)

    // Recent 30 events
    const recentEvents = interactionEvents
      .sort((a, b) => new Date(b.timestamp || b.createdAt).getTime() - new Date(a.timestamp || a.createdAt).getTime())
      .slice(0, 30)
      .map(ev => ({
        eventType: ev.eventType,
        eventTarget: ev.eventTarget || '',
        pathname: ev.pathname || '/',
        timestamp: (ev.timestamp || ev.createdAt)?.toISOString?.() || new Date(ev.timestamp || ev.createdAt).toISOString(),
      }))

    // --- Section View-Through Funnel ---
    const sectionOrder = ['category-hero', 'about', 'resume', 'projects', 'publications', 'contact']
    const uniquePageSessions = new Set(pageSessions.map(ps => ps.sessionId).filter(Boolean)).size

    const sectionFunnel = sectionOrder.map(sectionId => {
      const uniqueSessions = sectionTimeData[sectionId]?.sessions.size || 0
      const rate = uniquePageSessions > 0 ? Math.round((uniqueSessions / uniquePageSessions) * 100) : 0
      return { section: sectionId, uniqueSessions, rate }
    })

    // --- Engagement Score (per session, averaged) ---
    const sessionData: Record<string, {
      maxScrollDepth: number
      visibleTimeMs: number
      sectionsViewed: Set<string>
      clickCount: number
    }> = {}

    // From page_sessions
    pageSessions.forEach(ps => {
      const sid = ps.sessionId
      if (!sid) return
      if (!sessionData[sid]) {
        sessionData[sid] = { maxScrollDepth: 0, visibleTimeMs: 0, sectionsViewed: new Set(), clickCount: 0 }
      }
      sessionData[sid].maxScrollDepth = Math.max(sessionData[sid].maxScrollDepth, ps.scrollDepth || 0)
      sessionData[sid].visibleTimeMs += ps.visibleTimeMs || 0
    })

    // From section_durations
    sectionDurations.forEach(d => {
      const sid = d.sessionId
      if (!sid) return
      if (!sessionData[sid]) {
        sessionData[sid] = { maxScrollDepth: 0, visibleTimeMs: 0, sectionsViewed: new Set(), clickCount: 0 }
      }
      if (d.sectionId) sessionData[sid].sectionsViewed.add(d.sectionId)
    })

    // From interaction_events
    interactionEvents.forEach(ev => {
      const sid = ev.sessionId
      if (!sid) return
      if (!sessionData[sid]) {
        sessionData[sid] = { maxScrollDepth: 0, visibleTimeMs: 0, sectionsViewed: new Set(), clickCount: 0 }
      }
      sessionData[sid].clickCount++
    })

    const sessionScores = Object.values(sessionData).map(s => {
      const scrollScore = (Math.min(s.maxScrollDepth, 100) / 100) * 25
      const timeScore = Math.min(s.visibleTimeMs / 120000, 1) * 25
      const sectionsScore = (Math.min(s.sectionsViewed.size, 6) / 6) * 25
      const clickScore = Math.min(s.clickCount / 3, 1) * 25
      return scrollScore + timeScore + sectionsScore + clickScore
    })

    const avgEngagementScore = sessionScores.length > 0
      ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)
      : 0

    // --- Conversion Funnel ---
    const allVisitorIds = new Set(allVisitors.map(v => v.visitorId).filter(Boolean))
    const sectionViewVisitors = new Set(sectionDurations.map(d => d.visitorId).filter(Boolean))
    const projectInteractionVisitors = new Set(
      interactionEvents
        .filter(ev => ev.eventType?.startsWith('project_'))
        .map(ev => ev.visitorId)
        .filter(Boolean)
    )
    const contactSocialVisitors = new Set(
      interactionEvents
        .filter(ev => ['contact_email_click', 'contact_phone_click', 'social_link_click'].includes(ev.eventType))
        .map(ev => ev.visitorId)
        .filter(Boolean)
    )

    const conversionFunnel = [
      { stage: 'Visitors', count: allVisitorIds.size },
      { stage: 'Section Views', count: sectionViewVisitors.size },
      { stage: 'Project Interactions', count: projectInteractionVisitors.size },
      { stage: 'Contact/Social Clicks', count: contactSocialVisitors.size },
    ]

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
      sectionEngagement,
      scrollDepthDistribution,
      totalPageSessions,
      topEvents,
      recentEvents,
      sectionFunnel,
      avgEngagementScore,
      conversionFunnel
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
