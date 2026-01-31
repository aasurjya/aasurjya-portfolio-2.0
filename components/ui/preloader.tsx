'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [counter, setCounter] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Reduced duration: 500ms total instead of ~2s
    const duration = 500
    const steps = 20
    const stepDuration = duration / steps

    const interval = setInterval(() => {
      setCounter(prev => {
        const next = prev + (100 / steps)
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsVisible(false)
            onComplete()
          }, 100)
          return 100
        }
        return Math.round(next)
      })
    }, stepDuration)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white"
        >
          <div className="relative overflow-hidden">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-8xl md:text-[12rem] font-bold tracking-tighter"
            >
              {counter}%
            </motion.div>
          </div>
          
          <div className="absolute bottom-10 left-10 flex items-end gap-4">
            <div className="h-px w-24 bg-white/20 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${counter}%` }}
              />
            </div>
            <span className="text-xs uppercase tracking-widest text-white/50">Loading Portfolio</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
