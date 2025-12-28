import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LazyLawyerCard from './LazyLawyerCard';
import { getAllLawyersHybrid, getCategoriesWithCountsHybrid } from '../utils/dataFetching';
import { BatchLazyLoader } from '../utils/lazyLoading';

/**
 * Lazy-loaded Directory Grid with Infinite Scroll
 */
const LazyDirectoryGrid = ({ 
  initialLawyers = [], 
  showFilters = true,
  itemsPerPage = 12,
  onLawyerClick 
}) => {
  const [lawyers, setLawyers] = useState(initialLawyers);
  const [filteredLawyers, setFilteredLawyers] = useState(initialLawyers);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [lastVisible, setLastVisible] = useState(null);
  
  const batchLoader = React.useRef(new BatchLazyLoader(6, 100));

  // Load initial data
  useEffect(() => {
    loadInitialData();
    loadCategories();
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [lawyers, selectedCategories, searchQuery, sortBy]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const data = await getAllLawyersHybrid({ limit: itemsPerPage });
      setLawyers(data);
      setLastVisible(data[data.length - 1]);
      setHasMore(data.length === itemsPerPage);
    } catch (error) {
      console.error('Failed to load lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategoriesWithCountsHybrid();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const moreData = await getAllLawyersHybrid({ 
        limit: itemsPerPage,
        startAfter: lastVisible
      });
      
      if (moreData.length > 0) {
        setLawyers(prev => [...prev, ...moreData]);
        setLastVisible(moreData[moreData.length - 1]);
        setHasMore(moreData.length === itemsPerPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more lawyers:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...lawyers];
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(lawyer =>
        lawyer.categories?.some(cat => selectedCategories.includes(cat))
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lawyer =>
        lawyer.name.toLowerCase().includes(query) ||
        lawyer.firm.toLowerCase().includes(query) ||
        lawyer.bio?.toLowerCase().includes(query) ||
        lawyer.categories?.some(cat => cat.toLowerCase().includes(query))
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'reviews':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        default:
          return 0;
      }
    });
    
    setFilteredLawyers(filtered);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setSortBy('rating');
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Load more when 80% from bottom
    if (scrollTop + windowHeight >= documentHeight * 0.8) {
      loadMore();
    }
  }, [loadingMore, hasMore, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-800 rounded-2xl mb-4"></div>
            <div className="h-4 bg-gray-800 rounded mb-2"></div>
            <div className="h-4 bg-gray-800 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      {showFilters && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Find Your Lawyer</h3>
              <p className="text-textSecondary">
                {filteredLawyers.length} lawyers found
                {selectedCategories.length > 0 &&` in ${selectedCategories.join(', ')}`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search lawyers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
          
          {/* Categories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Practice Areas</h4>
              {selectedCategories.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryToggle(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.includes(category.name)
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Lawyer Grid */}
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredLawyers.map((lawyer, index) => (
            <LazyLawyerCard
              key={lawyer.id}
              lawyer={lawyer}
              index={index}
              onClick={onLawyerClick}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-textSecondary">Loading more lawyers...</p>
          </div>
        </div>
      )}
      
      {/* No Results */}
      {filteredLawyers.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 mx-auto mb-6 text-gray-600">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No lawyers found</h3>
          <p className="text-textSecondary mb-6">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Clear all filters
          </button>
        </motion.div>
      )}
      
      {/* End of Results */}
      {!hasMore && filteredLawyers.length > 0 && (
        <div className="text-center py-8 border-t border-border">
          <p className="text-textSecondary">
            You've reached the end of the directory
          </p>
        </div>
      )}
    </div>
  );
};

export default LazyDirectoryGrid;
