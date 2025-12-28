import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Award, Target, Heart, Globe } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Integrity',
      description: 'Every lawyer in our directory undergoes rigorous verification to ensure they meet our high standards of professionalism and ethics.',
    },
    {
      icon: Users,
      title: 'Client-First Approach',
      description: 'We prioritize your needs, connecting you with lawyers who specialize in your specific legal situation.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We feature only top-rated legal professionals with proven track records of success.',
    },
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'Our advanced matching algorithm connects you with the perfect lawyer for your unique case.',
    },
    {
      icon: Heart,
      title: 'Community Focus',
      description: 'We\'re committed to serving the Calgary community with accessible, high-quality legal resources.',
    },
    {
      icon: Globe,
      title: 'Modern Solutions',
      description: 'Leveraging technology to make finding legal help simpler, faster, and more transparent.',
    },
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former corporate lawyer with 15+ years experience in Calgary legal community.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Legal Partnerships',
      bio: 'Specializes in lawyer vetting and quality assurance processes.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Client Success Director',
      bio: 'Dedicated to ensuring every client finds their perfect legal match.',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
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
          About <span className="text-primary">CalgaryLawyers</span>
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto">
          We're revolutionizing how Calgarians find trusted legal representation. 
          Our mission is to make quality legal services accessible, transparent, and stress-free.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div 
        className="bg-surface border border-border rounded-2xl p-8 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-textSecondary mb-6">
              To bridge the gap between Calgarians in need of legal assistance and the city's 
              most qualified, trustworthy legal professionals. We believe everyone deserves 
              access to excellent legal representation without the traditional barriers of 
              cost, complexity, and uncertainty.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-surface border border-border rounded-xl">
                <div className="text-3xl font-bold text-primary mb-1">5,000+</div>
                <div className="text-textSecondary">Clients Helped</div>
              </div>
              <div className="text-center p-4 bg-surface border border-border rounded-xl">
                <div className="text-3xl font-bold text-secondary mb-1">12</div>
                <div className="text-textSecondary">Verified Lawyers</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
              alt="Calgary legal community"
              className="rounded-xl w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent rounded-xl" />
          </div>
        </div>
      </motion.div>

      {/* Values */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                className="bg-surface border border-border rounded-xl p-6 hover:border-primary transition-all"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-textSecondary">{value.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Team */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
            >
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-6 border-4 border-surface">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <div className="text-primary font-semibold mb-3">{member.role}</div>
              <p className="text-textSecondary">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-xl text-textSecondary mb-8 max-w-2xl mx-auto">
            Whether you need legal help or are a lawyer looking to join our directory, 
            we're here to support you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Find a Lawyer
            </button>
            <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors">
              Join as Lawyer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
