'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbProps {
  amplitude: number
  isSpeaking: boolean
  modeColor: string
}

function AvatarOrb({ amplitude, isSpeaking, modeColor }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const color = useMemo(() => new THREE.Color(modeColor), [modeColor])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (meshRef.current) {
      // Idle breathing animation
      const breathe = 1 + Math.sin(t * 1.5) * 0.03

      // Speaking: pulse with amplitude
      const speakScale = isSpeaking ? 1 + amplitude * 0.15 : 1

      const scale = breathe * speakScale
      meshRef.current.scale.setScalar(scale)

      // Gentle rotation
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.1
    }

    if (glowRef.current) {
      // Glow pulses with speaking
      const glowScale = isSpeaking ? 1.6 + amplitude * 0.4 : 1.4 + Math.sin(t * 2) * 0.05
      glowRef.current.scale.setScalar(glowScale)
    }

    if (materialRef.current) {
      const emissiveIntensity = isSpeaking ? 0.3 + amplitude * 0.7 : 0.2 + Math.sin(t * 2) * 0.1
      materialRef.current.emissiveIntensity = emissiveIntensity
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>

      {/* Main orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.7, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="white" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

interface AvatarSceneProps {
  amplitude: number
  isSpeaking: boolean
  mode?: string | null
}

export default function AvatarScene({ amplitude, isSpeaking, mode }: AvatarSceneProps) {
  const modeColor = mode === 'xr' ? '#10b981' : '#8b5cf6'

  return (
    <div className="w-full h-[160px] sm:h-[180px] relative">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 5]} intensity={0.8} />
        <pointLight position={[-2, -1, 3]} intensity={0.3} color={modeColor} />
        <AvatarOrb
          amplitude={amplitude}
          isSpeaking={isSpeaking}
          modeColor={modeColor}
        />
      </Canvas>
    </div>
  )
}
