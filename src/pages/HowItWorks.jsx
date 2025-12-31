import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  User, 
  Phone, 
  Mail, 
  Shield, 
  Search, 
  Calendar, 
  CheckCircle, 
  FileText,
  Users,
  Building,
  AlertCircle,
  Lock
} from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Share Your Story',
      description: 'Tell us about your legal situation in your own words. Be as detailed as possible about what happened, when it occurred, and what outcome you\'re seeking.',
      icon: MessageSquare,
      color: 'from-primary to-secondary',
      details: [
        'Describe events chronologically',
        'Include relevant dates and locations',
        'Mention any documents or evidence you have',
        'Explain what resolution you\'re hoping for'
      ]
    },
    {
      number: '02',
      title: 'Provide Your Information',
      description: 'Share your contact details so verified lawyers can reach out to you. This information is kept confidential and only shared with lawyers you approve.',
      icon: User,
      color: 'from-secondary to-accent',
      details: [
        'Full legal name',
        'Email address',
        'Phone number',
        'Preferred contact method',
        'Best time to reach you'
      ]
    },
    {
      number: '03',
      title: 'Identify Opposing Parties',
      description: 'Tell us who is involved on the other side. This is crucial for conflict of interest checks to ensure your lawyer can properly represent you.',
      icon: Users,
      color: 'from-accent to-primary',
      details: [
        'Names of individuals or companies involved',
        'Law firms representing the other party',
        'Any previous legal representation you\'ve had',
        'Related cases or proceedings'
      ]
    },
    {
      number: '04',
      title: 'Conflict Check Process',
      description: 'Our system automatically screens all lawyers against your case details to identify potential conflicts before any contact is made.',
      icon: Shield,
      color: 'from-warning to-success',
      details: [
        'Automated conflict database search',
        'Manual review by legal ethics experts',
        'Confidentiality maintained throughout',
        'Immediate notification of any conflicts'
      ]
    },
    {
      number: '05',
      title: 'Get Matched with Lawyers',
      description: 'Receive personalized recommendations from verified Calgary lawyers who specialize in your type of case and have no conflicts.',
      icon: Search,
      color: 'from-success to-primary',
      details: [
        '3-5 lawyer recommendations',
        'Specialized in your legal area',
        'Verified credentials and experience',
        'Transparent fee structures'
      ]
    },
    {
      number: '06',
      title: 'Schedule Free Consultations',
      description: 'Book initial consultations with your matched lawyers at no cost. Most lawyers offer 30-60 minute free consultations.',
      icon: Calendar,
      color: 'from-primary to-accent',
      details: [
        'Schedule directly through our platform',
        'Virtual or in-person options',
        'No obligation to hire',
        'Prepare questions in advance'
      ]
    }
  ]

  const privacyFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All your information is encrypted both in transit and at rest.'
    },
    {
      icon: Shield,
      title: 'Strict Confidentiality',
      description: 'Your details are only shared with lawyers after your explicit approval.'
    },
    {
      icon: AlertCircle,
      title: 'Conflict Protection',
      description: 'Comprehensive checks ensure your lawyer has no prior relationships with opposing parties.'
    },
    {
      icon: FileText,
      title: 'Legal Compliance',
      description: 'We follow Alberta Law Society rules for client confidentiality and conflict checks.'
    }
  ]

  const requiredInfo = [
    {
      category: 'Personal Information',
      items: ['Full legal name', 'Date of birth', 'Contact information', 'Address']
    },
    {
      category: 'Case Details',
      items: ['Type of legal matter', 'Jurisdiction (Calgary)', 'Timeline of events', 'Desired outcome']
    },
    {
      category: 'Opposing Party Information',
      items: ['Names of individuals/companies', 'Law firms involved', 'Previous legal representation', 'Case numbers if applicable']
    },
    {
      category: 'Supporting Documents',
      items: ['Contracts or agreements', 'Correspondence', 'Court documents', 'Photographic evidence']
    }
  ]

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
            alt="Legal process and consultation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Secure & Confidential Process</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              How It Works
              <span className="block gradient-text">Your Path to Legal Help</span>
            </h1>
            
            <p className="text-xl text-textTertiary mb-8 max-w-2xl">
              A simple, secure process to connect with the right Calgary lawyer for your specific needs. 
              We handle conflict checks and matching so you can focus on your case.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/personalized-match"
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors animate-pulse flex items-center justify-center gap-2"
              >
                Start Your Case Review
                <CheckCircle className="w-5 h-5" />
              </Link>
              <Link 
                to="/all-lawyers"
                className="px-8 py-3 border-2 border-primary text-white font-semibold rounded-lg hover:bg-primary/10 transition-colors"
              >
                Browse Verified Lawyers
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Process Steps */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our 6-Step Process</h2>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto">
            From sharing your story to scheduling consultations, here's how we connect you with the right legal help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                className="bg-surface border border-border rounded-2xl p-8 hover:border-primary transition-all hover:shadow-glow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                    <div className="text-white font-bold text-2xl">{step.number}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-textSecondary mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Required Information Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-surface border border-border rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Information We Need From You</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              To ensure proper conflict checks and effective matching, please be prepared to provide the following information:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requiredInfo.map((category, index) => (
              <motion.div
                key={category.category}
                className="bg-background border border-border rounded-xl p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <h3 className="font-bold text-lg mb-4 text-primary">{category.category}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-textSecondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-2">Why This Information Matters</h4>
                <p className="text-textSecondary">
                  Conflict of interest checks are required by the Alberta Law Society to protect both clients and lawyers. 
                  Without complete information about all parties involved, we cannot ensure your lawyer will be able to 
                  represent you effectively and ethically. All information is kept strictly confidential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Your Privacy & Security</h2>
          <p className="text-textSecondary max-w-2xl mx-auto">
            We take your confidentiality seriously. Here's how we protect your information throughout the process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="bg-surface border border-border rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-textSecondary text-sm">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="container mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="relative bg-surface border border-border rounded-2xl p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-textSecondary mb-6 max-w-2xl">
                  Share your story with us today. Our secure process ensures your information is protected 
                  while we find you the perfect Calgary lawyer for your case.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/contact"
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Share Your Story
                  </Link>
                  <Link 
                    to="/faq"
                    className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Read FAQs
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-64 h-64 rounded-full bg-gradient-primary opacity-20 flex items-center justify-center">
                  <Shield className="w-32 h-32 text-primary opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Methods */}
      <div className="container mx-auto px-4 mt-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Need Help With the Process?</h3>
          <p className="text-textSecondary max-w-2xl mx-auto">
            Our team is here to guide you through every step. Contact us for assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-lg mb-2">Call Us</h4>
            <p className="text-textSecondary mb-3">(403) 555-HELP</p>
            <p className="text-sm text-textSecondary">Mon-Fri, 9am-5pm MST</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="font-bold text-lg mb-2">Email Us</h4>
            <p className="text-textSecondary mb-3">help@calgarylawyers.ca</p>
            <p className="text-sm text-textSecondary">Response within 24 hours</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <h4 className="font-bold text-lg mb-2">Live Chat</h4>
            <p className="text-textSecondary mb-3">Available on website</p>
            <p className="text-sm text-textSecondary">Real-time assistance</p>
          </div>
        </div>
      </div>
    </div>
  )
}
