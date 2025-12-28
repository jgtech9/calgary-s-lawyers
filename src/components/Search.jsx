import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, Filter, X, MapPin, Star, Clock } from 'lucide-react'
import { searchLawyers, getCategories } from '../data/lawyers'

export default function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Load categories
    const categoriesData = getCategories()
    setCategories(categoriesData)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm, selectedCategory)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    if (onSearch) {
      onSearch('', '')
    }
  }

  const handleCategorySelect = (categoryId) => {
    const newCategory = selectedCategory === categoryId ? '' : categoryId
    setSelectedCategory(newCategory)
    if (onSearch) {
      onSearch(searchTerm, newCategory)
    }
  }

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for lawyers by name, specialty, or location..."
              className="w-full pl-12 pr-24 py-4 bg-surface border border-border rounded-xl text-text placeholder:text-textSecondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Active Filters */}
        {(searchTerm || selectedCategory) && (
          <motion.div 
            className="mt-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-textSecondary">Active filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm flex items-center gap-1">
                Category: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-textSecondary hover:text-text transition-colors text-sm"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="mt-4 p-6 bg-surface border border-border rounded-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Filter Lawyers</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-surface/80 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-textSecondary">Legal Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-border hover:border-primary'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-textSecondary">Location</h4>
                <div className="space-y-2">
                  {['Downtown', 'NW Calgary', 'SE Calgary', 'NE Calgary', 'SW Calgary'].map((location) => (
                    <label key={location} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-text">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-textSecondary">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3].map((stars) => (
                    <label key={stars} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border" />
                      <div className="flex items-center gap-1">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                        ))}
                        <span className="text-text">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-textSecondary">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <Clock className="w-4 h-4 text-success" />
                    <span className="text-text">Available Today</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-text">Free Consultation</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-text">Emergency Services</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
