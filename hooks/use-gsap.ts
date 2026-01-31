'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Check for reduced motion preference
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const useGSAPAnimation = () => {
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const fadeInUp = (element: HTMLElement | null, delay = 0) => {
    if (!element) return

    if (prefersReducedMotion()) {
      gsap.set(element, { opacity: 1, y: 0 })
      return
    }

    gsap.fromTo(
      element,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }

  const parallax = (element: HTMLElement | null, speed = 0.5) => {
    if (!element || prefersReducedMotion()) return

    gsap.to(element, {
      yPercent: -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  const staggerFadeIn = (elements: NodeListOf<Element> | null, staggerAmount = 0.1) => {
    if (!elements || elements.length === 0) return

    if (prefersReducedMotion()) {
      gsap.set(elements, { opacity: 1, y: 0 })
      return
    }

    gsap.fromTo(
      elements,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: staggerAmount,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elements[0],
          start: 'top 80%',
        },
      }
    )
  }

  const scaleOnScroll = (element: HTMLElement | null) => {
    if (!element) return

    if (prefersReducedMotion()) {
      gsap.set(element, { opacity: 1, scale: 1 })
      return
    }

    gsap.fromTo(
      element,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 75%',
        },
      }
    )
  }

  const textReveal = (element: HTMLElement | null) => {
    if (!element) return

    const text = element.textContent || ''
    element.innerHTML = ''

    text.split('').forEach(char => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      element.appendChild(span)
    })

    if (prefersReducedMotion()) {
      gsap.set(element.children, { opacity: 1, y: 0 })
      return
    }

    gsap.fromTo(
      element.children,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
        },
      }
    )
  }

  return {
    fadeInUp,
    parallax,
    staggerFadeIn,
    scaleOnScroll,
    textReveal,
  }
}

export const useGSAPTimeline = () => {
  const timeline = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    timeline.current = gsap.timeline()

    return () => {
      timeline.current?.kill()
    }
  }, [])

  return timeline.current
}

// Magnetic hover effect for buttons and interactive elements
export const useMagneticEffect = (strength = 0.3) => {
  const elementRef = useRef<HTMLElement | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!elementRef.current || prefersReducedMotion()) return

    const element = elementRef.current
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    if (!elementRef.current) return

    gsap.to(elementRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return elementRef
}

// 3D card tilt effect
export const use3DTilt = (maxTilt = 15) => {
  const cardRef = useRef<HTMLElement | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current || prefersReducedMotion()) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const percentX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const percentY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)

    gsap.to(card, {
      rotateX: percentY * -maxTilt,
      rotateY: percentX * maxTilt,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [maxTilt])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return cardRef
}

// Scroll progress tracker for sections
export const useScrollProgress = () => {
  const containerRef = useRef<HTMLElement | null>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })

    return () => trigger.kill()
  }, [])

  return { containerRef, progress: progressRef }
}

// Clip-path reveal animation
export const useClipPathReveal = (direction: 'left' | 'right' | 'top' | 'bottom' = 'left') => {
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const clipPaths = {
      left: {
        from: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        to: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      },
      right: {
        from: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
        to: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      },
      top: {
        from: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        to: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      },
      bottom: {
        from: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
        to: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      },
    }

    if (prefersReducedMotion()) {
      gsap.set(elementRef.current, { clipPath: clipPaths[direction].to, opacity: 1 })
      return
    }

    gsap.fromTo(
      elementRef.current,
      { clipPath: clipPaths[direction].from, opacity: 0.5 },
      {
        clipPath: clipPaths[direction].to,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top 75%',
        },
      }
    )
  }, [direction])

  return elementRef
}

// Character-by-character animation for titles
export const useCharacterAnimation = () => {
  const splitAndAnimate = useCallback((element: HTMLElement | null, options?: {
    stagger?: number
    duration?: number
    delay?: number
    ease?: string
  }) => {
    if (!element) return

    const text = element.innerText
    element.innerHTML = text
      .split('')
      .map(char => `<span class="char inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('')

    if (prefersReducedMotion()) {
      gsap.set(element.querySelectorAll('.char'), { opacity: 1, y: 0 })
      return
    }

    gsap.from(element.querySelectorAll('.char'), {
      y: '100%',
      opacity: 0,
      stagger: options?.stagger ?? 0.02,
      duration: options?.duration ?? 0.8,
      delay: options?.delay ?? 0,
      ease: options?.ease ?? 'power4.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
      },
    })
  }, [])

  return { splitAndAnimate }
}

// Batch scroll reveal for multiple elements
export const useScrollBatch = (selector: string, options?: {
  stagger?: number
  fromDirection?: 'up' | 'down' | 'left' | 'right'
}) => {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const elements = containerRef.current.querySelectorAll(selector)
    if (elements.length === 0) return

    const fromVars = {
      up: { y: 50, x: 0 },
      down: { y: -50, x: 0 },
      left: { x: 50, y: 0 },
      right: { x: -50, y: 0 },
    }

    const from = fromVars[options?.fromDirection ?? 'up']

    if (prefersReducedMotion()) {
      gsap.set(elements, { opacity: 1, y: 0, x: 0 })
      return
    }

    ScrollTrigger.batch(elements, {
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { ...from, opacity: 0 },
          {
            y: 0,
            x: 0,
            opacity: 1,
            stagger: options?.stagger ?? 0.1,
            duration: 0.8,
            ease: 'power3.out',
          }
        )
      },
      start: 'top 85%',
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [selector, options])

  return containerRef
}
