import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  FileText, 
  Users,
  Building,
  Shield,
  CheckCircle,
  AlertCircle,
  Search,
  MessageSquare,
  Clock,
  Award,
  Star,
  Target,
  Loader2,
  LogIn
} from 'lucide-react'
import { db, serverTimestamp } from '../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

export default function PersonalizedMatch() {
  const navigate = useNavigate()
  const { currentUser, isAuthenticated } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: 'Calgary, AB',
    legalIssue: '',
    opposingParty: '',
    opposingLawFirm: '',
    timeline: '',
    budget: '',
    preferredContact: 'email',
    description: ''
  })

  // Check if user is authenticated on component mount
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Pre-fill form with user data if available
      setFormData(prev => ({
        ...prev,
        firstName: currentUser.displayName?.split(' ')[0] || '',
        lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
        email: currentUser.email || '',
        // Note: Phone would need to be fetched from user profile
      }))
    }
  }, [isAuthenticated, currentUser])

  const legalIssues = [
    'Family Law (Divorce, Custody)',
    'Corporate Law (Business, Contracts)',
    'Real Estate (Buying, Selling, Disputes)',
    'Criminal Defense',
    'Employment Law',
    'Civil Litigation',
    'Personal Injury',
    'Estate Planning',
    'Immigration Law',
    'Tax Law'
  ]

  const timelineOptions = [
    'Immediate (Within 1 week)',
    'Urgent (Within 1 month)',
    'Standard (1-3 months)',
    'Long-term (3+ months)'
  ]

  const budgetOptions = [
    'Under $5,000',
    '$5,000 - $15,000',
    '$15,000 - $50,000',
    '$50,000+',
    'Not sure / Need consultation'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Store form data in session storage and redirect to signup
  const redirectToSignupWithData = () => {
    // Store form data in session storage
    sessionStorage.setItem('matchingFormData', JSON.stringify(formData))
    sessionStorage.setItem('matchingRedirect', '/personalized-match')
    
    // Redirect to signup
    navigate('/signup', { 
      state: { 
        fromMatching: true,
        prefillData: formData 
      } 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthPrompt(true)
      return
    }

    // Proceed with submission for authenticated users
    setIsSubmitting(true)

    try {
      // Phase 2: PII-Safe Data Splitting
      const leadData = {
        created_at: serverTimestamp(),
        status: 'open',
        interested_lawyers: [],
        userId: currentUser.uid, // Link to authenticated user
        
        // PRIVATE (PII - Only visible to Admin/Matched Lawyer)
        contact_info: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          userId: currentUser.uid
        },
        
        // CONFLICT CHECK (Hidden from Bulletin Board)
        conflict_data: {
          opposingParty: formData.opposingParty,
          opposingLawFirm: formData.opposingLawFirm
        },
        
        // PUBLIC (Visible on Lawyer Bulletin Board)
        case_details: {
          category: formData.legalIssue,
          timeline: formData.timeline,
          budget: formData.budget,
          location: formData.location,
          summary: formData.description,
          preferredContact: formData.preferredContact,
          userId: currentUser.uid
        }
      };

      await addDoc(collection(db, 'leads'), leadData);
      
      alert('Your personalized match request has been submitted! Our team will contact you within 24 hours.');
      
      // Reset form
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        location: 'Calgary, AB', legalIssue: '', opposingParty: '',
        opposingLawFirm: '', timeline: '', budget: '',
        preferredContact: 'email', description: ''
      });
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const benefits = [
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'We match you with lawyers who have specific experience in your exact type of case.'
    },
    {
      icon: Shield,
      title: 'Conflict-Free Guarantee',
      description: 'Comprehensive checks ensure no conflicts with opposing parties or law firms.'
    },
    {
      icon: Star,
      title: 'Verified Experts',
      description: 'All lawyers are vetted for credentials, experience, and client satisfaction.'
    },
    {
      icon: Clock,
      title: 'Fast Response',
      description: 'Get matched with qualified lawyers within 24-48 hours of submitting your request.'
    }
  ]

  const processSteps = [
    {
      step: 1,
      title: 'Share Your Details',
      description: 'Fill out our secure form with your case information and requirements.',
      icon: FileText
    },
    {
      step: 2,
      title: 'Conflict Check',
      description: 'Our system screens all lawyers against your case details for conflicts.',
      icon: Shield
    },
    {
      step: 3,
      title: 'Expert Matching',
      description: 'We match you with 3-5 lawyers who specialize in your specific legal area.',
      icon: Search
    },
    {
      step: 4,
      title: 'Free Consultations',
      description: 'Schedule initial consultations with your matched lawyers at no cost.',
      icon: MessageSquare
    }
  ]

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
            alt="Legal consultation and matching"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full mb-6">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Personalized Lawyer Matching</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get Your
              <span className="block gradient-text">Personalized Legal Match</span>
            </h1>
            
            <p className="text-xl text-textSecondary mb-8 max-w-2xl">
              Tell us about your legal situation and we'll match you with verified Calgary lawyers 
              who specialize in your specific needs. Free consultations, no obligation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#match-form"
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Start Your Match Request
              </a>
              <Link 
                to="/how-it-works"
                className="px-8 py-3 border-2 border-primary text-white font-semibold rounded-lg hover:bg-primary/10 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Get a Personalized Match?</h2>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto">
            Our matching system goes beyond basic search to find the perfect lawyer for your unique situation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                className="bg-surface border border-border rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-textSecondary text-sm">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Process Steps */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-surface border border-border rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Our 4-Step Matching Process</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              From your initial request to scheduling consultations, here's how we find your perfect legal match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="bg-background border border-border rounded-xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                      <div className="text-white font-bold text-xl">{step.step}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-textSecondary text-sm">{step.description}</p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 w-full h-0.5 bg-border transform translate-x-1/2 -translate-y-1/2">
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-primary rotate-45"></div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Authentication Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Sign Up Required</h3>
                <p className="text-textSecondary text-sm">To submit your match request, please create an account</p>
              </div>
            </div>
            
            <p className="mb-6">
              Creating an account allows us to securely store your case details, match you with the right lawyers, 
              and keep you updated on your legal match progress.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={redirectToSignupWithData}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign Up & Continue
              </button>
              
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="w-full py-3 border-2 border-border text-text font-semibold rounded-lg hover:bg-surface/80 transition-colors"
              >
                Continue Without Saving
              </button>
              
              <div className="text-center">
                <p className="text-sm text-textSecondary">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary font-semibold hover:underline"
                    onClick={() => {
                      // Store form data before redirecting to login
                      sessionStorage.setItem('matchingFormData', JSON.stringify(formData))
                      sessionStorage.setItem('matchingRedirect', '/personalized-match')
                    }}
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Match Form */}
      <div id="match-form" className="container mx-auto px-4 mb-16">
        <div className="bg-surface border border-border rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Get Your Personalized Match</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              Fill out this secure form to start the matching process. All information is kept confidential.
            </p>
            
            {/* Authentication Status Banner */}
            {isAuthenticated ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-lg mb-4">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Signed in as {currentUser?.email}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/20 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">
                  You'll need to sign up to submit this form
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            {/* Personal Information */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="(403) 555-0123"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Calgary, AB"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Case Details */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Case Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Legal Issue *</label>
                  <select
                    name="legalIssue"
                    value={formData.legalIssue}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select your legal issue</option>
                    {legalIssues.map(issue => (
                      <option key={issue} value={issue}>{issue}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Opposing Party Name(s)</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
                    <input
                      type="text"
                      name="opposingParty"
                      value={formData.opposingParty}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Name of individual or company"
                    />
                  </div>
                  <p className="text-xs text-textSecondary mt-2">
                    Required for conflict of interest checks
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Opposing Law Firm (if known)</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
                    <input
                      type="text"
                      name="opposingLawFirm"
                      value={formData.opposingLawFirm}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Law firm name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Timeline *</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select your timeline</option>
                    {timelineOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select budget range</option>
                    {budgetOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Case Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Please describe your legal situation in detail..."
                  />
                  <p className="text-xs text-textSecondary mt-2">
                    Include relevant dates, events, and what outcome you're seeking
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Preferences */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Contact Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-4">Preferred Contact Method *</label>
                  <div className="flex flex-wrap gap-4">
                    {['email', 'phone', 'either'].map(method => (
                      <label key={method} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method}
                          checked={formData.preferredContact === method}
                          onChange={handleChange}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="capitalize">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Privacy & Confidentiality</h4>
                  <p className="text-textSecondary mb-3">
                    Your information is kept strictly confidential and is only shared with lawyers 
                    after comprehensive conflict checks. We follow Alberta Law Society rules for 
                    client confidentiality and data protection.
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">End-to-end encryption</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Strict conflict of interest screening</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Your information is never sold or shared with third parties</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    {isAuthenticated ? 'Submit Match Request' : 'Continue to Sign Up'}
                  </>
                )}
              </button>
              <p className="text-sm text-textSecondary mt-4">
                By submitting, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="container mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="relative bg-surface border border-border rounded-2xl p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Need Help With Your Request?</h2>
                <p className="text-textSecondary mb-6 max-w-2xl">
                  Our legal matching specialists are here to help you complete your request 
                  and answer any questions about the process.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/contact"
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Contact Our Team
                  </Link>
                  <Link 
                    to="/faq"
                    className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Read FAQs
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-64 h-64 rounded-full bg-gradient-primary opacity-20 flex items-center justify-center">
                  <Award className="w-32 h-32 text-primary opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
