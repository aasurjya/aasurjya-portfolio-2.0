'use client'

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { PanInfo } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { projects } from '@/lib/content-data'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { getLiquidColors } from '@/lib/theme-colors'
import { THRESHOLDS, DURATIONS, PORTAL } from '@/lib/animation-constants'
import type { VideoModalState, PortalStage, Project } from './types'

import ProjectsHeader from './ProjectsHeader'
import MobileSwipeCarousel from './MobileSwipeCarousel'
import DesktopStackedCards from './DesktopStackedCards'
import VideoModal from './VideoModal'

export default function Projects() {
  const { mode } = useMode()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndexState] = useState(0)
  const isMobile = useIsMobile()

  // Memoized setter to prevent re-creating in child component's useEffect
  const setActiveIndex = useCallback((index: number) => {
    setActiveIndexState(index)
  }, [])

  // Swipe state for mobile
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Video modal state with origin tracking for portal effect
  const [videoModal, setVideoModal] = useState<VideoModalState>({
    isOpen: false,
    videoUrl: null,
    originRect: null
  })
  const [portalStage, setPortalStage] = useState<PortalStage>('closed')

  // Memoize filtered projects to avoid recalculation on every render
  const filteredProjects = useMemo(() =>
    mode
      ? (projects as Project[]).filter(p => p.modes.includes(mode))
      : (projects as Project[]),
    [mode]
  )

  const projectCount = filteredProjects.length
  const liquidColors = getLiquidColors(mode)

  // Video modal handlers
  const openVideoModal = useCallback((videoUrl: string, buttonElement: HTMLButtonElement) => {
    const rect = buttonElement.getBoundingClientRect()
    setVideoModal({
      isOpen: true,
      videoUrl,
      originRect: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height }
    })
    setPortalStage('expanding')
    setTimeout(() => setPortalStage('open'), 50)
  }, [])

  const closeVideoModal = useCallback(() => {
    setPortalStage('expanding')
    setTimeout(() => {
      setPortalStage('closed')
      setVideoModal({ isOpen: false, videoUrl: null, originRect: null })
    }, PORTAL.collapseDelay)
  }, [])

  // Swipe handlers for mobile
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (isAnimating) return

    if (direction === 'left' && activeIndex < projectCount - 1) {
      setIsAnimating(true)
      setExitDirection('left')
      setTimeout(() => {
        setActiveIndexState(activeIndex + 1)
        setExitDirection(null)
        setIsAnimating(false)
      }, DURATIONS.fastMs)
    } else if (direction === 'right' && activeIndex > 0) {
      setIsAnimating(true)
      setExitDirection('right')
      setTimeout(() => {
        setActiveIndexState(activeIndex - 1)
        setExitDirection(null)
        setIsAnimating(false)
      }, DURATIONS.fastMs)
    }
  }, [activeIndex, projectCount, isAnimating])

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -THRESHOLDS.swipeDistance || info.velocity.x < -THRESHOLDS.swipeVelocity) {
      handleSwipe('left')
    } else if (info.offset.x > THRESHOLDS.swipeDistance || info.velocity.x > THRESHOLDS.swipeVelocity) {
      handleSwipe('right')
    }
  }, [handleSwipe])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard if modal is open (except ESC)
      if (e.key === 'Escape' && videoModal.isOpen) {
        closeVideoModal()
        return
      }

      // Don't navigate with arrows if modal is open
      if (videoModal.isOpen) return

      if (e.key === 'ArrowLeft') {
        handleSwipe('right') // Go to previous
      } else if (e.key === 'ArrowRight') {
        handleSwipe('left') // Go to next
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSwipe, closeVideoModal, videoModal.isOpen])

  return (
    <section id="projects" className="relative">
      {/* Static Background Gradients - no blur, no animation for performance */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" style={{ contain: 'strict' }}>
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 10% 30%, ${liquidColors.primary}18 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 90% 70%, ${liquidColors.secondary}15 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Header */}
      <ProjectsHeader
        mode={mode}
        filteredProjects={filteredProjects}
        activeIndex={activeIndex}
        isMobile={isMobile}
        containerRef={containerRef}
      />

      {/* Mobile/Tablet: Tinder-style Swipe Cards */}
      {isMobile ? (
        <MobileSwipeCarousel
          mode={mode}
          filteredProjects={filteredProjects}
          activeIndex={activeIndex}
          isAnimating={isAnimating}
          exitDirection={exitDirection}
          onSwipe={handleSwipe}
          onDragEnd={handleDragEnd}
          onVideoClick={openVideoModal}
        />
      ) : (
        /* Desktop: Scroll-based stacked cards */
        <DesktopStackedCards
          mode={mode}
          filteredProjects={filteredProjects}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          containerRef={containerRef}
          onVideoClick={openVideoModal}
        />
      )}

      <div className="h-16 lg:h-24" aria-hidden="true" />

      {/* Video Portal Modal */}
      <VideoModal
        videoModal={videoModal}
        portalStage={portalStage}
        mode={mode}
        onClose={closeVideoModal}
      />
    </section>
  )
}
