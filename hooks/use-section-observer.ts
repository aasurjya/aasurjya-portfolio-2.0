'use client'

import { useState, useEffect } from 'react'

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'publications', 'contact']

export function useSectionObserver(): string {
  const [currentSection, setCurrentSection] = useState('hero')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentSection(id)
          }
        },
        { threshold: 0.4 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach(o => o.disconnect())
    }
  }, [])

  return currentSection
}
