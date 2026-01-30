'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { skills } from '@/lib/content-data'

export default function Skills() {
  const { mode } = useMode()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const filteredSkills = mode
    ? skills.filter(s => s.modes.includes(mode))
    : skills

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  const categoryLabels = {
    language: 'Languages',
    framework: 'Frameworks',
    tool: 'Tools',
    platform: 'Platforms',
    soft: 'Soft Skills'
  }

  const getModeColor = () => {
    switch (mode) {
      case 'phd': return 'bg-blue-500'
      case 'xr': return 'bg-teal-500'
      case 'fullstack': return 'bg-purple-500'
      default: return 'bg-purple-500'
    }
  }

  const getModeAccent = () => {
    switch (mode) {
      case 'phd': return 'text-blue-400'
      case 'xr': return 'text-teal-400'
      case 'fullstack': return 'text-purple-400'
      default: return 'text-purple-400'
    }
  }

  return (
    <section id="skills" ref={sectionRef} className="py-20 md:py-32 bg-[#0a0a0a]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className={`text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase ${getModeAccent()} mb-4`}>
              Expertise
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Skills & Technologies
            </h2>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="p-5 md:p-6 bg-white/[0.02] rounded-2xl border border-white/5"
              >
                <h3 className="text-sm font-bold text-white/80 mb-5 flex items-center gap-3">
                  <span className={`w-1 h-4 ${getModeColor()} rounded-full`} />
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/70">{skill.name}</span>
                        <span className="text-xs text-white/40">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${getModeColor()} rounded-full`}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{
                            delay: categoryIndex * 0.1 + index * 0.05 + 0.3,
                            duration: 0.8,
                            ease: 'easeOut'
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
