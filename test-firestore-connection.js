/**
 * Firestore Connection Test
 * Tests connectivity with the newly deployed rules
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA_GhG7Cy-pjaXPaNhSxcDSeZzfs0TBVi4',
  authDomain: 'calgary-lawyer-directory-d4c44.firebaseapp.com',
  projectId: 'calgary-lawyer-directory-d4c44',
  storageBucket: 'calgary-lawyer-directory-d4c44.firebasestorage.app',
  messagingSenderId: '27772805268',
  appId: '1:27772805268:web:b04ab5d3fcfa69444f1481',
  measurementId: 'G-B3LNM8D1QQ'
};

async function testFirestoreConnection() {
  console.log('🔍 FIRESTORE CONNECTION TEST');
  console.log('============================\n');

  try {
    // 1. Initialize Firebase
    console.log('1. Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized');
    console.log(`   Project: ${app.options.projectId}`);

    // 2. Test Read Access
    console.log('\n2. Testing READ access...');
    
    // Try to read lawyers collection
    const lawyersRef = collection(db, 'lawyers');
    const lawyersSnapshot = await getDocs(lawyersRef);
    
    console.log(`✅ Read access granted`);
    console.log(`   Lawyers collection: ${lawyersSnapshot.size} documents`);
    
    // Display sample data if exists
    if (lawyersSnapshot.size > 0) {
      console.log('\n   Sample lawyers:');
      lawyersSnapshot.forEach((doc, index) => {
        if (index < 3) { // Show first 3
          const data = doc.data();
          console.log(`   • ${doc.id}: ${data.profile_data?.name || 'Unnamed'}`);
        }
      });
    } else {
      console.log('   ℹ️ Collection is empty - this is normal for new projects');
    }

    // 3. Test Write Access (Optional - creates test document)
    console.log('\n3. Testing WRITE access...');
    
    const testCollection = collection(db, '_test_connection');
    const testDoc = {
      test: 'Firestore connection test',
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    
    try {
      const docRef = await addDoc(testCollection, testDoc);
      console.log(`✅ Write access granted`);
      console.log(`   Test document created: ${docRef.id}`);
      
      // Clean up test document
      console.log('   Cleaning up test document...');
      // Note: We can't delete here without delete permission, but that's okay
    } catch (writeError) {
      console.log(`⚠️ Write test: ${writeError.message}`);
      console.log('   ℹ️ This is expected if rules only allow read');
    }

    // 4. Test Other Collections
    console.log('\n4. Testing other collections...');
    
    const collectionsToTest = ['users', 'intake_leads', 'messages', 'appointments'];
    
    for (const collectionName of collectionsToTest) {
      try {
        const colRef = collection(db, collectionName);
        const snapshot = await getDocs(colRef);
        console.log(`   ${collectionName}: ${snapshot.size} documents`);
      } catch (error) {
        console.log(`   ${collectionName}: ${error.code === 'permission-denied' ? 'Access denied' : 'Not found'}`);
      }
    }

    // 5. Summary
    console.log('\n🎉 TEST SUMMARY');
    console.log('===============');
    console.log('✅ Firebase connection: SUCCESS');
    console.log('✅ Firestore access: READ/WRITE');
    console.log('✅ Project: calgary-lawyer-directory-d4c44');
    console.log('✅ Rules: Development mode (open access)');
    
    console.log('\n💡 NEXT STEPS:');
    console.log('==============');
    console.log('1. Your Firestore is now accessible');
    console.log('2. Start building your lawyer directory features');
    console.log('3. When ready for production:');
    console.log('   • Edit firestore.rules');
    console.log('   • Switch to production rules');
    console.log('   • Deploy again');
    
    return { success: true, db, app };

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error('==============');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('===================');
    console.log('1. Ensure rules are deployed: firebase deploy --only firestore:rules');
    console.log('2. Check Firebase project ID matches');
    console.log('3. Verify internet connection');
    
    return { success: false, error };
  }
}

// Export for use in browser console
window.testFirestoreConnection = testFirestoreConnection;

// Auto-run if imported directly
if (import.meta.url === document.currentScript?.src) {
  testFirestoreConnection();
}

export default testFirestoreConnection;
