'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface CartoonAvatarProps {
  amplitude: number
  isSpeaking: boolean
  playful?: boolean
  mode?: string | null
}

export default function CartoonAvatar({ amplitude, isSpeaking, playful = false, mode }: CartoonAvatarProps) {
  const [expression, setExpression] = useState<'idle' | 'lookLeft' | 'lookRight' | 'lookUp' | 'lookDown' | 'playful' | 'happy' | 'wink' | 'surprised' | 'sad' | 'angry' | 'thinking' | 'sleepy'>('idle')

  // Randomize expression when not speaking (or always when playful)
  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout
    let resetTimeoutId: NodeJS.Timeout

    // In normal mode, lock to idle while speaking
    if (isSpeaking && !playful) {
      setExpression('idle')
      return
    }

    const trigger = () => {
      if (!isMounted) return

      const rand = Math.random()
      let nextExpr: typeof expression = 'idle'
      // Faster cycle when playful (minimized bubble)
      let delay = playful ? (800 + Math.random() * 1500) : (2000 + Math.random() * 3000)

      if (playful) {
        // More teasing: heavier weight on looks, winks, and playful
        if (rand < 0.15) nextExpr = 'lookLeft'
        else if (rand < 0.30) nextExpr = 'lookRight'
        else if (rand < 0.45) nextExpr = 'wink'
        else if (rand < 0.60) nextExpr = 'happy'
        else if (rand < 0.75) nextExpr = 'playful'
        else if (rand < 0.85) nextExpr = 'thinking'
        else if (rand < 0.95) nextExpr = 'surprised'
        else nextExpr = 'lookUp'
      } else {
        // Weighted probabilities for different expressions
        if (rand < 0.10) nextExpr = 'lookLeft'
        else if (rand < 0.20) nextExpr = 'lookRight'
        else if (rand < 0.25) nextExpr = 'lookUp'
        else if (rand < 0.30) nextExpr = 'lookDown'
        else if (rand < 0.40) nextExpr = 'happy'
        else if (rand < 0.50) nextExpr = 'playful'
        else if (rand < 0.55) nextExpr = 'wink'
        else if (rand < 0.65) nextExpr = 'thinking'
        else if (rand < 0.70) nextExpr = 'surprised'
        else if (rand < 0.75) nextExpr = 'sad'
        else if (rand < 0.80) nextExpr = 'angry'
        else if (rand < 0.85) nextExpr = 'sleepy'
        else nextExpr = 'idle'
      }

      setExpression(nextExpr)

      // Reset specific expressions faster than simple eye movements
      if (['playful', 'wink', 'happy', 'surprised', 'sad', 'angry', 'thinking', 'sleepy'].includes(nextExpr)) {
        const resetDelay = playful ? (600 + Math.random() * 600) : (1200 + Math.random() * 1000)
        resetTimeoutId = setTimeout(() => {
          if (isMounted) setExpression('idle')
        }, resetDelay)
        delay += playful ? 800 : 1500
      }

      timeoutId = setTimeout(trigger, delay)
    }

    timeoutId = setTimeout(trigger, playful ? 500 : 2000)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      clearTimeout(resetTimeoutId)
    }
  }, [isSpeaking, playful])

  const isPlayful = expression === 'playful'
  const isHappy = expression === 'happy'
  const isWink = expression === 'wink'
  const isSurprised = expression === 'surprised'
  const isSad = expression === 'sad'
  const isAngry = expression === 'angry'
  const isThinking = expression === 'thinking'
  const isSleepy = expression === 'sleepy'
  
  const isSquint = isPlayful || isHappy || isAngry
  const isWide = isSurprised

  // Eye blinks naturally
  const blinkTransition = {
    duration: 4,
    times: [0, 0.95, 0.96, 0.98, 1],
    repeat: Infinity,
    repeatType: "loop" as const,
    ease: "easeInOut"
  }

  const defaultEyeAnim = { scaleY: [1, 1, 0.1, 1, 1], transition: blinkTransition }
  const wideEyeAnim = { scaleY: 1.2, transition: { type: 'spring', stiffness: 300 } }
  const squintEyeAnim = { scaleY: 0.3, transition: { type: 'spring', stiffness: 300 } }
  const sleepyEyeAnim = { scaleY: 0.2, transition: { type: 'spring', stiffness: 200 } }
  const winkEyeAnim = { scaleY: 0.1, transition: { type: 'spring', stiffness: 300 } }
  const sadEyeAnim = { scaleY: 0.6, transition: { type: 'spring', stiffness: 300 } }
  
  let baseEyeAnim: { scaleY: number | number[]; transition: object } = defaultEyeAnim
  if (isWide) baseEyeAnim = wideEyeAnim
  else if (isSleepy) baseEyeAnim = sleepyEyeAnim
  else if (isSad) baseEyeAnim = sadEyeAnim
  else if (isSquint) baseEyeAnim = squintEyeAnim

  const leftEyeAnim = isWink ? winkEyeAnim : baseEyeAnim
  const rightEyeAnim = baseEyeAnim

  // Pupil positions based on expression
  let pupilX = 0
  let pupilY = 0
  if (expression === 'lookLeft') pupilX = -2.5
  if (expression === 'lookRight') pupilX = 2.5
  if (expression === 'lookUp') pupilY = -2.5
  if (expression === 'lookDown') pupilY = 2.5
  if (isThinking) { pupilX = 2; pupilY = -2 }
  if (isPlayful || isHappy || isSad) pupilY = 1

  // Mouth reacts to speech amplitude or expression
  let mouthHeight = 4
  let mouthWidth = 12
  let mouthBorderRadius = '4px'

  if (isSpeaking) {
    mouthHeight = 4 + amplitude * 6
    mouthWidth = 10 + amplitude * 2
    mouthBorderRadius = '4px 4px 10px 10px' // Subtler D-shape when speaking
  } else if (isSurprised) {
    mouthHeight = 10
    mouthWidth = 10
    mouthBorderRadius = '50%'
  } else if (isPlayful) {
    mouthHeight = 12
    mouthWidth = 14
    mouthBorderRadius = '4px 4px 12px 12px'
  } else if (isHappy) {
    mouthHeight = 8
    mouthWidth = 16
    mouthBorderRadius = '2px 2px 12px 12px'
  } else if (isWink) {
    mouthHeight = 6
    mouthWidth = 12
    mouthBorderRadius = '2px 2px 8px 8px'
  } else if (isSad) {
    mouthHeight = 4
    mouthWidth = 14
    mouthBorderRadius = '12px 12px 2px 2px'
  } else if (isAngry) {
    mouthHeight = 2
    mouthWidth = 14
    mouthBorderRadius = '2px'
  } else if (isThinking) {
    mouthHeight = 3
    mouthWidth = 8
    mouthBorderRadius = '2px'
  } else if (isSleepy) {
    mouthHeight = 3
    mouthWidth = 8
    mouthBorderRadius = '4px'
  } else if (['lookUp', 'lookLeft', 'lookRight'].includes(expression)) {
    mouthHeight = 4
    mouthWidth = 8
    mouthBorderRadius = '4px'
  }

  // Head bobs slightly based on state
  const headBob = {
    y: isSpeaking ? [-2, 2, -2] : (isHappy || isPlayful ? [-3, 3, -3] : isSad || isSleepy ? [1, 2, 1] : [-1, 1, -1]),
    rotateZ: expression === 'lookLeft' ? -3 : expression === 'lookRight' ? 3 : isThinking ? 4 : 0,
    transition: {
      y: { duration: isSpeaking ? 0.4 : isSleepy ? 4 : 3, repeat: Infinity, ease: "easeInOut" },
      rotateZ: { type: 'spring', stiffness: 300, damping: 20 }
    }
  }

  const leftBrowRot = isAngry ? 20 : isSad ? -15 : isPlayful ? 15 : isHappy ? -10 : isThinking ? -10 : expression === 'lookLeft' ? -5 : 0
  const rightBrowRot = isAngry ? -20 : isSad ? 15 : isPlayful ? -15 : isHappy ? 10 : isThinking ? 5 : expression === 'lookRight' ? 5 : 0
  const browY = isSurprised ? -6 : isAngry ? 2 : isSquint ? -2 : expression === 'lookUp' ? -4 : 0

  const baseColor = mode === 'xr' ? 'bg-teal-500' : 'bg-purple-500'

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Glow / Aura behind avatar */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.2, 1] : 1,
          opacity: isSpeaking ? [0.4, 0.7, 0.4] : 0.2
        }}
        transition={{ duration: isSpeaking ? 0.3 : 2, repeat: Infinity }}
        className={`absolute inset-0 rounded-full ${baseColor} blur-2xl opacity-30`}
      />

      {/* Main Head */}
      <motion.div
        animate={headBob}
        className={`relative w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-white/20 to-white/5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden z-10`}
      >
        {/* Blush / Cheeks */}
        <motion.div animate={{ opacity: isSquint || isSpeaking ? 0.6 : 0.2 }} className="absolute top-[44px] left-[8px] w-[14px] h-[6px] bg-[#ff6b8b] rounded-full blur-[3px] transition-opacity duration-500" />
        <motion.div animate={{ opacity: isSquint || isSpeaking ? 0.6 : 0.2 }} className="absolute top-[44px] right-[8px] w-[14px] h-[6px] bg-[#ff6b8b] rounded-full blur-[3px] transition-opacity duration-500" />

        {/* Eyebrows */}
        <div className="absolute top-[22px] w-full flex justify-center gap-[6px] px-3 z-10 pointer-events-none">
          <motion.div 
            animate={{ y: browY, rotateZ: leftBrowRot }}
            className="w-[12px] h-[2.5px] bg-white/70 rounded-full"
          />
          <motion.div 
            animate={{ y: browY, rotateZ: rightBrowRot }}
            className="w-[12px] h-[2.5px] bg-white/70 rounded-full"
          />
        </div>

        <div className="flex flex-col items-center gap-2 mt-4 z-10">
          {/* Eyes */}
          <div className="flex gap-4 items-center">
            {/* Left Eye */}
            <motion.div animate={leftEyeAnim} className="relative w-[14px] h-[18px] bg-white rounded-full overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.6)]">
              <motion.div animate={{ x: pupilX, y: pupilY }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="absolute top-[2px] left-[2px] w-[10px] h-[10px] bg-[#1a1a1a] rounded-full">
                  <div className="absolute top-[1px] right-[2px] w-[3px] h-[3px] bg-white rounded-full" />
                  <div className="absolute bottom-[2px] left-[2px] w-[1.5px] h-[1.5px] bg-white/70 rounded-full" />
              </motion.div>
            </motion.div>

            {/* Right Eye */}
            <motion.div animate={rightEyeAnim} className="relative w-[14px] h-[18px] bg-white rounded-full overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.6)]">
              <motion.div animate={{ x: pupilX, y: pupilY }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="absolute top-[2px] left-[2px] w-[10px] h-[10px] bg-[#1a1a1a] rounded-full">
                  <div className="absolute top-[1px] right-[2px] w-[3px] h-[3px] bg-white rounded-full" />
                  <div className="absolute bottom-[2px] left-[2px] w-[1.5px] h-[1.5px] bg-white/70 rounded-full" />
              </motion.div>
            </motion.div>
          </div>

          {/* Mouth container */}
          <div className="relative flex flex-col items-center">
            <motion.div
              animate={{ height: mouthHeight, width: mouthWidth, borderRadius: mouthBorderRadius, x: isThinking ? 4 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] z-10"
            />
            {/* Tongue sticking out and wagging */}
            <motion.div
              animate={isPlayful ? { 
                scaleY: 1, 
                opacity: 1,
                y: 0,
                rotateZ: [-15, 15, -15]
              } : { 
                scaleY: 0, 
                opacity: 0,
                y: -8,
                rotateZ: 0
              }}
              style={{ originY: 0, originX: 0.5 }}
              transition={isPlayful ? { 
                rotateZ: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
                scaleY: { type: 'spring', stiffness: 400, damping: 15 },
                opacity: { duration: 0.2 },
                y: { type: 'spring', stiffness: 400, damping: 15 }
              } : { duration: 0.2 }}
              className="absolute top-[60%] w-[12px] h-[14px] bg-[#ff6b8b] rounded-b-full shadow-sm z-20 border border-black/10"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
