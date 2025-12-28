import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Scale, FileText, Clock, Users, AlertTriangle } from 'lucide-react'
import DirectoryGrid from '../components/DirectoryGrid'
import { getLawyersByCategory } from '../data/lawyers'

export default function CriminalDefense() {
  const criminalLawyers = getLawyersByCategory('criminal-defense')

  const services = [
    {
      icon: Shield,
      title: 'Criminal Charges Defense',
      description: 'Defense against all criminal charges including DUI, assault, theft, and drug offenses.',
    },
    {
      icon: Scale,
      title: 'Court Representation',
      description: 'Experienced courtroom advocacy and trial representation.',
    },
    {
      icon: FileText,
      title: 'Bail Hearings',
      description: 'Bail applications and release conditions negotiations.',
    },
    {
      icon: Clock,
      title: 'Emergency Legal Help',
      description: '24/7 availability for arrests and urgent criminal matters.',
    },
    {
      icon: Users,
      title: 'Appeals & Reviews',
      description: 'Appeal preparation and sentence review applications.',
    },
    {
      icon: AlertTriangle,
      title: 'Record Suspensions',
      description: 'Assistance with criminal record suspensions and pardons.',
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
          <span className="text-primary">Criminal Defense</span> in Calgary
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto">
          Aggressive defense for criminal charges. Our experienced criminal defense lawyers 
          protect your rights and fight for the best possible outcome in your case.
        </p>
      </motion.div>

      {/* Emergency Banner */}
      <motion.div 
        className="bg-error/10 border border-error/20 rounded-2xl p-6 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-error flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg mb-1">Emergency Criminal Defense</h3>
            <p className="text-textSecondary">
              If you've been arrested or charged with a criminal offense, contact us immediately 
              for 24/7 emergency legal assistance.
            </p>
          </div>
          <button className="ml-auto px-6 py-3 bg-error text-white font-semibold rounded-lg hover:bg-error/90 transition-colors whitespace-nowrap">
            Emergency Help Line
          </button>
        </div>
      </motion.div>

      {/* Services */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Criminal Defense Services</h2>
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

      {/* Criminal Defense Lawyers */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Criminal Defense Specialists</h2>
            <p className="text-textSecondary">Verified criminal defense lawyers in Calgary</p>
          </div>
          <div className="text-textSecondary">
            {criminalLawyers.length} {criminalLawyers.length === 1 ? 'Lawyer' : 'Lawyers'} Available
          </div>
        </div>
        
        <DirectoryGrid lawyers={criminalLawyers} />
      </motion.div>

      {/* CTA */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Need Criminal Defense Representation?</h2>
          <p className="text-xl text-textSecondary mb-8 max-w-2xl mx-auto">
            Don't face criminal charges alone. Our experienced defense lawyers provide 
            aggressive representation to protect your rights and freedom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Free Case Review
            </button>
            <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors">
              24/7 Emergency Line
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
