'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [counter, setCounter] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsVisible(false)
          onComplete()
        }, 500)
      }
    })

    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 20)

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
