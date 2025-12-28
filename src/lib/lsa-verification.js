/**
 * Law Society of Alberta (LSA) Verification System
 * Handles lawyer verification against LSA database
 */

import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Mock LSA verification (replace with actual API call in production)
export const verifyLawyerWithLSA = async (lawyerData) => {
  try {
    // In production, this would call the LSA API
    // const response = await fetch(`${import.meta.env.VITE_LSA_API_ENDPOINT}`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${import.meta.env.VITE_LSA_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     lsa_id: lawyerData.lsa_id,
    //     name: lawyerData.name,
    //     bar_number: lawyerData.bar_number,
    //   }),
    // });
    
    // For now, simulate API response with validation logic
    const isValidLSA = validateLSAFormat(lawyerData.lsa_id);
    const nameMatches = validateNameFormat(lawyerData.name);
    
    const verificationResult = {
      verified: isValidLSA && nameMatches,
      lsa_id: lawyerData.lsa_id,
      verified_at: new Date().toISOString(),
      verification_method: 'manual', // 'api' in production
      details: {
        name_match: nameMatches,
        lsa_format_valid: isValidLSA,
        status: isValidLSA && nameMatches ? 'verified' : 'pending_review'
      }
    };
    
    return verificationResult;
  } catch (error) {
    console.error('LSA verification error:', error);
    return {
      verified: false,
      error: error.message,
      verification_method: 'error'
    };
  }
};

// Validate LSA ID format (Alberta-specific format)
const validateLSAFormat = (lsaId) => {
  if (!lsaId) return false;
  
  // Alberta LSA IDs typically follow patterns like:
  // - 123456 (6 digits)
  // - ABC123 (3 letters + 3 digits)
  // - 12345A (5 digits + 1 letter)
  const patterns = [
    /^\d{6}$/, // 6 digits
    /^[A-Z]{3}\d{3}$/, // 3 letters + 3 digits
    /^\d{5}[A-Z]$/, // 5 digits + 1 letter
    /^[A-Z]\d{5}$/, // 1 letter + 5 digits
  ];
  
  return patterns.some(pattern => pattern.test(lsaId.toUpperCase()));
};

// Validate lawyer name format
const validateNameFormat = (name) => {
  if (!name) return false;
  
  // Basic validation: at least first and last name
  const nameParts = name.trim().split(/\s+/);
  return nameParts.length >= 2 && nameParts.every(part => part.length >= 2);
};

// Update lawyer verification status in Firestore
export const updateLawyerVerification = async (lawyerId, verificationData) => {
  try {
    const lawyerRef = doc(db, 'lawyers', lawyerId);
    
    await updateDoc(lawyerRef, {
      'verification': verificationData,
      'is_verified': verificationData.verified,
      'updated_at': serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating lawyer verification:', error);
    return { success: false, error: error.message };
  }
};

// Batch verify multiple lawyers (admin function)
export const batchVerifyLawyers = async (lawyerIds) => {
  const results = [];
  
  for (const lawyerId of lawyerIds) {
    try {
      const lawyerDoc = await getDoc(doc(db, 'lawyers', lawyerId));
      
      if (lawyerDoc.exists()) {
        const lawyerData = lawyerDoc.data();
        const verificationResult = await verifyLawyerWithLSA(lawyerData);
        
        await updateLawyerVerification(lawyerId, verificationResult);
        
        results.push({
          lawyerId,
          success: true,
          verified: verificationResult.verified,
          name: lawyerData.profile_data?.name || 'Unknown'
        });
      }
    } catch (error) {
      results.push({
        lawyerId,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

// Get verification status for a lawyer
export const getLawyerVerificationStatus = async (lawyerId) => {
  try {
    const lawyerDoc = await getDoc(doc(db, 'lawyers', lawyerId));
    
    if (lawyerDoc.exists()) {
      const data = lawyerDoc.data();
      return {
        verified: data.is_verified || false,
        verification: data.verification || null,
        lsa_id: data.lsa_id || null,
        last_verified: data.verification?.verified_at || null
      };
    }
    
    return { verified: false, error: 'Lawyer not found' };
  } catch (error) {
    console.error('Error getting verification status:', error);
    return { verified: false, error: error.message };
  }
};

// Create verification request (for lawyers to request verification)
export const createVerificationRequest = async (lawyerId, lsaId, supportingDocs = {}) => {
  try {
    const requestRef = doc(db, 'verification_requests', `${lawyerId}_${Date.now()}`);
    
    await setDoc(requestRef, {
      lawyer_id: lawyerId,
      lsa_id: lsaId,
      supporting_docs: supportingDocs,
      status: 'pending',
      submitted_at: serverTimestamp(),
      reviewed_by: null,
      reviewed_at: null,
      notes: ''
    });
    
    return { success: true, requestId: requestRef.id };
  } catch (error) {
    console.error('Error creating verification request:', error);
    return { success: false, error: error.message };
  }
};

// Admin: Get pending verification requests
export const getPendingVerificationRequests = async () => {
  // This would require a Firestore query in production
  // For now, return mock data
  return [];
};
