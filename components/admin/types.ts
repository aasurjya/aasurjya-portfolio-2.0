export interface GeoCity {
  city: string
  count: number
}

export interface GeoState {
  state: string
  count: number
  cities: GeoCity[]
}

export interface GeoCountry {
  country: string
  count: number
  states: GeoState[]
}

export interface AnalyticsData {
  totalVisitors: number
  todayVisitors: number
  yesterdayVisitors: number
  weeklyVisitors: number
  monthlyVisitors: number
  uniqueVisitors: number
  uniqueSessions: number
  growthRate: number
  modeBreakdown: { xr: number; fullstack: number }
  topCountries: { country: string; count: number }[]
  topCities: { city: string; count: number }[]
  visitsOverTime: { date: string; count: number }[]
  recentVisits: { timestamp: string; city: string; country: string; mode?: string }[]
  locations: { lat: number; lng: number; city: string; count: number }[]
  hourlyDistribution: number[]
  screenSizes: { device: string; count: number }[]
  topReferrers: { source: string; count: number }[]
  topPages: { path: string; count: number; avgTimeMs?: number; avgScrollDepth?: number; totalTimeMs?: number }[]
  geographyData: GeoCountry[]
  sectionEngagement: { section: string; avgTimeMs: number; totalTimeMs: number; views: number }[]
  scrollDepthDistribution: { depth: number; count: number }[]
  totalPageSessions: number
  topEvents: { eventType: string; count: number }[]
  recentEvents: { eventType: string; eventTarget: string; pathname: string; timestamp: string }[]
  sectionFunnel: { section: string; uniqueSessions: number; rate: number }[]
  avgEngagementScore: number
  conversionFunnel: { stage: string; count: number }[]
}
