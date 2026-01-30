'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import {
  Users, TrendingUp, Globe, Activity, Calendar,
  PieChart, Monitor, Clock, MapPin, BarChart3, Eye, MousePointer,
  Layers, RefreshCw, LogOut, Home, ArrowUpRight, ArrowDownRight,
  ChevronRight, Building, Flag, ZoomIn, ZoomOut, RotateCcw, Timer
} from 'lucide-react'
import toast from 'react-hot-toast'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
)

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Format timestamp to readable format
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
  modeBreakdown: { phd: number; xr: number; fullstack: number }
  topCountries: { country: string; count: number }[]
  topCities: { city: string; count: number }[]
  visitsOverTime: { date: string; count: number }[]
  recentVisits: { timestamp: string; city: string; country: string; mode?: string }[]
  locations: { lat: number; lng: number; city: string }[]
  hourlyDistribution: number[]
  screenSizes: { device: string; count: number }[]
  topReferrers: { source: string; count: number }[]
  topPages: { path: string; count: number; avgTimeMs?: number; totalTimeMs?: number }[]
  geographyData: GeoCountry[]
  sectionEngagement: { section: string; avgTimeMs: number; totalTimeMs: number; views: number }[]
}

type TabType = 'overview' | 'visitors' | 'geography' | 'behavior'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set())
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set())
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapZoom, setMapZoom] = useState(1)
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 20])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => { checkAuth() }, [])

  // Auto-refresh every 60 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(() => {
      fetchAnalytics()
    }, 60000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      if (res.ok) {
        setIsAuthenticated(true)
        fetchAnalytics()
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
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
        setIsAuthenticated(true)
        fetchAnalytics()
        toast.success('Welcome back!')
      } else {
        toast.error('Invalid password')
      }
    } catch {
      toast.error('Login failed')
    }
  }

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true)
      const res = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      if (res.ok) {
        const data = await res.json()
        // Ensure all required fields have defaults
        setAnalyticsData({
          totalVisitors: data.totalVisitors || 0,
          todayVisitors: data.todayVisitors || 0,
          yesterdayVisitors: data.yesterdayVisitors || 0,
          weeklyVisitors: data.weeklyVisitors || 0,
          monthlyVisitors: data.monthlyVisitors || 0,
          uniqueVisitors: data.uniqueVisitors || 0,
          uniqueSessions: data.uniqueSessions || 0,
          growthRate: data.growthRate || 0,
          modeBreakdown: data.modeBreakdown || { phd: 0, xr: 0, fullstack: 0 },
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
          sectionEngagement: data.sectionEngagement || []
        })
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('Analytics API error:', res.status, errorData)
        toast.error(`Failed to fetch analytics: ${errorData.error || res.statusText}`)
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      toast.error('Failed to fetch analytics')
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

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
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'visitors', label: 'Visitors', icon: <Users className="w-4 h-4" /> },
    { id: 'geography', label: 'Geography', icon: <Globe className="w-4 h-4" /> },
    { id: 'behavior', label: 'Behavior', icon: <MousePointer className="w-4 h-4" /> },
  ]

  const StatCard = ({ title, value, subtitle, icon, trend, color = 'primary' }: {
    title: string; value: string | number; subtitle?: string; icon: React.ReactNode; trend?: number; color?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-5 rounded-xl border hover:shadow-lg transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(trend)}% vs yesterday</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-${color}/10`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Analytics</h1>
                <p className="text-xs text-muted-foreground">
                  {lastUpdated ? `Updated ${formatDate(lastUpdated.toISOString())}` : 'Portfolio Dashboard'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchAnalytics}
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

          {/* Tabs */}
          <div className="flex gap-1 mt-4 bg-muted/50 p-1 rounded-xl w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Visits Over Time */}
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    Visits Over Time
                  </h3>
                  <div className="h-64">
                    <Line
                      data={{
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
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Mode Breakdown */}
                <div className="bg-card p-6 rounded-xl border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-muted-foreground" />
                    Portfolio Modes
                  </h3>
                  <div className="h-48">
                    <Doughnut
                      data={{
                        labels: ['PhD Research', 'XR Developer', 'Full Stack'],
                        datasets: [{
                          data: [
                            analyticsData.modeBreakdown.phd,
                            analyticsData.modeBreakdown.xr,
                            analyticsData.modeBreakdown.fullstack
                          ],
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(139, 92, 246, 0.8)'
                          ],
                          borderWidth: 0
                        }]
                      }}
                      options={{ ...chartOptions, cutout: '60%' }}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: 'PhD Research', value: analyticsData.modeBreakdown.phd, color: 'bg-blue-500' },
                      { label: 'XR Developer', value: analyticsData.modeBreakdown.xr, color: 'bg-green-500' },
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
              </div>

              {/* Recent Activity & Top Pages */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Visits */}
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
                              {visit.city === 'Unknown' ? 'Local' : visit.city}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(visit.timestamp)}
                            </p>
                          </div>
                        </div>
                        {visit.mode && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            visit.mode === 'phd' ? 'bg-blue-500/10 text-blue-500' :
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

                {/* Top Pages & Referrers */}
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
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Hourly Distribution */}
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="font-semibold mb-4">Today's Hourly Activity</h3>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                      datasets: [{
                        data: analyticsData.hourlyDistribution,
                        backgroundColor: 'rgba(99, 102, 241, 0.6)',
                        borderRadius: 4
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-xl border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-muted-foreground" />
                    Devices
                  </h3>
                  <div className="space-y-4">
                    {analyticsData.screenSizes.map((device, i) => {
                      const total = analyticsData.screenSizes.reduce((a, b) => a + b.count, 0)
                      const percentage = total > 0 ? Math.round((device.count / total) * 100) : 0
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

                {/* All Visitors Table */}
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
                              {visit.city === 'Unknown' ? 'Local' : `${visit.city}, ${visit.country}`}
                            </td>
                            <td className="py-2 text-muted-foreground" title={formatFullDate(visit.timestamp)}>
                              {formatDate(visit.timestamp)}
                            </td>
                            <td className="py-2">
                              {visit.mode ? (
                                <span className={`px-2 py-0.5 text-xs rounded ${
                                  visit.mode === 'phd' ? 'bg-blue-500/10 text-blue-500' :
                                  visit.mode === 'xr' ? 'bg-green-500/10 text-green-500' :
                                  'bg-purple-500/10 text-purple-500'
                                }`}>{visit.mode}</span>
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
            <motion.div
              key="geography"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Enhanced World Map */}
              <div className="bg-card rounded-xl border overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Global Visitor Distribution
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {analyticsData.locations.length} locations tracked across {analyticsData.topCountries.length} countries
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                      <span className="text-muted-foreground">Active regions</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  {/* Map Stats Overlay */}
                  <div className="absolute top-4 left-4 z-10 space-y-2">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
                      <p className="text-xs text-muted-foreground">Total Locations</p>
                      <p className="text-2xl font-bold">{analyticsData.locations.length}</p>
                    </div>
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
                      <p className="text-xs text-muted-foreground">Top Country</p>
                      <p className="text-lg font-semibold">{analyticsData.topCountries[0]?.country || 'N/A'}</p>
                      <p className="text-xs text-primary">{analyticsData.topCountries[0]?.count || 0} visitors</p>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
                    <p className="text-xs font-medium mb-2">Visitor Density</p>
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-primary/30" />
                      <span className="w-5 h-5 rounded-full bg-primary/50" />
                      <span className="w-6 h-6 rounded-full bg-primary/70" />
                      <span className="w-7 h-7 rounded-full bg-primary" />
                      <span className="text-xs text-muted-foreground ml-2">Low → High</span>
                    </div>
                  </div>

                  <div className="h-[500px] bg-gradient-to-b from-slate-900 to-slate-800 relative">
                    {/* Zoom Controls */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-1">
                      <button
                        onClick={() => setMapZoom(z => Math.min(z * 1.5, 8))}
                        className="p-2 bg-background/90 backdrop-blur-sm rounded-lg border shadow-lg hover:bg-background transition-colors"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setMapZoom(z => Math.max(z / 1.5, 1))}
                        className="p-2 bg-background/90 backdrop-blur-sm rounded-lg border shadow-lg hover:bg-background transition-colors"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setMapZoom(1); setMapCenter([0, 20]); }}
                        className="p-2 bg-background/90 backdrop-blur-sm rounded-lg border shadow-lg hover:bg-background transition-colors"
                        title="Reset view"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Zoom Level Indicator */}
                    <div className="absolute top-4 right-20 z-20 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 border shadow-lg">
                      <span className="text-xs text-muted-foreground">{Math.round(mapZoom * 100)}%</span>
                    </div>

                    {!mapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-900/80">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                          <span className="text-sm text-slate-400">Loading world map...</span>
                        </div>
                      </div>
                    )}
                    {analyticsData.locations.length === 0 && mapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 border text-center">
                          <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No visitor locations yet</p>
                          <p className="text-xs text-muted-foreground mt-1">Locations appear when visitors allow geolocation</p>
                        </div>
                      </div>
                    )}
                    <ComposableMap
                      projectionConfig={{
                        scale: 147,
                        center: [0, 30]
                      }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <ZoomableGroup
                        zoom={mapZoom}
                        center={mapCenter}
                        onMoveEnd={({ coordinates, zoom }) => {
                          setMapCenter(coordinates as [number, number])
                          setMapZoom(zoom)
                        }}
                        minZoom={1}
                        maxZoom={8}
                      >
                        <Geographies geography={geoUrl}>
                          {({ geographies }) => {
                            if (!mapLoaded && geographies.length > 0) {
                              setTimeout(() => setMapLoaded(true), 100)
                            }
                            return geographies.map(geo => {
                              const geoName = geo.properties.name || geo.properties.NAME
                              const countryData = analyticsData.topCountries.find(
                                c => c.country?.toLowerCase() === geoName?.toLowerCase() ||
                                     c.country?.includes(geoName) ||
                                     geoName?.includes(c.country)
                              )
                              const hasVisitors = countryData && countryData.count > 0
                              const intensity = countryData
                                ? Math.min(countryData.count / (analyticsData.topCountries[0]?.count || 1), 1)
                                : 0

                              return (
                                <Geography
                                  key={geo.rsmKey}
                                  geography={geo}
                                  fill={hasVisitors
                                    ? `rgba(99, 102, 241, ${0.3 + intensity * 0.5})`
                                    : '#334155'
                                  }
                                  stroke="#475569"
                                  strokeWidth={0.4}
                                  style={{
                                    default: { outline: 'none' },
                                    hover: {
                                      fill: hasVisitors ? '#818cf8' : '#3f4f63',
                                      outline: 'none',
                                      cursor: 'pointer'
                                    },
                                    pressed: { outline: 'none' }
                                  }}
                                />
                              )
                            })
                          }}
                        </Geographies>

                        {/* Visitor Markers */}
                        {analyticsData.locations.map((loc, i) => {
                          const cityCount = analyticsData.topCities.find(c => c.city === loc.city)?.count || 1
                          const maxCount = analyticsData.topCities[0]?.count || 1
                          const size = (5 + (cityCount / maxCount) * 10) / mapZoom

                          return (
                            <Marker key={i} coordinates={[loc.lng, loc.lat]}>
                              <g filter="url(#glow)">
                                {/* Pulse ring */}
                                <circle r={size + 6 / mapZoom} fill="none" stroke="#818cf8" strokeWidth={1.5 / mapZoom} opacity={0.3}>
                                  <animate attributeName="r" from={size} to={size + 15 / mapZoom} dur="2s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                                </circle>
                                {/* Main dot */}
                                <circle r={size} fill="#6366f1" stroke="#fff" strokeWidth={1.5 / mapZoom} />
                                <circle r={size * 0.4} fill="#fff" opacity={0.8} />
                              </g>
                              <title>{`${loc.city}: ${cityCount} visitor${cityCount > 1 ? 's' : ''}`}</title>
                            </Marker>
                          )
                        })}
                      </ZoomableGroup>
                    </ComposableMap>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsData.topCountries.slice(0, 4).map((country, i) => (
                  <motion.div
                    key={country.country}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card p-4 rounded-xl border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        i === 0 ? 'bg-yellow-500/10' :
                        i === 1 ? 'bg-slate-500/10' :
                        i === 2 ? 'bg-amber-500/10' : 'bg-muted'
                      }`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🌍'}
                      </div>
                      <div>
                        <p className="font-medium">{country.country}</p>
                        <p className="text-sm text-muted-foreground">{country.count} visitors</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Geographic Hierarchy: Country → State → City */}
              <div className="bg-card rounded-xl border">
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Flag className="w-5 h-5 text-primary" />
                    Geographic Breakdown
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click to expand Country → State/Region → City
                  </p>
                </div>
                <div className="divide-y max-h-[500px] overflow-y-auto">
                  {analyticsData.geographyData?.map((country, countryIdx) => {
                    const isCountryExpanded = expandedCountries.has(country.country)
                    const countryPercentage = Math.round((country.count / analyticsData.totalVisitors) * 100)

                    return (
                      <div key={country.country} className="group">
                        {/* Country Level */}
                        <button
                          onClick={() => {
                            const newExpanded = new Set(expandedCountries)
                            if (isCountryExpanded) {
                              newExpanded.delete(country.country)
                            } else {
                              newExpanded.add(country.country)
                            }
                            setExpandedCountries(newExpanded)
                          }}
                          className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                        >
                          <motion.div
                            animate={{ rotate: isCountryExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                            countryIdx === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                            countryIdx === 1 ? 'bg-slate-500/20 text-slate-600' :
                            countryIdx === 2 ? 'bg-amber-500/20 text-amber-600' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {countryIdx < 3 ? ['🥇', '🥈', '🥉'][countryIdx] : <Globe className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{country.country}</span>
                              <span className="text-sm font-medium">{country.count} visitors</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${countryPercentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-10">{countryPercentage}%</span>
                            </div>
                          </div>
                        </button>

                        {/* States Level */}
                        <AnimatePresence>
                          {isCountryExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-muted/30"
                            >
                              {country.states.map((state) => {
                                const stateKey = `${country.country}-${state.state}`
                                const isStateExpanded = expandedStates.has(stateKey)
                                const statePercentage = Math.round((state.count / country.count) * 100)

                                return (
                                  <div key={stateKey}>
                                    {/* State Row */}
                                    <button
                                      onClick={() => {
                                        const newExpanded = new Set(expandedStates)
                                        if (isStateExpanded) {
                                          newExpanded.delete(stateKey)
                                        } else {
                                          newExpanded.add(stateKey)
                                        }
                                        setExpandedStates(newExpanded)
                                      }}
                                      className="w-full pl-12 pr-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left border-t border-muted/50"
                                    >
                                      <motion.div
                                        animate={{ rotate: isStateExpanded ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                      </motion.div>
                                      <Building className="w-4 h-4 text-blue-500" />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium text-sm">{state.state}</span>
                                          <span className="text-sm text-muted-foreground">{state.count}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-blue-500 rounded-full"
                                              style={{ width: `${statePercentage}%` }}
                                            />
                                          </div>
                                          <span className="text-xs text-muted-foreground w-8">{statePercentage}%</span>
                                        </div>
                                      </div>
                                    </button>

                                    {/* Cities Level */}
                                    <AnimatePresence>
                                      {isStateExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          {state.cities.map((city) => {
                                            const cityPercentage = Math.round((city.count / state.count) * 100)
                                            return (
                                              <div
                                                key={city.city}
                                                className="pl-20 pr-4 py-2 flex items-center gap-3 bg-muted/20 border-t border-muted/30"
                                              >
                                                <MapPin className="w-3 h-3 text-green-500" />
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-sm">{city.city}</span>
                                                    <span className="text-xs text-muted-foreground">{city.count}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="flex-1 h-0.5 bg-muted rounded-full overflow-hidden">
                                                      <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${cityPercentage}%` }}
                                                      />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground w-8">{cityPercentage}%</span>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-xl border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    Visitors by Country
                  </h3>
                  <div className="h-72">
                    <Bar
                      data={{
                        labels: analyticsData.topCountries.slice(0, 8).map(c => c.country),
                        datasets: [{
                          data: analyticsData.topCountries.slice(0, 8).map(c => c.count),
                          backgroundColor: analyticsData.topCountries.slice(0, 8).map((_, i) =>
                            `rgba(99, 102, 241, ${1 - i * 0.1})`
                          ),
                          borderRadius: 6,
                          borderSkipped: false,
                        }]
                      }}
                      options={{
                        ...chartOptions,
                        indexAxis: 'y' as const,
                        plugins: {
                          ...chartOptions.plugins,
                          tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            padding: 12,
                            cornerRadius: 8,
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    Top Cities
                  </h3>
                  <div className="space-y-3">
                    {analyticsData.topCities.slice(0, 8).map((city, i) => {
                      const maxCount = analyticsData.topCities[0]?.count || 1
                      const percentage = Math.round((city.count / maxCount) * 100)
                      return (
                        <div key={i} className="group">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                              }`}>
                                {i + 1}
                              </span>
                              <span className="font-medium group-hover:text-primary transition-colors">
                                {city.city}
                              </span>
                            </div>
                            <span className="text-sm font-semibold">{city.count}</span>
                          </div>
                          <div className="ml-9 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: i * 0.05 }}
                              className={`h-full rounded-full ${
                                i === 0 ? 'bg-primary' :
                                i === 1 ? 'bg-primary/80' :
                                i === 2 ? 'bg-primary/60' : 'bg-primary/40'
                              }`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'behavior' && (
            <motion.div
              key="behavior"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Mode Selection Trends */}
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border">
                  <h3 className="font-semibold mb-4">Portfolio Mode Preferences</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'PhD Research', value: analyticsData.modeBreakdown.phd, color: 'blue', icon: '🎓' },
                      { label: 'XR Developer', value: analyticsData.modeBreakdown.xr, color: 'green', icon: '🥽' },
                      { label: 'Full Stack', value: analyticsData.modeBreakdown.fullstack, color: 'purple', icon: '💻' },
                    ].map(mode => {
                      const total = analyticsData.modeBreakdown.phd + analyticsData.modeBreakdown.xr + analyticsData.modeBreakdown.fullstack
                      const pct = total > 0 ? Math.round((mode.value / total) * 100) : 0
                      return (
                        <div key={mode.label} className={`p-4 rounded-xl bg-${mode.color}-500/5 border border-${mode.color}-500/20`}>
                          <div className="text-2xl mb-2">{mode.icon}</div>
                          <p className="text-sm text-muted-foreground">{mode.label}</p>
                          <p className="text-2xl font-bold">{mode.value}</p>
                          <p className="text-xs text-muted-foreground">{pct}% of total</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-card p-6 rounded-xl border">
                  <h3 className="font-semibold mb-4">Traffic Sources</h3>
                  <div className="space-y-4">
                    {analyticsData.topReferrers.map((ref, i) => {
                      const total = analyticsData.topReferrers.reduce((a, b) => a + b.count, 0)
                      const pct = total > 0 ? Math.round((ref.count / total) * 100) : 0
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
                        <th className="pb-3 font-medium text-muted-foreground text-right">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topPages.map((page, i) => {
                        const total = analyticsData.topPages.reduce((a, b) => a + b.count, 0)
                        const pct = total > 0 ? Math.round((page.count / total) * 100) : 0
                        return (
                          <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="py-3 font-mono text-sm">{page.path || '/'}</td>
                            <td className="py-3 text-right font-medium">{page.count}</td>
                            <td className="py-3 text-right">
                              <span className={`text-sm ${page.avgTimeMs && page.avgTimeMs > 30000 ? 'text-green-500' : page.avgTimeMs && page.avgTimeMs > 10000 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                                {formatDuration(page.avgTimeMs || 0)}
                              </span>
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

              {/* Section Engagement */}
              {analyticsData.sectionEngagement && analyticsData.sectionEngagement.length > 0 && (
                <div className="bg-card p-6 rounded-xl border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-muted-foreground" />
                    Section Engagement
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analyticsData.sectionEngagement.map((section, i) => {
                      const maxTime = analyticsData.sectionEngagement[0]?.avgTimeMs || 1
                      const percentage = Math.round((section.avgTimeMs / maxTime) * 100)
                      return (
                        <div key={section.section} className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium capitalize">{section.section}</span>
                            <span className="text-xs text-muted-foreground">{section.views} views</span>
                          </div>
                          <div className="text-2xl font-bold text-primary mb-1">
                            {formatDuration(section.avgTimeMs)}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">avg. time spent</div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
