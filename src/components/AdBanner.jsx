import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Shield, Clock, Users } from 'lucide-react'

export default function AdBanner() {
  const [visible, setVisible] = useState(true)
  const [currentAd, setCurrentAd] = useState(0)

  const ads = [
    {
      id: 1,
      title: "Need Emergency Legal Help?",
      description: "24/7 emergency legal assistance available. Speak with a lawyer now.",
      cta: "Call Now: (403) 555-HELP",
      icon: Shield,
      bgColor: "bg-gradient-to-r from-primary to-secondary",
      textColor: "text-white",
      stats: "500+ emergencies handled"
    },
    {
      id: 2,
      title: "Free Initial Consultation",
      description: "Book your free 30-minute consultation with top-rated lawyers.",
      cta: "Book Free Consultation",
      icon: Clock,
      bgColor: "bg-gradient-to-r from-accent to-primary",
      textColor: "text-white",
      stats: "2,000+ free consults given"
    },
    {
      id: 3,
      title: "Join Our Lawyer Network",
      description: "Are you a lawyer? Join our verified network of legal professionals.",
      cta: "Apply Now",
      icon: Users,
      bgColor: "bg-gradient-to-r from-secondary to-accent",
      textColor: "text-white",
      stats: "200+ lawyers in network"
    }
  ]

  const nextAd = () => {
    setCurrentAd((prev) => (prev + 1) % ads.length)
  }

  const prevAd = () => {
    setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length)
  }

  if (!visible) return null

  const ad = ads[currentAd]
  const Icon = ad.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative ${ad.bgColor} ${ad.textColor} rounded-2xl mx-4 mt-4 mb-8 overflow-hidden`}
      >
        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 z-10 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={prevAd}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Previous ad"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <button
          onClick={nextAd}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Next ad"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Ad Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-8 h-8" />
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{ad.title}</h3>
              <p className="mb-4 opacity-90">{ad.description}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button className="px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-white/90 transition-colors flex items-center gap-2">
                  {ad.cta}
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="text-sm opacity-80">
                  <span className="font-semibold">{ad.stats}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAd(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentAd ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to ad ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
