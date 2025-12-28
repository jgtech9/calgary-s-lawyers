import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLazyLoad } from '../utils/lazyLoading';

/**
 * Lazy-loaded Lawyer Card Component
 * Only renders content when visible in viewport
 */
const LazyLawyerCard = ({ lawyer, index, onClick }) => {
  const cardRef = useRef(null);
  const isVisible = useLazyLoad(cardRef, { threshold: 0.1 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Default image if lawyer image fails to load
  const defaultImage = 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=600';

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Mark as loaded to show default image
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.05
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="bg-surface border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={() => onClick && onClick(lawyer)}
    >
      {isVisible ? (
        <>
          {/* Image Container */}
          <div className="relative h-48 bg-gray-800 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            
            <img
              src={imageError ? defaultImage : (lawyer.image || defaultImage)}
              alt={`${lawyer.name} - ${lawyer.firm}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Verified Badge */}
            {lawyer.verified && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            )}
            
            {/* Rating Badge */}
            {lawyer.rating && (
              <div className="absolute bottom-3 left-3 bg-black/70 text-white text-sm font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {lawyer.rating.toFixed(1)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
              {lawyer.name}
            </h3>
            
            <p className="text-sm text-textSecondary mb-2 line-clamp-1">
              {lawyer.title || 'Lawyer'}
            </p>
            
            <p className="text-sm text-textSecondary mb-3 line-clamp-2">
              {lawyer.firm}
            </p>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-1 mb-4">
              {lawyer.categories.slice(0, 3).map((category, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {category}
                </span>
              ))}
              {lawyer.categories.length > 3 && (
                <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full">
                  +{lawyer.categories.length - 3}
                </span>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-textSecondary border-t border-border pt-3">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{lawyer.reviewCount || 0} reviews</span>
              </div>
              
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{lawyer.location?.city || 'Calgary'}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Loading skeleton
        <div className="animate-pulse">
          <div className="h-48 bg-gray-800"></div>
          <div className="p-5">
            <div className="h-5 bg-gray-800 rounded mb-3"></div>
            <div className="h-4 bg-gray-800 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-800 rounded mb-4 w-1/2"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-800 rounded-full w-16"></div>
              <div className="h-6 bg-gray-800 rounded-full w-20"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-800 rounded w-20"></div>
              <div className="h-4 bg-gray-800 rounded w-16"></div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LazyLawyerCard;
