/**
 * Firestore Index Configuration for Calgary Lawyer Directory
 * 
 * This file defines the composite indexes needed for optimal query performance.
 * These indexes should be created in the Firebase Console under:
 * Firestore Database → Indexes → Composite Indexes
 */

export const firestoreIndexes = {
  // Primary index for lawyer directory queries
  lawyers_primary: {
    collection: 'lawyers',
    fields: [
      { field: 'verified', order: 'descending' },
      { field: 'rating', order: 'descending' },
      { field: 'reviewCount', order: 'descending' }
    ],
    queryScope: 'COLLECTION'
  },

  // Index for category-based filtering
  lawyers_by_category: {
    collection: 'lawyers',
    fields: [
      { field: 'categories', arrayConfig: 'CONTAINS' },
      { field: 'verified', order: 'descending' },
      { field: 'rating', order: 'descending' }
    ],
    queryScope: 'COLLECTION'
  },

  // Index for location-based queries
  lawyers_by_location: {
    collection: 'lawyers',
    fields: [
      { field: 'location.city', order: 'ascending' },
      { field: 'location.province', order: 'ascending' },
      { field: 'verified', order: 'descending' }
    ],
    queryScope: 'COLLECTION'
  },

  // Index for search functionality
  lawyers_search: {
    collection: 'lawyers',
    fields: [
      { field: 'name', order: 'ascending' },
      { field: 'firm', order: 'ascending' },
      { field: 'verified', order: 'descending' }
    ],
    queryScope: 'COLLECTION'
  },

  // Index for intake leads by lawyer and status
  intake_leads_by_lawyer: {
    collection: 'intake_leads',
    fields: [
      { field: 'lawyer_id', order: 'ascending' },
      { field: 'status', order: 'ascending' },
      { field: 'createdAt', order: 'descending' }
    ],
    queryScope: 'COLLECTION'
  },

  // Index for admin dashboard - all leads by date
  intake_leads_by_date: {
    collection: 'intake_leads',
    fields: [
      { field: 'createdAt', order: 'descending' },
      { field: 'status', order: 'ascending' }
    ],
    queryScope: 'COLLECTION'
  }
};

/**
 * Utility function to generate Firestore index creation commands
 * These are for reference - actual indexes must be created in Firebase Console
 */
export const generateIndexCreationCommands = () => {
  const commands = [];
  
  Object.entries(firestoreIndexes).forEach(([indexName, config]) => {
    const fields = config.fields.map(f => 
      f.arrayConfig ? `${f.field} array-contains` : `${f.field} ${f.order}`
    ).join(', ');
    
    commands.push({
      name: indexName,
      command: `gcloud firestore indexes composite create --collection-group=${config.collection} --field=${fields} --query-scope=${config.queryScope}`,
      description: `Create ${indexName} index for ${config.collection} collection`
    });
  });
  
  return commands;
};

/**
 * Check if required indexes exist (simulated - actual check requires admin SDK)
 */
export const validateIndexes = async () => {
  console.log('📋 Firestore Index Validation Report');
  console.log('====================================');
  
  Object.entries(firestoreIndexes).forEach(([indexName, config]) => {
    console.log(`✅ ${indexName}: Required for ${config.collection} queries`);
    console.log(`   Fields: ${config.fields.map(f => f.field).join(', ')}`);
  });
  
  console.log('\n⚠️  IMPORTANT: These indexes must be created in Firebase Console');
  console.log('   Navigate to: Firestore Database → Indexes → Composite Indexes');
  console.log('   Click "Create Index" and configure according to above specifications');
  
  return { valid: true, message: 'Index configuration validated' };
};
