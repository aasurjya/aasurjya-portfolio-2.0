'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface LipSyncData {
  amplitude: number     // 0-1, overall volume
  isSpeaking: boolean
}

export function useLipSync(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const [lipSync, setLipSync] = useState<LipSyncData>({ amplitude: 0, isSpeaking: false })
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const rafRef = useRef<number>(0)
  const connectedAudioRef = useRef<HTMLAudioElement | null>(null)

  const connectAudio = useCallback((audio: HTMLAudioElement) => {
    // Avoid reconnecting the same element
    if (connectedAudioRef.current === audio) return

    try {
      // Disconnect previous nodes to prevent leaks when queue swaps Audio elements
      if (sourceRef.current) try { sourceRef.current.disconnect() } catch {}
      if (analyserRef.current) try { analyserRef.current.disconnect() } catch {}

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }

      const ctx = audioContextRef.current

      // Create new source
      const source = ctx.createMediaElementSource(audio)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8

      source.connect(analyser)
      analyser.connect(ctx.destination)

      sourceRef.current = source
      analyserRef.current = analyser
      connectedAudioRef.current = audio
    } catch {
      // Audio element may already have a source
    }
  }, [])

  useEffect(() => {
    const dataArray = new Uint8Array(128)

    const tick = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray)

        // Focus on speech frequencies (85-255 Hz range, indices ~2-8 for 256 FFT)
        let sum = 0
        const start = 2
        const end = 12
        for (let i = start; i < end; i++) {
          sum += dataArray[i]
        }
        const avg = sum / (end - start)
        const amplitude = Math.min(avg / 180, 1) // Normalize

        setLipSync({
          amplitude,
          isSpeaking: amplitude > 0.05,
        })
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Watch for audio element changes
  useEffect(() => {
    const audio = audioRef.current
    if (audio && audio !== connectedAudioRef.current) {
      connectAudio(audio)
    }
  })

  return { lipSync, connectAudio }
}
