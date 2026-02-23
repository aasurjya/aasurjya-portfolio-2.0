'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bar } from 'react-chartjs-2'
import { Monitor } from 'lucide-react'
import { chartOptions, hourlyLabels } from './chart-config'
import { formatDate, formatFullDate } from './format-utils'
import ChartErrorBoundary from './ChartErrorBoundary'
import type { AnalyticsData } from './types'

export default function VisitorsTab({ analyticsData }: { analyticsData: AnalyticsData }) {
  const hourlyChartData = useMemo(() => ({
    labels: hourlyLabels,
    datasets: [{
      data: analyticsData.hourlyDistribution,
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderRadius: 4
    }]
  }), [analyticsData.hourlyDistribution])

  const screenSizeTotal = useMemo(
    () => analyticsData.screenSizes.reduce((a, b) => a + b.count, 0) || 0,
    [analyticsData.screenSizes]
  )

  return (
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
          <Bar data={hourlyChartData} options={chartOptions} />
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
  )
}
