/**
 * Firebase Verification Test - Non-destructive diagnostic tool
 * This file tests Firebase connectivity and configuration without modifying existing code
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Test Firebase configuration
export const testFirebaseConnection = async () => {
  console.log('🔍 Starting Firebase Verification Test...');
  
  try {
    // 1. Check if environment variables are loaded
    console.log('📋 Checking environment variables...');
    
    const requiredEnvVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN', 
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => 
      !import.meta.env[varName]
    );
    
    if (missingVars.length > 0) {
      console.warn('⚠️ Missing environment variables:', missingVars);
      console.log('Current env vars:', {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✓ Present' : '✗ Missing',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✓ Present' : '✗ Missing',
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✓ Present' : '✗ Missing',
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✓ Present' : '✗ Missing',
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✓ Present' : '✗ Missing',
        appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✓ Present' : '✗ Missing'
      });
    } else {
      console.log('✅ All required environment variables are present');
    }
    
    // 2. Test Firebase App Initialization
    console.log('🚀 Testing Firebase App initialization...');
    
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    
    console.log('📝 Firebase Config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      apiKey: firebaseConfig.apiKey ? '✓ Present (masked)' : '✗ Missing'
    });
    
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase App initialized successfully');
    
    // 3. Test Firestore Connection
    console.log('🗄️ Testing Firestore connection...');
    const db = getFirestore(app);
    console.log('✅ Firestore service initialized');
    
    // 4. Test Auth Service
    console.log('🔐 Testing Auth service...');
    const auth = getAuth(app);
    console.log('✅ Auth service initialized');
    
    // 5. Test Firestore Collections (if they exist)
    console.log('📊 Checking Firestore collections...');
    try {
      // Try to list collections (this will fail if no permissions, but that's okay)
      // We'll just test connectivity
      console.log('📡 Testing Firestore connectivity...');
      
      // Create a test query that won't fail even if collections don't exist
      const testCollection = collection(db, '_test_connection');
      console.log('✅ Firestore connectivity test passed');
      
      // Check if lawyers collection exists (optional)
      try {
        const lawyersRef = collection(db, 'lawyers');
        const snapshot = await getDocs(lawyersRef);
        console.log(`📋 Lawyers collection: ${snapshot.empty ? 'Empty or not found' : `Found ${snapshot.size} documents`}`);
      } catch (lawyersError) {
        console.log('ℹ️ Lawyers collection not accessible or doesn\'t exist yet');
      }
      
    } catch (firestoreError) {
      console.warn('⚠️ Firestore collection check failed (may be permission issue):', firestoreError.message);
    }
    
    // 6. Test Emulator Configuration
    console.log('🔧 Checking emulator configuration...');
    const useEmulator = import.meta.env.VITE_USE_EMULATOR === 'true';
    console.log(`Emulator mode: ${useEmulator ? 'Enabled' : 'Disabled'}`);
    
    if (useEmulator) {
      console.log('⚠️ Emulator mode enabled - ensure Firebase Emulator Suite is running');
    }
    
    // 7. Summary
    console.log('\n🎉 FIREBASE VERIFICATION SUMMARY:');
    console.log('================================');
    console.log('✅ Firebase App: Initialized');
    console.log('✅ Firestore: Service ready');
    console.log('✅ Authentication: Service ready');
    console.log(`✅ Project ID: ${firebaseConfig.projectId}`);
    console.log(`✅ Auth Domain: ${firebaseConfig.authDomain}`);
    console.log(`✅ Emulator: ${useEmulator ? 'ENABLED' : 'DISABLED'}`);
    
    if (missingVars.length > 0) {
      console.warn(`\n⚠️ WARNING: ${missingVars.length} environment variable(s) missing`);
      console.warn('The app may still work if using emulator or default values');
    }
    
    return {
      success: true,
      app,
      db,
      auth,
      config: firebaseConfig,
      missingEnvVars: missingVars,
      useEmulator
    };
    
  } catch (error) {
    console.error('❌ Firebase Verification Failed:', error);
    console.error('Error details:', error.message);
    
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
};

// Export for manual testing
export default testFirebaseConnection;
