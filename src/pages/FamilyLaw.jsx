import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Users, Scale, Shield, BookOpen } from 'lucide-react'
import DirectoryGrid from '../components/DirectoryGrid'
import { getLawyersByCategory } from '../data/lawyers'

export default function FamilyLaw() {
  const familyLawyers = getLawyersByCategory('family-law')

  const services = [
    {
      icon: Heart,
      title: 'Divorce & Separation',
      description: 'Legal guidance through divorce proceedings, separation agreements, and asset division.',
    },
    {
      icon: Users,
      title: 'Child Custody',
      description: 'Representation in custody disputes, parenting plans, and visitation rights.',
    },
    {
      icon: Scale,
      title: 'Child & Spousal Support',
      description: 'Calculation and enforcement of support payments for children and spouses.',
    },
    {
      icon: Shield,
      title: 'Domestic Violence Protection',
      description: 'Emergency protection orders and legal support for domestic violence situations.',
    },
    {
      icon: BookOpen,
      title: 'Prenuptial Agreements',
      description: 'Drafting and review of prenuptial agreements to protect assets.',
    },
    {
      icon: Users,
      title: 'Adoption & Guardianship',
      description: 'Legal assistance with adoption processes and guardianship arrangements.',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-primary">Family Law</span> Services in Calgary
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto">
          Compassionate legal support for family matters including divorce, child custody, 
          support agreements, and domestic issues. Our verified family lawyers prioritize 
          your family's well-being throughout the legal process.
        </p>
      </motion.div>

      {/* Services */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Our Family Law Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                className="bg-surface border border-border rounded-xl p-6 hover:border-primary transition-all"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-textSecondary">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Why Choose Our Family Lawyers */}
      <motion.div 
        className="bg-surface border border-border rounded-2xl p-8 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Family Lawyers</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Compassionate Approach</h4>
                  <p className="text-textSecondary text-sm">We understand family matters are sensitive and require empathy.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Mediation Focus</h4>
                  <p className="text-textSecondary text-sm">We prioritize amicable solutions to minimize family conflict.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Child-Centered</h4>
                  <p className="text-textSecondary text-sm">We always prioritize the best interests of children involved.</p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Transparent Pricing</h4>
                  <p className="text-textSecondary text-sm">Clear fee structures with no hidden costs.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Emergency Support</h4>
                  <p className="text-textSecondary text-sm">24/7 availability for urgent family law matters.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Free Consultations</h4>
                  <p className="text-textSecondary text-sm">Initial consultations to understand your situation.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Family Lawyers */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Family Law Specialists</h2>
            <p className="text-textSecondary">Verified family lawyers in Calgary</p>
          </div>
          <div className="text-textSecondary">
            {familyLawyers.length} {familyLawyers.length === 1 ? 'Lawyer' : 'Lawyers'} Available
          </div>
        </div>
        
        <DirectoryGrid lawyers={familyLawyers} />
      </motion.div>

      {/* CTA */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-border rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Need Family Law Assistance?</h2>
          <p className="text-xl text-textSecondary mb-8 max-w-2xl mx-auto">
            Our family law specialists are here to guide you through difficult times with 
            compassion and expertise. Schedule a free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Schedule Consultation
            </button>
            <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors">
              Emergency Help
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
