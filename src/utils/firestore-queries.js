/**
 * Optimized Firestore Queries for Lawyer Directory
 * 
 * These queries are optimized with proper indexes for fast performance.
 */

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getDocs,
  getDoc,
  doc,
  startAt,
  endAt
} from 'firebase/firestore';
import { db } from './firebase-config';

/**
 * Get lawyer by ID with optimized query
 */
export async function getLawyerById(lawyerId) {
  try {
    const lawyerRef = doc(db, 'lawyers', lawyerId);
    const lawyerSnap = await getDoc(lawyerRef);
    
    if (lawyerSnap.exists()) {
      return {
        id: lawyerSnap.id,
        ...lawyerSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching lawyer:', error);
    throw error;
  }
}

/**
 * Search lawyers with multiple filter options
 * Uses composite indexes for optimal performance
 */
export async function searchLawyers({
  searchTerm = '',
  category = null,
  location = null,
  minRating = 0,
  maxHourlyRate = null,
  languages = [],
  sortBy = 'rating',
  sortOrder = 'desc',
  page = 1,
  pageSize = 12
}) {
  try {
    let q = collection(db, 'lawyers');
    const constraints = [];
    
    // Apply filters with indexed fields
    if (category) {
      constraints.push(where('categories', 'array-contains', category));
    }
    
    if (location) {
      constraints.push(where('location', '==', location));
    }
    
    if (minRating > 0) {
      constraints.push(where('rating', '>=', minRating));
    }
    
    if (maxHourlyRate !== null) {
      constraints.push(where('hourlyRate', '<=', maxHourlyRate));
    }
    
    if (languages.length > 0) {
      constraints.push(where('languages', 'array-contains-any', languages));
    }
    
    // Apply sorting based on selected field
    switch (sortBy) {
      case 'rating':
        constraints.push(orderBy('rating', sortOrder));
        constraints.push(orderBy('reviews', 'desc'));
        break;
      case 'experience':
        constraints.push(orderBy('experience', sortOrder));
        constraints.push(orderBy('rating', 'desc'));
        break;
      case 'hourlyRate':
        constraints.push(orderBy('hourlyRate', sortOrder));
        constraints.push(orderBy('rating', 'desc'));
        break;
      case 'name':
        constraints.push(orderBy('name', sortOrder));
        break;
      default:
        constraints.push(orderBy('rating', 'desc'));
    }
    
    // Create the query
    q = query(q, ...constraints);
    
    // Execute query
    const snapshot = await getDocs(q);
    
    // Process results
    const lawyers = [];
    snapshot.forEach((doc) => {
      const lawyerData = doc.data();
      
      // Apply search term filter in memory (Firestore doesn't support full-text search)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          lawyerData.name.toLowerCase().includes(searchLower) ||
          lawyerData.title.toLowerCase().includes(searchLower) ||
          lawyerData.description.toLowerCase().includes(searchLower) ||
          lawyerData.specialties?.some(s => s.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return;
      }
      
      lawyers.push({
        id: doc.id,
        ...lawyerData
      });
    });
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedLawyers = lawyers.slice(startIndex, endIndex);
    
    return {
      lawyers: paginatedLawyers,
      total: lawyers.length,
      page,
      pageSize,
      totalPages: Math.ceil(lawyers.length / pageSize)
    };
    
  } catch (error) {
    console.error('Error searching lawyers:', error);
    
    // Provide helpful error messages for missing indexes
    if (error.message.includes('index')) {
      throw new Error(
        `Missing Firestore index for this query combination. ` +
        `Please create a composite index for: ${category ? 'categories, ' : ''}` +
        `${location ? 'location, ' : ''}${sortBy}`
      );
    }
    
    throw error;
  }
}

/**
 * Get featured lawyers (optimized query)
 */
export async function getFeaturedLawyers(limitCount = 6) {
  try {
    const q = query(
      collection(db, 'lawyers'),
      where('featured', '==', true),
      orderBy('rating', 'desc'),
      orderBy('reviews', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const lawyers = [];
    
    snapshot.forEach((doc) => {
      lawyers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return lawyers;
  } catch (error) {
    console.error('Error fetching featured lawyers:', error);
    throw error;
  }
}

/**
 * Get lawyers by category with pagination
 */
export async function getLawyersByCategory(category, page = 1, pageSize = 12) {
  try {
    const q = query(
      collection(db, 'lawyers'),
      where('categories', 'array-contains', category),
      orderBy('rating', 'desc'),
      orderBy('reviews', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const allLawyers = [];
    
    snapshot.forEach((doc) => {
      allLawyers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedLawyers = allLawyers.slice(startIndex, endIndex);
    
    return {
      lawyers: paginatedLawyers,
      total: allLawyers.length,
      page,
      pageSize,
      totalPages: Math.ceil(allLawyers.length / pageSize)
    };
  } catch (error) {
    console.error('Error fetching lawyers by category:', error);
    throw error;
  }
}

/**
 * Get similar lawyers (same category, nearby location)
 */
export async function getSimilarLawyers(lawyerId, limitCount = 3) {
  try {
    // First get the target lawyer
    const lawyer = await getLawyerById(lawyerId);
    if (!lawyer) return [];
    
    // Get lawyers in same category, excluding the target lawyer
    const q = query(
      collection(db, 'lawyers'),
      where('categories', 'array-contains-any', lawyer.categories || []),
      where('__name__', '!=', lawyerId), // Exclude self
      orderBy('rating', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const similarLawyers = [];
    
    snapshot.forEach((doc) => {
      similarLawyers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return similarLawyers;
  } catch (error) {
    console.error('Error fetching similar lawyers:', error);
    
    // Fallback: get random featured lawyers
    return getFeaturedLawyers(limitCount);
  }
}

/**
 * Get lawyer reviews with pagination
 */
export async function getLawyerReviews(lawyerId, page = 1, pageSize = 10) {
  try {
    const q = query(
      collection(db, 'lawyers', lawyerId, 'reviews'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const allReviews = [];
    
    snapshot.forEach((doc) => {
      allReviews.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedReviews = allReviews.slice(startIndex, endIndex);
    
    return {
      reviews: paginatedReviews,
      total: allReviews.length,
      page,
      pageSize,
      totalPages: Math.ceil(allReviews.length / pageSize),
      averageRating: allReviews.length > 0 
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
        : 0
    };
  } catch (error) {
    console.error('Error fetching lawyer reviews:', error);
    throw error;
  }
}

/**
 * Get statistics for dashboard
 */
export async function getLawyerStats() {
  try {
    // Note: For production, consider using Firestore aggregation queries
    // or maintaining a stats document that gets updated on write
    
    const q = query(collection(db, 'lawyers'));
    const snapshot = await getDocs(q);
    
    let totalLawyers = 0;
    let totalRating = 0;
    let totalReviews = 0;
    const categories = {};
    const locations = {};
    
    snapshot.forEach((doc) => {
      const lawyer = doc.data();
      totalLawyers++;
      totalRating += lawyer.rating || 0;
      totalReviews += lawyer.reviews || 0;
      
      // Count categories
      (lawyer.categories || []).forEach(category => {
        categories[category] = (categories[category] || 0) + 1;
      });
      
      // Count locations
      const location = lawyer.location || 'Unknown';
      locations[location] = (locations[location] || 0) + 1;
    });
    
    return {
      totalLawyers,
      averageRating: totalLawyers > 0 ? totalRating / totalLawyers : 0,
      totalReviews,
      categories,
      locations: Object.entries(locations)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10) // Top 10 locations
    };
  } catch (error) {
    console.error('Error fetching lawyer stats:', error);
    throw error;
  }
}

// Export all query functions
export default {
  getLawyerById,
  searchLawyers,
  getFeaturedLawyers,
  getLawyersByCategory,
  getSimilarLawyers,
  getLawyerReviews,
  getLawyerStats
};
