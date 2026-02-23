'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Activity, Eye, MousePointer, Layers, Timer, Mail, Download
} from 'lucide-react'
import { formatDate, formatFullDate, formatDuration } from './format-utils'
import ChartErrorBoundary from './ChartErrorBoundary'
import type { AnalyticsData } from './types'

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

export default function BehaviorTab({ analyticsData }: { analyticsData: AnalyticsData }) {
  const referrerTotal = useMemo(
    () => analyticsData.topReferrers.reduce((a, b) => a + b.count, 0) || 0,
    [analyticsData.topReferrers]
  )

  const topPagesTotal = useMemo(
    () => analyticsData.topPages.reduce((a, b) => a + b.count, 0) || 0,
    [analyticsData.topPages]
  )

  const behaviorCards = useMemo(() => {
    const projectClicks = analyticsData.topEvents.filter(e => e.eventType.startsWith('project_')).reduce((a, b) => a + b.count, 0)
    const contactClicks = analyticsData.topEvents.filter(e => ['contact_email_click', 'contact_phone_click', 'social_link_click'].includes(e.eventType)).reduce((a, b) => a + b.count, 0)
    const resumeDownloads = analyticsData.topEvents.find(e => e.eventType === 'resume_download')?.count || 0
    return [
      { label: 'Project Clicks', value: projectClicks, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <MousePointer className="w-5 h-5 text-blue-500" /> },
      { label: 'Contact Clicks', value: contactClicks, color: 'text-green-500', bg: 'bg-green-500/10', icon: <Mail className="w-5 h-5 text-green-500" /> },
      { label: 'Resume Downloads', value: resumeDownloads, color: 'text-amber-500', bg: 'bg-amber-500/10', icon: <Download className="w-5 h-5 text-amber-500" /> },
      { label: 'Engagement Score', value: analyticsData.avgEngagementScore, color: 'text-purple-500', bg: 'bg-purple-500/10', icon: <Activity className="w-5 h-5 text-purple-500" /> },
    ]
  }, [analyticsData.topEvents, analyticsData.avgEngagementScore])

  const sortedSectionEngagement = useMemo(() => {
    if (!analyticsData.sectionEngagement?.length) return { sorted: [], maxTime: 1, medianTime: 0 }
    const sorted = [...analyticsData.sectionEngagement].sort((a, b) => b.avgTimeMs - a.avgTimeMs)
    return {
      sorted,
      maxTime: sorted[0]?.avgTimeMs || 1,
      medianTime: sorted[Math.floor(sorted.length / 2)].avgTimeMs,
    }
  }, [analyticsData.sectionEngagement])

  return (
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
  )
}
