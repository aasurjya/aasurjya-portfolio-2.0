'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  CheckCircle,
  Copy,
  ExternalLink,
  QrCode,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import gsap from 'gsap'

// Contact data
const contactInfo = {
  name: 'Aasurjya Bikash Handique',
  title: 'HCI Researcher | XR Developer | Full Stack Engineer',
  email: 'corp.asurjya@gmail.com',
  phone: '+91 93653 84660',
  location: 'IIT Jodhpur, India',
  website: 'https://aasurjya.in',
  github: 'https://github.com/aasurjya',
  linkedin: 'https://linkedin.com/in/aasurjya',
  availability: 'Open for Opportunities',
  domains: ['Research', 'Fullstack', 'XR Development'],
}

export default function GetInTouchPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [activeQr, setActiveQr] = useState<'website' | 'linkedin' | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-badge', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power3.out',
      })
      gsap.from('.hero-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      })
      gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.out',
      })
      gsap.from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.7,
        ease: 'power3.out',
      })
      gsap.from('.visiting-card', {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
      })
      gsap.from('.info-card', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        delay: 0.9,
        ease: 'power3.out',
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  // 3D tilt effect on visiting card
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 25
      const rotateY = (centerX - x) / 25

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <main ref={mainRef} className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[200px] bg-cyan-500/8" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[180px] bg-purple-500/8" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-[150px] bg-blue-500/5" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/fullstack"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Portfolio
          </Link>
        </motion.div>

        {/* Hero Section */}
        <section className="text-center mt-12 md:mt-16 mb-16 md:mb-20">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-white/60 tracking-wide uppercase">
              Contact
            </span>
          </div>

          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6">
            Get In Touch
          </h1>

          <p className="hero-subtitle text-base md:text-lg lg:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
            Let&apos;s create something extraordinary together.
            <br className="hidden sm:block" />
            I&apos;m always open to discussing innovative projects, research opportunities, or technical challenges.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a
              href={`mailto:${contactInfo.email}`}
              className="magnetic-btn inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-all group"
            >
              <Mail className="w-4 h-4" />
              MAIL ME
              <ExternalLink className="w-3 h-3 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={`tel:${contactInfo.phone}`}
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              Prefer a call? {contactInfo.phone}
            </a>
          </div>
        </section>

        {/* Visiting Card */}
        <section className="visiting-card mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-sm font-bold text-white/40 tracking-widest uppercase">
              Digital Visiting Card
            </h2>
          </div>

          <div
            ref={cardRef}
            className="relative w-full max-w-4xl mx-auto"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Card */}
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1a] to-[#0a0a0a]">
              {/* Top accent stripe */}
              <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />

              <div className="p-8 sm:p-10 md:p-14">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                  <div className="space-y-2">
                    {/* Monogram / Logo */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-cyan-500/20">
                      <span className="text-2xl font-black text-white">A</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {contactInfo.name}
                    </h3>
                    <p className="text-base text-cyan-400/80 font-medium mt-1">
                      {contactInfo.title}
                    </p>
                  </div>

                  {/* QR Codes */}
                  <div className="flex gap-8">
                    <button
                      onClick={() => setActiveQr(activeQr === 'website' ? null : 'website')}
                      className="group relative flex flex-col items-center gap-2"
                    >
                      <div className={`p-3 rounded-2xl border transition-all ${
                        activeQr === 'website'
                          ? 'border-cyan-500/50 bg-white'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}>
                        <QRCodeSVG
                          value="https://aasurjya.in"
                          size={110}
                          bgColor="transparent"
                          fgColor={activeQr === 'website' ? '#000000' : '#ffffff'}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-white/30 tracking-wider uppercase group-hover:text-cyan-400 transition-colors">
                        Website
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveQr(activeQr === 'linkedin' ? null : 'linkedin')}
                      className="group relative flex flex-col items-center gap-2"
                    >
                      <div className={`p-3 rounded-2xl border transition-all ${
                        activeQr === 'linkedin'
                          ? 'border-blue-500/50 bg-white'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}>
                        <QRCodeSVG
                          value="https://linkedin.com/in/aasurjya"
                          size={110}
                          bgColor="transparent"
                          fgColor={activeQr === 'linkedin' ? '#000000' : '#ffffff'}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-white/30 tracking-wider uppercase group-hover:text-blue-400 transition-colors">
                        LinkedIn
                      </span>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                {/* Contact Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <button
                    onClick={() => copyToClipboard(contactInfo.email, 'email')}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors shrink-0">
                      <Mail className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase">Email</p>
                      <p className="text-sm text-white/70 group-hover:text-white transition-colors truncate">
                        {contactInfo.email}
                      </p>
                    </div>
                    <div className="ml-auto shrink-0">
                      {copiedField === 'email' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                      )}
                    </div>
                  </button>

                  {/* Phone */}
                  <button
                    onClick={() => copyToClipboard(contactInfo.phone, 'phone')}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors shrink-0">
                      <Phone className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase">Phone</p>
                      <p className="text-sm text-white/70 group-hover:text-white transition-colors truncate">
                        {contactInfo.phone}
                      </p>
                    </div>
                    <div className="ml-auto shrink-0">
                      {copiedField === 'phone' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                      )}
                    </div>
                  </button>

                  {/* Location */}
                  <div className="flex items-center gap-3 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase">Location</p>
                      <p className="text-sm text-white/70 truncate">{contactInfo.location}</p>
                    </div>
                  </div>

                  {/* Website */}
                  <a
                    href={contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors shrink-0">
                      <Globe className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase">Website</p>
                      <p className="text-sm text-white/70 group-hover:text-white transition-colors truncate">
                        aasurjya.in
                      </p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors ml-auto shrink-0" />
                  </a>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

                {/* Social Row + Availability */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <a
                      href={contactInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <Github className="w-5 h-5 text-white/60" />
                    </a>
                    <a
                      href={contactInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <Linkedin className="w-5 h-5 text-white/60" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400 tracking-wide">
                      {contactInfo.availability}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enlarged QR Modal */}
        {activeQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setActiveQr(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-3xl p-8 max-w-xs w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveQr(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4 text-black/60" />
              </button>

              <div className="mb-4">
                <QRCodeSVG
                  value={activeQr === 'website' ? 'https://aasurjya.in' : 'https://linkedin.com/in/aasurjya'}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin
                  className="mx-auto"
                />
              </div>

              <p className="text-sm font-bold text-black/80 mb-1">
                {activeQr === 'website' ? 'Visit Portfolio' : 'Connect on LinkedIn'}
              </p>
              <p className="text-xs text-black/50">
                {activeQr === 'website' ? 'aasurjya.in' : 'linkedin.com/in/aasurjya'}
              </p>

              <a
                href={activeQr === 'website' ? 'https://aasurjya.in' : 'https://linkedin.com/in/aasurjya'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-black/80 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Open Link
              </a>
            </motion.div>
          </motion.div>
        )}

        {/* Info Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 md:mb-20">
          {/* Current Availability */}
          <div className="info-card glass-card rounded-2xl p-6 md:p-8 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Current Availability</h3>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-base font-bold text-emerald-400">{contactInfo.availability}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {contactInfo.domains.map((domain) => (
                <span
                  key={domain}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/60"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Contact */}
          <div className="info-card glass-card rounded-2xl p-6 md:p-8 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Direct Contact</h3>
            </div>

            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Messages land in my inbox and I typically reply within 24 hours.
            </p>

            <div className="space-y-3">
              <a
                href={`mailto:${contactInfo.email}`}
                className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all"
              >
                <Mail className="w-4 h-4 text-white/30 group-hover:text-cyan-400 transition-colors" />
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                  {contactInfo.email}
                </span>
              </a>

              <a
                href={`tel:${contactInfo.phone}`}
                className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all"
              >
                <Phone className="w-4 h-4 text-white/30 group-hover:text-cyan-400 transition-colors" />
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                  {contactInfo.phone}
                </span>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="info-card glass-card rounded-2xl p-6 md:p-8 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Location</h3>
            </div>

            <p className="text-base text-white/60 mb-2">{contactInfo.location}</p>
            <p className="text-sm text-white/30">
              Available for remote collaboration worldwide
            </p>
          </div>

          {/* Social */}
          <div className="info-card glass-card rounded-2xl p-6 md:p-8 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Social</h3>
            </div>

            <div className="space-y-3">
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">GitHub</span>
                </div>
                <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
              </a>

              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-white/40 group-hover:text-blue-400 transition-colors" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">LinkedIn</span>
                </div>
                <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
              </a>

              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">aasurjya.in</span>
                </div>
                <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pb-12">
          <div className="h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} Aasurjya Bikash Handique. Built with passion.
          </p>
        </footer>
      </div>
    </main>
  )
}
