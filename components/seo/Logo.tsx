'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  variant?: 'default' | 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 56, height: 56 },
}

export function Logo({ 
  variant = 'default', 
  size = 'md', 
  showText = false,
  className = '' 
}: LogoProps) {
  const dimensions = sizeMap[size]
  
  // Use SVG for best quality and SEO
  // Fallback to PNG if SVG not available
  const logoSrc = variant === 'light' 
    ? '/aasurjya-logo-light.svg' 
    : variant === 'dark'
    ? '/aasurjya-logo-dark.svg'
    : '/aasurjya-logo.svg'

  return (
    <Link 
      href="/" 
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Aasurjya - Home"
    >
      <Image
        src={logoSrc}
        alt="Aasurjya - XR Developer and Full Stack Engineer Logo"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className="object-contain"
      />
      {showText && (
        <span className="font-bold text-lg tracking-tight">
          Aasurjya
        </span>
      )}
    </Link>
  )
}

// SVG Logo Component for inline use (better for animations)
export function LogoSVG({ 
  size = 40, 
  className = '',
  color = 'currentColor' 
}: { 
  size?: number
  className?: string
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Aasurjya Logo"
    >
      <title>Aasurjya - XR Developer and Full Stack Engineer</title>
      <desc>The stylized "A" logo representing Aasurjya Bikash Handique, an XR Developer and Full Stack Engineer</desc>
      {/* Replace this with your actual logo SVG path */}
      <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2" fill="none" />
      <text
        x="50"
        y="65"
        textAnchor="middle"
        fill={color}
        fontSize="48"
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
      >
        A
      </text>
    </svg>
  )
}
