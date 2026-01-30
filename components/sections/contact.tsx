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
    { icon: MapPin, label: 'Location', value: 'Bengaluru, India', link: null },
    { icon: Phone, label: 'Phone', value: '+91 98765 43210', link: 'tel:+919876543210' }
  ]

  const socialLinks = [
    { icon: Github, label: 'GitHub', link: 'https://github.com' },
    { icon: Linkedin, label: 'LinkedIn', link: 'https://linkedin.com' },
    { icon: Twitter, label: 'Twitter', link: 'https://twitter.com' }
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
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Project Collaboration"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-card rounded-lg border"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        {info.link ? (
                          <a href={info.link} className="font-medium hover:text-primary transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-medium">{info.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Connect on Social</h3>
                
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-3 bg-card border rounded-lg hover:bg-primary/10 hover:border-primary transition-all"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Availability Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.8 }}
                className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border"
              >
                <h4 className="text-lg font-semibold mb-2">Available for Opportunities</h4>
                <p className="text-sm text-muted-foreground">
                  I'm currently open to new projects and collaborations. 
                  Feel free to reach out if you have an interesting opportunity!
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
