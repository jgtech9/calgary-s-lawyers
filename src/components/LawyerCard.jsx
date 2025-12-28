import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock, Award, Phone, Mail, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IntakeForm } from './IntakeForm' // 👈 NEW: Import IntakeForm

export default function LawyerCard({ lawyer, viewMode = 'grid' }) {
  const [showIntakeForm, setShowIntakeForm] = useState(false) // 👈 NEW: Modal state

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'fill-warning text-warning'
                : 'fill-border text-border'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // 👈 NEW: Handler to open intake form
  const handleContactClick = () => {
    setShowIntakeForm(true)
  }

  if (viewMode === 'list') {
    return (
      <>
        <motion.div
          className="bg-surface border border-border rounded-xl p-6 hover:border-primary transition-all hover:shadow-glow"
          whileHover={{ y: -2 }}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Lawyer Image */}
            <div className="md:w-48">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs font-semibold rounded">
                  Verified
                </div>
              </div>
            </div>

            {/* Lawyer Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{lawyer.name}</h3>
                  <p className="text-primary font-medium mb-2">{lawyer.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-textSecondary" />
                      <span className="text-sm">{lawyer.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-textSecondary" />
                      <span className="text-sm">{lawyer.experience} years experience</span>
                    </div>
                    {renderStars(lawyer.rating)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary mb-1">
                    ${lawyer.hourlyRate}/hr
                  </div>
                  <div className="text-sm text-textSecondary">Starting rate</div>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {lawyer.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-textSecondary mb-4 line-clamp-2">
                {lawyer.description}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {/* 👈 UPDATED: Book Consultation now opens IntakeForm */}
                <button 
                  onClick={handleContactClick}
                  className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Book Consultation
                </button>
                
                {/* 👈 UPDATED: Send Message also opens IntakeForm */}
                <button 
                  onClick={handleContactClick}
                  className="px-4 py-2 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Message
                </button>
                
                {/* 👈 FIXED: Removed broken navigate() call */}
                <Link
                  to={`/lawyer/${lawyer.id}`}
                  className="px-4 py-2 border border-border text-text font-semibold rounded-lg hover:bg-surface/80 transition-colors flex items-center gap-2"
                >
                  View Profile
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 👈 NEW: IntakeForm Modal for List View */}
        {showIntakeForm && (
          <IntakeForm
            lawyerId={lawyer.id}
            lawyerName={lawyer.name}
            onClose={() => setShowIntakeForm(false)}
            onSuccess={() => {
              alert('✅ Your consultation request has been sent!');
              setShowIntakeForm(false);
            }}
          />
        )}
      </>
    )
  }

  // Grid View
  return (
    <>
      <motion.div
        className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary transition-all hover:shadow-glow group"
        whileHover={{ y: -4 }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={lawyer.image}
            alt={lawyer.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 right-3 px-2 py-1 bg-primary text-white text-xs font-semibold rounded">
            Verified
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold">{lawyer.rating.toFixed(1)}</div>
                {renderStars(lawyer.rating)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg mb-1">{lawyer.name}</h3>
              <p className="text-primary text-sm font-medium">{lawyer.title}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">${lawyer.hourlyRate}/hr</div>
              <div className="text-xs text-textSecondary">Starting rate</div>
            </div>
          </div>

          {/* Location & Experience */}
          <div className="flex items-center gap-3 mb-3 text-sm text-textSecondary">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {lawyer.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lawyer.experience} years
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {lawyer.specialties.slice(0, 3).map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                >
                  {specialty}
                </span>
              ))}
              {lawyer.specialties.length > 3 && (
                <span className="px-2 py-1 bg-surface text-textSecondary text-xs rounded">
                  +{lawyer.specialties.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-textSecondary text-sm mb-4 line-clamp-2">
            {lawyer.description}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            {/* 👈 UPDATED: Contact button now opens IntakeForm */}
            <button 
              onClick={handleContactClick}
              className="flex-1 px-3 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact
            </button>
            <Link
              to={`/lawyer/${lawyer.id}`}
              className="flex-1 px-3 py-2 border border-border text-text text-sm font-semibold rounded-lg hover:bg-surface/80 transition-colors text-center"
            >
              Profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 👈 NEW: IntakeForm Modal for Grid View */}
      {showIntakeForm && (
        <IntakeForm
          lawyerId={lawyer.id}
          lawyerName={lawyer.name}
          onClose={() => setShowIntakeForm(false)}
          onSuccess={() => {
            alert('✅ Your consultation request has been sent!');
            setShowIntakeForm(false);
          }}
        />
      )}
    </>
  )
}
