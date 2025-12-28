import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  HelpCircle, MessageSquare, AlertTriangle, 
  BarChart, Shield, Phone, Mail, Clock, 
  CheckCircle, Users, FileText, Search,
  ChevronDown, ChevronUp, ExternalLink,
  Send, Calendar, Video, Download
} from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function Support() {
  const [activeFAQ, setActiveFAQ] = useState(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: 'general',
    message: ''
  })
  
  const location = useLocation()
  const helpCenterRef = useRef(null)
  const liveChatRef = useRef(null)
  const emergencyHelpRef = useRef(null)
  const reportIssueRef = useRef(null)
  const statusRef = useRef(null)

  // Scroll to anchor when hash changes
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location.hash])

  const supportCategories = [
    {
      icon: HelpCircle,
      title: 'Help Center',
      description: 'Browse our comprehensive knowledge base with articles, guides, and tutorials.',
      link: '/support#help-center',
      color: 'primary',
      items: ['Getting Started Guide', 'Account Setup', 'Billing Questions', 'Platform Features'],
      ref: helpCenterRef
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Get instant help from our support team via real-time chat.',
      link: '/support#live-chat',
      color: 'secondary',
      items: ['24/7 Availability', 'Average Response: 2 min', 'File Sharing', 'Screen Sharing'],
      ref: liveChatRef
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Help',
      description: 'Urgent legal assistance for time-sensitive matters requiring immediate attention.',
      link: '/support#emergency-help',
      color: 'error',
      items: ['Legal Emergencies', 'Court Deadlines', 'Document Review', 'Urgent Consultations'],
      ref: emergencyHelpRef
    },
    {
      icon: BarChart,
      title: 'Report Issue',
      description: 'Report technical issues, bugs, or platform problems for quick resolution.',
      link: '/support#report-issue',
      color: 'warning',
      items: ['Bug Reports', 'Feature Requests', 'Performance Issues', 'Security Concerns'],
      ref: reportIssueRef
    },
    {
      icon: Shield,
      title: 'Status',
      description: 'Check real-time platform status, maintenance schedules, and incident reports.',
      link: '/support#status',
      color: 'success',
      items: ['System Status', 'Maintenance Updates', 'Incident History', 'Service Health'],
      ref: statusRef
    }
  ]

  const faqs = [
    {
      question: 'How do I find the right lawyer for my case?',
      answer: 'Use our advanced search filters to narrow down by legal area, experience level, location, and client ratings. You can also use our matching algorithm by answering a few questions about your case.'
    },
    {
      question: 'What information should I prepare before contacting a lawyer?',
      answer: 'Gather relevant documents, timeline of events, any correspondence, and specific questions. Having this organized helps lawyers understand your situation quickly and provide better guidance.'
    },
    {
      question: 'How does the review system work?',
      answer: 'After a consultation or case completion, clients can leave verified reviews. Reviews include ratings for communication, expertise, and results. All reviews are verified to ensure authenticity.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use bank-level encryption, secure servers, and strict privacy controls. Your information is only shared with lawyers you choose to contact, and you control what information is shared.'
    },
    {
      question: 'What if I need emergency legal help?',
      answer: 'Use our Emergency Help feature for immediate assistance. We connect you with available lawyers who can provide urgent consultations, document reviews, or emergency representation.'
    },
    {
      question: 'How do I update my lawyer profile?',
      answer: 'Lawyers can log into their dashboard to update profiles, add specialties, upload documents, and manage availability. Changes are reviewed within 24 hours.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, bank transfers, and secure payment platforms. Some lawyers also offer payment plans - check individual profiles for specific payment options.'
    },
    {
      question: 'Can I schedule consultations through the platform?',
      answer: 'Yes, many lawyers offer online scheduling. Look for the "Schedule Consultation" button on lawyer profiles to book appointments directly through our platform.'
    }
  ]

  const emergencyContacts = [
    {
      type: 'Legal Emergency',
      number: '(403) 555-HELP',
      description: '24/7 emergency legal assistance',
      response: 'Immediate callback within 15 minutes'
    },
    {
      type: 'Technical Support',
      number: '(403) 555-TECH',
      description: 'Platform issues and technical help',
      response: 'Available 6AM-10PM MST'
    },
    {
      type: 'Billing Support',
      number: '(403) 555-BILL',
      description: 'Payment and subscription questions',
      response: 'Available 8AM-6PM MST'
    },
    {
      type: 'General Inquiries',
      number: '(403) 555-INFO',
      description: 'General questions and information',
      response: 'Available 9AM-5PM MST'
    }
  ]

  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Complete guide to using CalgaryLawyers platform',
      type: 'PDF Guide',
      size: '2.4 MB',
      link: '#'
    },
    {
      title: 'Legal Glossary',
      description: 'Common legal terms explained in simple language',
      type: 'Interactive',
      size: 'Web Page',
      link: '#'
    },
    {
      title: 'Document Templates',
      description: 'Free legal document templates and samples',
      type: 'Templates',
      size: 'Multiple Files',
      link: '#'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for all features',
      type: 'Video Series',
      size: '45 min total',
      link: '#'
    }
  ]

  const handleFAQToggle = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would submit to your backend
    alert('Support request submitted! We\'ll get back to you within 24 hours.')
    setContactForm({
      name: '',
      email: '',
      category: 'general',
      message: ''
    })
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          How Can We <span className="text-primary">Help You</span> Today?
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto mb-8">
          Get the support you need to navigate legal challenges with confidence. 
          Our team is here to help you every step of the way.
        </p>
        
        {/* Search Bar */}
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              placeholder="Search for help articles, guides, or common questions..."
              className="w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-textSecondary">Popular searches:</span>
            <a href="#" className="text-sm text-primary hover:underline">billing</a>
            <span className="text-textSecondary">•</span>
            <a href="#" className="text-sm text-primary hover:underline">account setup</a>
            <span className="text-textSecondary">•</span>
            <a href="#" className="text-sm text-primary hover:underline">lawyer matching</a>
            <span className="text-textSecondary">•</span>
            <a href="#" className="text-sm text-primary hover:underline">reviews</a>
          </div>
        </motion.div>
      </motion.div>

      {/* Support Categories - Based on Footer Links */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Support Channels</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={index}
                ref={category.ref}
                id={category.link.split('#')[1]}
                className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group scroll-mt-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-lg bg-${category.color}/10 flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${category.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="text-textSecondary mb-4">{category.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Includes:</h4>
                  <ul className="space-y-1">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-textSecondary">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <a 
                  href={category.link}
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline group-hover:gap-3 transition-all"
                >
                  Access {category.title}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Emergency Contacts */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="bg-gradient-to-r from-error/10 to-warning/10 border border-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-error" />
            <h2 className="text-2xl font-bold">Emergency Contacts</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold mb-2">{contact.number}</div>
                <div className="font-semibold mb-1">{contact.type}</div>
                <div className="text-sm text-textSecondary mb-2">{contact.description}</div>
                <div className="text-xs text-textSecondary">{contact.response}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-textSecondary" />
                <span className="text-sm text-textSecondary">
                  Average response time: <span className="font-semibold">2 minutes</span>
                </span>
              </div>
              <button className="px-6 py-3 bg-error text-white font-semibold rounded-lg hover:bg-error/90 transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Emergency Line
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-surface border border-border rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.3 + index * 0.05 }}
            >
              <button
                onClick={() => handleFAQToggle(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">{index + 1}</span>
                  </div>
                  <span className="font-semibold">{faq.question}</span>
                </div>
                {activeFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-textSecondary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-textSecondary" />
                )}
              </button>
              
              {activeFAQ === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-4"
                >
                  <div className="pl-12 border-l-2 border-primary/20">
                    <p className="text-textSecondary">{faq.answer}</p>
                    {index === 0 && (
                      <div className="mt-4">
                        <a 
                          href="/all-lawyers" 
                          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                        >
                          Browse all lawyers
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <div>
          <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
          <p className="text-textSecondary mb-6">
            Can't find what you're looking for? Send us a message and our support team 
            will get back to you within 24 hours.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <div className="text-textSecondary text-sm">Email Support</div>
                <div className="font-semibold">support@calgarylawyers.ca</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-secondary" />
              <div>
                <div className="text-textSecondary text-sm">Live Chat Hours</div>
                <div className="font-semibold">6:00 AM - 10:00 PM MST</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" />
              <div>
                <div className="text-textSecondary text-sm">Community Forum</div>
                <div className="font-semibold">community.calgarylawyers.ca</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:pl-8 lg:border-l lg:border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleFormChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleFormChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={contactForm.category}
                onChange={handleFormChange}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="emergency">Emergency Help</option>
                <option value="feedback">Feedback/Suggestion</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleFormChange}
                placeholder="Describe your issue or question..."
                rows="4"
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              ></textarea>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="consent"
                className="rounded border-border text-primary focus:ring-primary"
                required
              />
              <label htmlFor="consent" className="text-sm text-textSecondary">
                I agree to have my information used to provide support
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.0 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Helpful Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <div key={index} className="bg-surface border border-border rounded-xl p-5 hover:border-secondary/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-6 h-6 text-secondary" />
                <span className="text-xs px-2 py-1 bg-surface border border-border rounded text-textSecondary">
                  {resource.type}
                </span>
              </div>
              <h3 className="font-bold mb-2">{resource.title}</h3>
              <p className="text-sm text-textSecondary mb-4">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-textSecondary">{resource.size}</span>
                <a 
                  href={resource.link}
                  className="text-primary hover:underline text-sm font-semibold"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.2 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Related Pages</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="/faq" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            FAQs
          </a>
          <a 
            href="/contact" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Contact Us
          </a>
          <a 
            href="/blog" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Legal Blog
          </a>
          <a 
            href="/terms" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Terms of Service
          </a>
        </div>
      </motion.div>
    </div>
  )
}
