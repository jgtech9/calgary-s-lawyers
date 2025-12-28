import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set persistence on initialization
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);
  }, []);

  // Sign up new user
  const signup = async (email, password, displayName, additionalData = {}) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName,
        role: additionalData.role || 'user',
        phone: additionalData.phone || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        emailVerified: false
      });
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      // Create user document if it doesn't exist
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: true,
          emailVerified: result.user.emailVerified
        });
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Password reset
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  };

  // Fetch user role and data from Firestore
  const fetchUserRole = async (user) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role || 'user';
      }
      
      // Check for custom claims as fallback
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.admin) return 'admin';
      if (idTokenResult.claims.lawyer) return 'lawyer';
      
      return 'user';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      
      if (user) {
        const role = await fetchUserRole(user);
        setUserRole(role);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    signup,
    login,
    logout,
    signInWithGoogle,
    resetPassword,
    isAdmin: userRole === 'admin',
    isLawyer: userRole === 'lawyer',
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
