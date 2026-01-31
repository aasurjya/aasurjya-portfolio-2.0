'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

// Futuristic ambient sound generator using Web Audio API
class AmbientSynth {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private oscillators: OscillatorNode[] = []
  private gains: GainNode[] = []
  private lfo: OscillatorNode | null = null
  private isPlaying = false

  async init() {
    if (this.audioContext) return

    this.audioContext = new AudioContext()
    this.masterGain = this.audioContext.createGain()
    this.masterGain.gain.value = 0
    this.masterGain.connect(this.audioContext.destination)
  }

  async start() {
    if (this.isPlaying) return
    await this.init()
    if (!this.audioContext || !this.masterGain) return

    this.isPlaying = true

    // Base frequencies for sci-fi ambient drone
    const frequencies = [
      { freq: 55, type: 'sine' as OscillatorType, gain: 0.15 },      // Deep bass
      { freq: 82.41, type: 'sine' as OscillatorType, gain: 0.1 },   // Low E
      { freq: 110, type: 'triangle' as OscillatorType, gain: 0.08 }, // A2
      { freq: 146.83, type: 'sine' as OscillatorType, gain: 0.06 }, // D3
      { freq: 220, type: 'sine' as OscillatorType, gain: 0.04 },    // A3 harmonic
      { freq: 329.63, type: 'triangle' as OscillatorType, gain: 0.03 }, // E4 shimmer
    ]

    // Create LFO for subtle movement
    this.lfo = this.audioContext.createOscillator()
    this.lfo.type = 'sine'
    this.lfo.frequency.value = 0.1 // Very slow modulation

    const lfoGain = this.audioContext.createGain()
    lfoGain.gain.value = 3 // Subtle pitch variation
    this.lfo.connect(lfoGain)
    this.lfo.start()

    // Create oscillators
    frequencies.forEach(({ freq, type, gain }, i) => {
      if (!this.audioContext || !this.masterGain) return

      const osc = this.audioContext.createOscillator()
      const oscGain = this.audioContext.createGain()

      osc.type = type
      osc.frequency.value = freq

      // Connect LFO to frequency for subtle movement
      if (i > 0) {
        lfoGain.connect(osc.frequency)
      }

      oscGain.gain.value = gain

      // Add filter for warmth
      const filter = this.audioContext.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 800 + (i * 200)
      filter.Q.value = 0.5

      osc.connect(filter)
      filter.connect(oscGain)
      oscGain.connect(this.masterGain)

      osc.start()

      this.oscillators.push(osc)
      this.gains.push(oscGain)
    })

    // Add subtle noise layer for texture
    const noiseBuffer = this.createNoiseBuffer()
    const noiseSource = this.audioContext.createBufferSource()
    noiseSource.buffer = noiseBuffer
    noiseSource.loop = true

    const noiseFilter = this.audioContext.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 1000
    noiseFilter.Q.value = 0.3

    const noiseGain = this.audioContext.createGain()
    noiseGain.gain.value = 0.015 // Very subtle

    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(this.masterGain)
    noiseSource.start()

    // Fade in
    this.masterGain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 2)
  }

  private createNoiseBuffer(): AudioBuffer {
    if (!this.audioContext) throw new Error('No audio context')

    const bufferSize = this.audioContext.sampleRate * 2
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const output = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    return buffer
  }

  stop() {
    if (!this.isPlaying || !this.audioContext || !this.masterGain) return

    // Fade out
    this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1)

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop() } catch (e) {}
      })
      this.oscillators = []
      this.gains = []

      if (this.lfo) {
        try { this.lfo.stop() } catch (e) {}
        this.lfo = null
      }

      this.isPlaying = false
    }, 1100)
  }

  setVolume(volume: number) {
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.linearRampToValueAtTime(volume * 0.3, this.audioContext.currentTime + 0.1)
    }
  }

  getIsPlaying() {
    return this.isPlaying
  }
}

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const synthRef = useRef<AmbientSynth | null>(null)

  useEffect(() => {
    synthRef.current = new AmbientSynth()

    return () => {
      if (synthRef.current) {
        synthRef.current.stop()
      }
    }
  }, [])

  const toggleSound = useCallback(async () => {
    if (!synthRef.current) return

    if (isPlaying) {
      synthRef.current.stop()
      setIsPlaying(false)
    } else {
      await synthRef.current.start()
      synthRef.current.setVolume(volume)
      setIsPlaying(true)
    }
  }, [isPlaying, volume])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (synthRef.current && isPlaying) {
      synthRef.current.setVolume(newVolume)
    }
  }, [isPlaying])

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      {/* Volume slider */}
      <AnimatePresence>
        {showVolumeSlider && isPlaying && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-xl border border-white/10">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={toggleSound}
        className="relative p-3 rounded-full backdrop-blur-xl border transition-colors"
        style={{
          background: isPlaying
            ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))'
            : 'rgba(0,0,0,0.5)',
          borderColor: isPlaying ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
      >
        {/* Animated rings when playing */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border border-violet-500/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-indigo-500/20"
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            />
          </>
        )}

        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-violet-300" />
        ) : (
          <VolumeX className="w-5 h-5 text-white/60" />
        )}
      </motion.button>

      {/* Label on first visit */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-3 whitespace-nowrap"
          >
            <span className="text-[10px] text-white/40 tracking-wide uppercase">
              Ambient
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
