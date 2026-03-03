'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface AIChatTriggerProps {
  onClick: () => void
  isOpen: boolean
  mode?: string | null
}

export default function AIChatTrigger({ onClick, isOpen, mode }: AIChatTriggerProps) {
  const [visible, setVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setShowTooltip(true), 2000)
    const hide = setTimeout(() => setShowTooltip(false), 10000)
    return () => { clearTimeout(timer); clearTimeout(hide) }
  }, [visible])

  if (isOpen || !visible) return null

  const bg = mode === 'xr'
    ? 'bg-gradient-to-br from-teal-500 to-emerald-600'
    : 'bg-gradient-to-br from-purple-500 to-indigo-600'

  const ringColor = mode === 'xr' ? 'bg-teal-500' : 'bg-purple-500'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-20 right-4 z-40"
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute bottom-full right-0 mb-3 px-3 py-2 rounded-lg bg-card border border-white/10 text-xs text-foreground whitespace-nowrap shadow-lg"
            >
              Hi! I&apos;m Aasurjya AI. Ask me anything.
              <div className="absolute top-full right-5 w-2 h-2 bg-card border-r border-b border-white/10 transform rotate-45 -translate-y-1" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onPointerDown={(e) => {
            pointerDownPos.current = { x: e.clientX, y: e.clientY }
          }}
          onClick={(e) => {
            if (pointerDownPos.current) {
              const dx = e.clientX - pointerDownPos.current.x
              const dy = e.clientY - pointerDownPos.current.y
              pointerDownPos.current = null
              if (Math.sqrt(dx * dx + dy * dy) > 6) return  // was a drag, not a tap
            }
            onClick()
          }}
          className={`relative w-14 h-14 rounded-full ${bg} text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center`}
        >
          {/* Pulse ring */}
          <span className={`absolute inset-0 rounded-full ${ringColor} animate-ping opacity-20`} />
          <MessageCircle className="w-6 h-6 relative z-10" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
