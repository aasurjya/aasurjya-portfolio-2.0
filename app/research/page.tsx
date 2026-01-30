'use client'

import { useEffect } from 'react'
import { useMode } from '@/components/providers/mode-provider'
import About from '@/components/sections/about'
import Resume from '@/components/sections/resume'
import CategoryHero from '@/components/sections/category-hero'
import Projects from '@/components/sections/projects'
import Publications from '@/components/sections/publications'
import Skills from '@/components/sections/skills'
import Contact from '@/components/sections/contact'
import Navigation from '@/components/navigation'
import { motion } from 'framer-motion'

export default function ResearchPage() {
  const { setMode } = useMode()

  useEffect(() => {
    setMode('phd')
  }, [setMode])

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="pt-0">
          <CategoryHero />
          <About />
          <Resume />
          <Projects />
          <Publications />
          <Skills />
          <Contact />
        </div>
      </motion.div>
    </main>
  )
}
