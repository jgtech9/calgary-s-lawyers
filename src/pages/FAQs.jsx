import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, UserCheck, Shield, CreditCard, Clock, Globe, FileText, Users } from 'lucide-react'

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const faqCategories = [
    {
      icon: UserCheck,
      title: 'Finding a Lawyer',
      color: 'primary',
      questions: [
        {
          question: 'How do I find the right lawyer for my case?',
          answer: 'Use our advanced search filters to narrow down lawyers by practice area, experience level, location, and client ratings. You can also read detailed profiles and client reviews to make an informed decision.',
        },
        {
          question: 'Are all lawyers on your platform verified?',
          answer: 'Yes, every lawyer listed on our platform undergoes a verification process. We confirm their credentials, license status, and professional standing with the Law Society of Alberta.',
        },
        {
          question: 'Can I contact lawyers directly through your platform?',
          answer: 'Yes, registered users can contact lawyers directly through our secure messaging system. Some lawyers also provide direct contact information on their profiles.',
        },
        {
          question: 'How often are lawyer profiles updated?',
          answer: 'Lawyers are encouraged to update their profiles regularly. We also conduct quarterly reviews to ensure information accuracy and completeness.',
        },
      ],
    },
    {
      icon: CreditCard,
      title: 'Pricing & Fees',
      color: 'secondary',
      questions: [
        {
          question: 'Is using your directory free?',
          answer: 'Yes, searching for lawyers and viewing basic profiles is completely free. Some premium features may require a subscription, but basic directory access remains free.',
        },
        {
          question: 'How do lawyers set their fees?',
          answer: 'Lawyers set their own fees based on their experience, case complexity, and market rates. Fee structures are typically displayed on lawyer profiles or discussed during initial consultations.',
        },
        {
          question: 'What payment methods do lawyers accept?',
          answer: 'Payment methods vary by lawyer. Common options include credit cards, e-transfers, cheques, and legal aid. Specific payment details are discussed during client-lawyer agreements.',
        },
        {
          question: 'Are there any hidden costs?',
          answer: 'No, we are transparent about all costs. Any fees associated with our platform are clearly disclosed. Lawyer fees are discussed directly between you and the lawyer.',
        },
      ],
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      color: 'accent',
      questions: [
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we use industry-standard encryption and security measures to protect your data. Your personal information is never shared without your consent, except as required by law.',
        },
        {
          question: 'How are reviews verified?',
          answer: 'All reviews go through a verification process to ensure they come from genuine clients. We monitor for fraudulent activity and maintain review integrity.',
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes, you can request account deletion at any time. We will remove your personal data in accordance with our Privacy Policy and applicable laws.',
        },
        {
          question: 'Who can see my search history?',
          answer: 'Your search history is private and only visible to you. We use aggregated, anonymized data for analytics to improve our service.',
        },
      ],
    },
    {
      icon: Clock,
      title: 'Process & Timing',
      color: 'success',
      questions: [
        {
          question: 'How long does it take to find a lawyer?',
          answer: 'Most users find suitable lawyers within minutes using our search tools. The actual hiring process depends on lawyer availability and your specific needs.',
        },
        {
          question: 'What happens after I contact a lawyer?',
          answer: 'Lawyers typically respond within 1-2 business days. They will schedule an initial consultation to discuss your case and determine if they can help.',
        },
        {
          question: 'Can I schedule consultations through your platform?',
          answer: 'Yes, many lawyers offer online scheduling through their profiles. You can book initial consultations directly from their profile pages.',
        },
        {
          question: 'What if I need emergency legal help?',
          answer: 'For emergencies, contact our emergency legal help line at (403) 555-HELP or visit our emergency resources page for immediate assistance options.',
        },
      ],
    },
  ]

  const generalFAQs = [
    {
      question: 'What areas of law does your directory cover?',
      answer: 'We cover all major practice areas including Family Law, Corporate Law, Real Estate, Criminal Defense, Employment Law, Civil Litigation, Immigration, Personal Injury, and more.',
    },
    {
      question: 'How do I leave a review for a lawyer?',
      answer: 'After working with a lawyer through our platform, you will receive an invitation to leave a review. Reviews help other users make informed decisions.',
    },
    {
      question: 'Can I update my review after posting it?',
      answer: 'Yes, you can edit or update your review within 30 days of posting. After that, contact our support team for assistance with updates.',
    },
    {
      question: 'What if I have a complaint about a lawyer?',
      answer: 'Contact our support team immediately. We take complaints seriously and will investigate any issues with listed professionals.',
    },
    {
      question: 'Do you offer legal advice?',
      answer: 'No, we are a directory service that connects users with lawyers. We do not provide legal advice. For legal advice, consult with a qualified lawyer.',
    },
    {
      question: 'How can I become a listed lawyer?',
      answer: 'Lawyers can apply for listing through our professional portal. We verify credentials and require active standing with the Law Society of Alberta.',
    },
  ]

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Filter questions based on search
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const filteredGeneralFAQs = generalFAQs.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Frequently Asked <span className="text-primary">Questions</span>
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto mb-8">
          Find answers to common questions about using Calgary Lawyer Directory
        </p>
        
        {/* Search Bar */}
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {searchTerm && (
            <motion.p 
              className="mt-2 text-sm text-textSecondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Found {filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0) + filteredGeneralFAQs.length} results
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Quick Help Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg">Need Immediate Help?</h3>
          </div>
          <p className="text-textSecondary mb-4">
            Contact our support team for urgent questions or assistance.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Contact Support
          </a>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-bold text-lg">Legal Resources</h3>
          </div>
          <p className="text-textSecondary mb-4">
            Access our legal guides, blog posts, and educational materials.
          </p>
          <a 
            href="/blog" 
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
          >
            Visit Blog
          </a>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-bold text-lg">Community Forum</h3>
          </div>
          <p className="text-textSecondary mb-4">
            Join discussions with other users and legal professionals.
          </p>
          <a 
            href="/community" 
            className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
          >
            Join Community
          </a>
        </div>
      </motion.div>

      {/* Categorized FAQs */}
      <div className="space-y-12 mb-16">
        {filteredCategories.map((category, catIndex) => {
          const Icon = category.icon
          const colorClass = `text-${category.color}`
          const bgClass = `bg-${category.color}/10`
          
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + catIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-lg ${bgClass} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colorClass}`} />
                </div>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              
              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const isOpen = openIndex === `${catIndex}-${index}`
                  return (
                    <motion.div
                      key={index}
                      className="bg-surface border border-border rounded-xl overflow-hidden"
                      initial={false}
                    >
                      <button
                        onClick={() => toggleQuestion(`${catIndex}-${index}`)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface/50 transition-colors"
                      >
                        <span className="font-semibold pr-4">{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-textSecondary flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-textSecondary flex-shrink-0" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-4 pt-2 border-t border-border">
                              <p className="text-textSecondary">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* General FAQs */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold mb-6">General Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGeneralFAQs.map((faq, index) => {
            const isOpen = openIndex === `general-${index}`
            return (
              <motion.div
                key={index}
                className="bg-surface border border-border rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
              >
                <button
                  onClick={() => toggleQuestion(`general-${index}`)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface/50 transition-colors"
                >
                  <span className="font-semibold pr-4">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-textSecondary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-textSecondary flex-shrink-0" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-4 pt-2 border-t border-border">
                        <p className="text-textSecondary">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Still Have Questions */}
      <motion.div 
        className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-textSecondary mb-6 max-w-2xl mx-auto">
          Can't find what you're looking for? Our support team is here to help you 
          with any questions about our platform or finding the right legal representation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/contact" 
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
          <a 
            href="/all-lawyers" 
            className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
          >
            Browse Lawyers
          </a>
        </div>
      </motion.div>

      {/* Helpful Links */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Helpful Resources</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="/blog" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            Legal Blog
          </a>
          <a 
            href="/terms" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            Terms of Service
          </a>
          <a 
            href="/privacy" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="/cookies" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            Cookie Policy
          </a>
        </div>
      </motion.div>
    </div>
  )
}
