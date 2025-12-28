import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

const ReviewContext = createContext({});

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

export const ReviewProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalPending: 0,
    totalApproved: 0,
    averageRating: 0
  });

  // Fetch all reviews (admin view)
  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const reviewsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setReviews(reviewsData);
        
        // Calculate stats
        const total = reviewsData.length;
        const pending = reviewsData.filter(r => r.status === 'pending').length;
        const approved = reviewsData.filter(r => r.status === 'approved').length;
        const average = reviewsData.length > 0 
          ? reviewsData.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsData.length
          : 0;
        
        setStats({
          totalReviews: total,
          totalPending: pending,
          totalApproved: approved,
          averageRating: parseFloat(average.toFixed(1))
        });
        
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching reviews:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Submit a new review
  const submitReview = async (reviewData) => {
    try {
      const reviewRef = await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        user_id: currentUser?.uid,
        user_name: currentUser?.displayName || 'Anonymous',
        status: 'pending', // All reviews require moderation
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      return { success: true, reviewId: reviewRef.id };
    } catch (error) {
      console.error('Error submitting review:', error);
      return { success: false, error: error.message };
    }
  };

  // Update review status (admin only)
  const updateReviewStatus = async (reviewId, status, adminNotes = '') => {
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      
      await updateDoc(reviewRef, {
        status,
        admin_notes: adminNotes,
        reviewed_by: currentUser?.uid,
        reviewed_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating review:', error);
      return { success: false, error: error.message };
    }
  };

  // Get reviews for a specific lawyer
  const getLawyerReviews = async (lawyerId) => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('lawyer_id', '==', lawyerId),
        where('status', '==', 'approved'),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching lawyer reviews:', error);
      return [];
    }
  };

  // Get user's submitted reviews
  const getUserReviews = async (userId) => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }
  };

  const value = {
    reviews,
    loading,
    error,
    stats,
    submitReview,
    updateReviewStatus,
    getLawyerReviews,
    getUserReviews,
    getStats: () => stats
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};
