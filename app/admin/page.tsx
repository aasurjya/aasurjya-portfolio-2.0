'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
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
import {
  Users, Globe, Home, MousePointer,
  RefreshCw, LogOut, BarChart3, Bot
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate } from '@/components/admin/format-utils'
import type { AnalyticsData } from '@/components/admin/types'
import OverviewTab from '@/components/admin/OverviewTab'
import VisitorsTab from '@/components/admin/VisitorsTab'
import BehaviorTab from '@/components/admin/BehaviorTab'
import AITab from '@/components/admin/AITab'

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

type TabType = 'overview' | 'visitors' | 'geography' | 'behavior' | 'ai'

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
  { id: 'ai', label: 'AI', icon: <Bot className="w-4 h-4" /> },
]

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
          conversionFunnel: data.conversionFunnel || [],
          aiAnalytics: data.aiAnalytics || undefined,
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
        {activeTab === 'overview' && <OverviewTab analyticsData={analyticsData} />}

        {activeTab === 'visitors' && <VisitorsTab analyticsData={analyticsData} />}

        {activeTab === 'geography' && (
          <GeographyTab
            locations={analyticsData.locations}
            topCountries={analyticsData.topCountries}
            topCities={analyticsData.topCities}
            geographyData={analyticsData.geographyData}
            totalVisitors={analyticsData.totalVisitors}
          />
        )}

        {activeTab === 'behavior' && <BehaviorTab analyticsData={analyticsData} />}

        {activeTab === 'ai' && <AITab analyticsData={analyticsData} />}
      </main>
    </div>
  )
}
