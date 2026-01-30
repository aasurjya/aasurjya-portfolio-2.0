'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, MapPin, Phone, Send, Linkedin, Github, Twitter } from 'lucide-react'
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
      // Simulate form submission
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
    { icon: Mail, label: 'Email', value: 'hello@aasurjya.com', link: 'mailto:hello@aasurjya.com' },
    { icon: MapPin, label: 'Location', value: 'IIT Jodhpur, India', link: null },
    { icon: Phone, label: 'Phone', value: '+91 82548 76592', link: 'tel:+918254876592' }
  ]

  const socialLinks = [
    { icon: Github, label: 'GitHub', link: 'https://github.com/aasurjya' },
    { icon: Linkedin, label: 'LinkedIn', link: 'https://linkedin.com/in/aasurjya' }
  ]

  return (
    <section id="contact" ref={sectionRef} className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Get In Touch</h2>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Call to Action */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">
                  Let's create something <span className="text-primary italic">extraordinary</span> together.
                </h3>
                <p className="text-xl text-muted-foreground font-light max-w-md">
                  I'm always open to discussing innovative projects, research opportunities, or technical challenges.
                </p>
              </div>
              
              <div className="pt-4">
                <a 
                  href="mailto:hello@aasurjya.com"
                  className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  <div className="relative z-10 flex items-center gap-3">
                    <Mail className="w-6 h-6" />
                    MAIL ME
                  </div>
                  <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-primary/20" />
                </a>
              </div>

              <div className="pt-12 border-t border-white/10">
                <p className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase mb-6">Current Availability</p>
                <div className="flex items-center gap-4 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute" />
                    <div className="w-3 h-3 bg-green-500 rounded-full relative" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Open for Opportunities</h4>
                    <p className="text-xs text-white/40">Research • Fullstack • XR Development</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Contact Details */}
            <div className="space-y-12">
              <div className="space-y-6">
                <p className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Direct Contact</p>
                <div className="grid gap-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="group flex items-center gap-6 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-500"
                    >
                      <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-black transition-all duration-500">
                        <info.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">{info.label}</p>
                        {info.link ? (
                          <a href={info.link} className="text-lg font-bold hover:text-primary transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-lg font-bold">{info.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Social Presence</p>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-center gap-3 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white hover:text-black transition-all duration-500 group"
                    >
                      <social.icon className="w-6 h-6" />
                      <span className="font-bold tracking-tight">{social.label}</span>
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
