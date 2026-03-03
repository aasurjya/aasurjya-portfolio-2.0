'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bot, MessageCircle, Volume2, TrendingUp, HelpCircle } from 'lucide-react'
import type { AnalyticsData } from './types'

export default function AITab({ analyticsData }: { analyticsData: AnalyticsData }) {
  const ai = analyticsData.aiAnalytics

  if (!ai) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No AI conversation data yet.</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      key="ai"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Conversations"
          value={ai.totalConversations}
          subtitle={`${ai.todayConversations} today`}
          icon={<Bot className="w-6 h-6 text-purple-500" />}
        />
        <StatCard
          title="Total Messages"
          value={ai.totalMessages}
          subtitle={`${ai.weeklyConversations} convos this week`}
          icon={<MessageCircle className="w-6 h-6 text-blue-500" />}
        />
        <StatCard
          title="Voice Usage"
          value={`${ai.voiceUsagePercent}%`}
          subtitle="of messages used voice"
          icon={<Volume2 className="w-6 h-6 text-green-500" />}
        />
        <StatCard
          title="Avg Messages"
          value={ai.avgMessagesPerConversation}
          subtitle="per conversation"
          icon={<TrendingUp className="w-6 h-6 text-orange-500" />}
        />
      </div>

      {/* Top Questions */}
      <div className="bg-card p-6 rounded-xl border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
          Most Asked Questions
        </h3>
        <div className="space-y-3">
          {ai.topQuestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No questions recorded yet.</p>
          ) : (
            ai.topQuestions.map((q, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm text-muted-foreground w-6 shrink-0">{i + 1}.</span>
                  <span className="text-sm truncate">{q.question}</span>
                </div>
                <span className="text-sm font-medium ml-3 shrink-0">{q.count}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}

const StatCard = React.memo(({ title, value, subtitle, icon }: {
  title: string; value: string | number; subtitle?: string; icon: React.ReactNode
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
      </div>
      <div className="p-3 rounded-xl bg-primary/10">{icon}</div>
    </div>
  </motion.div>
))
StatCard.displayName = 'AIStatCard'
