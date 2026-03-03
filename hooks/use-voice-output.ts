'use client'

import { useState, useCallback, useRef } from 'react'

type Voice = 'a' | 'b'

interface UseVoiceOutputReturn {
  isSpeaking: boolean
  isVoiceEnabled: boolean
  setIsVoiceEnabled: (enabled: boolean) => void
  speak: (text: string) => Promise<HTMLAudioElement | null>
  speakChunk: (text: string) => void
  clearQueue: () => void
  stop: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[NAV:\w+\]/g, '')
    .trim()
}

export function useVoiceOutput(): UseVoiceOutputReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isVoiceEnabled, _setIsVoiceEnabled] = useState(false)
  const isVoiceEnabledRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cacheRef = useRef<Map<string, string>>(new Map())

  // Keep ref in sync with state
  const setIsVoiceEnabled = useCallback((enabled: boolean) => {
    isVoiceEnabledRef.current = enabled
    _setIsVoiceEnabled(enabled)
  }, [])

  // Queue-based playback state
  const queueRef = useRef<string[]>([])
  const isPlayingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Voice alternation: flips between 'a' and 'b' each sentence
  const voiceIndexRef = useRef(0)

  // Prefetch state for next chunk
  const prefetchPromiseRef = useRef<Promise<string> | null>(null)
  const prefetchTextRef = useRef<string | null>(null)
  const prefetchVoiceRef = useRef<Voice>('a')

  const fetchTTSAudio = useCallback(async (text: string, voice: Voice = 'a', signal?: AbortSignal): Promise<string> => {
    const cacheKey = `${voice}:${text.slice(0, 100)}`
    const cachedUrl = cacheRef.current.get(cacheKey)
    if (cachedUrl) return cachedUrl

    const res = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
      signal,
    })

    if (!res.ok) throw new Error('TTS failed')

    const blob = await res.blob()
    const audioUrl = URL.createObjectURL(blob)
    cacheRef.current.set(cacheKey, audioUrl)
    return audioUrl
  }, [])

  const speakWithBrowser = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve()
        return
      }

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onend = () => resolve()
      utterance.onerror = () => resolve()

      window.speechSynthesis.speak(utterance)
    })
  }, [])

  const startPrefetch = useCallback((text: string, voice: Voice) => {
    const cleaned = cleanMarkdown(text)
    if (!cleaned) return
    prefetchTextRef.current = cleaned
    prefetchVoiceRef.current = voice
    prefetchPromiseRef.current = fetchTTSAudio(cleaned, voice)
  }, [fetchTTSAudio])

  const processQueue = useCallback(async () => {
    if (isPlayingRef.current || queueRef.current.length === 0) return

    isPlayingRef.current = true
    setIsSpeaking(true)

    const text = queueRef.current.shift()!
    const cleaned = cleanMarkdown(text)
    if (!cleaned) {
      isPlayingRef.current = false
      if (queueRef.current.length === 0) setIsSpeaking(false)
      processQueue()
      return
    }

    // Alternate voice per sentence
    const currentVoice: Voice = voiceIndexRef.current % 2 === 0 ? 'a' : 'b'
    voiceIndexRef.current++

    try {
      // Use prefetched audio if it matches text + voice, otherwise fetch fresh
      let audioUrl: string
      if (
        prefetchTextRef.current === cleaned &&
        prefetchVoiceRef.current === currentVoice &&
        prefetchPromiseRef.current
      ) {
        audioUrl = await prefetchPromiseRef.current
        prefetchPromiseRef.current = null
        prefetchTextRef.current = null
      } else {
        abortControllerRef.current = new AbortController()
        audioUrl = await fetchTTSAudio(cleaned, currentVoice, abortControllerRef.current.signal)
        abortControllerRef.current = null
      }

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        isPlayingRef.current = false
        if (queueRef.current.length === 0) {
          setIsSpeaking(false)
        }
        processQueue()
      }

      audio.onerror = () => {
        isPlayingRef.current = false
        if (queueRef.current.length === 0) {
          setIsSpeaking(false)
        }
        processQueue()
      }

      await audio.play()

      // Prefetch next chunk while current one plays (with the next voice)
      if (queueRef.current.length > 0) {
        const nextVoice: Voice = voiceIndexRef.current % 2 === 0 ? 'a' : 'b'
        startPrefetch(queueRef.current[0], nextVoice)
      }
    } catch {
      abortControllerRef.current = null
      prefetchPromiseRef.current = null
      prefetchTextRef.current = null
      // Fallback to browser speech for this chunk
      try {
        await speakWithBrowser(cleaned)
      } catch {
        // Ignore browser speech errors
      }
      isPlayingRef.current = false
      if (queueRef.current.length === 0) {
        setIsSpeaking(false)
      }
      processQueue()
    }
  }, [fetchTTSAudio, speakWithBrowser, startPrefetch])

  const speakChunk = useCallback((text: string) => {
    if (!isVoiceEnabledRef.current || !text.trim()) return
    queueRef.current.push(text)
    processQueue()
  }, [processQueue])

  const clearQueue = useCallback(() => {
    queueRef.current = []
    voiceIndexRef.current = 0
    prefetchPromiseRef.current = null
    prefetchTextRef.current = null
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  // Legacy speak method (sends full text at once)
  const speak = useCallback(async (text: string): Promise<HTMLAudioElement | null> => {
    if (!isVoiceEnabledRef.current || !text.trim()) return null

    const cleaned = cleanMarkdown(text)
    if (!cleaned) return null

    try {
      const audioUrl = await fetchTTSAudio(cleaned)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      return new Promise((resolve) => {
        audio.onplay = () => setIsSpeaking(true)
        audio.onended = () => {
          setIsSpeaking(false)
          resolve(audio)
        }
        audio.onerror = () => {
          setIsSpeaking(false)
          resolve(null)
        }
        audio.play().catch(() => {
          setIsSpeaking(false)
          resolve(null)
        })
      })
    } catch {
      return speakWithBrowser(cleaned).then(() => null)
    }
  }, [fetchTTSAudio, speakWithBrowser])

  const stop = useCallback(() => {
    clearQueue()
    audioRef.current?.pause()
    audioRef.current = null
    window.speechSynthesis?.cancel()
    isPlayingRef.current = false
    setIsSpeaking(false)
  }, [clearQueue])

  return { isSpeaking, isVoiceEnabled, setIsVoiceEnabled, speak, speakChunk, clearQueue, stop, audioRef }
}
