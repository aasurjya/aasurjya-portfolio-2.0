'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Users, TrendingUp, Calendar, PieChart, Clock, MapPin,
  Eye, Layers, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { chartOptions, doughnutOptions } from './chart-config'
import { formatDate } from './format-utils'
import ChartErrorBoundary from './ChartErrorBoundary'
import type { AnalyticsData } from './types'

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

export default function OverviewTab({ analyticsData }: { analyticsData: AnalyticsData }) {
  const visitsChartData = useMemo(() => ({
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
  }), [analyticsData.visitsOverTime])

  const modeChartData = useMemo(() => ({
    labels: ['XR & Research', 'Full Stack'],
    datasets: [{
      data: [analyticsData.modeBreakdown.xr, analyticsData.modeBreakdown.fullstack],
      backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(139, 92, 246, 0.8)'],
      borderWidth: 0
    }]
  }), [analyticsData.modeBreakdown])

  return (
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
            <Line data={visitsChartData} options={chartOptions} />
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
            <Doughnut data={modeChartData} options={doughnutOptions} />
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
  )
}
