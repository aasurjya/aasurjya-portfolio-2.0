'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, MapPin, Phone, Linkedin, Github } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Contact() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'corp.asurjya@gmail.com', link: 'mailto:corp.asurjya@gmail.com' },
    { icon: MapPin, label: 'Location', value: 'IIT Jodhpur, India', link: null },
    { icon: Phone, label: 'Phone', value: '+91 93653 84660', link: 'tel:+919365384660' }
  ]

  const socialLinks = [
    { icon: Github, label: 'GitHub', link: 'https://github.com/aasurjya' },
    { icon: Linkedin, label: 'LinkedIn', link: 'https://linkedin.com/in/aasurjya' }
  ]

  return (
    <section id="contact" ref={sectionRef} className="py-20 md:py-32 bg-[#050505]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-purple-400 mb-4">
              Contact
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Get In Touch
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                  Let&apos;s create something{' '}
                  <span className="text-purple-400 italic">extraordinary</span> together.
                </h3>
                <p className="text-base md:text-lg text-white/70 max-w-md">
                  I&apos;m always open to discussing innovative projects, research opportunities, or technical challenges.
                </p>
              </div>

              <a
                href="mailto:corp.asurjya@gmail.com"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-sm hover:bg-white/90 transition-colors"
              >
                <Mail className="w-5 h-5" />
                MAIL ME
              </a>

              <p className="text-sm text-white/60">
                Prefer a call?{' '}
                <a href="tel:+919365384660" className="text-white/70 hover:text-white underline underline-offset-4">
                  +91 93653 84660
                </a>
              </p>

              {/* Availability */}
              <div className="pt-8 border-t border-white/10">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase mb-4">Current Availability</p>
                <div className="flex items-center gap-4 p-5 bg-white/[0.03] rounded-2xl border border-white/10">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute" />
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full relative" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Open for Opportunities</p>
                    <p className="text-xs text-white/60">Research • Fullstack • XR Development</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">Direct Contact</p>
                <p className="text-sm text-white/60">
                  Messages land in my inbox and I typically reply within 24 hours.
                </p>

                <div className="space-y-3">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                        <info.icon className="w-5 h-5 text-white/60" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{info.label}</p>
                        {info.link ? (
                          <a href={info.link} className="text-sm font-medium text-white hover:text-purple-400 transition-colors truncate block">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-white truncate">{info.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">Social</p>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white hover:text-black transition-all duration-300"
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{social.label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
