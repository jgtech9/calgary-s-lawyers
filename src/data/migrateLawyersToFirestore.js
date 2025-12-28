/**
 * Migration script to move static lawyer data to Firestore
 * Run this once after Firebase is configured
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import lawyers from './lawyers.js';

// Firebase configuration (use environment variables)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID,
};

const migrateLawyersToFirestore = async () => {
  try {
    console.log('Starting migration of lawyers to Firestore...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Create batch for efficient writes
    const batch = writeBatch(db);
    const lawyersCollection = collection(db, 'lawyers');
    
    // Transform and add each lawyer to batch
    lawyers.forEach((lawyer, index) => {
      const lawyerRef = doc(lawyersCollection);
      
      // Transform to Firestore schema
      const firestoreLawyer = {
        lsa_id: generateLSAId(), // Generate mock LSA ID
        is_verified: Math.random() > 0.3, // 70% verified for demo
        profile_data: {
          name: lawyer.name,
          title: lawyer.title,
          bio: lawyer.bio,
          categories: lawyer.categories,
          email: lawyer.email || `${lawyer.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          phone: lawyer.phone || '(403) 555-0100',
          address: lawyer.address || 'Calgary, AB',
          website: lawyer.website,
          languages: lawyer.languages || ['English'],
          education: lawyer.education || ['University of Calgary Law School'],
          years_experience: lawyer.years_experience || Math.floor(Math.random() * 30) + 1,
        },
        metrics: {
          rating: lawyer.rating || 4.0 + Math.random(),
          review_count: lawyer.review_count || Math.floor(Math.random() * 100),
          response_rate: 80 + Math.floor(Math.random() * 20),
          response_time: Math.floor(Math.random() * 24) + 1,
        },
        verification: {
          verified: Math.random() > 0.3,
          verified_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          verification_method: 'manual',
          details: {
            name_match: true,
            lsa_format_valid: true,
            status: Math.random() > 0.3 ? 'verified' : 'pending_review'
          }
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      batch.set(lawyerRef, firestoreLawyer);
      
      // Log progress every 50 lawyers
      if ((index + 1) % 50 === 0) {
        console.log(`Processed ${index + 1} of ${lawyers.length} lawyers...`);
      }
    });
    
    // Commit the batch
    console.log('Committing batch to Firestore...');
    await batch.commit();
    
    console.log(`✅ Successfully migrated ${lawyers.length} lawyers to Firestore!`);
    console.log('Next steps:');
    console.log('1. Review data in Firebase Console');
    console.log('2. Run verification process for lawyers');
    console.log('3. Update application to use Firestore data');
    
    return { success: true, count: lawyers.length };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to generate mock LSA IDs
const generateLSAId = () => {
  const formats = [
    () => Math.floor(100000 + Math.random() * 900000).toString(), // 6 digits
    () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = Math.floor(100 + Math.random() * 900);
      return letters.charAt(Math.floor(Math.random() * 26)) + 
             letters.charAt(Math.floor(Math.random() * 26)) + 
             letters.charAt(Math.floor(Math.random() * 26)) + 
             numbers;
    }, // 3 letters + 3 digits
    () => {
      const numbers = Math.floor(10000 + Math.random() * 90000);
      const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26));
      return numbers + letter;
    }, // 5 digits + 1 letter
  ];
  
  return formats[Math.floor(Math.random() * formats.length)]();
};

// Export for use in application
export { migrateLawyersToFirestore };

// Run if called directly
if (typeof window === 'undefined' && process.argv[1] === import.meta.url) {
  migrateLawyersToFirestore().then(result => {
    if (result.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}
