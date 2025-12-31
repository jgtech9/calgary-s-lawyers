import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Phone, Building, Briefcase, Shield, Check, ArrowRight, Target, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup, signInWithGoogle } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'individual',
    agreeToTerms: false,
    subscribeNewsletter: true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [hasPrefilledData, setHasPrefilledData] = useState(false)

  useEffect(() => {
    const storedMatchingData = sessionStorage.getItem('matchingFormData')
    const matchingRedirect = sessionStorage.getItem('matchingRedirect')
    
    if (storedMatchingData) {
      try {
        const parsedData = JSON.parse(storedMatchingData)
        
        setFormData(prev => ({
          ...prev,
          firstName: parsedData.firstName || '',
          lastName: parsedData.lastName || '',
          email: parsedData.email || '',
          phone: parsedData.phone || '',
        }))
        
        setHasPrefilledData(true)
      } catch (error) {
        console.error('Error parsing stored matching data:', error)
      }
    }
    
    if (location.state?.prefillData) {
      const { prefillData } = location.state
      setFormData(prev => ({
        ...prev,
        firstName: prefillData.firstName || '',
        lastName: prefillData.lastName || '',
        email: prefillData.email || '',
        phone: prefillData.phone || '',
      }))
      setHasPrefilledData(true)
    }
  }, [location.state])

  const clearStoredMatchingData = () => {
    sessionStorage.removeItem('matchingFormData')
    sessionStorage.removeItem('matchingRedirect')
  }

  const accountTypes = [
    { id: 'individual', icon: User, label: 'Individual', description: 'Looking for legal help' },
    { id: 'business', icon: Building, label: 'Business', description: 'Corporate legal needs' },
    { id: 'lawyer', icon: Briefcase, label: 'Lawyer', description: 'Professional account' },
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})

    try {
      const displayName = `${formData.firstName.trim()} ${formData.lastName.trim()}`
      
      const result = await signup(
        formData.email,
        formData.password,
        displayName,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          accountType: formData.accountType,
          subscribeNewsletter: formData.subscribeNewsletter
        }
      )

      if (result.success) {
        clearStoredMatchingData()
        
        const matchingRedirect = sessionStorage.getItem('matchingRedirect')
        
        if (matchingRedirect) {
          sessionStorage.removeItem('matchingRedirect')
          alert('Account created successfully! You can now submit your matching request.')
          navigate('/personalized-match')
        } else {
          if (formData.accountType === 'lawyer') {
            navigate('/lawyer-dashboard')
          } else {
            navigate('/user-dashboard')
          }
        }
      } else {
        const errorMessage = result.error || 'Failed to create account'
        
        if (errorMessage.includes('email-already-in-use')) {
          setErrors({ email: 'This email is already registered. Please sign in instead.' })
        } else if (errorMessage.includes('weak-password')) {
          setErrors({ password: 'Password is too weak. Please choose a stronger password.' })
        } else if (errorMessage.includes('invalid-email')) {
          setErrors({ email: 'Please enter a valid email address.' })
        } else {
          setErrors({ general: errorMessage })
        }
      }
    } catch (err) {
      console.error('Signup error:', err)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setErrors({})

    try {
      const result = await signInWithGoogle()
      
      if (result.success) {
        clearStoredMatchingData()
        
        const matchingRedirect = sessionStorage.getItem('matchingRedirect')
        
        if (matchingRedirect) {
          sessionStorage.removeItem('matchingRedirect')
          alert('Signed in successfully! You can now submit your matching request.')
          navigate('/personalized-match')
        } else {
          if (result.isNewUser) {
            navigate('/setup-profile')
          } else {
            if (result.user?.role === 'lawyer') {
              navigate('/lawyer-dashboard')
            } else {
              navigate('/user-dashboard')
            }
          }
        }
      } else {
        setErrors({ general: result.error || 'Failed to sign in with Google' })
      }
    } catch (err) {
      console.error('Google sign-in error:', err)
      setErrors({ general: 'An unexpected error occurred with Google sign-in.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAccountTypeSelect = (typeId) => {
    setFormData(prev => ({ ...prev, accountType: typeId }))
  }

  const passwordStrength = () => {
    if (!formData.password) return { score: 0, label: 'None', color: 'border-border' }
    
    let score = 0
    if (formData.password.length >= 8) score++
    if (/[A-Z]/.test(formData.password)) score++
    if (/[0-9]/.test(formData.password)) score++
    if (/[^A-Za-z0-9]/.test(formData.password)) score++
    
    const levels = [
      { label: 'Weak', color: 'border-error' },
      { label: 'Fair', color: 'border-warning' },
      { label: 'Good', color: 'border-secondary' },
      { label: 'Strong', color: 'border-success' },
      { label: 'Very Strong', color: 'border-success' },
    ]
    
    return levels[Math.min(score, levels.length - 1)]
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface/50 to-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="inline-flex items-center gap-2 text-textSecondary hover:text-text transition-colors mb-6">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join <span className="text-primary">Calgary Lawyers</span> Today
          </h1>
          <p className="text-xl text-textSecondary max-w-2xl mx-auto">
            Create your free account to access trusted legal professionals and manage your legal journey.
          </p>
        </motion.div>

        <motion.div 
          className="bg-surface border border-border rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create Your Account</h2>
              <p className="text-textSecondary">Fill in your details to get started</p>
            </div>
          </div>

          {hasPrefilledData && (
            <motion.div 
              className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary mb-1">Matching Form Data Detected</h3>
                  <p className="text-sm text-textSecondary">
                    We've pre-filled your personal information from your matching request. 
                    Complete your account setup to submit your request.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {errors.general && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full mb-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-surface/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing up...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-border"></div>
            <span className="text-textSecondary text-sm">OR</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium mb-4">Select Account Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accountTypes.map((type) => {
                const Icon = type.icon
                const isSelected = formData.accountType === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleAccountTypeSelect(type.id)}
                    className={`p-4 border rounded-xl transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-surface/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary/20' : 'bg-surface'
                      }`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-textSecondary'}`} />
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-primary ml-auto" />}
                    </div>
                    <div className="font-semibold">{type.label}</div>
                    <div className="text-sm text-textSecondary mt-1">{type.description}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className={`w-full px-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.firstName
                      ? 'border-error focus:border-error focus:ring-error/20'
                      : 'border-border focus:border-primary focus:ring-primary/20'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-error">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  className={`w-full px-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.lastName
                      ? 'border-error focus:border-error focus:ring-error/20'
                      : 'border-border focus:border-primary focus:ring-primary/20'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-error">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-error focus:border-error focus:ring-error/20'
                        : 'border-border focus:border-primary focus:ring-primary/20'
                  }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(403) 555-0123"
                    className={`w-full pl-12 pr-4 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-error focus:border-error focus:ring-error/20'
                        : 'border-border focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-error">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a strong password"
                    className={`w-full pl-12 pr-12 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-error focus:border-error focus:ring-error/20'
                        : 'border-border focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-text"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Password strength:</span>
                      <span className={`font-medium ${
                        strength.label === 'Weak' ? 'text-error' :
                        strength.label === 'Fair' ? 'text-warning' :
                        strength.label === 'Good' ? 'text-secondary' :
                        'text-success'
                      }`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-surface border border-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${strength.color.replace('border-', 'bg-')} transition-all duration-300`}
                        style={{ width: `${(formData.password.length / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-error">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-12 py-3 bg-surface border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? 'border-error focus:border-error focus:ring-error/20'
                        : 'border-border focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-text"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-error">{errors.agreeToTerms}</p>
                  )}
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={handleChange}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">
                  Subscribe to our newsletter for legal tips and updates
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  {hasPrefilledData ? 'Complete Account & Continue' : 'Create Free Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-textSecondary">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </form>
        </motion.div>

        <motion.div 
          className="mt-8 grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            {
              title: 'Verified Lawyers Only',
              description: 'All professionals are thoroughly vetted and verified',
              icon: '✅'
            },
            {
              title: 'Free Consultations',
              description: 'Schedule initial consultations at no cost',
              icon: '💬'
            },
            {
              title: 'Secure & Private',
              description: 'Your information is protected with bank-level security',
              icon: '🔒'
            },
          ].map((benefit, index) => (
            <div key={index} className="bg-surface border border-border rounded-xl p-6 text-center">
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h3 className="font-bold mb-2">{benefit.title}</h3>
              <p className="text-sm text-textSecondary">{benefit.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
