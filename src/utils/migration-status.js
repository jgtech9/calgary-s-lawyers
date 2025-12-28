/**
 * Migration Status Tracker
 * Tracks the status of data migration and provides real-time updates
 */

import { db } from '../lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

/**
 * Check if migration has been completed by verifying Firestore data
 */
export const checkMigrationStatus = async () => {
  try {
    const lawyersRef = collection(db, 'lawyers');
    const q = query(lawyersRef, limit(1));
    const snapshot = await getDocs(q);
    
    return {
      migrated: !snapshot.empty,
      count: snapshot.empty ? 0 : 'Unknown (sample check only)',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      migrated: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get detailed migration statistics
 */
export const getMigrationStats = async () => {
  try {
    const lawyersRef = collection(db, 'lawyers');
    const snapshot = await getDocs(lawyersRef);
    
    const lawyers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Calculate statistics
    const verifiedCount = lawyers.filter(l => l.verified).length;
    const tiers = lawyers.reduce((acc, lawyer) => {
      const tier = lawyer.tier || 'unknown';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {});
    
    const categories = lawyers.reduce((acc, lawyer) => {
      (lawyer.categories || []).forEach(category => {
        acc[category] = (acc[category] || 0) + 1;
      });
      return acc;
    }, {});
    
    return {
      total: lawyers.length,
      verified: verifiedCount,
      verificationRate: lawyers.length > 0 ? (verifiedCount / lawyers.length * 100).toFixed(1) + '%' : '0%',
      tiers,
      topCategories: Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
      lastUpdated: lawyers.length > 0 
        ? new Date(Math.max(...lawyers.map(l => new Date(l.updatedAt || 0).getTime()))).toISOString()
        : null
    };
  } catch (error) {
    return {
      error: error.message,
      total: 0
    };
  }
};

/**
 * Monitor migration status with real-time updates
 */
export const monitorMigration = (callback) => {
  let unsubscribe = null;
  
  const startMonitoring = async () => {
    try {
      const lawyersRef = collection(db, 'lawyers');
      // Note: Real-time monitoring would require onSnapshot
      // For now, we'll use periodic checks
      const checkInterval = setInterval(async () => {
        const status = await checkMigrationStatus();
        callback(status);
      }, 5000);
      
      return () => {
        clearInterval(checkInterval);
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      callback({ error: error.message });
      return () => {};
    }
  };
  
  return startMonitoring();
};

export default {
  checkMigrationStatus,
  getMigrationStats,
  monitorMigration
};
