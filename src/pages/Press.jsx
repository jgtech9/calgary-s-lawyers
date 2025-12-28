import React from 'react'
import { motion } from 'framer-motion'
import { Newspaper, Calendar, Download, ExternalLink, Users, TrendingUp, Award, Globe, FileText, MessageSquare, Share2, Mail } from 'lucide-react'

export default function Press() {
  const pressReleases = [
    {
      id: 1,
      title: 'Calgary Lawyer Directory Launches New AI-Powered Matching System',
      date: '2024-03-15',
      summary: 'Introducing advanced AI technology to match clients with the most suitable legal professionals based on case complexity, expertise, and client preferences.',
      category: 'Product Launch',
      downloads: ['PDF', 'DOC'],
      link: '#'
    },
    {
      id: 2,
      title: 'Partnership with Law Society of Alberta Announced',
      date: '2024-02-28',
      summary: 'Strategic partnership to enhance lawyer verification processes and provide continuing education resources for legal professionals.',
      category: 'Partnership',
      downloads: ['PDF'],
      link: '#'
    },
    {
      id: 3,
      title: 'Record Growth: 500+ Lawyers Now Listed on Platform',
      date: '2024-02-10',
      summary: 'Milestone achievement as platform expands to include over 500 verified legal professionals across all major practice areas.',
      category: 'Milestone',
      downloads: ['PDF', 'DOC', 'PPT'],
      link: '#'
    },
    {
      id: 4,
      title: 'New Mobile App Release for iOS and Android',
      date: '2024-01-22',
      summary: 'Enhanced mobile experience with new features including real-time chat, document sharing, and appointment scheduling.',
      category: 'Product Update',
      downloads: ['PDF'],
      link: '#'
    },
    {
      id: 5,
      title: 'Community Legal Education Initiative Launched',
      date: '2023-12-05',
      summary: 'Free legal education workshops and resources now available to Calgary communities through new outreach program.',
      category: 'Community',
      downloads: ['PDF', 'DOC'],
      link: '#'
    },
    {
      id: 6,
      title: 'Annual Transparency Report Published',
      date: '2023-11-18',
      summary: 'Comprehensive report detailing platform statistics, user demographics, and impact metrics for the past year.',
      category: 'Report',
      downloads: ['PDF', 'XLS'],
      link: '#'
    }
  ]

  const mediaCoverage = [
    {
      outlet: 'Calgary Herald',
      title: 'Digital Transformation in Legal Services',
      date: '2024-03-10',
      excerpt: 'How Calgary Lawyer Directory is revolutionizing access to legal services through technology.',
      link: '#',
      logo: 'CH'
    },
    {
      outlet: 'LegalTech Today',
      title: 'Innovation in Lawyer Matching Algorithms',
      date: '2024-02-25',
      excerpt: 'Deep dive into the AI technology powering better client-lawyer connections.',
      link: '#',
      logo: 'LT'
    },
    {
      outlet: 'Alberta Business Journal',
      title: 'Startup Spotlight: Connecting Calgarians with Legal Help',
      date: '2024-02-12',
      excerpt: 'Profile of the platform\'s journey from concept to market leader.',
      link: '#',
      logo: 'AB'
    },
    {
      outlet: 'Canadian Lawyer Magazine',
      title: 'The Future of Legal Directories',
      date: '2024-01-30',
      excerpt: 'Analysis of how digital platforms are changing legal service discovery.',
      link: '#',
      logo: 'CL'
    }
  ]

  const pressKit = [
    {
      title: 'Company Logo Pack',
      description: 'High-resolution logos in various formats',
      format: 'ZIP',
      size: '15 MB',
      icon: FileText
    },
    {
      title: 'Brand Guidelines',
      description: 'Complete brand style guide and usage',
      format: 'PDF',
      size: '8 MB',
      icon: Award
    },
    {
      title: 'Executive Team Photos',
      description: 'High-quality headshots and team photos',
      format: 'ZIP',
      size: '25 MB',
      icon: Users
    },
    {
      title: 'Company Fact Sheet',
      description: 'Key statistics and company information',
      format: 'PDF',
      size: '2 MB',
      icon: TrendingUp
    },
    {
      title: 'Product Screenshots',
      description: 'Platform screenshots and feature images',
      format: 'ZIP',
      size: '40 MB',
      icon: Globe
    },
    {
      title: 'Media Contact List',
      description: 'Key contacts for media inquiries',
      format: 'PDF',
      size: '1 MB',
      icon: Mail
    }
  ]

  const stats = [
    { icon: Users, label: 'Active Lawyers', value: '500+', color: 'primary' },
    { icon: TrendingUp, label: 'Monthly Users', value: '10,000+', color: 'secondary' },
    { icon: Award, label: 'Client Reviews', value: '2,500+', color: 'accent' },
    { icon: Globe, label: 'Practice Areas', value: '15+', color: 'success' }
  ]

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Newspaper className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Press & <span className="text-primary">Media</span>
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto mb-8">
          Latest news, press releases, and media resources from Calgary Lawyer Directory
        </p>
        
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${stat.color}/10 mb-3`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-textSecondary">{stat.label}</div>
              </div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Press Releases */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Press Releases</h2>
          <a 
            href="#subscribe" 
            className="flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <Mail className="w-4 h-4" />
            Subscribe to Updates
          </a>
        </div>
        
        <div className="space-y-6">
          {pressReleases.map((release, index) => (
            <motion.div
              key={release.id}
              className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:w-32 flex-shrink-0">
                  <div className="flex items-center gap-2 text-textSecondary mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(release.date).toLocaleDateString('en-CA', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {release.category}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">{release.title}</h3>
                  <p className="text-textSecondary mb-4">{release.summary}</p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-textSecondary" />
                      <span className="text-sm text-textSecondary">Downloads:</span>
                      <div className="flex gap-2">
                        {release.downloads.map((format, i) => (
                          <span key={i} className="px-2 py-1 bg-surface border border-border rounded text-xs">
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <a 
                      href={release.link}
                      className="flex items-center gap-2 text-primary font-semibold hover:underline ml-auto"
                    >
                      Read More
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Media Coverage */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-8">Media Coverage</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaCoverage.map((article, index) => (
            <motion.div
              key={index}
              className="bg-surface border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <div className="font-bold text-secondary">{article.logo}</div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{article.outlet}</span>
                    <span className="text-sm text-textSecondary">
                      {new Date(article.date).toLocaleDateString('en-CA', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                  <p className="text-textSecondary mb-4 text-sm">{article.excerpt}</p>
                  
                  <a 
                    href={article.link}
                    className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
                  >
                    Read Article
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Press Kit */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h2 className="text-3xl font-bold mb-8">Press Kit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pressKit.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                className="bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.3 + index * 0.05 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-textSecondary text-sm">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-surface border border-border rounded text-xs">
                      {item.format}
                    </span>
                    <span className="text-sm text-textSecondary">{item.size}</span>
                  </div>
                  
                  <button className="flex items-center gap-2 text-accent font-semibold hover:underline">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
            <p className="text-textSecondary mb-6">
              For media inquiries, interview requests, or additional information, 
              please contact our communications team.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-textSecondary text-sm">Email</div>
                  <div className="font-semibold">press@calgarylawyers.ca</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-secondary" />
                <div>
                  <div className="text-textSecondary text-sm">Phone</div>
                  <div className="font-semibold">(403) 555-PRESS</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-textSecondary text-sm">Social Media</div>
                  <div className="font-semibold">@CalgaryLawyers</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:pl-8 lg:border-l lg:border-border">
            <h3 className="text-xl font-bold mb-4">Subscribe to Press Releases</h3>
            <p className="text-textSecondary mb-6">
              Get notified about our latest news, announcements, and media updates.
            </p>
            
            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="updates"
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="updates" className="text-sm text-textSecondary">
                  I agree to receive press releases and media updates
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Quick Links</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="/about" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            About Us
          </a>
          <a 
            href="/blog" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            Legal Blog
          </a>
          <a 
            href="/faq" 
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            FAQs
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
