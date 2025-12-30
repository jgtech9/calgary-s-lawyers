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
  const [userData, setUserData] = useState(null); // Store full user data from Firestore
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set persistence on initialization
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);
  }, []);

  // Helper function to get user data from Firestore
  const getUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Helper function to determine user role
  const determineRole = async (user, firestoreData = null) => {
    try {
      // First check Firestore data
      if (firestoreData?.role) {
        return firestoreData.role;
      }

      // Fetch from Firestore if not provided
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return data.role || 'user';
      }

      // Check for custom claims as fallback
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.admin) return 'admin';
      if (idTokenResult.claims.lawyer) return 'lawyer';

      return 'user';
    } catch (error) {
      console.error('Error determining user role:', error);
      return 'user';
    }
  };

  // Sign up new user - FIXED
  const signup = async (email, password, displayName, additionalData = {}) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });

      // ✅ FIX: Check for both 'role' and 'accountType'
      const role = additionalData.role || additionalData.accountType || 'user';

      // Create user document in Firestore
      const userDocData = {
        uid: userCredential.user.uid,
        email,
        displayName,
        firstName: additionalData.firstName || '',
        lastName: additionalData.lastName || '',
        role: role,
        phone: additionalData.phone || '',
        subscribeNewsletter: additionalData.subscribeNewsletter || false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        emailVerified: false,
        provider: 'email'
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userDocData);

      // Update local state
      setUserRole(role);
      setUserData(userDocData);

      // ✅ FIX: Return user object WITH role
      return {
        success: true,
        user: {
          ...userCredential.user,
          role: role,
          ...userDocData
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Login with email/password - FIXED
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // ✅ FIX: Fetch user data from Firestore to get role
      const firestoreData = await getUserData(result.user.uid);
      const role = await determineRole(result.user, firestoreData);

      // Update local state
      setUserRole(role);
      setUserData(firestoreData);

      // ✅ FIX: Return user object WITH role
      return {
        success: true,
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: role,
          ...firestoreData
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Google Sign In - FIXED
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();

      provider.addScope('profile');
      provider.addScope('email');

      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      const isNewUser = !userDoc.exists();

      let firestoreData;
      let role = 'user';

      if (isNewUser) {
        // Create new user document
        firestoreData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: true,
          emailVerified: result.user.emailVerified,
          provider: 'google'
        };

        await setDoc(doc(db, 'users', result.user.uid), firestoreData);
      } else {
        // Get existing user data
        firestoreData = userDoc.data();
        role = firestoreData.role || 'user';
      }

      // Update local state
      setUserRole(role);
      setUserData(firestoreData);

      // ✅ FIX: Return user object WITH role
      return {
        success: true,
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: role,
          ...firestoreData
        },
        isNewUser
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      let errorMessage = error.message;
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please allow popups for this site.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed before completing.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for OAuth operations. Please check Firebase console settings.';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      setUserData(null);
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

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        try {
          const firestoreData = await getUserData(user.uid);
          const role = await determineRole(user, firestoreData);

          setCurrentUser(user);
          setUserRole(role);
          setUserData(firestoreData);
        } catch (error) {
          console.error('Error in auth state change:', error);
          setCurrentUser(user);
          setUserRole('user');
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
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
    isUser: userRole === 'user',
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
