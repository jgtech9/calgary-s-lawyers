import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star, MapPin, Briefcase, Award, ChevronDown, Users, Clock } from 'lucide-react'
import DirectoryGrid from '../components/DirectoryGrid'
import Pagination from '../components/Pagination'
import { getAllLawyers, getCategoriesWithCounts } from '../data/lawyers'

export default function AllLawyers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  
  const allLawyers = getAllLawyers()
  const categoriesData = getCategoriesWithCounts()
  
  // Convert categories object to array with proper structure
  const categories = [
    { name: 'All Categories', count: allLawyers.length, id: 'all' },
    { name: 'Family Law', count: categoriesData['family-law'] || 0, id: 'family-law' },
    { name: 'Corporate Law', count: categoriesData['corporate-law'] || 0, id: 'corporate-law' },
    { name: 'Real Estate', count: categoriesData['real-estate'] || 0, id: 'real-estate' },
    { name: 'Criminal Defense', count: categoriesData['criminal-defense'] || 0, id: 'criminal-defense' },
    { name: 'Employment Law', count: categoriesData['employment-law'] || 0, id: 'employment-law' },
    { name: 'Civil Law', count: categoriesData['civil-law'] || 0, id: 'civil-law' },
  ]

  // Filter and sort lawyers
  const filteredLawyers = useMemo(() => {
    return allLawyers.filter(lawyer => {
      // Filter by search term - use correct properties from lawyer data
      const matchesSearch = searchTerm === '' || 
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filter by category - check if lawyer has this category in their categories array
      const matchesCategory = selectedCategory === 'all' || 
        lawyer.categories.includes(selectedCategory)
      
      return matchesSearch && matchesCategory
    }).sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'experience') {
        // Extract years from experience string (e.g., "15 years" -> 15)
        const getYears = (exp) => parseInt(exp) || 0
        return getYears(b.experience) - getYears(a.experience)
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })
  }, [allLawyers, searchTerm, selectedCategory, sortBy])

  // Calculate pagination
  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLawyers = filteredLawyers.slice(startIndex, endIndex)

  const stats = [
    { icon: Users, value: allLawyers.length.toString(), label: 'Total Lawyers', color: 'text-primary' },
    { icon: Star, value: '4.8', label: 'Average Rating', color: 'text-warning' },
    { icon: Clock, value: '15+', label: 'Avg. Experience', color: 'text-secondary' },
    { icon: Award, value: '95%', label: 'Satisfaction Rate', color: 'text-accent' },
  ]

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSortBy('rating')
    setCurrentPage(1) // Reset to first page when clearing filters
  }

  const handlePageChange = (page, newItemsPerPage = itemsPerPage) => {
    setCurrentPage(page)
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage)
    }
  }

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortBy])

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Browse All <span className="text-primary">Calgary Lawyers</span>
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto">
          Find the perfect legal professional from our comprehensive directory of verified lawyers in Calgary.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className={`w-10 h-10 rounded-full ${stat.color}/10 flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-textSecondary">{stat.label}</div>
            </div>
          )
        })}
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="bg-surface border border-border rounded-2xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              placeholder="Search lawyers by name, title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div 
            className="border-t border-border pt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-3">Legal Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-white'
                          : 'bg-surface border border-border hover:bg-surface/80'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium mb-3">Sort By</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'rating', label: 'Highest Rating' },
                    { id: 'experience', label: 'Most Experience' },
                    { id: 'name', label: 'Name (A-Z)' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        sortBy === option.id
                          ? 'bg-primary text-white'
                          : 'bg-surface border border-border hover:bg-surface/80'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-textSecondary hover:text-text transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {filteredLawyers.length} {filteredLawyers.length === 1 ? 'Lawyer' : 'Lawyers'} Found
          </h2>
          {selectedCategory !== 'all' && (
            <p className="text-textSecondary mt-1">
              Showing {categories.find(c => c.id === selectedCategory)?.name} lawyers
            </p>
          )}
        </div>
        
        <div className="text-sm text-textSecondary">
          Sorted by {sortBy === 'rating' ? 'Highest Rating' : sortBy === 'experience' ? 'Most Experience' : 'Name'}
        </div>
      </div>

      {/* Lawyers Grid */}
      {paginatedLawyers.length > 0 ? (
        <>
          <DirectoryGrid lawyers={paginatedLawyers} />
          
          {/* Pagination */}
          {filteredLawyers.length > itemsPerPage && (
            <motion.div 
              className="mt-8 pt-8 border-t border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredLawyers.length}
                itemsPerPage={itemsPerPage}
              />
            </motion.div>
          )}
        </>
      ) : (
        <motion.div 
          className="text-center py-16 border border-border rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface border border-border flex items-center justify-center">
            <Search className="w-12 h-12 text-textSecondary" />
          </div>
          <h3 className="text-xl font-bold mb-3">No lawyers found</h3>
          <p className="text-textSecondary mb-6 max-w-md mx-auto">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* CTA Section */}
      <motion.div 
        className="mt-12 bg-surface border border-border rounded-2xl p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold mb-4">Need Help Finding the Right Lawyer?</h2>
        <p className="text-textSecondary mb-6 max-w-2xl mx-auto">
          Our team can help match you with the perfect legal professional for your specific needs.
          Get personalized recommendations and schedule free consultations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            Get Personalized Match
          </button>
          <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors">
            How It Works
          </button>
        </div>
      </motion.div>
    </div>
  )
}
