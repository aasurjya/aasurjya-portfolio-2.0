'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { Mode } from '@/lib/theme-colors'
import { getLiquidColors } from '@/lib/theme-colors'
import { EASINGS, PORTAL } from '@/lib/animation-constants'
import type { VideoModalState, PortalStage } from './types'

interface VideoModalProps {
  videoModal: VideoModalState
  portalStage: PortalStage
  mode: Mode
  onClose: () => void
}

function getVideoEmbedUrl(url: string): string {
  if (url.includes('vimeo.com')) {
    return `${url}?autoplay=1&title=0&byline=0&portrait=0`
  } else if (url.includes('youtube.com')) {
    return `${url}?autoplay=1&rel=0`
  }
  return url
}

export default function VideoModal({ videoModal, portalStage, mode, onClose }: VideoModalProps) {
  const liquidColors = getLiquidColors(mode)
  const isXR = mode === 'xr'

  return (
    <AnimatePresence>
      {videoModal.isOpen && videoModal.videoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: portalStage === 'open' ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Video player modal"
        >
          {/* Background with radial reveal */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: portalStage === 'open' ? 1 : 0,
              background: isXR
                ? `radial-gradient(circle at ${videoModal.originRect?.x || 50}px ${videoModal.originRect?.y || 50}px, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0.95) 50%)`
                : 'rgba(0,0,0,0.95)'
            }}
            transition={{ duration: 0.5 }}
            style={{ backdropFilter: 'blur(8px)' }}
          />

          {/* Portal ring effect - XR only */}
          {isXR && videoModal.originRect && (
            <>
              <motion.div
                className="absolute rounded-full pointer-events-none"
                initial={{
                  width: PORTAL.ringSize.initial,
                  height: PORTAL.ringSize.initial,
                  x: videoModal.originRect.x - 40,
                  y: videoModal.originRect.y - 40,
                  opacity: 1,
                }}
                animate={{
                  width: portalStage === 'open' ? PORTAL.ringSize.expanded : PORTAL.ringSize.initial,
                  height: portalStage === 'open' ? PORTAL.ringSize.expanded : PORTAL.ringSize.initial,
                  x: portalStage === 'open' ? -window.innerWidth / 2 : videoModal.originRect.x - 40,
                  y: portalStage === 'open' ? -window.innerHeight / 2 : videoModal.originRect.y - 40,
                  opacity: portalStage === 'open' ? 0 : 1,
                }}
                transition={{ duration: 0.6, ease: EASINGS.portalEase }}
                style={{
                  border: `3px solid ${liquidColors.primary}`,
                  boxShadow: `0 0 60px ${liquidColors.primary}, inset 0 0 60px ${liquidColors.primary}40`,
                }}
              />
              <motion.div
                className="absolute rounded-full pointer-events-none"
                initial={{
                  width: PORTAL.innerRingSize.initial,
                  height: PORTAL.innerRingSize.initial,
                  x: videoModal.originRect.x - 30,
                  y: videoModal.originRect.y - 30,
                  opacity: 0.6,
                }}
                animate={{
                  width: portalStage === 'open' ? PORTAL.innerRingSize.expanded : PORTAL.innerRingSize.initial,
                  height: portalStage === 'open' ? PORTAL.innerRingSize.expanded : PORTAL.innerRingSize.initial,
                  x: portalStage === 'open' ? -window.innerWidth / 2 : videoModal.originRect.x - 30,
                  y: portalStage === 'open' ? -window.innerHeight / 2 : videoModal.originRect.y - 30,
                  opacity: 0,
                }}
                transition={{ duration: 0.5, ease: EASINGS.portalEase, delay: 0.1 }}
                style={{
                  border: `2px solid ${liquidColors.secondary}`,
                  boxShadow: `0 0 40px ${liquidColors.secondary}`,
                }}
              />
            </>
          )}

          {/* Video container with portal expand */}
          <motion.div
            initial={{
              scale: 0,
              opacity: 0,
              borderRadius: '50%',
            }}
            animate={{
              scale: portalStage === 'open' ? 1 : 0,
              opacity: portalStage === 'open' ? 1 : 0,
              borderRadius: portalStage === 'open' ? '16px' : '50%',
            }}
            transition={{
              duration: PORTAL.expandDuration,
              ease: EASINGS.portalEase,
              delay: isXR ? 0.15 : 0,
            }}
            className="relative w-[90vw] max-w-6xl aspect-video overflow-hidden"
            style={{
              boxShadow: isXR
                ? `0 0 0 1px ${liquidColors.primary}40, 0 0 100px ${liquidColors.primary}30, 0 40px 100px -20px rgba(0,0,0,0.8)`
                : '0 0 0 1px rgba(255,255,255,0.1), 0 40px 100px -20px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glowing border for XR */}
            {isXR && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${liquidColors.primary}20, transparent, ${liquidColors.secondary}20)`,
                  padding: '2px',
                }}
              >
                <div className="w-full h-full rounded-2xl bg-black" />
              </div>
            )}

            <iframe
              src={getVideoEmbedUrl(videoModal.videoUrl)}
              className="absolute inset-0 w-full h-full rounded-2xl"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Project video"
            />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              style={{
                background: isXR
                  ? `linear-gradient(135deg, ${liquidColors.primary}80, ${liquidColors.secondary}80)`
                  : 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                border: isXR ? `1px solid ${liquidColors.primary}50` : '1px solid rgba(255,255,255,0.2)',
                boxShadow: isXR ? `0 4px 20px ${liquidColors.primary}40` : 'none'
              }}
              aria-label="Close video modal"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Video title overlay for XR */}
            {isXR && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
                }}
              >
                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: liquidColors.primary }}>
                  Now Playing
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
