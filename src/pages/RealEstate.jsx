import React from 'react'
import { motion } from 'framer-motion'
import { Home, Key, FileText, Scale, Building, MapPin } from 'lucide-react'
import DirectoryGrid from '../components/DirectoryGrid'
import { getLawyersByCategory } from '../data/lawyers'

export default function RealEstate() {
  const realEstateLawyers = getLawyersByCategory('real-estate')

  const services = [
    {
      icon: Home,
      title: 'Residential Transactions',
      description: 'Purchase and sale agreements for homes, condos, and residential properties.',
    },
    {
      icon: Building,
      title: 'Commercial Real Estate',
      description: 'Office leases, retail spaces, industrial properties, and commercial developments.',
    },
    {
      icon: FileText,
      title: 'Title & Closing Services',
      description: 'Title searches, closing documents, and property transfer registration.',
    },
    {
      icon: Scale,
      title: 'Property Disputes',
      description: 'Boundary disputes, easement issues, and neighbor conflicts resolution.',
    },
    {
      icon: Key,
      title: 'Landlord-Tenant Law',
      description: 'Lease agreements, eviction proceedings, and tenant rights protection.',
    },
    {
      icon: MapPin,
      title: 'Zoning & Land Use',
      description: 'Zoning compliance, development permits, and municipal regulations.',
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
          <span className="text-primary">Real Estate</span> Law in Calgary
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto">
          Comprehensive legal services for all your real estate needs. Whether buying your first home 
          or managing commercial properties, our real estate lawyers ensure smooth transactions.
        </p>
      </motion.div>

      {/* Services */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Real Estate Legal Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                className="bg-surface border border-border rounded-xl p-6 hover:border-primary transition-all"
                whileHover={{ y: -4 }}
                initial={{ opacity: 1, y: 20 }}
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

      {/* Real Estate Lawyers */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Real Estate Law Specialists</h2>
            <p className="text-textSecondary">Verified real estate lawyers in Calgary</p>
          </div>
          <div className="text-textSecondary">
            {realEstateLawyers.length} {realEstateLawyers.length === 1 ? 'Lawyer' : 'Lawyers'} Available
          </div>
        </div>
        
        <DirectoryGrid lawyers={realEstateLawyers} />
      </motion.div>

      {/* CTA */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Need Real Estate Legal Assistance?</h2>
          <p className="text-xl text-textSecondary mb-8 max-w-2xl mx-auto">
            Our real estate law specialists ensure your property transactions are legally sound 
            and protect your interests throughout the process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Schedule Consultation
            </button>
            <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors">
              Property Assessment
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
