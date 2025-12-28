import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Trash2, Download, AlertCircle, CheckCircle, Users, Database, Globe } from 'lucide-react'

export default function PrivacyPolicy() {
  const privacySections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: 'We collect personal information you provide directly to us, such as when you create an account, contact us, or use our services. This may include your name, email address, phone number, and professional information.',
      details: [
        'Contact information (name, email, phone)',
        'Professional details for lawyer profiles',
        'Communication preferences',
        'Usage data and analytics',
      ],
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: 'We use your information to provide, maintain, and improve our services, communicate with you, and ensure the security of our platform.',
      details: [
        'Provide and personalize our services',
        'Communicate about updates and features',
        'Respond to inquiries and support requests',
        'Ensure platform security and prevent fraud',
      ],
    },
    {
      icon: Eye,
      title: 'Information Sharing',
      content: 'We do not sell your personal information. We may share information with service providers who assist in operating our platform, or when required by law.',
      details: [
        'Service providers (hosting, analytics)',
        'Legal compliance and law enforcement',
        'Business transfers (mergers, acquisitions)',
        'With your explicit consent',
      ],
    },
    {
      icon: Globe,
      title: 'Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.',
      details: [
        'Encryption of sensitive data',
        'Regular security assessments',
        'Access controls and authentication',
        'Secure data storage practices',
      ],
    },
    {
      icon: Users,
      title: 'Your Rights',
      content: 'You have rights regarding your personal information, including access, correction, deletion, and objection to processing.',
      details: [
        'Access your personal data',
        'Correct inaccurate information',
        'Request deletion of your data',
        'Object to data processing',
      ],
    },
    {
      icon: Database,
      title: 'Data Retention',
      content: 'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.',
      details: [
        'Account data: While account is active',
        'Communication data: 3 years',
        'Analytics data: 2 years',
        'Legal requirements: As required by law',
      ],
    },
  ]

  const dataTypes = [
    {
      category: 'Personal Information',
      examples: ['Name', 'Email address', 'Phone number', 'Professional credentials'],
      purpose: 'Account creation, communication, verification',
    },
    {
      category: 'Usage Data',
      examples: ['IP address', 'Browser type', 'Pages visited', 'Time spent'],
      purpose: 'Analytics, service improvement, security',
    },
    {
      category: 'Communication Data',
      examples: ['Contact form submissions', 'Email correspondence', 'Support requests'],
      purpose: 'Customer service, support, communication',
    },
    {
      category: 'Professional Data',
      examples: ['Law firm information', 'Practice areas', 'Experience', 'Credentials'],
      purpose: 'Directory listings, profile verification',
    },
  ]

  const userRights = [
    {
      icon: Eye,
      title: 'Right to Access',
      description: 'You can request a copy of the personal information we hold about you.',
    },
    {
      icon: Trash2,
      title: 'Right to Delete',
      description: 'You can request deletion of your personal information in certain circumstances.',
    },
    {
      icon: Download,
      title: 'Right to Data Portability',
      description: 'You can request your data in a structured, commonly used format.',
    },
    {
      icon: AlertCircle,
      title: 'Right to Object',
      description: 'You can object to certain types of data processing.',
    },
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
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Privacy <span className="text-primary">Policy</span>
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
          At Calgary Lawyer Directory, we are committed to protecting your privacy and ensuring the security 
          of your personal information. This Privacy Policy explains how we collect, use, disclose, and 
          safeguard your information when you use our website and services.
        </p>
        <div className="flex items-center gap-2 text-primary font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>Your privacy is important to us. We never sell your personal information.</span>
        </div>
      </motion.div>

      {/* Data Types Overview */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-6">Types of Data We Handle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataTypes.map((type, index) => (
            <motion.div
              key={type.category}
              className="bg-surface border border-border rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4">{type.category}</h3>
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-textSecondary">Examples:</h4>
                <div className="flex flex-wrap gap-2">
                  {type.examples.map((example, idx) => (
                    <span key={idx} className="px-3 py-1 bg-surface border border-border text-xs rounded-full">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-textSecondary">Purpose:</h4>
                <p className="text-sm">{type.purpose}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Privacy Sections */}
      <div className="space-y-8 mb-12">
        {privacySections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              className="bg-surface border border-border rounded-xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                  <p className="text-textSecondary mb-4">{section.content}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* User Rights */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Your Privacy Rights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userRights.map((right, index) => {
            const Icon = right.icon
            return (
              <motion.div
                key={right.title}
                className="bg-surface border border-border rounded-xl p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{right.title}</h3>
                </div>
                <p className="text-textSecondary">{right.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* How to Exercise Rights */}
      <motion.div 
        className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <h2 className="text-2xl font-bold mb-4">How to Exercise Your Rights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Contact Our Privacy Team
            </h3>
            <p className="text-textSecondary mb-4">
              To exercise any of your privacy rights, please contact our privacy team. 
              We will respond to your request within 30 days.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Email:</span>
                <a href="mailto:privacy@calgarylawyers.ca" className="text-primary hover:underline">
                  privacy@calgarylawyers.ca
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Phone:</span>
                <span>(403) 555-PRIVACY</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Account Settings
            </h3>
            <p className="text-textSecondary mb-4">
              You can manage many privacy settings directly through your account dashboard.
            </p>
            <div className="bg-background border border-border rounded-lg p-4">
              <ul className="space-y-2 text-sm text-textSecondary">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Update contact information</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Manage communication preferences</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Download your data</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Request account deletion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Children's Privacy */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-textSecondary">
            Our services are not directed to individuals under the age of 18. We do not knowingly 
            collect personal information from children. If you become aware that a child has provided 
            us with personal information, please contact us immediately.
          </p>
        </div>
      </motion.div>

      {/* Changes to Policy */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-textSecondary mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
          <div className="flex items-center gap-2 text-primary font-semibold">
            <AlertCircle className="w-5 h-5" />
            <span>We encourage you to review this Privacy Policy periodically for any changes.</span>
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="text-textSecondary mb-6 max-w-2xl mx-auto">
          If you have any questions about this Privacy Policy or our privacy practices, 
          please contact our privacy team. We are committed to protecting your privacy 
          and will address any concerns promptly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="mailto:privacy@calgarylawyers.ca" 
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Email Privacy Team
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
        transition={{ duration: 0.6, delay: 2.2 }}
      >
        <p>
          This Privacy Policy was last updated on {new Date().toLocaleDateString('en-CA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}. We recommend checking this page periodically for updates.
        </p>
      </motion.div>
    </div>
  )
}
