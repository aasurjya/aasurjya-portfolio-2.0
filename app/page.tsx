'use client'

import { useState, useEffect } from 'react'
import { useMode } from '@/components/providers/mode-provider'
import Preloader from '@/components/ui/preloader'
import HeroV2 from '../components/sections/hero-v2'
import { trackVisitor } from '../lib/analytics'

export default function HomePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    trackVisitor()
    // Disable scrolling on landing page
    document.body.style.overflow = 'hidden'
    
    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <main className="relative h-screen w-screen bg-black text-white overflow-hidden">
      <Preloader onComplete={() => setLoading(false)} />
      
      {!loading && (
        <HeroV2 />
      )}
    </main>
  )
}
