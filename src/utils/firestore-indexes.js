/**
 * Firestore Index Management Utility
 * 
 * This utility helps manage Firestore composite indexes for optimal query performance.
 * Run this script to create indexes if they don't exist automatically.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// Firebase configuration (should match your project config)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

/**
 * Test queries to ensure indexes are working properly
 */
export async function testFirestoreIndexes() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('🔍 Testing Firestore indexes...');
    
    const tests = [
      {
        name: 'Lawyers by rating (highest first)',
        query: query(
          collection(db, 'lawyers'),
          orderBy('rating', 'desc'),
          orderBy('reviews', 'desc'),
          limit(10)
        )
      },
      {
        name: 'Family law lawyers in Calgary',
        query: query(
          collection(db, 'lawyers'),
          where('categories', 'array-contains', 'family-law'),
          where('location', '==', 'Calgary'),
          orderBy('rating', 'desc'),
          limit(10)
        )
      },
      {
        name: 'Featured lawyers',
        query: query(
          collection(db, 'lawyers'),
          where('featured', '==', true),
          orderBy('rating', 'desc'),
          orderBy('experience', 'desc'),
          limit(10)
        )
      },
      {
        name: 'Lawyers by hourly rate (lowest first)',
        query: query(
          collection(db, 'lawyers'),
          orderBy('hourlyRate', 'asc'),
          orderBy('rating', 'desc'),
          limit(10)
        )
      },
      {
        name: 'English-speaking corporate lawyers',
        query: query(
          collection(db, 'lawyers'),
          where('languages', 'array-contains', 'English'),
          where('categories', 'array-contains', 'corporate-law'),
          orderBy('rating', 'desc'),
          limit(10)
        )
      }
    ];

    const results = [];
    
    for (const test of tests) {
      try {
        const snapshot = await getDocs(test.query);
        results.push({
          name: test.name,
          success: true,
          count: snapshot.size,
          error: null
        });
        console.log(`✅ ${test.name}: ${snapshot.size} documents found`);
      } catch (error) {
        results.push({
          name: test.name,
          success: false,
          count: 0,
          error: error.message
        });
        console.log(`❌ ${test.name}: ${error.message}`);
        
        // Provide helpful error messages for missing indexes
        if (error.message.includes('index')) {
          console.log('   💡 You need to create a Firestore composite index for this query.');
          console.log('   💡 Run: firebase deploy --only firestore:indexes');
          console.log('   💡 Or create indexes manually in Firebase Console');
        }
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('🔥 Error testing Firestore indexes:', error);
    throw error;
  }
}

/**
 * Check if required indexes exist by testing common queries
 */
export async function validateIndexes() {
  console.log('📊 Validating Firestore indexes...');
  
  const testResults = await testFirestoreIndexes();
  
  const passed = testResults.filter(r => r.success).length;
  const total = testResults.length;
  
  console.log(`\n📈 Index Validation Results: ${passed}/${total} tests passed`);
  
  testResults.forEach(result => {
    if (result.success) {
      console.log(`   ✅ ${result.name}`);
    } else {
      console.log(`   ❌ ${result.name}: ${result.error}`);
    }
  });
  
  if (passed === total) {
    console.log('\n🎉 All Firestore indexes are properly configured!');
    return true;
  } else {
    console.log('\n⚠️ Some indexes are missing. Please create the required composite indexes.');
    console.log('📋 Check firestore.indexes.json for required index configurations.');
    return false;
  }
}

/**
 * Generate index creation commands for Firebase CLI
 */
export function generateIndexCommands() {
  const commands = [
    'firebase init firestore',
    'firebase deploy --only firestore:indexes',
    '# Or manually create indexes in Firebase Console:',
    '# 1. Go to Firebase Console > Firestore Database > Indexes',
    '# 2. Click "Add Index"',
    '# 3. Configure composite indexes as shown in firestore.indexes.json'
  ];
  
  return commands;
}

/**
 * Monitor query performance
 */
export async function monitorQueryPerformance(queryFunc, queryName) {
  const startTime = performance.now();
  
  try {
    const result = await queryFunc();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ ${queryName}: ${duration.toFixed(2)}ms`);
    
    return {
      success: true,
      duration,
      result
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ ${queryName}: ${duration.toFixed(2)}ms (FAILED)`);
    
    return {
      success: false,
      duration,
      error: error.message
    };
  }
}

// Export utility functions
export default {
  testFirestoreIndexes,
  validateIndexes,
  generateIndexCommands,
  monitorQueryPerformance
};
