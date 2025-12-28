import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Award, Star, Users, Clock, Shield } from 'lucide-react'

export default function AdSidebar() {
  const ads = [
    {
      id: 1,
      title: "Top Rated This Week",
      lawyer: "Sarah Chen",
      specialty: "Corporate Law",
      rating: 4.9,
      reviews: 42,
      image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg",
      badge: "Trending",
      icon: TrendingUp,
      color: "from-primary to-secondary"
    },
    {
      id: 2,
      title: "Most Experienced",
      lawyer: "Robert Kim",
      specialty: "Criminal Defense",
      experience: "25 years",
      image: "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg",
      badge: "Veteran",
      icon: Award,
      color: "from-accent to-primary"
    },
    {
      id: 3,
      title: "Emergency Services",
      description: "24/7 legal assistance for urgent matters",
      image: "https://images.pexels.com/photos/5668479/pexels-photo-5668479.jpeg",
      badge: "24/7",
      icon: Shield,
      color: "from-secondary to-accent"
    }
  ]

  const resources = [
    { title: "Legal Aid Alberta", description: "Free legal services for eligible individuals", icon: Users },
    { title: "Court Schedule", description: "Check Calgary court dates and times", icon: Clock },
    { title: "Lawyer Reviews", description: "Read verified client testimonials", icon: Star },
  ]

  return (
    <div className="space-y-6">
      {/* Featured Lawyers */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-surface border border-border rounded-xl p-5"
      >
        <h3 className="font-bold text-lg mb-4">Featured Lawyers</h3>
        <div className="space-y-4">
          {ads.map((ad) => {
            const Icon = ad.icon
            return (
              <motion.div
                key={ad.id}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <div className={`absolute inset-0 bg-gradient-to-r ${ad.color} opacity-20`} />
                  <div className="relative p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                          <img
                            src={ad.image}
                            alt={ad.lawyer || ad.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -top-1 -right-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold">{ad.title}</h4>
                            {ad.lawyer && (
                              <>
                                <p className="text-primary font-medium">{ad.lawyer}</p>
                                <p className="text-sm text-textSecondary">{ad.specialty}</p>
                              </>
                            )}
                            {ad.description && (
                              <p className="text-sm text-textSecondary">{ad.description}</p>
                            )}
                          </div>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                            {ad.badge}
                          </span>
                        </div>
                        {(ad.rating || ad.experience) && (
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            {ad.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-warning text-warning" />
                                <span className="font-medium">{ad.rating}</span>
                                <span className="text-textSecondary">({ad.reviews} reviews)</span>
                              </div>
                            )}
                            {ad.experience && (
                              <div className="text-textSecondary">{ad.experience} experience</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-surface border border-border rounded-xl p-5"
      >
        <h3 className="font-bold text-lg mb-4">Legal Resources</h3>
        <div className="space-y-3">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface/80 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-sm text-textSecondary">{resource.description}</div>
                </div>
                <div className="text-textSecondary group-hover:text-primary transition-colors">
                  →
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-primary to-secondary rounded-xl p-5 text-white"
      >
        <h3 className="font-bold text-lg mb-4">Directory Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm opacity-90">Verified Lawyers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">6</div>
              <div className="text-sm opacity-90">Legal Areas</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm opacity-90">Avg Rating</div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/20">
            <div className="text-sm opacity-90 mb-2">Success Rate</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="w-4/5 bg-white rounded-full h-2"></div>
            </div>
            <div className="text-right text-sm mt-1">92% Case Success</div>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-surface border border-border rounded-xl p-5 text-center"
      >
        <h3 className="font-bold text-lg mb-3">Need Legal Help?</h3>
        <p className="text-textSecondary mb-4">
          Our team is ready to assist you with any legal matter.
        </p>
        <button className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          Get Free Consultation
        </button>
        <div className="mt-3 text-sm text-textSecondary">
          No obligation • 30-minute session • Expert advice
        </div>
      </motion.div>
    </div>
  )
}
