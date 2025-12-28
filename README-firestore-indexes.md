# Firestore Index Configuration Guide

## Overview
This document explains how to set up and manage Firestore composite indexes for optimal performance in the Calgary Lawyer Directory.

## Required Indexes

The following composite indexes are required for the application to function properly:

### 1. Lawyers Collection Indexes

#### Primary Search Index
```
Collection: lawyers
Fields:
  - rating (DESCENDING)
  - reviews (DESCENDING)
  - name (ASCENDING)
Scope: Collection
```

#### Category Filter Index
```
Collection: lawyers
Fields:
  - categories (CONTAINS)
  - rating (DESCENDING)
  - location (ASCENDING)
Scope: Collection
```

#### Location Filter Index
```
Collection: lawyers
Fields:
  - location (ASCENDING)
  - categories (CONTAINS)
  - rating (DESCENDING)
Scope: Collection
```

#### Featured Lawyers Index
```
Collection: lawyers
Fields:
  - featured (DESCENDING)
  - rating (DESCENDING)
  - experience (DESCENDING)
Scope: Collection
```

#### Price Filter Index
```
Collection: lawyers
Fields:
  - hourlyRate (ASCENDING)
  - rating (DESCENDING)
Scope: Collection
```

#### Language Filter Index
```
Collection: lawyers
Fields:
  - languages (CONTAINS)
  - categories (CONTAINS)
  - rating (DESCENDING)
Scope: Collection
```

### 2. Reviews Subcollection Indexes

#### Lawyer Reviews Index
```
Collection: lawyers/{lawyerId}/reviews
Fields:
  - createdAt (DESCENDING)
Scope: Collection
```

#### Rating Reviews Index
```
Collection: lawyers/{lawyerId}/reviews
Fields:
  - rating (DESCENDING)
  - createdAt (DESCENDING)
Scope: Collection
```

### 3. Consultations Subcollection Indexes

#### Lawyer Consultations Index
```
Collection: lawyers/{lawyerId}/consultations
Fields:
  - status (ASCENDING)
  - requestedDate (DESCENDING)
Scope: Collection
```

#### User Consultations Index
```
Collection: lawyers/{lawyerId}/consultations
Fields:
  - userId (ASCENDING)
  - status (ASCENDING)
  - requestedDate (DESCENDING)
Scope: Collection
```

## Setting Up Indexes

### Method 1: Firebase CLI (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firestore in your project:
```bash
firebase init firestore
```

4. Deploy indexes:
```bash
firebase deploy --only firestore:indexes
```

### Method 2: Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database > Indexes tab
4. Click "Add Index"
5. Configure each index as shown above

### Method 3: Using the Index File

The `firestore.indexes.json` file contains all required indexes. You can:

1. Upload directly to Firebase Console
2. Use with Firebase CLI:
```bash
firebase deploy --only firestore:indexes
```

## Testing Indexes

Run the index validation script to ensure all indexes are properly configured:

```bash
node -e "import('./src/utils/firestore-indexes.js').then(m => m.validateIndexes())"
```

Or from the browser console in development mode:
```javascript
import { validateIndexes } from './src/utils/firestore-indexes.js';
await validateIndexes();
```

## Common Issues & Solutions

### 1. "Missing or insufficient permissions"
- Ensure Firestore rules allow the query
- Check that the user is authenticated (if required)
- Verify collection and document permissions

### 2. "The query requires an index"
- Create the missing composite index
- Wait 1-2 minutes for index to build
- Retry the query

### 3. Slow Query Performance
- Ensure you're using indexed fields in WHERE clauses
- Add composite indexes for common query combinations
- Limit the number of documents returned
- Use pagination for large result sets

### 4. Index Limit Reached
- Firestore has a limit of 200 composite indexes per database
- Remove unused indexes
- Combine similar indexes
- Use single-field indexes where possible

## Best Practices

### 1. Index Planning
- Plan indexes based on your most common queries
- Create indexes for filter combinations used together
- Avoid over-indexing (stick to necessary indexes)

### 2. Query Optimization
- Always use indexed fields in WHERE clauses
- Order results by indexed fields
- Use limit() to reduce data transfer
- Implement pagination for large datasets

### 3. Monitoring
- Monitor index usage in Firebase Console
- Check query performance regularly
- Remove unused indexes
- Update indexes as query patterns change

### 4. Cost Optimization
- Indexes increase storage costs
- More indexes = higher write costs
- Balance performance needs with budget

## Maintenance

### Regular Tasks
1. Review index usage monthly
2. Remove unused indexes
3. Add indexes for new query patterns
4. Monitor query performance

### Update Process
1. Test new indexes in development first
2. Deploy indexes during low-traffic periods
3. Monitor for any performance regressions
4. Roll back if issues occur

## Support

For issues with Firestore indexes:
1. Check Firebase Console error messages
2. Review Firestore documentation
3. Test with the validation script
4. Contact Firebase support if needed

## Additional Resources

- [Firestore Index Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Composite Index Guide](https://firebase.google.com/docs/firestore/query-data/index-overview#composite_indexes)
- [Query Performance Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firestore Pricing](https://firebase.google.com/pricing) (index costs)
