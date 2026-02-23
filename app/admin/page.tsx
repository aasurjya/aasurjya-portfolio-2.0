'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Users, TrendingUp, Globe, Activity, Calendar,
  PieChart, Monitor, Clock, MapPin, BarChart3, Eye, MousePointer,
  Layers, RefreshCw, LogOut, Home, ArrowUpRight, ArrowDownRight,
  Timer, Mail, Download
} from 'lucide-react'
import toast from 'react-hot-toast'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
)

// Lazy-load GeographyTab — code-splits ~150KB of react-simple-maps
const GeographyTab = dynamic(() => import('@/components/admin/GeographyTab'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="text-sm text-muted-foreground">Loading geography...</span>
      </div>
    </div>
  ),
})

// Error boundary for chart sections
class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackTitle?: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallbackTitle?: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Chart error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-card p-6 rounded-xl border flex flex-col items-center justify-center min-h-[200px] text-center">
          <p className="text-muted-foreground mb-2">
            {this.props.fallbackTitle || 'Failed to load this section'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Module-level constants (never recreated)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true }
  }
}

const doughnutOptions = { ...chartOptions, cutout: '60%' }

const hourlyLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`)

// Date range helpers
function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDatePreset(preset: string): { from: string; to: string } {
  const now = new Date()
  const to = toISODate(now)

  switch (preset) {
    case 'today': {
      return { from: to, to }
    }
    case '7d': {
      const from = new Date(now)
      from.setDate(from.getDate() - 7)
      return { from: toISODate(from), to }
    }
    case '30d': {
      const from = new Date(now)
      from.setDate(from.getDate() - 30)
      return { from: toISODate(from), to }
    }
    case 'all':
      return { from: '', to: '' }
    default: {
      const from = new Date(now)
      from.setDate(from.getDate() - 30)
      return { from: toISODate(from), to }
    }
  }
}

// Format helpers
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatFullDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const formatDuration = (ms: number) => {
  if (!ms || ms <= 0) return '-'
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

// StatCard extracted as a standalone memoized component
const StatCard = React.memo(({ title, value, subtitle, icon, trend }: {
  title: string; value: string | number; subtitle?: string; icon: React.ReactNode; trend?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card p-5 rounded-xl border hover:shadow-lg transition-all"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(trend)}% vs yesterday</span>
          </div>
        )}
      </div>
      <div className="p-3 rounded-xl bg-primary/10">
        {icon}
      </div>
    </div>
  </motion.div>
))
StatCard.displayName = 'StatCard'

interface GeoCity {
  city: string
  count: number
}

interface GeoState {
  state: string
  count: number
  cities: GeoCity[]
}

interface GeoCountry {
  country: string
  count: number
  states: GeoState[]
}

interface AnalyticsData {
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

type TabType = 'overview' | 'visitors' | 'geography' | 'behavior'

const datePresets = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: 'all', label: 'All time' },
]

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
  { id: 'visitors', label: 'Visitors', icon: <Users className="w-4 h-4" /> },
  { id: 'geography', label: 'Geography', icon: <Globe className="w-4 h-4" /> },
  { id: 'behavior', label: 'Behavior', icon: <MousePointer className="w-4 h-4" /> },
]

const badgeColors: Record<string, string> = {
  project_video_play: 'bg-blue-500/10 text-blue-500',
  project_link_click: 'bg-indigo-500/10 text-indigo-500',
  contact_email_click: 'bg-green-500/10 text-green-500',
  contact_phone_click: 'bg-emerald-500/10 text-emerald-500',
  social_link_click: 'bg-cyan-500/10 text-cyan-500',
  resume_download: 'bg-amber-500/10 text-amber-500',
  journey_button_click: 'bg-pink-500/10 text-pink-500',
  mode_switch: 'bg-purple-500/10 text-purple-500',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [dateRange, setDateRange] = useState(() => getDatePreset('30d'))
  const [activePreset, setActivePreset] = useState('30d')
  const dateRangeRef = useRef(dateRange)
  dateRangeRef.current = dateRange

  const fetchAnalytics = useCallback(async (range?: { from: string; to: string }) => {
    try {
      setRefreshing(true)
      const r = range || dateRangeRef.current
      const params = new URLSearchParams()
      if (r.from) params.set('from', r.from)
      if (r.to) params.set('to', r.to)
      const qs = params.toString()
      const res = await fetch(`/api/admin/analytics${qs ? `?${qs}` : ''}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      if (res.ok) {
        const data = await res.json()
        setAnalyticsData({
          totalVisitors: data.totalVisitors || 0,
          todayVisitors: data.todayVisitors || 0,
          yesterdayVisitors: data.yesterdayVisitors || 0,
          weeklyVisitors: data.weeklyVisitors || 0,
          monthlyVisitors: data.monthlyVisitors || 0,
          uniqueVisitors: data.uniqueVisitors || 0,
          uniqueSessions: data.uniqueSessions || 0,
          growthRate: data.growthRate || 0,
          modeBreakdown: data.modeBreakdown || { xr: 0, fullstack: 0 },
          topCountries: data.topCountries || [],
          topCities: data.topCities || [],
          visitsOverTime: data.visitsOverTime || [],
          recentVisits: data.recentVisits || [],
          locations: data.locations || [],
          hourlyDistribution: data.hourlyDistribution || Array(24).fill(0),
          screenSizes: data.screenSizes || [],
          topReferrers: data.topReferrers || [],
          topPages: data.topPages || [],
          geographyData: data.geographyData || [],
          sectionEngagement: data.sectionEngagement || [],
          scrollDepthDistribution: data.scrollDepthDistribution || [],
          totalPageSessions: data.totalPageSessions || 0,
          topEvents: data.topEvents || [],
          recentEvents: data.recentEvents || [],
          sectionFunnel: data.sectionFunnel || [],
          avgEngagementScore: data.avgEngagementScore || 0,
          conversionFunnel: data.conversionFunnel || []
        })
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('Analytics API error:', res.status, errorData)
        toast.error(`Failed to fetch analytics: ${errorData.error || res.statusText}`)
      }
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      if (res.ok) {
        setIsAuthenticated(true)
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }, [])

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      if (res.ok) {
        const { token } = await res.json()
        localStorage.setItem('adminToken', token)
        setLoading(true)
        setIsAuthenticated(true)
        toast.success('Welcome back!')
      } else {
        toast.error('Invalid password')
      }
    } catch {
      toast.error('Login failed')
    }
  }, [password])

  useEffect(() => { checkAuth() }, [checkAuth])

  // Fetch analytics on initial auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics()
    }
  }, [isAuthenticated, fetchAnalytics])

  // Auto-refresh every 60 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(() => {
      fetchAnalytics()
    }, 60000)
    return () => clearInterval(interval)
  }, [isAuthenticated, fetchAnalytics])

  // Memoized chart data objects
  const visitsChartData = useMemo(() => {
    if (!analyticsData) return null
    return {
      labels: analyticsData.visitsOverTime.map(d => d.date),
      datasets: [{
        data: analyticsData.visitsOverTime.map(d => d.count),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(99, 102, 241)'
      }]
    }
  }, [analyticsData?.visitsOverTime])

  const modeChartData = useMemo(() => {
    if (!analyticsData) return null
    return {
      labels: ['XR & Research', 'Full Stack'],
      datasets: [{
        data: [analyticsData.modeBreakdown.xr, analyticsData.modeBreakdown.fullstack],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(139, 92, 246, 0.8)'],
        borderWidth: 0
      }]
    }
  }, [analyticsData?.modeBreakdown])

  const hourlyChartData = useMemo(() => {
    if (!analyticsData) return null
    return {
      labels: hourlyLabels,
      datasets: [{
        data: analyticsData.hourlyDistribution,
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderRadius: 4
      }]
    }
  }, [analyticsData?.hourlyDistribution])

  // Memoize derived computations
  const screenSizeTotal = useMemo(
    () => analyticsData?.screenSizes.reduce((a, b) => a + b.count, 0) || 0,
    [analyticsData?.screenSizes]
  )

  const referrerTotal = useMemo(
    () => analyticsData?.topReferrers.reduce((a, b) => a + b.count, 0) || 0,
    [analyticsData?.topReferrers]
  )

  const topPagesTotal = useMemo(
    () => analyticsData?.topPages.reduce((a, b) => a + b.count, 0) || 0,
    [analyticsData?.topPages]
  )

  const behaviorCards = useMemo(() => {
    if (!analyticsData) return []
    const projectClicks = analyticsData.topEvents.filter(e => e.eventType.startsWith('project_')).reduce((a, b) => a + b.count, 0)
    const contactClicks = analyticsData.topEvents.filter(e => ['contact_email_click', 'contact_phone_click', 'social_link_click'].includes(e.eventType)).reduce((a, b) => a + b.count, 0)
    const resumeDownloads = analyticsData.topEvents.find(e => e.eventType === 'resume_download')?.count || 0
    return [
      { label: 'Project Clicks', value: projectClicks, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <MousePointer className="w-5 h-5 text-blue-500" /> },
      { label: 'Contact Clicks', value: contactClicks, color: 'text-green-500', bg: 'bg-green-500/10', icon: <Mail className="w-5 h-5 text-green-500" /> },
      { label: 'Resume Downloads', value: resumeDownloads, color: 'text-amber-500', bg: 'bg-amber-500/10', icon: <Download className="w-5 h-5 text-amber-500" /> },
      { label: 'Engagement Score', value: analyticsData.avgEngagementScore, color: 'text-purple-500', bg: 'bg-purple-500/10', icon: <Activity className="w-5 h-5 text-purple-500" /> },
    ]
  }, [analyticsData?.topEvents, analyticsData?.avgEngagementScore])

  const sortedSectionEngagement = useMemo(() => {
    if (!analyticsData?.sectionEngagement?.length) return { sorted: [], maxTime: 1, medianTime: 0 }
    const sorted = [...analyticsData.sectionEngagement].sort((a, b) => b.avgTimeMs - a.avgTimeMs)
    return {
      sorted,
      maxTime: sorted[0]?.avgTimeMs || 1,
      medianTime: sorted[Math.floor(sorted.length / 2)].avgTimeMs,
    }
  }, [analyticsData?.sectionEngagement])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-8 rounded-2xl border shadow-2xl max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground mt-2">Enter your password to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 bg-background border rounded-xl mb-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-medium transition-all"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center p-8">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Analytics Data</h2>
          <p className="text-muted-foreground mb-4">Unable to load analytics. Check your connection and try again.</p>
          <button
            onClick={() => fetchAnalytics()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg sm:rounded-xl">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">Analytics</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {lastUpdated ? `Updated ${formatDate(lastUpdated.toISOString())}` : 'Portfolio Dashboard'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchAnalytics()}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => { localStorage.removeItem('adminToken'); router.push('/') }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {datePresets.map(preset => (
              <button
                key={preset.key}
                onClick={() => {
                  const range = getDatePreset(preset.key)
                  setActivePreset(preset.key)
                  setDateRange(range)
                  fetchAnalytics(range)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activePreset === preset.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {preset.label}
              </button>
            ))}
            <div className="flex items-center gap-1.5 ml-auto">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => {
                  const range = { ...dateRange, from: e.target.value }
                  setActivePreset('custom')
                  setDateRange(range)
                  fetchAnalytics(range)
                }}
                className="px-2 py-1.5 bg-background border rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => {
                  const range = { ...dateRange, to: e.target.value }
                  setActivePreset('custom')
                  setDateRange(range)
                  fetchAnalytics(range)
                }}
                className="px-2 py-1.5 bg-background border rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3 bg-muted/50 p-1 rounded-xl overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content — only active tab is mounted */}
      <main className="container mx-auto max-w-7xl px-4 py-6">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                title="Total Visitors"
                value={analyticsData.totalVisitors}
                subtitle={`${analyticsData.uniqueVisitors} unique`}
                icon={<Users className="w-6 h-6 text-primary" />}
              />
              <StatCard
                title="Today"
                value={analyticsData.todayVisitors}
                trend={analyticsData.growthRate}
                icon={<TrendingUp className="w-6 h-6 text-green-500" />}
              />
              <StatCard
                title="This Week"
                value={analyticsData.weeklyVisitors}
                icon={<Calendar className="w-6 h-6 text-blue-500" />}
              />
              <StatCard
                title="Sessions"
                value={analyticsData.uniqueSessions}
                icon={<Activity className="w-6 h-6 text-purple-500" />}
              />
              {/* Engagement Score Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-5 rounded-xl border hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Engagement</p>
                    <p className="text-3xl font-bold mt-1">{analyticsData.avgEngagementScore}</p>
                    <p className="text-xs text-muted-foreground mt-1">out of 100</p>
                  </div>
                  <div className="relative w-14 h-14">
                    <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-muted/30"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={analyticsData.avgEngagementScore >= 60 ? '#22c55e' : analyticsData.avgEngagementScore >= 30 ? '#eab308' : '#ef4444'}
                        strokeWidth="3"
                        strokeDasharray={`${analyticsData.avgEngagementScore}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                      {analyticsData.avgEngagementScore}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Row */}
            <ChartErrorBoundary fallbackTitle="Failed to load charts">
            <div className="grid lg:grid-cols-3 gap-6">
              <ChartErrorBoundary fallbackTitle="Failed to load visits chart">
              <div className="lg:col-span-2 bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  Visits Over Time
                </h3>
                <div className="h-48 sm:h-56 lg:h-64">
                  {visitsChartData && <Line data={visitsChartData} options={chartOptions} />}
                </div>
              </div>
              </ChartErrorBoundary>

              <ChartErrorBoundary fallbackTitle="Failed to load mode breakdown">
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-muted-foreground" />
                  Portfolio Modes
                </h3>
                <div className="h-36 sm:h-40 lg:h-48">
                  {modeChartData && <Doughnut data={modeChartData} options={doughnutOptions} />}
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    { label: 'XR & Research', value: analyticsData.modeBreakdown.xr, color: 'bg-green-500' },
                    { label: 'Full Stack', value: analyticsData.modeBreakdown.fullstack, color: 'bg-purple-500' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              </ChartErrorBoundary>
            </div>
            </ChartErrorBoundary>

            {/* Recent Activity & Top Pages */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {analyticsData.recentVisits.slice(0, 8).map((visit, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {visit.city === 'Unknown' || !visit.city ? '📍 Location Pending' : visit.city}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(visit.timestamp)}
                          </p>
                        </div>
                      </div>
                      {visit.mode && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          visit.mode === 'xr' ? 'bg-green-500/10 text-green-500' :
                          'bg-purple-500/10 text-purple-500'
                        }`}>
                          {visit.mode}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  Top Pages
                </h3>
                <div className="space-y-3">
                  {analyticsData.topPages.map((page, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
                        <span className="text-sm font-mono">{page.path || '/'}</span>
                      </div>
                      <span className="text-sm font-medium">{page.count}</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-semibold mt-6 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-muted-foreground" />
                  Traffic Sources
                </h3>
                <div className="space-y-3">
                  {analyticsData.topReferrers.map((ref, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">{ref.source}</span>
                      <span className="text-sm font-medium">{ref.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'visitors' && (
          <motion.div
            key="visitors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ChartErrorBoundary fallbackTitle="Failed to load hourly chart">
            <div className="bg-card p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Today&apos;s Hourly Activity</h3>
              <div className="h-48 sm:h-56 lg:h-64">
                {hourlyChartData && <Bar data={hourlyChartData} options={chartOptions} />}
              </div>
            </div>
            </ChartErrorBoundary>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                  Devices
                </h3>
                <div className="space-y-4">
                  {analyticsData.screenSizes.map((device, i) => {
                    const percentage = screenSizeTotal > 0 ? Math.round((device.count / screenSizeTotal) * 100) : 0
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{device.device}</span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4">Visitor Log</h3>
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card">
                      <tr className="text-left border-b">
                        <th className="pb-2 font-medium text-muted-foreground">Location</th>
                        <th className="pb-2 font-medium text-muted-foreground">Time</th>
                        <th className="pb-2 font-medium text-muted-foreground">Mode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.recentVisits.map((visit, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2">
                            {visit.city === 'Unknown' || !visit.city ? '📍 Location Pending' : `${visit.city}, ${visit.country}`}
                          </td>
                          <td className="py-2 text-muted-foreground" title={formatFullDate(visit.timestamp)}>
                            {formatDate(visit.timestamp)}
                          </td>
                          <td className="py-2">
                            {visit.mode ? (
                              <span className={`px-2 py-0.5 text-xs rounded ${
                                (visit.mode === 'xr' || visit.mode === 'phd') ? 'bg-green-500/10 text-green-500' :
                                'bg-purple-500/10 text-purple-500'
                              }`}>{visit.mode === 'phd' ? 'xr' : visit.mode}</span>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'geography' && (
          <GeographyTab
            locations={analyticsData.locations}
            topCountries={analyticsData.topCountries}
            topCities={analyticsData.topCities}
            geographyData={analyticsData.geographyData}
            totalVisitors={analyticsData.totalVisitors}
          />
        )}

        {activeTab === 'behavior' && (
          <motion.div
            key="behavior"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Interaction Event Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {behaviorCards.map(card => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card p-4 rounded-xl border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${card.bg}`}>{card.icon}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">{card.label}</p>
                      <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4">Portfolio Mode Preferences</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'XR & Research', value: analyticsData.modeBreakdown.xr, bgClass: 'bg-green-500/5 border-green-500/20', icon: '🥽' },
                    { label: 'Full Stack', value: analyticsData.modeBreakdown.fullstack, bgClass: 'bg-purple-500/5 border-purple-500/20', icon: '💻' },
                  ].map(mode => {
                    const total = analyticsData.modeBreakdown.xr + analyticsData.modeBreakdown.fullstack
                    const pct = total > 0 ? Math.round((mode.value / total) * 100) : 0
                    return (
                      <div key={mode.label} className={`p-4 rounded-xl border ${mode.bgClass}`}>
                        <div className="text-2xl mb-2">{mode.icon}</div>
                        <p className="text-sm text-muted-foreground">{mode.label}</p>
                        <p className="text-2xl font-bold">{mode.value}</p>
                        <p className="text-xs text-muted-foreground">{pct}% of total</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4">Traffic Sources</h3>
                <div className="space-y-4">
                  {analyticsData.topReferrers.map((ref, i) => {
                    const pct = referrerTotal > 0 ? Math.round((ref.count / referrerTotal) * 100) : 0
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="truncate">{ref.source}</span>
                          <span className="font-medium ml-2">{ref.count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Page Performance */}
            <ChartErrorBoundary fallbackTitle="Failed to load page performance">
            <div className="bg-card p-6 rounded-xl border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-muted-foreground" />
                Page Views & Time Spent
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3 font-medium text-muted-foreground">Page</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Views</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Timer className="w-3 h-3" />
                          Avg. Time
                        </div>
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Scroll Depth</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.topPages.map((page, i) => {
                      const pct = topPagesTotal > 0 ? Math.round((page.count / topPagesTotal) * 100) : 0
                      return (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="py-3 font-mono text-sm">{page.path || '/'}</td>
                          <td className="py-3 text-right font-medium">{page.count}</td>
                          <td className="py-3 text-right">
                            <span className={`text-sm font-medium ${page.avgTimeMs && page.avgTimeMs > 30000 ? 'text-green-500' : page.avgTimeMs && page.avgTimeMs > 10000 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                              {formatDuration(page.avgTimeMs || 0)}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {page.avgScrollDepth ? (
                              <span className={`text-sm font-medium ${page.avgScrollDepth >= 75 ? 'text-green-500' : page.avgScrollDepth >= 50 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                                {page.avgScrollDepth}%
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-sm text-muted-foreground w-10">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            </ChartErrorBoundary>

            {/* Scroll Depth Distribution */}
            {analyticsData.scrollDepthDistribution && analyticsData.scrollDepthDistribution.length > 0 && (
              <ChartErrorBoundary fallbackTitle="Failed to load scroll depth">
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-muted-foreground" />
                  Scroll Depth Distribution
                </h3>
                <p className="text-sm text-muted-foreground mb-4">How far users scroll on your pages</p>
                <div className="space-y-4">
                  {(() => {
                    const totalSessions = analyticsData.totalPageSessions || analyticsData.scrollDepthDistribution[0]?.count || 1
                    return analyticsData.scrollDepthDistribution.map((item) => {
                      const pct = totalSessions > 0 ? Math.min(Math.round((item.count / totalSessions) * 100), 100) : 0
                      const barColor = item.depth === 100 ? 'bg-green-500' :
                        item.depth >= 75 ? 'bg-emerald-500' :
                        item.depth >= 50 ? 'bg-yellow-500' : 'bg-primary/60'
                      return (
                        <div key={item.depth} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium whitespace-nowrap">
                            {item.depth}% depth
                          </div>
                          <div className="flex-1 h-6 bg-muted/40 rounded-lg overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(pct, 2)}%` }}
                              transition={{ duration: 0.5 }}
                              className={`h-full rounded-lg ${barColor}`}
                            />
                            <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold">
                              {pct}%
                            </span>
                          </div>
                          <div className="w-24 text-right text-xs text-muted-foreground">
                            {item.count} sessions
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
              </ChartErrorBoundary>
            )}

            {/* Section Engagement */}
            {sortedSectionEngagement.sorted.length > 0 && (
              <ChartErrorBoundary fallbackTitle="Failed to load section engagement">
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Timer className="w-5 h-5 text-muted-foreground" />
                  Section Engagement
                </h3>
                <div className="space-y-3">
                  {sortedSectionEngagement.sorted.map((section, i) => {
                    const pct = Math.round((section.avgTimeMs / sortedSectionEngagement.maxTime) * 100)
                    const healthColor = section.avgTimeMs >= sortedSectionEngagement.medianTime * 1.2
                      ? 'bg-green-500'
                      : section.avgTimeMs >= sortedSectionEngagement.medianTime * 0.5
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                    return (
                      <div key={section.section} className="flex items-center gap-4">
                        <div className="w-28 text-sm font-medium capitalize truncate">{section.section}</div>
                        <div className="flex-1 h-7 bg-muted/40 rounded-lg overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className={`h-full rounded-lg ${healthColor}`}
                          />
                          <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-foreground">
                            {formatDuration(section.avgTimeMs)}
                          </span>
                        </div>
                        <div className="w-16 text-right text-xs text-muted-foreground">{section.views} views</div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> Above median</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500 inline-block" /> Near median</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> Below median</span>
                </div>
              </div>
              </ChartErrorBoundary>
            )}

            {/* Section View-Through Funnel */}
            {analyticsData.sectionFunnel && analyticsData.sectionFunnel.length > 0 && (
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-muted-foreground" />
                  Section View-Through Funnel
                </h3>
                <p className="text-sm text-muted-foreground mb-4">What % of sessions reach each section</p>
                <div className="space-y-2">
                  {analyticsData.sectionFunnel.map((item, i) => (
                    <div key={item.section} className="flex items-center gap-3">
                      <div className="w-28 text-sm font-medium capitalize truncate">{item.section}</div>
                      <div className="flex-1 h-6 bg-muted/40 rounded overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.rate}%` }}
                          transition={{ duration: 0.5, delay: i * 0.06 }}
                          className="h-full rounded bg-primary/70"
                        />
                        <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold">
                          {item.rate}%
                        </span>
                      </div>
                      <div className="w-20 text-right text-xs text-muted-foreground">{item.uniqueSessions} sessions</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversion Funnel */}
            {analyticsData.conversionFunnel && analyticsData.conversionFunnel.length > 0 && (
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  Conversion Funnel
                </h3>
                <div className="space-y-3">
                  {(() => {
                    const funnel = analyticsData.conversionFunnel
                    const maxCount = funnel[0]?.count || 1
                    return funnel.map((stage, i) => {
                      const pct = maxCount > 0 ? Math.round((stage.count / maxCount) * 100) : 0
                      const dropOff = i > 0 && funnel[i - 1].count > 0
                        ? Math.round(((funnel[i - 1].count - stage.count) / funnel[i - 1].count) * 100)
                        : 0
                      const colors = ['bg-primary', 'bg-blue-500', 'bg-amber-500', 'bg-green-500']
                      return (
                        <div key={stage.stage}>
                          {i > 0 && dropOff > 0 && (
                            <div className="flex items-center justify-center py-1">
                              <span className="text-xs text-red-400 font-medium">-{dropOff}% drop-off</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <div className="w-40 text-sm font-medium">{stage.stage}</div>
                            <div className="flex-1 relative">
                              <div
                                className={`h-10 rounded-lg ${colors[i] || 'bg-primary'} flex items-center px-4 transition-all`}
                                style={{ width: `${Math.max(pct, 8)}%` }}
                              >
                                <span className="text-sm font-bold text-white whitespace-nowrap">
                                  {stage.count} ({pct}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            )}

            {/* Recent Events Log */}
            {analyticsData.recentEvents && analyticsData.recentEvents.length > 0 && (
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  Recent Interaction Events
                </h3>
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card">
                      <tr className="text-left border-b">
                        <th className="pb-2 font-medium text-muted-foreground">Event</th>
                        <th className="pb-2 font-medium text-muted-foreground">Target</th>
                        <th className="pb-2 font-medium text-muted-foreground">Page</th>
                        <th className="pb-2 font-medium text-muted-foreground text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.recentEvents.map((event, i) => {
                        const badge = badgeColors[event.eventType] || 'bg-muted text-muted-foreground'
                        return (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${badge}`}>
                                {event.eventType.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-2 text-muted-foreground max-w-[150px] truncate">{event.eventTarget || '-'}</td>
                            <td className="py-2 font-mono text-muted-foreground text-xs">{event.pathname}</td>
                            <td className="py-2 text-right text-muted-foreground" title={formatFullDate(event.timestamp)}>
                              {formatDate(event.timestamp)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
