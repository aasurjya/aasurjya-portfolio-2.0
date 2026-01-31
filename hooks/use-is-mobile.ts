'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect mobile/tablet viewport
 * @param breakpoint - The pixel width threshold (default: 1024 for lg breakpoint)
 * @returns boolean indicating if viewport is below the breakpoint
 */
export function useIsMobile(breakpoint: number = 1024): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check on mount
    checkMobile()

    // Listen for resize
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}
