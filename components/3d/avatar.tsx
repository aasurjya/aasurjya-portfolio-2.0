'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useMode } from '@/components/providers/mode-provider'

function AvatarModel() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse, viewport } = useThree()
  const { mode } = useMode()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Follow mouse movement
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.y * 0.2,
        0.1
      )
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.x * 0.3,
        0.1
      )

      // Dynamic animation based on mode
      if (mode === 'xr') {
        // High energy rotation for XR
        meshRef.current.rotation.z += 0.01
        const floatY = Math.sin(state.clock.elapsedTime * 2) * 0.2
        meshRef.current.position.y = floatY
      } else if (mode === 'phd') {
        // Calm, stable movement for Research
        const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
        meshRef.current.scale.set(scale, scale, scale)
      } else {
        // Standard breathing for Fullstack
        const breathingScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
        meshRef.current.scale.set(breathingScale, breathingScale, breathingScale)
      }

      // Click animation
      if (clicked) {
        meshRef.current.rotation.z += 0.1
        if (meshRef.current.rotation.z > Math.PI * 2) {
          setClicked(false)
          meshRef.current.rotation.z = 0
        }
      }
    }
  })

  // Mode-based colors and materials
  const getMaterialProps = () => {
    switch(mode) {
      case 'phd': return { 
        color: '#3B82F6', 
        distort: 0.1, 
        speed: 1, 
        roughness: 0.2, 
        metalness: 0.5 
      }
      case 'xr': return { 
        color: '#10B981', 
        distort: 0.5, 
        speed: 4, 
        roughness: 0, 
        metalness: 1 
      }
      case 'fullstack': return { 
        color: '#8B5CF6', 
        distort: 0.3, 
        speed: 2, 
        roughness: 0.1, 
        metalness: 0.8 
      }
      default: return { 
        color: '#6366F1', 
        distort: 0.3, 
        speed: 2, 
        roughness: 0, 
        metalness: 0.8 
      }
    }
  }

  const materialProps = getMaterialProps()

  return (
    <group>
      {/* Main avatar sphere */}
      <Sphere
        ref={meshRef}
        args={[2, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(true)}
      >
        <MeshDistortMaterial
          {...materialProps}
          attach="material"
        />
      </Sphere>

      {/* Orbiting elements */}
      {[...Array(3)].map((_, i) => (
        <group key={i} rotation={[0, (Math.PI * 2 / 3) * i, 0]}>
          <Box
            position={[3, 0, 0]}
            args={[0.3, 0.3, 0.3]}
            rotation={[Math.PI / 4, Math.PI / 4, 0]}
          >
            <meshStandardMaterial
              color={hovered ? '#FFD700' : '#C0C0C0'}
              metalness={0.9}
              roughness={0.1}
            />
          </Box>
        </group>
      ))}

      {/* Ambient particles */}
      {[...Array(20)].map((_, i) => {
        const x = (Math.random() - 0.5) * 10
        const y = (Math.random() - 0.5) * 10
        const z = (Math.random() - 0.5) * 10
        return (
          <Sphere key={`particle-${i}`} position={[x, y, z]} args={[0.05]}>
            <meshBasicMaterial color={materialProps.color} />
          </Sphere>
        )
      })}
    </group>
  )
}

export default function Avatar3D() {
  return (
    <div className="w-full h-full canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <AvatarModel />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  )
}
