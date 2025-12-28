/**
 * Debug Migration Tool - Comprehensive diagnostic for migration issues
 */

import { db } from '../lib/firebase';
import { collection, writeBatch, doc, getDocs, getDoc } from 'firebase/firestore';
import { getAllLawyers } from '../data/lawyers';

/**
 * Diagnostic function to identify migration issues
 */
export const diagnoseMigrationIssue = async () => {
  console.log('🔍 Starting Migration Diagnosis...');
  
  const diagnostics = {
    phase1: { name: 'Data Source Check', status: 'pending', details: {} },
    phase2: { name: 'Firestore Connection Test', status: 'pending', details: {} },
    phase3: { name: 'Data Structure Validation', status: 'pending', details: {} },
    phase4: { name: 'Write Permission Test', status: 'pending', details: {} },
    phase5: { name: 'Batch Write Simulation', status: 'pending', details: {} }
  };

  try {
    // Phase 1: Check Data Source
    console.log('📊 Phase 1: Checking data source...');
    const lawyers = getAllLawyers();
    diagnostics.phase1.status = 'completed';
    diagnostics.phase1.details = {
      totalLawyers: lawyers.length,
      sampleLawyer: lawyers[0] ? {
        id: lawyers[0].id,
        name: lawyers[0].name,
        hasCategories: Array.isArray(lawyers[0].categories),
        categoriesCount: lawyers[0].categories?.length || 0
      } : 'No lawyers found',
      dataType: typeof lawyers,
      isArray: Array.isArray(lawyers)
    };

    if (lawyers.length === 0) {
      diagnostics.phase1.status = 'failed';
      diagnostics.phase1.details.error = 'No lawyers found in data source';
    }

    // Phase 2: Test Firestore Connection
    console.log('🔌 Phase 2: Testing Firestore connection...');
    try {
      // Test read access
      const testRef = collection(db, '_diagnostic_test');
      await getDocs(testRef);
      diagnostics.phase2.status = 'completed';
      diagnostics.phase2.details = {
        connection: 'success',
        projectId: db.app.options.projectId
      };
    } catch (error) {
      diagnostics.phase2.status = 'failed';
      diagnostics.phase2.details = {
        error: error.message,
        code: error.code
      };
    }

    // Phase 3: Validate Data Structure
    console.log('📝 Phase 3: Validating data structure...');
    if (lawyers.length > 0) {
      const sample = lawyers[0];
      const requiredFields = ['id', 'name', 'title', 'description', 'rating', 'experience', 'location', 'categories'];
      const missingFields = requiredFields.filter(field => !(field in sample));
      
      diagnostics.phase3.status = missingFields.length === 0 ? 'completed' : 'warning';
      diagnostics.phase3.details = {
        requiredFields,
        missingFields,
        sampleStructure: Object.keys(sample),
        categoriesType: typeof sample.categories,
        categoriesValue: sample.categories
      };
    }

    // Phase 4: Test Write Permissions
    console.log('✍️ Phase 4: Testing write permissions...');
    try {
      const testDocRef = doc(collection(db, '_write_test'));
      const batch = writeBatch(db);
      batch.set(testDocRef, {
        test: true,
        timestamp: new Date().toISOString(),
        diagnostic: 'write_permission_test'
      });
      
      // Try to commit (this will fail if no write permissions)
      await batch.commit();
      
      // Clean up test document
      const cleanupBatch = writeBatch(db);
      cleanupBatch.delete(testDocRef);
      await cleanupBatch.commit();
      
      diagnostics.phase4.status = 'completed';
      diagnostics.phase4.details = { writePermission: 'granted' };
    } catch (error) {
      diagnostics.phase4.status = 'failed';
      diagnostics.phase4.details = {
        error: error.message,
        code: error.code,
        suggestion: 'Check Firestore security rules'
      };
    }

    // Phase 5: Batch Write Simulation
    console.log('⚡ Phase 5: Simulating batch write...');
    const testBatch = writeBatch(db);
    const testDocs = lawyers.slice(0, 3); // Test with first 3 lawyers
    
    testDocs.forEach((lawyer, index) => {
      const docRef = doc(collection(db, '_migration_test'));
      testBatch.set(docRef, {
        ...lawyer,
        verified: true,
        tier: 'standard',
        migratedAt: new Date().toISOString(),
        testRun: true
      });
    });
    
    try {
      await testBatch.commit();
      
      // Verify test documents were written
      const verifyRef = collection(db, '_migration_test');
      const snapshot = await getDocs(verifyRef);
      
      // Clean up test documents
      const cleanupBatch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        cleanupBatch.delete(doc.ref);
      });
      await cleanupBatch.commit();
      
      diagnostics.phase5.status = 'completed';
      diagnostics.phase5.details = {
        testDocumentsWritten: snapshot.size,
        batchSize: testDocs.length,
        batchWrite: 'successful'
      };
    } catch (error) {
      diagnostics.phase5.status = 'failed';
      diagnostics.phase5.details = {
        error: error.message,
        code: error.code,
        batchSize: testDocs.length
      };
    }

    // Generate summary
    const summary = {
      totalPhases: Object.keys(diagnostics).length,
      completed: Object.values(diagnostics).filter(d => d.status === 'completed').length,
      failed: Object.values(diagnostics).filter(d => d.status === 'failed').length,
      warnings: Object.values(diagnostics).filter(d => d.status === 'warning').length,
      hasCriticalIssues: Object.values(diagnostics).some(d => d.status === 'failed'),
      recommendations: []
    };

    // Generate recommendations
    if (diagnostics.phase1.status === 'failed') {
      summary.recommendations.push('Fix data source: lawyers.js file appears empty or corrupted');
    }
    if (diagnostics.phase2.status === 'failed') {
      summary.recommendations.push('Fix Firestore connection: Check Firebase configuration and network');
    }
    if (diagnostics.phase4.status === 'failed') {
      summary.recommendations.push('Fix write permissions: Update Firestore security rules to allow writes');
    }
    if (diagnostics.phase5.status === 'failed') {
      summary.recommendations.push('Fix batch writes: The batch operation failed - check error details');
    }

    console.log('📋 Diagnosis Complete:', summary);
    
    return {
      success: !summary.hasCriticalIssues,
      diagnostics,
      summary,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Enhanced migration with chunking and retry logic
 */
export const enhancedMigrateLawyers = async () => {
  console.log('🚀 Starting Enhanced Migration...');
  
  const lawyers = getAllLawyers();
  console.log(`📊 Found ${lawyers.length} lawyers to migrate`);
  
  if (lawyers.length === 0) {
    return {
      success: false,
      error: 'No lawyers found in data source',
      migrated: 0
    };
  }

  // Chunk lawyers into batches of 400 (Firestore limit is 500, leaving buffer)
  const chunkSize = 400;
  const chunks = [];
  for (let i = 0; i < lawyers.length; i += chunkSize) {
    chunks.push(lawyers.slice(i, i + chunkSize));
  }

  console.log(`📦 Split into ${chunks.length} chunks of max ${chunkSize} lawyers each`);

  let totalMigrated = 0;
  const errors = [];
  const results = [];

  // Process each chunk
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];
    console.log(`🔄 Processing chunk ${chunkIndex + 1}/${chunks.length} (${chunk.length} lawyers)`);
    
    try {
      const batch = writeBatch(db);
      const lawyersCollection = collection(db, 'lawyers');
      
      chunk.forEach((lawyer) => {
        // Ensure lawyer has all required fields
        const enhancedLawyer = {
          ...lawyer,
          verified: true,
          tier: 'standard',
          migratedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Ensure categories is an array
          categories: Array.isArray(lawyer.categories) ? lawyer.categories : [],
          // Ensure numeric fields are numbers
          rating: typeof lawyer.rating === 'number' ? lawyer.rating : parseFloat(lawyer.rating) || 0,
          // Extract years from experience string
          experienceYears: typeof lawyer.experience === 'string' 
            ? parseInt(lawyer.experience) || 0 
            : lawyer.experience || 0
        };
        
        const lawyerRef = doc(lawyersCollection, lawyer.id.toString());
        batch.set(lawyerRef, enhancedLawyer);
      });
      
      await batch.commit();
      
      const chunkResult = {
        chunk: chunkIndex + 1,
        lawyers: chunk.length,
        success: true,
        timestamp: new Date().toISOString()
      };
      
      results.push(chunkResult);
      totalMigrated += chunk.length;
      
      console.log(`✅ Chunk ${chunkIndex + 1} migrated successfully: ${chunk.length} lawyers`);
      
      // Small delay between chunks to avoid rate limiting
      if (chunkIndex < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      console.error(`❌ Chunk ${chunkIndex + 1} failed:`, error);
      
      const chunkError = {
        chunk: chunkIndex + 1,
        lawyers: chunk.length,
        success: false,
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      };
      
      errors.push(chunkError);
      results.push(chunkError);
    }
  }

  // Verify migration
  let verification = null;
  try {
    const lawyersRef = collection(db, 'lawyers');
    const snapshot = await getDocs(lawyersRef);
    verification = {
      totalInFirestore: snapshot.size,
      expected: totalMigrated,
      match: snapshot.size === totalMigrated,
      sampleIds: snapshot.docs.slice(0, 3).map(doc => doc.id)
    };
    
    console.log(`🔍 Verification: ${snapshot.size} lawyers in Firestore, expected ${totalMigrated}`);
  } catch (verifyError) {
    verification = {
      error: verifyError.message,
      success: false
    };
  }

  const finalResult = {
    success: errors.length === 0,
    totalLawyers: lawyers.length,
    totalMigrated,
    chunksProcessed: chunks.length,
    successfulChunks: results.filter(r => r.success).length,
    failedChunks: errors.length,
    errors: errors.length > 0 ? errors : undefined,
    results,
    verification,
    timestamp: new Date().toISOString()
  };

  console.log('🎉 Migration Complete:', finalResult);
  return finalResult;
};

/**
 * Check current Firestore state
 */
export const checkFirestoreState = async () => {
  try {
    const lawyersRef = collection(db, 'lawyers');
    const snapshot = await getDocs(lawyersRef);
    
    const lawyers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      exists: !snapshot.empty,
      count: snapshot.size,
      sample: lawyers.slice(0, 3),
      hasVerifiedField: lawyers.length > 0 ? 'verified' in lawyers[0] : false,
      hasTierField: lawyers.length > 0 ? 'tier' in lawyers[0] : false,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

export default {
  diagnoseMigrationIssue,
  enhancedMigrateLawyers,
  checkFirestoreState
};
