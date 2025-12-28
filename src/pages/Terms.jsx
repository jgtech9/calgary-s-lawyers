import React from 'react'
import { motion } from 'framer-motion'
import { Shield, FileText, AlertCircle, CheckCircle, Clock, Scale } from 'lucide-react'

export default function Terms() {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: 'By accessing and using the Calgary Lawyer Directory website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.',
    },
    {
      icon: Shield,
      title: 'User Responsibilities',
      content: 'You agree to use the website only for lawful purposes. You are prohibited from posting or transmitting any material that is unlawful, threatening, abusive, defamatory, invasive of privacy, or otherwise objectionable.',
    },
    {
      icon: AlertCircle,
      title: 'Disclaimer',
      content: 'The information provided on this website is for general informational purposes only. We do not provide legal advice. The directory listings are for informational purposes and do not constitute an endorsement or recommendation.',
    },
    {
      icon: CheckCircle,
      title: 'Accuracy of Information',
      content: 'While we strive to keep the information on our website accurate and up-to-date, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability, or availability of the information.',
    },
    {
      icon: Clock,
      title: 'Modifications to Terms',
      content: 'We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page. Your continued use of the service after any changes constitutes acceptance of those changes.',
    },
    {
      icon: Scale,
      title: 'Limitation of Liability',
      content: 'In no event shall Calgary Lawyer Directory be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of this website or the information provided herein.',
    },
  ]

  const importantPoints = [
    'This service connects users with lawyers but does not provide legal advice',
    'All lawyer profiles are verified but we recommend conducting your own due diligence',
    'We are not responsible for the quality of legal services provided by listed lawyers',
    'User reviews and ratings are opinions of individual users',
    'We reserve the right to remove or modify listings at our discretion',
    'All content on this website is protected by copyright laws',
  ]

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Scale className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Terms of <span className="text-primary">Service</span>
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto">
          Last updated: {new Date().toLocaleDateString('en-CA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>

      {/* Introduction */}
      <motion.div 
        className="bg-surface border border-border rounded-2xl p-8 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className="text-lg text-textSecondary mb-6">
          Welcome to Calgary Lawyer Directory. These Terms of Service govern your use of our website 
          and services. Please read them carefully before using our platform.
        </p>
        <div className="flex items-center gap-2 text-primary font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>Important: By using our website, you agree to these terms.</span>
        </div>
      </motion.div>

      {/* Main Sections */}
      <div className="space-y-8 mb-12">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              className="bg-surface border border-border rounded-xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                  <p className="text-textSecondary">{section.content}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Important Points */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Key Points to Remember</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {importantPoints.map((point, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 p-4 bg-surface border border-border rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-textSecondary">{point}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
        <p className="text-textSecondary mb-6 max-w-2xl mx-auto">
          If you have any questions about these Terms of Service, please contact us. 
          We're here to help clarify any concerns you may have.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="mailto:legal@calgarylawyers.ca" 
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Email Legal Team
          </a>
          <a 
            href="/contact" 
            className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
          >
            Contact Form
          </a>
        </div>
      </motion.div>

      {/* Update Notice */}
      <motion.div 
        className="mt-8 text-center text-textSecondary text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <p>
          These terms may be updated periodically. We recommend checking this page regularly 
          to stay informed about any changes.
        </p>
      </motion.div>
    </div>
  )
}
