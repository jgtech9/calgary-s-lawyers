import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      category: 'general',
    })
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['(403) 555-HELP (Emergency)', '(403) 555-INFO (General)'],
      description: 'Available 24/7 for emergencies',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['emergency@calgarylawyers', 'info@calgarylawyers'],
      description: 'Response within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Office',
      details: ['123 Legal Ave NW', 'Calgary, AB T2P 0H4'],
      description: 'By appointment only',
    },
    {
      icon: Clock,
      title: 'Hours',
      details: ['Mon-Fri: 9AM-6PM', 'Sat: 10AM-4PM', 'Sun: Emergency Only'],
      description: 'Virtual consultations available',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Hero */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Contact <span className="text-primary">CalgaryLawyers</span>
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto">
          Get in touch with our team. We're here to help you find the right legal assistance 
          or answer any questions about our directory.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-surface border border-border rounded-2xl p-8 sticky top-8">
            <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <div key={info.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-textSecondary">{detail}</p>
                        ))}
                      </div>
                      <p className="text-sm text-textSecondary mt-2">{info.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h3 className="font-bold mb-2 text-primary">Emergency Legal Help</h3>
              <p className="text-textSecondary text-sm mb-4">
                If you're facing an urgent legal situation that requires immediate attention:
              </p>
              <button className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                Call Emergency Line
              </button>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-surface border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            
            {isSubmitted ? (
              <motion.div 
                className="bg-success/10 border border-success/20 rounded-xl p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
                <p className="text-textSecondary mb-4">
                  Thank you for contacting CalgaryLawyers. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="(403) 555-1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inquiry Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="legal-help">Need Legal Help</option>
                      <option value="lawyer-join">Join as Lawyer</option>
                      <option value="partnership">Business Partnership</option>
                      <option value="technical">Technical Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-textSecondary">
                    * Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* FAQ Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="border border-border rounded-xl p-4">
                  <h4 className="font-bold mb-2">How quickly will I get a response?</h4>
                  <p className="text-textSecondary text-sm">
                    We respond to all inquiries within 24 hours. Emergency inquiries receive immediate attention.
                  </p>
                </div>
                <div className="border border-border rounded-xl p-4">
                  <h4 className="font-bold mb-2">Is there a fee to use your directory?</h4>
                  <p className="text-textSecondary text-sm">
                    No, our directory is completely free for individuals seeking legal help. Lawyers pay a subscription fee to be listed.
                  </p>
                </div>
                <div className="border border-border rounded-xl p-4">
                  <h4 className="font-bold mb-2">Can I schedule a consultation through this form?</h4>
                  <p className="text-textSecondary text-sm">
                    Yes! Select "Need Legal Help" as your inquiry category and we'll connect you with lawyers offering free consultations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
