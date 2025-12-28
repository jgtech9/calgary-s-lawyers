import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, DollarSign, Clock, Users, Award, GraduationCap, Heart, ArrowRight, CheckCircle, ExternalLink, Mail } from 'lucide-react'

export default function Careers() {
  const jobOpenings = [
    {
      id: 1,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Calgary, AB',
      type: 'Full-time',
      salary: '$85,000 - $110,000',
      experience: '3+ years',
      description: 'Build beautiful, responsive interfaces for our legal directory platform using React, TypeScript, and Tailwind CSS.',
      requirements: ['React/TypeScript', 'Tailwind CSS', 'REST APIs', 'Git'],
      posted: '2024-03-10',
      link: '#'
    },
    {
      id: 2,
      title: 'Legal Content Writer',
      department: 'Content',
      location: 'Remote',
      type: 'Contract',
      salary: '$60 - $80/hour',
      experience: '2+ years',
      description: 'Create engaging legal content, blog posts, and educational materials for our platform.',
      requirements: ['Legal Writing', 'SEO Knowledge', 'Research Skills', 'Attention to Detail'],
      posted: '2024-03-08',
      link: '#'
    },
    {
      id: 3,
      title: 'Customer Success Manager',
      department: 'Operations',
      location: 'Calgary, AB',
      type: 'Full-time',
      salary: '$70,000 - $90,000',
      experience: '2+ years',
      description: 'Support our lawyer partners and clients, ensuring exceptional user experience and satisfaction.',
      requirements: ['Customer Service', 'Communication', 'Problem Solving', 'Legal Industry Knowledge'],
      posted: '2024-03-05',
      link: '#'
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Hybrid',
      type: 'Full-time',
      salary: '$75,000 - $100,000',
      experience: '3+ years',
      description: 'Design intuitive user experiences and beautiful interfaces for our legal technology platform.',
      requirements: ['Figma/Sketch', 'User Research', 'Prototyping', 'Design Systems'],
      posted: '2024-03-01',
      link: '#'
    },
    {
      id: 5,
      title: 'Legal Partnerships Manager',
      department: 'Business Development',
      location: 'Calgary, AB',
      type: 'Full-time',
      salary: '$80,000 - $105,000',
      experience: '4+ years',
      description: 'Build and maintain relationships with law firms and individual legal practitioners.',
      requirements: ['Sales/Partnerships', 'Legal Industry', 'Networking', 'Negotiation'],
      posted: '2024-02-28',
      link: '#'
    },
    {
      id: 6,
      title: 'Data Analyst',
      department: 'Analytics',
      location: 'Remote',
      type: 'Full-time',
      salary: '$75,000 - $95,000',
      experience: '2+ years',
      description: 'Analyze platform data to provide insights for business decisions and product improvements.',
      requirements: ['SQL/Python', 'Data Visualization', 'Statistics', 'Analytical Thinking'],
      posted: '2024-02-25',
      link: '#'
    }
  ]

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Compensation',
      description: 'Market-competitive salaries with regular reviews and bonus opportunities'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision coverage for you and your family'
    },
    {
      icon: Clock,
      title: 'Flexible Hours',
      description: 'Flexible work arrangements and generous paid time off'
    },
    {
      icon: GraduationCap,
      title: 'Learning & Development',
      description: 'Annual learning budget and opportunities for professional growth'
    },
    {
      icon: Users,
      title: 'Team Culture',
      description: 'Collaborative, inclusive environment with regular team events'
    },
    {
      icon: Award,
      title: 'Impact',
      description: 'Make a real difference in how people access legal services'
    }
  ]

  const values = [
    {
      title: 'Integrity First',
      description: 'We build trust through transparency and ethical practices in everything we do.'
    },
    {
      title: 'User-Centric',
      description: 'Every decision starts with our users - both clients seeking help and lawyers providing it.'
    },
    {
      title: 'Innovation Driven',
      description: 'We embrace new technologies and approaches to solve complex legal challenges.'
    },
    {
      title: 'Community Focused',
      description: 'We\'re committed to making legal services more accessible to all Calgarians.'
    }
  ]

  const departments = [
    { name: 'Engineering', count: 8, color: 'primary' },
    { name: 'Design', count: 4, color: 'secondary' },
    { name: 'Operations', count: 12, color: 'accent' },
    { name: 'Content', count: 5, color: 'success' },
    { name: 'Business', count: 6, color: 'warning' },
    { name: 'Analytics', count: 3, color: 'error' }
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Build the Future of <span className="text-primary">Legal Access</span>
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto mb-8">
          Join our mission to make legal services more accessible, transparent, and effective for everyone in Calgary.
        </p>
        
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">38</div>
            <div className="text-sm text-textSecondary">Team Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">6</div>
            <div className="text-sm text-textSecondary">Open Positions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">4.8</div>
            <div className="text-sm text-textSecondary">Team Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">15+</div>
            <div className="text-sm text-textSecondary">Cities Represented</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Job Openings */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Open Positions</h2>
          <div className="text-textSecondary">
            Showing <span className="font-semibold text-primary">{jobOpenings.length}</span> positions
          </div>
        </div>
        
        <div className="space-y-6">
          {jobOpenings.map((job, index) => (
            <motion.div
              key={job.id}
              className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="lg:w-48 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                      {job.department}
                    </span>
                    <span className="px-3 py-1 bg-surface border border-border text-textSecondary text-sm rounded-full">
                      {job.type}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-textSecondary">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-textSecondary">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-textSecondary">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{job.experience} experience</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <p className="text-textSecondary mb-4">{job.description}</p>
                    </div>
                    <span className="text-sm text-textSecondary">
                      Posted {new Date(job.posted).toLocaleDateString('en-CA', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, i) => (
                        <span key={i} className="px-3 py-1 bg-surface border border-border rounded text-sm">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <a 
                      href={job.link}
                      className="flex items-center gap-2 text-primary font-semibold hover:underline group-hover:gap-3 transition-all"
                    >
                      View Details & Apply
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    
                    <button className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                      Quick Apply
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Why Join Our Team?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                className="bg-surface border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
              >
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-textSecondary text-sm">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Departments & Values */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Departments */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Our Departments</h2>
          <div className="space-y-4">
            {departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-${dept.color}`}></div>
                  <span className="font-medium">{dept.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-surface border border-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${dept.color}`}
                      style={{ width: `${(dept.count / 12) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-textSecondary text-sm">{dept.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="space-y-4">
            {values.map((value, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{value.title}</h3>
                  <p className="text-textSecondary text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Application Process */}
      <motion.div 
        className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-8 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Our Hiring Process</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Application Review', desc: 'We review your application within 48 hours' },
            { step: '2', title: 'Initial Screen', desc: '30-minute call with our hiring team' },
            { step: '3', title: 'Skills Assessment', desc: 'Practical task related to the role' },
            { step: '4', title: 'Team Interviews', desc: 'Meet the team and final discussions' }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-textSecondary text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact & General Application */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <div>
          <h2 className="text-2xl font-bold mb-4">General Inquiries</h2>
          <p className="text-textSecondary mb-6">
            Don't see the perfect role? We're always looking for talented people. 
            Send us your resume and tell us how you can contribute to our mission.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <div className="text-textSecondary text-sm">Email</div>
                <div className="font-semibold">careers@calgarylawyers.ca</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-secondary" />
              <div>
                <div className="text-textSecondary text-sm">LinkedIn</div>
                <div className="font-semibold">@CalgaryLawyers-Careers</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:pl-8 lg:border-l lg:border-border">
          <h3 className="text-xl font-bold mb-4">General Application</h3>
          <p className="text-textSecondary mb-6">
            Submit your resume and cover letter for future opportunities.
          </p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <textarea
                placeholder="Tell us about yourself and why you're interested..."
                rows="3"
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="consent"
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="consent" className="text-sm text-textSecondary">
                I agree to have my information stored for future opportunities
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Submit Application
            </button>
          </form>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.0 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Learn More</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="/about" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            About Us
          </a>
          <a 
            href="/press" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            Press & Media
          </a>
          <a 
            href="/blog" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            Legal Blog
          </a>
          <a 
            href="/contact" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            Contact
          </a>
        </div>
      </motion.div>
    </div>
  )
}
