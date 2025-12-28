import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLawyerProfile } from '../hooks/useFirestore';
import { createVerificationRequest } from '../lib/lsa-verification';
import { Shield, CheckCircle, Upload, FileText, AlertCircle, Clock } from 'lucide-react';
import LSAVerificationBadge from '../components/LSAVerificationBadge';

const LawyerVerification = () => {
  const { currentUser } = useAuth();
  const { lawyer, loading } = useLawyerProfile(currentUser?.uid);
  const [lsaId, setLsaId] = useState(lawyer?.lsa_id || '');
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSupportingDocs(prev => [...prev, ...files.slice(0, 3 - prev.length)]);
  };

  const removeFile = (index) => {
    setSupportingDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!lsaId.trim()) {
      setSubmissionResult({
        success: false,
        message: 'Please enter your LSA ID'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert files to base64 for storage (in production)
      const docsData = {};
      // In production: await Promise.all(supportingDocs.map(async (file, index) => {
      //   const base64 = await convertToBase64(file);
      //   docsData[`doc_${index}`] = {
      //     name: file.name,
      //     type: file.type,
      //     size: file.size,
      //     data: base64
      //   };
      // }));

      const result = await createVerificationRequest(
        currentUser.uid,
        lsaId,
        {
          fileCount: supportingDocs.length,
          fileNames: supportingDocs.map(f => f.name)
        }
      );

      if (result.success) {
        setSubmissionResult({
          success: true,
          message: 'Verification request submitted successfully! Our team will review your submission within 2-3 business days.',
          requestId: result.requestId
        });
        setLsaId('');
        setSupportingDocs([]);
      } else {
        setSubmissionResult({
          success: false,
          message: result.error || 'Failed to submit verification request'
        });
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const verificationStatus = lawyer ? {
    verified: lawyer.is_verified,
    status: lawyer.verification?.status,
    lsa_id: lawyer.lsa_id,
    last_verified: lawyer.verification?.verified_at
  } : null;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">LSA Verification</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Law Society of Alberta
            <span className="block gradient-text">Verification</span>
          </h1>
          
          <p className="text-xl text-textSecondary max-w-2xl mx-auto">
            Get verified with the Law Society of Alberta to build trust with clients and access premium features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Status & Benefits */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface border border-border rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text">Your Verification Status</h2>
                {verificationStatus && (
                  <LSAVerificationBadge 
                    verificationStatus={verificationStatus}
                    size="lg"
                    showDetails
                  />
                )}
              </div>

              {verificationStatus?.verified ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">You are verified with the Law Society of Alberta</span>
                  </div>
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <p className="text-text">
                      Your verification was completed on {new Date(verificationStatus.last_verified).toLocaleDateString()}.
                      Clients can see your verified status on your profile.
                    </p>
                  </div>
                </div>
              ) : verificationStatus?.status === 'pending_review' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-warning">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Verification Under Review</span>
                  </div>
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <p className="text-text">
                      Your verification request is being reviewed by our team. 
                      This process typically takes 2-3 business days.
                    </p>
                    <p className="text-sm text-textSecondary mt-2">
                      Request ID: {lawyer.verification?.request_id || 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-error">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Verification Required</span>
                  </div>
                  <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                    <p className="text-text">
                      You need to be verified with the Law Society of Alberta to access all features 
                      and build trust with potential clients.
                    </p>
                  </div>
                </div>
              )}

              {/* Verification Benefits */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-text mb-4">Benefits of Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Trust & Credibility</h4>
                      <p className="text-sm text-textSecondary">Verified badge builds client confidence</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Priority Placement</h4>
                      <p className="text-sm text-textSecondary">Higher visibility in search results</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Full Access</h4>
                      <p className="text-sm text-textSecondary">Access to all platform features</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Client Assurance</h4>
                      <p className="text-sm text-textSecondary">Clients know you're in good standing</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Verification Form */}
            {!verificationStatus?.verified && verificationStatus?.status !== 'pending_review' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface border border-border rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-text mb-6">Request Verification</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* LSA ID Input */}
                  <div>
                    <label className="block text-text font-medium mb-2">
                      Law Society of Alberta ID
                    </label>
                    <input
                      type="text"
                      value={lsaId}
                      onChange={(e) => setLsaId(e.target.value.toUpperCase())}
                      placeholder="Enter your LSA ID (e.g., 123456 or ABC123)"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-text placeholder:text-textSecondary focus:outline-none focus:border-primary"
                      required
                    />
                    <p className="text-sm text-textSecondary mt-2">
                      Your LSA ID can be found on your Law Society of Alberta membership card or correspondence.
                    </p>
                  </div>

                  {/* Supporting Documents */}
                  <div>
                    <label className="block text-text font-medium mb-2">
                      Supporting Documents (Optional)
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <Upload className="w-12 h-12 text-textSecondary mx-auto mb-4" />
                      <p className="text-text mb-2">Upload supporting documents</p>
                      <p className="text-sm text-textSecondary mb-4">
                        Upload your LSA membership card, bar certificate, or other verification documents.
                        Max 3 files, 5MB each.
                      </p>
                      <label className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer">
                        Choose Files
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* File List */}
                    {supportingDocs.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {supportingDocs.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-primary" />
                              <div>
                                <div className="font-medium text-text">{file.name}</div>
                                <div className="text-sm text-textSecondary">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-error hover:text-error/80"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submission Result */}
                  {submissionResult && (
                    <div className={`p-4 rounded-lg ${
                      submissionResult.success 
                        ? 'bg-success/10 border border-success/20 text-success'
                        : 'bg-error/10 border border-error/20 text-error'
                    }`}>
                      {submissionResult.message}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !lsaId.trim()}
                    className="w-full px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Submit Verification Request
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Right Column - Information & Help */}
          <div className="space-y-8">
            {/* Information Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-text mb-4">About LSA Verification</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-text">What is LSA?</h4>
                    <p className="text-sm text-textSecondary">
                      The Law Society of Alberta regulates lawyers in Alberta to ensure they meet professional standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium text-text">Why Verify?</h4>
                    <p className="text-sm text-textSecondary">
                      Verification confirms you're an active member in good standing with the LSA.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium text-text">Processing Time</h4>
                    <p className="text-sm text-textSecondary">
                      Verification requests are typically processed within 2-3 business days.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Help Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-text mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a 
                  href="https://www.lawsociety.ab.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-surface/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-text">Visit LSA Website</div>
                    <div className="text-sm text-textSecondary">Find your LSA ID or membership details</div>
                  </div>
                </a>
                <button className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-surface/50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-medium text-text">Contact Support</div>
                    <div className="text-sm text-textSecondary">Get help with verification</div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Status Legend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-text mb-4">Status Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <div>
                    <div className="font-medium text-text">Verified</div>
                    <div className="text-sm text-textSecondary">Successfully verified with LSA</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div>
                    <div className="font-medium text-text">Pending Review</div>
                    <div className="text-sm text-textSecondary">Verification request submitted</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div>
                    <div className="font-medium text-text">Unverified</div>
                    <div className="text-sm text-textSecondary">Verification required</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerVerification;
