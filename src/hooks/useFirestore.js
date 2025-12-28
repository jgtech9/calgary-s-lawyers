/**
 * Custom hooks for Firestore operations
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Hook for lawyer profile data
export const useLawyerProfile = (lawyerId) => {
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lawyerId) {
      setLoading(false);
      return;
    }

    const lawyerRef = doc(db, 'lawyers', lawyerId);
    
    const unsubscribe = onSnapshot(
      lawyerRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setLawyer({
            id: docSnap.id,
            ...docSnap.data()
          });
        } else {
          setLawyer(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching lawyer profile:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [lawyerId]);

  return { lawyer, loading, error };
};

// Hook for intake leads (lawyer-specific)
export const useIntakeLeads = (lawyerId) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lawyerId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'intake_leads'),
      where('lawyer_id', '==', lawyerId),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const leadsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeads(leadsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching intake leads:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [lawyerId]);

  return { leads, loading, error };
};

// Hook for directory lawyers with filters
export const useDirectoryLawyers = (filters = {}) => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const constraints = [];
    
    // Add filters
    if (filters.category) {
      constraints.push(where('profile_data.categories', 'array-contains', filters.category));
    }
    
    if (filters.verified) {
      constraints.push(where('is_verified', '==', true));
    }
    
    if (filters.minRating) {
      constraints.push(where('metrics.rating', '>=', filters.minRating));
    }
    
    // Always order by something
    constraints.push(orderBy('metrics.rating', 'desc'));
    
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    const q = query(collection(db, 'lawyers'), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const lawyersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLawyers(lawyersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching directory lawyers:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filters]);

  return { lawyers, loading, error };
};

// Hook for admin: all lawyers
export const useAllLawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'lawyers'),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const lawyersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLawyers(lawyersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching all lawyers:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { lawyers, loading, error };
};

// Hook for lawyer search
export const useLawyerSearch = (searchTerm) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const searchLawyers = async () => {
      setLoading(true);
      try {
        // Note: Firestore doesn't support full-text search natively
        // In production, you'd use Algolia, Elasticsearch, or Firebase Extensions
        const lawyersRef = collection(db, 'lawyers');
        const snapshot = await getDocs(lawyersRef);
        
        const allLawyers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Client-side filtering (temporary solution)
        const filtered = allLawyers.filter(lawyer => {
          const searchLower = searchTerm.toLowerCase();
          const name = lawyer.profile_data?.name?.toLowerCase() || '';
          const bio = lawyer.profile_data?.bio?.toLowerCase() || '';
          const categories = lawyer.profile_data?.categories?.join(' ').toLowerCase() || '';
          
          return name.includes(searchLower) || 
                 bio.includes(searchLower) || 
                 categories.includes(searchLower);
        });
        
        setResults(filtered);
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchLawyers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return { results, loading, error };
};

// Create new intake lead
export const createIntakeLead = async (lawyerId, leadData) => {
  try {
    const leadRef = await addDoc(collection(db, 'intake_leads'), {
      lawyer_id: lawyerId,
      ...leadData,
      status: 'new',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return { success: true, leadId: leadRef.id };
  } catch (error) {
    console.error('Error creating intake lead:', error);
    return { success: false, error: error.message };
  }
};

// Update lawyer profile
export const updateLawyerProfile = async (lawyerId, profileData) => {
  try {
    const lawyerRef = doc(db, 'lawyers', lawyerId);
    
    await updateDoc(lawyerRef, {
      'profile_data': profileData,
      'updated_at': serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating lawyer profile:', error);
    return { success: false, error: error.message };
  }
};

// Admin: Update lawyer verification status
export const adminUpdateVerification = async (lawyerId, verified, notes = '') => {
  try {
    const lawyerRef = doc(db, 'lawyers', lawyerId);
    
    await updateDoc(lawyerRef, {
      'is_verified': verified,
      'verification.notes': notes,
      'verification.reviewed_at': serverTimestamp(),
      'updated_at': serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating verification:', error);
    return { success: false, error: error.message };
  }
};
