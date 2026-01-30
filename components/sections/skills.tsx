'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { skills } from '@/lib/content-data'

export default function Skills() {
  const { mode } = useMode()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Filter skills based on mode
  const filteredSkills = mode
    ? skills.filter(s => s.modes.includes(mode))
    : skills

  // Group skills by category
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  const categoryLabels = {
    language: 'Programming Languages',
    framework: 'Frameworks & Libraries',
    tool: 'Tools & Technologies',
    platform: 'Platforms & Services',
    soft: 'Research & Soft Skills'
  }

  const categoryColors = {
    language: 'from-blue-500 to-blue-600',
    framework: 'from-green-500 to-green-600',
    tool: 'from-purple-500 to-purple-600',
    platform: 'from-orange-500 to-orange-600',
    soft: 'from-pink-500 to-pink-600'
  }

  return (
    <section id="skills" ref={sectionRef} className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Skills & Expertise</h2>

          <div className="space-y-8">
            {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: categoryIndex % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: categoryIndex % 2 === 0 ? -30 : 30 }}
                transition={{ delay: categoryIndex * 0.2 }}
                className="bg-card p-6 rounded-lg border"
              >
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className={`w-1 h-6 bg-gradient-to-b ${categoryColors[category as keyof typeof categoryColors]} rounded`} />
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: categoryIndex * 0.2 + index * 0.05 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} rounded-full`}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ 
                            delay: categoryIndex * 0.2 + index * 0.05 + 0.3,
                            duration: 0.8,
                            ease: "easeOut"
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
