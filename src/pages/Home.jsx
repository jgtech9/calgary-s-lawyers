import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Star, Clock, Users, Award, ChevronRight } from 'lucide-react'
import Search from '../components/Search'
import DirectoryGrid from '../components/DirectoryGrid'
import { getFeaturedLawyers, getCategoriesWithCounts, searchLawyers } from '../data/lawyers'

export default function Home() {
  const [searchResults, setSearchResults] = useState(null)
  const [shouldFocusSearch, setShouldFocusSearch] = useState(false)
  const featuredLawyers = getFeaturedLawyers()
  const categoriesData = getCategoriesWithCounts()
  const location = useLocation()
  const searchRef = useRef(null)
  
  // Convert categories object to array with proper structure
  const categories = [
    { name: 'Family Law', count: categoriesData['family-law'] || 0, icon: '👨‍👩‍👧‍👦', id: 'family-law', path: '/family-law' },
    { name: 'Corporate Law', count: categoriesData['corporate-law'] || 0, icon: '🏢', id: 'corporate-law', path: '/corporate-law' },
    { name: 'Real Estate', count: categoriesData['real-estate'] || 0, icon: '🏠', id: 'real-estate', path: '/real-estate' },
    { name: 'Criminal Defense', count: categoriesData['criminal-defense'] || 0, icon: '⚖️', id: 'criminal-defense', path: '/criminal-defense' },
    { name: 'Employment Law', count: categoriesData['employment-law'] || 0, icon: '💼', id: 'employment-law', path: '/employment-law' },
    { name: 'Civil Law', count: categoriesData['civil-law'] || 0, icon: '📜', id: 'civil-law', path: '/civil-law' },
  ]

  const stats = [
    { icon: Shield, value: '12', label: 'Verified Lawyers', color: 'text-primary' },
    { icon: Star, value: '4.8', label: 'Average Rating', color: 'text-warning' },
    { icon: Clock, value: '15+', label: 'Years Experience', color: 'text-secondary' },
    { icon: Users, value: '500+', label: 'Clients Helped', color: 'text-accent' },
  ]

  const handleSearch = (searchTerm, category) => {
    const results = searchLawyers(searchTerm, category)
    setSearchResults(results)
  }

  // Handle search focus from header
  useEffect(() => {
    // Check if we should focus search from navigation state
    if (location.state?.focusSearch) {
      setShouldFocusSearch(true)
      
      // Clear the state to prevent refocusing on re-renders
      window.history.replaceState({}, document.title)
    }

    // Listen for custom event from header
    const handleFocusSearch = () => {
      setShouldFocusSearch(true)
    }

    window.addEventListener('focusSearchInput', handleFocusSearch)
    
    return () => {
      window.removeEventListener('focusSearchInput', handleFocusSearch)
    }
  }, [location.state])

  // Focus search input when triggered
  useEffect(() => {
    if (shouldFocusSearch && searchRef.current) {
      // Scroll to search section
      const searchSection = document.querySelector('.search-section')
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' })
      }
      
      // Focus the search input
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]')
        if (searchInput) {
          searchInput.focus()
        }
        setShouldFocusSearch(false)
      }, 500)
    }
  }, [shouldFocusSearch])

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
            alt="Calgary skyline with legal documents"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full mb-6">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by 5,000+ Calgarians</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block gradient-text">Legal Match in Calgary</span>
            </h1>
            
            <p className="text-xl text-textTertiary mb-8 max-w-xl">
              Connect with verified, experienced lawyers across all legal specialties. 
              Free consultations, transparent pricing, and trusted reviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/all-lawyers"
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Browse Lawyers
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/contact"
                className="px-8 py-3 border-2 border-primary text-white font-semibold rounded-lg hover:bg-primary/10 transition-colors"
              >
                Get Free Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search Section */}
      <div className="search-section" ref={searchRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Search onSearch={handleSearch} />
        </motion.div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Search Results ({searchResults.length})
            </h2>
            <button 
              onClick={() => setSearchResults(null)}
              className="text-textSecondary hover:text-text transition-colors"
            >
              Clear Search
            </button>
          </div>
          {searchResults.length > 0 ? (
            <DirectoryGrid lawyers={searchResults} />
          ) : (
            <div className="text-center py-12 border border-border rounded-2xl">
              <p className="text-textSecondary text-lg">No lawyers found matching your search criteria.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-surface border border-border rounded-xl p-6 text-center">
              <div className={`w-12 h-12 rounded-full ${stat.color}/10 flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-textSecondary">{stat.label}</div>
            </div>
          )
        })}
      </motion.div>

      {/* Categories */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Browse by Legal Area</h2>
          <Link to="/all-lawyers" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="bg-surface border border-border rounded-xl p-4 text-center hover:border-primary transition-all hover:shadow-glow cursor-pointer group"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link 
                to={category.path}
                className="block"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <div className="font-semibold mb-1">{category.name}</div>
                <div className="text-sm text-textSecondary">{category.count} lawyers</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Featured Lawyers */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Lawyers</h2>
            <p className="text-textSecondary">Top-rated legal professionals in Calgary</p>
          </div>
          <Link to="/all-lawyers" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View all lawyers
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <DirectoryGrid lawyers={featuredLawyers} />
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="relative bg-surface border border-border rounded-2xl p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Lawyer?</h2>
              <p className="text-textSecondary mb-6 max-w-2xl">
                Join thousands of Calgarians who found their perfect legal match through our directory. 
                Get started with a free consultation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/all-lawyers"
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Browse All Lawyers
                </Link>
                <Link 
                  to="/contact"
                  className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Get Free Consultation
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-64 h-64 rounded-full bg-gradient-primary opacity-20 flex items-center justify-center">
                <Shield className="w-32 h-32 text-primary opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
