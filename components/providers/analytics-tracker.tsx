'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackVisitor } from '@/lib/analytics'
import { useMode } from '@/components/providers/mode-provider'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const { mode } = useMode()
  const trackedPathsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!pathname) return
    const key = `${pathname}:${mode ?? 'default'}`

    if (trackedPathsRef.current.has(key)) return

    trackVisitor({ mode, pathname })
    trackedPathsRef.current.add(key)
  }, [pathname, mode])

  return null
}
