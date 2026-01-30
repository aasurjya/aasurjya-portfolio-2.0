'use client'

import { motion } from 'framer-motion'
import { useMode, PortfolioMode } from '@/components/providers/mode-provider'
import { GraduationCap, Gamepad2, Code2 } from 'lucide-react'

const modes: {
  id: PortfolioMode
  title: string
  description: string
  icon: React.ElementType
  gradient: string
}[] = [
  {
    id: 'phd',
    title: 'PhD Research',
    description: 'Academic work in HCI and VR comfort studies',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'xr',
    title: 'XR Developer',
    description: 'Extended reality and 3D graphics projects',
    icon: Gamepad2,
    gradient: 'from-teal-500 to-green-500',
  },
  {
    id: 'fullstack',
    title: 'Full Stack',
    description: 'SaaS platforms and cloud infrastructure',
    icon: Code2,
    gradient: 'from-purple-500 to-indigo-500',
  },
]

export default function ModeSelector() {
  const { setMode } = useMode()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">What brings you here?</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {modes.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setMode(mode.id)}
            className="group relative overflow-hidden rounded-lg border border-border p-6 text-left transition-all hover:scale-105 hover:shadow-xl"
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            {/* Icon */}
            <mode.icon className="w-8 h-8 mb-4 text-primary" />
            
            {/* Content */}
            <h3 className="text-lg font-semibold mb-2">{mode.title}</h3>
            <p className="text-sm text-muted-foreground">{mode.description}</p>
            
            {/* Animated border */}
            <motion.div
              className="absolute inset-0 border-2 border-primary rounded-lg opacity-0 group-hover:opacity-100"
              initial={false}
              animate={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
