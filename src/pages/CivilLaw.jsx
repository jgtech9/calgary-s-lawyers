import React from 'react'
import { motion } from 'framer-motion'
import { Scale, FileText, Users, Home, Car, AlertTriangle } from 'lucide-react'
import DirectoryGrid from '../components/DirectoryGrid'
import { getLawyersByCategory } from '../data/lawyers'

export default function CivilLaw() {
  const civilLawyers = getLawyersByCategory('civil-law')

  const services = [
    {
      icon: Scale,
      title: 'Personal Injury',
      description: 'Claims for accidents, injuries, and negligence resulting in harm.',
    },
    {
      icon: FileText,
      title: 'Contract Disputes',
      description: 'Resolution of contract breaches, interpretation issues, and enforcement.',
    },
    {
      icon: Users,
      title: 'Defamation & Libel',
      description: 'Claims for damage to reputation through false statements.',
    },
    {
      icon: Home,
      title: 'Property Damage',
      description: 'Claims for damage to personal or real property.',
    },
    {
      icon: Car,
      title: 'Motor Vehicle Claims',
      description: 'Accident claims, insurance disputes, and liability issues.',
    },
    {
      icon: AlertTriangle,
      title: 'Professional Negligence',
      description: 'Claims against professionals for errors and omissions.',
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
          <span className="text-primary">Civil Law</span> in Calgary
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto">
          Resolution of disputes between individuals and organizations. Our civil litigation lawyers 
          provide effective representation for a wide range of civil matters.
        </p>
      </motion.div>

      {/* Services */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Civil Law Services</h2>
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

      {/* Civil Lawyers */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Civil Law Specialists</h2>
            <p className="text-textSecondary">Verified civil litigation lawyers in Calgary</p>
          </div>
          <div className="text-textSecondary">
            {civilLawyers.length} {civilLawyers.length === 1 ? 'Lawyer' : 'Lawyers'} Available
          </div>
        </div>
        
        <DirectoryGrid lawyers={civilLawyers} />
      </motion.div>

      {/* CTA */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Need Civil Litigation Assistance?</h2>
          <p className="text-xl text-textSecondary mb-8 max-w-2xl mx-auto">
            Our civil litigation lawyers provide strategic representation to resolve disputes 
            effectively and protect your legal rights in civil matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Case Evaluation
            </button>
            <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors">
              Litigation Strategy
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
