'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { Users, TrendingUp, Globe, Activity, Calendar, PieChart } from 'lucide-react'
import toast from 'react-hot-toast'

// Register ChartJS components
ChartJS.register(
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
)

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json'

interface AnalyticsData {
  totalVisitors: number
  todayVisitors: number
  modeBreakdown: {
    phd: number
    xr: number
    fullstack: number
  }
  topCountries: { country: string; count: number }[]
  topCities: { city: string; count: number }[]
  visitsOverTime: { date: string; count: number }[]
  recentVisits: {
    timestamp: string
    city: string
    country: string
    mode?: string
  }[]
  locations: { lat: number; lng: number; city: string }[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      if (res.ok) {
        setIsAuthenticated(true)
        fetchAnalytics()
      } else {
        setLoading(false)
      }
    } catch (error) {
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
        toast.success('Logged in successfully')
      } else {
        toast.error('Invalid password')
      }
    } catch (error) {
      toast.error('Login failed')
    }
  }

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-8 rounded-lg border shadow-lg max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 bg-background border rounded-lg mb-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No analytics data available</p>
      </div>
    )
  }

  // Chart configurations
  const visitsChartData = {
    labels: analyticsData.visitsOverTime.map(d => d.date),
    datasets: [{
      label: 'Daily Visits',
      data: analyticsData.visitsOverTime.map(d => d.count),
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  const modeChartData = {
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
      ]
    }]
  }

  const countriesChartData = {
    labels: analyticsData.topCountries.map(c => c.country),
    datasets: [{
      label: 'Visitors by Country',
      data: analyticsData.topCountries.map(c => c.count),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1
    }]
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken')
              router.push('/')
            }}
            className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-lg border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
                <p className="text-2xl font-bold">{analyticsData.totalVisitors}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card p-6 rounded-lg border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Visitors</p>
                <p className="text-2xl font-bold">{analyticsData.todayVisitors}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-6 rounded-lg border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Countries</p>
                <p className="text-2xl font-bold">{analyticsData.topCountries.length}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card p-6 rounded-lg border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold">{analyticsData.recentVisits.length}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Visits Over Time */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card p-6 rounded-lg border"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Visits Over Time
            </h3>
            <Line data={visitsChartData} options={{ responsive: true }} />
          </motion.div>

          {/* Mode Breakdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card p-6 rounded-lg border"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Mode Selection
            </h3>
            <Doughnut data={modeChartData} options={{ responsive: true }} />
          </motion.div>
        </div>

        {/* World Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card p-6 rounded-lg border mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Visitor Locations</h3>
          <div className="h-96">
            <ComposableMap>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#E5E7EB"
                      stroke="#D1D5DB"
                    />
                  ))
                }
              </Geographies>
              {analyticsData.locations.map((location, index) => (
                <Marker key={index} coordinates={[location.lng, location.lat]}>
                  <circle r={4} fill="#6366F1" />
                  <title>{location.city}</title>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </motion.div>

        {/* Countries Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card p-6 rounded-lg border"
        >
          <h3 className="text-lg font-semibold mb-4">Top Countries</h3>
          <Bar data={countriesChartData} options={{ responsive: true }} />
        </motion.div>

        {/* Recent Visits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card p-6 rounded-lg border mt-6"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Visits</h3>
          <div className="space-y-2">
            {analyticsData.recentVisits.slice(0, 10).map((visit, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{visit.city}, {visit.country}</p>
                  <p className="text-sm text-muted-foreground">{visit.timestamp}</p>
                </div>
                {visit.mode && (
                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                    {visit.mode}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
