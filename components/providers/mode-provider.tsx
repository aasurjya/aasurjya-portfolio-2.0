'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

export type PortfolioMode = 'xr' | 'fullstack'

interface ModeContextType {
  mode: PortfolioMode | null
  setMode: (mode: PortfolioMode) => void
  clearMode: () => void
}

const ModeContext = React.createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<PortfolioMode | null>(null)
  const pathname = usePathname()

  React.useEffect(() => {
    // Load mode from localStorage on mount
    const savedMode = localStorage.getItem('portfolio-mode') as PortfolioMode | null
    if (savedMode) {
      setModeState(savedMode)
      applyModeClass(savedMode)
    }
  }, [])

  React.useEffect(() => {
    // Clear mode if on admin page
    if (pathname?.includes('/admin')) {
      clearMode()
    }
  }, [pathname])

  const applyModeClass = (newMode: PortfolioMode | null) => {
    const root = document.documentElement
    root.classList.remove('mode-xr', 'mode-fullstack')
    if (newMode) {
      root.classList.add(`mode-${newMode}`)
      root.setAttribute('data-mode', newMode)
    } else {
      root.removeAttribute('data-mode')
    }
  }

  const setMode = (newMode: PortfolioMode) => {
    setModeState(newMode)
    localStorage.setItem('portfolio-mode', newMode)
    applyModeClass(newMode)
    
    // Track mode selection
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: newMode }),
    }).catch(console.error)
  }

  const clearMode = () => {
    setModeState(null)
    localStorage.removeItem('portfolio-mode')
    applyModeClass(null)
  }

  const value = React.useMemo(
    () => ({
      mode,
      setMode,
      clearMode,
    }),
    [mode]
  )

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export function useMode() {
  const context = React.useContext(ModeContext)
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}
