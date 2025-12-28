import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, startAfter, doc, getDoc } from 'firebase/firestore';
import { getAllLawyers, getFeaturedLawyers as getStaticFeaturedLawyers } from '../data/lawyers';

/**
 * Hybrid Data Fetching Strategy
 * 
 * This utility implements the hybrid approach:
 * 1. Try to fetch from Firestore first
 * 2. Fall back to static data if Firestore is empty or connection fails
 * 3. Cache results for performance
 */

// Cache for Firestore data to reduce redundant reads
const firestoreCache = {
  lawyers: null,
  lastFetch: null,
  cacheDuration: 5 * 60 * 1000, // 5 minutes
};

/**
 * Get all lawyers with hybrid fallback
 */
export const getAllLawyersHybrid = async (options = {}) => {
  const { 
    categories = [], 
    limit: queryLimit = 50, 
    startAfter: startAfterDoc = null,
    useCache = true 
  } = options;

  try {
    // Check cache first if enabled
    if (useCache && firestoreCache.lawyers && firestoreCache.lastFetch) {
      const cacheAge = Date.now() - firestoreCache.lastFetch;
      if (cacheAge < firestoreCache.cacheDuration) {
        console.log('📦 Using cached Firestore data');
        return filterAndPaginateLawyers(firestoreCache.lawyers, options);
      }
    }

    // Try to fetch from Firestore
    console.log('🔥 Fetching lawyers from Firestore...');
    const lawyersRef = collection(db, 'lawyers');
    
    // Build query
    let q = query(lawyersRef);
    
    // Apply filters
    if (categories.length > 0) {
      q = query(q, where('categories', 'array-contains-any', categories));
    }
    
    // Apply ordering (verified first, then by rating)
    q = query(q, orderBy('verified', 'desc'), orderBy('rating', 'desc'));
    
    // Apply pagination
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }
    
    q = query(q, limit(queryLimit));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const lawyers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Update cache
      if (useCache) {
        firestoreCache.lawyers = lawyers;
        firestoreCache.lastFetch = Date.now();
      }
      
      return lawyers;
    } else {
      // Firestore is empty, fall back to static data
      console.log('📄 Firestore empty, falling back to static data');
      return getStaticLawyersWithFallback(options);
    }
  } catch (error) {
    console.error('❌ Firestore fetch failed, using static fallback:', error.message);
    return getStaticLawyersWithFallback(options);
  }
};

/**
 * Get featured lawyers with hybrid fallback
 */
export const getFeaturedLawyersHybrid = async (count = 6) => {
  try {
    const lawyersRef = collection(db, 'lawyers');
    const q = query(
      lawyersRef,
      where('verified', '==', true),
      orderBy('rating', 'desc'),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } else {
      // Fall back to static featured lawyers
      console.log('📄 Using static featured lawyers');
      return getStaticFeaturedLawyers(count);
    }
  } catch (error) {
    console.error('❌ Featured lawyers fetch failed:', error.message);
    return getStaticFeaturedLawyers(count);
  }
};

/**
 * Get lawyer by ID with hybrid fallback
 */
export const getLawyerByIdHybrid = async (lawyerId) => {
  try {
    const lawyerRef = doc(db, 'lawyers', lawyerId.toString());
    const lawyerDoc = await getDoc(lawyerRef);
    
    if (lawyerDoc.exists()) {
      return { id: lawyerDoc.id, ...lawyerDoc.data() };
    } else {
      // Fall back to static data
      console.log('📄 Lawyer not in Firestore, checking static data');
      const staticLawyers = getAllLawyers();
      return staticLawyers.find(lawyer => lawyer.id.toString() === lawyerId.toString());
    }
  } catch (error) {
    console.error('❌ Lawyer fetch failed:', error.message);
    const staticLawyers = getAllLawyers();
    return staticLawyers.find(lawyer => lawyer.id.toString() === lawyerId.toString());
  }
};

/**
 * Search lawyers with hybrid fallback
 */
export const searchLawyersHybrid = async (searchTerm, options = {}) => {
  try {
    // For now, we'll filter static data since Firestore text search requires Algolia/Meilisearch
    // In production, implement proper full-text search
    console.log('🔍 Searching lawyers (static fallback for now)');
    
    const staticLawyers = getAllLawyers();
    const searchLower = searchTerm.toLowerCase();
    
    return staticLawyers.filter(lawyer => 
      lawyer.name.toLowerCase().includes(searchLower) ||
      lawyer.firm.toLowerCase().includes(searchLower) ||
      lawyer.bio.toLowerCase().includes(searchLower) ||
      lawyer.categories.some(cat => cat.toLowerCase().includes(searchLower))
    ).slice(0, options.limit || 50);
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    return [];
  }
};

/**
 * Get categories with counts (hybrid)
 */
export const getCategoriesWithCountsHybrid = async () => {
  try {
    const lawyers = await getAllLawyersHybrid({ useCache: true });
    const categoryCounts = {};
    
    lawyers.forEach(lawyer => {
      if (lawyer.categories) {
        lawyer.categories.forEach(category => {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
      }
    });
    
    return Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('❌ Categories fetch failed:', error.message);
    // Fall back to static calculation
    const staticLawyers = getAllLawyers();
    const categoryCounts = {};
    
    staticLawyers.forEach(lawyer => {
      lawyer.categories.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });
    
    return Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }
};

// Helper functions
const getStaticLawyersWithFallback = (options) => {
  const staticLawyers = getAllLawyers();
  return filterAndPaginateLawyers(staticLawyers, options);
};

const filterAndPaginateLawyers = (lawyers, options) => {
  let filtered = [...lawyers];
  
  // Filter by categories
  if (options.categories && options.categories.length > 0) {
    filtered = filtered.filter(lawyer =>
      lawyer.categories.some(cat => options.categories.includes(cat))
    );
  }
  
  // Sort (verified first, then by rating)
  filtered.sort((a, b) => {
    if (a.verified !== b.verified) return b.verified ? 1 : -1;
    return (b.rating || 0) - (a.rating || 0);
  });
  
  // Apply pagination
  const startIndex = options.startAfter ? 
    lawyers.findIndex(l => l.id === options.startAfter.id) + 1 : 0;
  
  return filtered.slice(startIndex, startIndex + (options.limit || 50));
};

/**
 * Clear the Firestore cache
 */
export const clearFirestoreCache = () => {
  firestoreCache.lawyers = null;
  firestoreCache.lastFetch = null;
  console.log('🧹 Firestore cache cleared');
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => ({
  hasCache: !!firestoreCache.lawyers,
  cacheSize: firestoreCache.lawyers ? firestoreCache.lawyers.length : 0,
  lastFetch: firestoreCache.lastFetch ? new Date(firestoreCache.lastFetch).toLocaleTimeString() : 'Never',
  cacheAge: firestoreCache.lastFetch ? 
    Math.floor((Date.now() - firestoreCache.lastFetch) / 1000) : null
});
