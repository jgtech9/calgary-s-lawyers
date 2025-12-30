import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Shield, User, ArrowRight, Building, Briefcase, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Constants for routes
const ROUTES = {
  HOME: '/',
  USER_DASHBOARD: '/user-dashboard',
  LAWYER_DASHBOARD: '/lawyer-dashboard',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password'
}

export default function Login() {
  const navigate = useNavigate()
  const { login, signInWithGoogle } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Centralized redirect logic - same as Signup page
  const handleSuccessRedirect = (user) => {
    // Check user role/accountType from the returned user object
    const userRole = user?.role || user?.accountType || 'user'
    
    if (userRole === 'lawyer') {
      navigate(ROUTES.LAWYER_DASHBOARD)
    } else {
      navigate(ROUTES.USER_DASHBOARD)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // ✅ Redirect to appropriate dashboard based on user role
        handleSuccessRedirect(result.user)
      } else {
        setError(result.error || 'Failed to sign in')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signInWithGoogle()
      
      if (result.success) {
        // ✅ Redirect to appropriate dashboard based on user role
        handleSuccessRedirect(result.user)
      } else {
        setError(result.error || 'Failed to sign in with Google')
      }
    } catch (err) {
      console.error('Google sign-in error:', err)
      setError('An unexpected error occurred with Google sign-in.')
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
  }

  const userTypes = [
    { icon: User, label: 'Individual', description: 'Looking for legal help' },
    { icon: Building, label: 'Business', description: 'Corporate legal needs' },
    { icon: Briefcase, label: 'Lawyer', description: 'Professional account' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface/50 to-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-textSecondary hover:text-text transition-colors mb-6">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome Back to <span className="text-primary">Calgary Lawyers</span>
          </h1>
          <p className="text-xl text-textSecondary max-w-2xl mx-auto">
            Access your account to manage consultations, save lawyers, and track your legal journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Login Form Card */}
          <motion.div 
            className="bg-surface border border-border rounded-2xl p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Sign In to Your Account</h2>
                <p className="text-textSecondary">Enter your credentials to continue</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-error">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
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
                    className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Password Field */}
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
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-text"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Remember me</span>
                  </label>
                  <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-surface text-textSecondary">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="py-3 border border-border rounded-lg hover:bg-surface/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="py-3 border border-border rounded-lg hover:bg-surface/80 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-textSecondary">
                Don't have an account?{' '}
                <Link to={ROUTES.SIGNUP} className="text-primary font-semibold hover:underline">
                  Sign up for free
                </Link>
              </p>
            </form>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Account Types Info */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">What type of account do you need?</h3>
              <div className="space-y-4">
                {userTypes.map((type, index) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={index}
                      className="w-full p-4 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{type.label}</div>
                          <div className="text-sm text-textSecondary">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Benefits of Your Account</h3>
              <div className="space-y-4">
                {[
                  { text: 'Save and compare lawyers', icon: '⭐' },
                  { text: 'Schedule free consultations', icon: '📅' },
                  { text: 'Track your legal cases', icon: '📊' },
                  { text: 'Get personalized recommendations', icon: '🎯' },
                  { text: 'Access exclusive resources', icon: '🔒' },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xl">{benefit.icon}</span>
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Help */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-error" />
                </div>
                <div>
                  <h4 className="font-bold">Need Immediate Legal Help?</h4>
                  <p className="text-sm text-textSecondary">24/7 emergency support</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error mb-2">(403) 555-HELP</div>
                <p className="text-sm text-textSecondary">Available 24 hours a day, 7 days a week</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
