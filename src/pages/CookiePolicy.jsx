import React from 'react'
import { motion } from 'framer-motion'
import { Cookie, Shield, Settings, Eye, Trash2, Clock, AlertCircle, CheckCircle, Lock } from 'lucide-react'

export default function CookiePolicy() {
  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      purpose: 'Enable core functionality like security, network management, and accessibility.',
      examples: ['Session management', 'Security tokens', 'Load balancing'],
      necessary: true,
    },
    {
      icon: Settings,
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization.',
      purpose: 'Remember choices you make (like your username, language, or region) and provide enhanced features.',
      examples: ['Language preferences', 'Region settings', 'Customized content'],
      necessary: false,
    },
    {
      icon: Eye,
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      purpose: 'Collect information about how you use our website to improve user experience.',
      examples: ['Page visits', 'Time on site', 'Error tracking'],
      necessary: false,
    },
    {
      icon: Cookie,
      title: 'Advertising Cookies',
      description: 'These cookies are used to make advertising messages more relevant to you.',
      purpose: 'Track your online activity to help advertisers deliver more relevant ads.',
      examples: ['Ad targeting', 'Campaign measurement', 'Conversion tracking'],
      necessary: false,
    },
  ]

  const cookieDetails = [
    {
      name: 'session_id',
      provider: 'CalgaryLawyers',
      purpose: 'Maintain user session state',
      duration: 'Session',
      type: 'Essential',
    },
    {
      name: 'preferences',
      provider: 'CalgaryLawyers',
      purpose: 'Store user preferences',
      duration: '1 year',
      type: 'Functional',
    },
    {
      name: '_ga',
      provider: 'Google Analytics',
      purpose: 'Distinguish unique users',
      duration: '2 years',
      type: 'Analytics',
    },
    {
      name: '_gid',
      provider: 'Google Analytics',
      purpose: 'Distinguish unique users',
      duration: '24 hours',
      type: 'Analytics',
    },
    {
      name: 'cookie_consent',
      provider: 'CalgaryLawyers',
      purpose: 'Store cookie consent preferences',
      duration: '1 year',
      type: 'Essential',
    },
  ]

  const userRights = [
    {
      icon: Settings,
      title: 'Right to Accept or Reject',
      description: 'You have the right to accept or reject non-essential cookies through our cookie banner.',
    },
    {
      icon: Eye,
      title: 'Right to Information',
      description: 'You have the right to be informed about the cookies we use and their purposes.',
    },
    {
      icon: Trash2,
      title: 'Right to Delete',
      description: 'You can delete cookies through your browser settings at any time.',
    },
    {
      icon: Clock,
      title: 'Right to Withdraw Consent',
      description: 'You can withdraw your cookie consent at any time through our preference center.',
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
          <Cookie className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Cookie <span className="text-primary">Policy</span>
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
          This Cookie Policy explains how Calgary Lawyer Directory ("we", "us", or "our") uses cookies 
          and similar technologies on our website. By using our website, you consent to the use of 
          cookies as described in this policy.
        </p>
        <div className="flex items-center gap-2 text-primary font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>Important: You can manage your cookie preferences at any time.</span>
        </div>
      </motion.div>

      {/* What Are Cookies */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-6">What Are Cookies?</h2>
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-textSecondary mb-4">
            Cookies are small text files that are placed on your device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information 
            to the website owners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-3 p-4 bg-surface border border-border rounded-lg">
              <Lock className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Small Files</h4>
                <p className="text-sm text-textSecondary">Tiny text files stored on your device</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-surface border border-border rounded-lg">
              <Clock className="w-5 h-5 text-secondary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Session & Persistent</h4>
                <p className="text-sm text-textSecondary">Temporary or long-term storage</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cookie Types */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Types of Cookies We Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cookieTypes.map((type, index) => {
            const Icon = type.icon
            return (
              <motion.div
                key={type.title}
                className="bg-surface border border-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${type.necessary ? 'bg-primary/10' : 'bg-secondary/10'} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${type.necessary ? 'text-primary' : 'text-secondary'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{type.title}</h3>
                      {type.necessary && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                          Necessary
                        </span>
                      )}
                    </div>
                    <p className="text-textSecondary mt-2">{type.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Purpose:</h4>
                  <p className="text-sm text-textSecondary mb-3">{type.purpose}</p>
                  <h4 className="font-semibold mb-2">Examples:</h4>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example, idx) => (
                      <span key={idx} className="px-3 py-1 bg-surface border border-border text-xs rounded-full">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Cookie Details Table */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6">Detailed Cookie Information</h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-left p-4 font-semibold">Cookie Name</th>
                  <th className="text-left p-4 font-semibold">Provider</th>
                  <th className="text-left p-4 font-semibold">Purpose</th>
                  <th className="text-left p-4 font-semibold">Duration</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody>
                {cookieDetails.map((cookie, index) => (
                  <tr key={cookie.name} className="border-b border-border last:border-b-0">
                    <td className="p-4 font-mono text-sm">{cookie.name}</td>
                    <td className="p-4">{cookie.provider}</td>
                    <td className="p-4 text-textSecondary">{cookie.purpose}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-surface border border-border text-xs rounded-full">
                        {cookie.duration}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        cookie.type === 'Essential' 
                          ? 'bg-primary/10 text-primary' 
                          : cookie.type === 'Functional'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-accent/10 text-accent'
                      }`}>
                        {cookie.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* User Rights */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Your Cookie Rights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userRights.map((right, index) => {
            const Icon = right.icon
            return (
              <motion.div
                key={right.title}
                className="bg-surface border border-border rounded-xl p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
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

      {/* How to Manage Cookies */}
      <motion.div 
        className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">How to Manage Cookies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Browser Settings
            </h3>
            <p className="text-textSecondary mb-4">
              Most web browsers allow you to control cookies through their settings. You can usually 
              find these settings in the "Options" or "Preferences" menu of your browser.
            </p>
            <ul className="space-y-2 text-textSecondary">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Chrome: Settings → Privacy and security → Cookies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Firefox: Options → Privacy & Security → Cookies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Safari: Preferences → Privacy → Cookies</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              Our Cookie Banner
            </h3>
            <p className="text-textSecondary mb-4">
              When you first visit our website, you'll see a cookie banner where you can choose 
              which types of cookies to accept. You can change these preferences at any time.
            </p>
            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-sm text-textSecondary">
                To update your preferences, click the cookie icon in the bottom corner of any page 
                or visit our <a href="/cookie-preferences" className="text-primary hover:underline">Cookie Preferences Center</a>.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact & Updates */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <h2 className="text-2xl font-bold mb-4">Questions or Updates</h2>
        <p className="text-textSecondary mb-6 max-w-2xl mx-auto">
          If you have any questions about our Cookie Policy or how we use cookies, 
          please contact our privacy team. We regularly review and update this policy 
          to ensure compliance with regulations.
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
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <p>
          This Cookie Policy was last updated on {new Date().toLocaleDateString('en-CA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}. We recommend checking this page periodically for updates.
        </p>
      </motion.div>
    </div>
  )
}
