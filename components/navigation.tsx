'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode, PortfolioMode } from '@/components/providers/mode-provider'
import { Menu, X, Download } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const modeOptions: { id: PortfolioMode; label: string; path: string; color: string }[] = [
  { id: 'fullstack', label: 'Full Stack', path: '/fullstack', color: 'text-purple-400' },
  { id: 'xr', label: 'XR & Research', path: '/xr-research', color: 'text-teal-400' },
]

export default function Navigation() {
  const pathname = usePathname()
  // Don't show navigation on the landing page
  if (pathname === '/') return null

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { mode, setMode } = useMode()

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = useCallback((href: string) => {
    const target = document.querySelector(href)
    if (!target) return

    gsap.to(window, {
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTo: { y: target, offsetY: 80 },
    })
  }, [])

  const navItemsWithConditional = mode === 'xr'
    ? [...navItems.slice(0, 2), { label: 'Publications', href: '#publications' }, ...navItems.slice(2)]
    : navItems

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Aasurjya
            </span>
            {mode && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {mode === 'xr' ? 'XR & RESEARCH' : mode.toUpperCase()}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {mode && navItemsWithConditional.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 ml-4 pl-4 border-l border-white/10">
              <span className="text-[10px] text-white/60 uppercase tracking-wider mr-2">Mode:</span>
              {modeOptions.map((m) => (
                <Link
                  key={m.id}
                  href={m.path}
                  onClick={() => setMode(m.id)}
                  data-track-event="mode_switch"
                  data-track-target={m.id}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    mode === m.id
                      ? `${m.color} bg-white/10`
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  {m.label}
                </Link>
              ))}
            </div>

            {/* Resume Button */}
            <motion.a
              href="/resume.pdf"
              download
              data-track-event="resume_download"
              data-track-target="resume_button"
              className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold !bg-gradient-to-r !from-amber-400 !via-amber-500 !to-orange-600 !text-black hover:shadow-lg hover:shadow-orange-500/20 transition-all"
              style={{ background: 'linear-gradient(to right, #f59e0b, #f59e0b, #ea580c)', color: '#000' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-3.5 h-3.5" />
              Resume
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t bg-background"
          >
            {mode && navItemsWithConditional.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  handleNavClick(item.href)
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left py-3 px-4 min-h-[44px] text-sm font-medium hover:text-primary hover:bg-white/5 transition-colors rounded-lg"
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Mode Switcher */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="block px-4 text-[10px] text-white/60 uppercase tracking-wider mb-2">Switch Mode</span>
              <div className="flex gap-2 px-4">
                {modeOptions.map((m) => (
                  <Link
                    key={m.id}
                    href={m.path}
                    onClick={() => {
                      setMode(m.id)
                      setIsMobileMenuOpen(false)
                    }}
                    data-track-event="mode_switch"
                    data-track-target={m.id}
                    className={`flex-1 py-3 min-h-[44px] text-center text-xs font-medium rounded-lg transition-colors ${
                      mode === m.id
                        ? `${m.color} bg-white/10`
                        : 'text-white/60 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Resume Button */}
            <div className="mt-4 px-4">
              <a
                href="/resume.pdf"
                download
                data-track-event="resume_download"
                data-track-target="resume_button"
                className="flex items-center justify-center gap-2 w-full py-4 min-h-[52px] rounded-xl text-sm font-bold text-black shadow-lg shadow-orange-500/15"
                style={{ background: 'linear-gradient(to right, #f59e0b, #f59e0b, #ea580c)' }}
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
