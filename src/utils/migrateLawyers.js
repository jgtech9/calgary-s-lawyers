import { db } from '../lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { getAllLawyers } from '../data/lawyers';

/**
 * Standalone utility to migrate static lawyer data to Firestore.
 * Adds 'verified' and 'tier' fields as per Phase 1 requirements.
 */
export const migrateLawyersToFirestore = async () => {
  const lawyers = getAllLawyers();
  const batch = writeBatch(db);
  const lawyersCollection = collection(db, 'lawyers');

  console.log(`Starting migration of ${lawyers.length} lawyers...`);

  lawyers.forEach((lawyer) => {
    const lawyerRef = doc(lawyersCollection, lawyer.id.toString());
    batch.set(lawyerRef, {
      ...lawyer,
      verified: true,
      tier: 'standard',
      updatedAt: new Date().toISOString()
    });
  });

  try {
    await batch.commit();
    console.log('Migration successful!');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
};
