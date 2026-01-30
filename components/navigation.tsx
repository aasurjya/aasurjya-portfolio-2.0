'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const pathname = usePathname()
  // Don't show navigation on the landing page
  if (pathname === '/') return null

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { mode } = useMode()

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

  const navItemsWithConditional = mode === 'phd' 
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
                {mode.toUpperCase()}
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
            className="md:hidden py-4 border-t"
          >
            {mode && navItemsWithConditional.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  handleNavClick(item.href)
                  setIsMobileMenuOpen(false)
                }}
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
