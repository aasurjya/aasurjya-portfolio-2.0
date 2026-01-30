'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
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
    if (!element) return
    
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
