import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const LEGAL_CATEGORIES = [
  'Family Law',
  'Criminal Defense',
  'Personal Injury',
  'Real Estate',
  'Immigration',
  'Employment Law',
  'Business Law',
  'Wills & Estates',
  'Civil Litigation',
  'Other'
];

const URGENCY_LEVELS = [
  { value: 'low', label: 'Not urgent (within 2 weeks)', icon: '📅' },
  { value: 'normal', label: 'Normal (within 1 week)', icon: '⏰' },
  { value: 'high', label: 'Urgent (within 48 hours)', icon: '⚡' },
  { value: 'emergency', label: 'Emergency (ASAP)', icon: '🚨' }
];

export const IntakeForm = ({ lawyerId, lawyerName, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    urgency: 'normal',
    contact_info: {
      name: '',
      email: '',
      phone: ''
    },
    case_summary: '',
    preferred_contact: 'email'
  });
  const [errors, setErrors] = useState({});

  // Validation
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.category) {
        newErrors.category = 'Please select a legal category';
      }
    }

    if (currentStep === 2) {
      if (!formData.case_summary || formData.case_summary.trim().length < 20) {
        newErrors.case_summary = 'Please provide at least 20 characters describing your situation';
      }
    }

    if (currentStep === 3) {
      if (!formData.contact_info.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.contact_info.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_info.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.contact_info.phone) {
        newErrors.phone = 'Phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'intake_leads'), {
        lawyer_id: lawyerId,
        lawyer_name: lawyerName,
        category: formData.category,
        urgency: formData.urgency,
        contact_info: {
          name: formData.contact_info.name,
          email: formData.contact_info.email,
          phone: formData.contact_info.phone
        },
        case_summary: formData.case_summary,
        preferred_contact: formData.preferred_contact,
        status: 'new',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      if (onSuccess) {
        onSuccess();
      } else {
        alert('✅ Your request has been sent successfully! The lawyer will contact you soon.');
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting intake form:', error);
      alert('❌ Error sending your request. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full my-8 shadow-2xl"
      >
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Contact {lawyerName}</h2>
              <p className="text-blue-100 mt-1">Step {step} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i <= step ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit} className="p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Legal Category & Urgency */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    What type of legal help do you need?
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {LEGAL_CATEGORIES.map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setFormData({...formData, category});
                          setErrors({...errors, category: ''});
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                          formData.category === category
                            ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-2">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    How urgent is your situation?
                  </label>
                  <div className="space-y-2">
                    {URGENCY_LEVELS.map(level => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData({...formData, urgency: level.value})}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                          formData.urgency === level.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{level.icon}</span>
                        <span className="font-medium">{level.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Case Summary */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Tell us about your situation
                </h3>
                
                <textarea
                  value={formData.case_summary}
                  onChange={(e) => {
                    setFormData({...formData, case_summary: e.target.value});
                    setErrors({...errors, case_summary: ''});
                  }}
                  rows={8}
                  className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all ${
                    errors.case_summary ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Please provide a brief overview of your legal situation. Include key details but avoid sensitive personal information like names, addresses, or social insurance numbers."
                />
                {errors.case_summary && (
                  <p className="text-red-500 text-sm mt-2">{errors.case_summary}</p>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <div className="flex gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1">Privacy Notice</h4>
                      <p className="text-sm text-yellow-800">
                        Do not include names, addresses, social insurance numbers, or other personally 
                        identifiable information. Lawyers will request these details in a secure consultation.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Contact Information */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  How can the lawyer reach you?
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contact_info.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData, 
                        contact_info: {...formData.contact_info, name: e.target.value}
                      });
                      setErrors({...errors, name: ''});
                    }}
                    className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.contact_info.email}
                    onChange={(e) => {
                      setFormData({
                        ...formData, 
                        contact_info: {...formData.contact_info, email: e.target.value}
                      });
                      setErrors({...errors, email: ''});
                    }}
                    className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_info.phone}
                    onChange={(e) => {
                      setFormData({
                        ...formData, 
                        contact_info: {...formData.contact_info, phone: e.target.value}
                      });
                      setErrors({...errors, phone: ''});
                    }}
                    className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(403) 555-0123"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferred_contact"
                        value="email"
                        checked={formData.preferred_contact === 'email'}
                        onChange={(e) => setFormData({...formData, preferred_contact: e.target.value})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferred_contact"
                        value="phone"
                        checked={formData.preferred_contact === 'phone'}
                        onChange={(e) => setFormData({...formData, preferred_contact: e.target.value})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Phone</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            
            <div className="flex-1"></div>

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Submit Request
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
