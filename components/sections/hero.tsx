'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import Avatar3D from '@/components/3d/avatar'
import ModeSelector from '@/components/ui/mode-selector'
import { ArrowDown } from 'lucide-react'

export default function Hero() {
  const { mode } = useMode()
  const [showModeSelector, setShowModeSelector] = useState(false)

  useEffect(() => {
    if (!mode) {
      setShowModeSelector(true)
    }
  }, [mode])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient based on mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            animate={{
              x: [0, Math.random() * 400 - 200],
              y: [0, Math.random() * 400 - 200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Aasurjya
            </h1>
            
            {mode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {mode === 'phd' && (
                  <p className="text-xl lg:text-2xl text-muted-foreground mb-4">
                    HCI Researcher
                  </p>
                )}
                {mode === 'xr' && (
                  <p className="text-xl lg:text-2xl text-muted-foreground mb-4">
                    Extended Reality Developer & 3D Graphics Engineer
                  </p>
                )}
                {mode === 'fullstack' && (
                  <p className="text-xl lg:text-2xl text-muted-foreground mb-4">
                    Full Stack Engineer & Cloud Architect
                  </p>
                )}
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg"
            >
              Building immersive experiences at the intersection of technology and human interaction
            </motion.p>

            {/* Mode Selector Modal */}
            {showModeSelector && !mode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <ModeSelector />
              </motion.div>
            )}
          </motion.div>

          {/* Right side - 3D Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[500px] lg:h-[600px] relative"
          >
            <Avatar3D />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  )
}
