import React from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin, Briefcase, Award, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DirectoryGrid({ lawyers }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lawyers.map((lawyer, index) => (
        <motion.div
          key={lawyer.id}
          className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={lawyer.image}
              alt={lawyer.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {lawyer.featured && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
                Featured
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {lawyer.name}
                  {/* Phase 4: Verification Badge */}
                  {lawyer.verified && (
                    <CheckCircle className="w-4 h-4 text-secondary fill-secondary/10" title="Verified Lawyer" />
                  )}
                </h3>
                <p className="text-primary font-medium text-sm">{lawyer.title}</p>
              </div>
              <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded text-warning">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{lawyer.rating}</span>
              </div>
            </div>

            <p className="text-textSecondary text-sm mb-4 line-clamp-2">
              {lawyer.description}
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-textSecondary">
                <MapPin className="w-4 h-4" />
                {lawyer.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-textSecondary">
                <Briefcase className="w-4 h-4" />
                {lawyer.experience} experience
              </div>
              <div className="flex items-center gap-2 text-sm text-textSecondary">
                <Award className="w-4 h-4" />
                {lawyer.consultationFee}
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/lawyer/${lawyer.id}`}
                className="flex-1 px-4 py-2 bg-surface border border-border text-center text-sm font-semibold rounded-lg hover:bg-surface/80 transition-colors"
              >
                View Profile
              </Link>
              <Link
                to="/contact"
                className="flex-1 px-4 py-2 bg-primary text-white text-center text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
