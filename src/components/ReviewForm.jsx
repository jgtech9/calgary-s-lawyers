import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Send, User, MessageSquare, AlertCircle } from 'lucide-react'
import { useReviews } from '../context/ReviewContext'

export default function ReviewForm({ lawyerId, lawyerName = 'Unknown Lawyer' }) {
  const navigate = useNavigate()
  const { submitReview } = useReviews()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [ratingError, setRatingError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    content: '',
    anonymous: false
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate rating
    if (rating === 0) {
      setRatingError('Please select a rating before submitting')
      return
    }

    setSubmitting(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const review = {
        lawyerId: lawyerId || 'general',
        lawyerName: lawyerName,
        rating,
        ...formData,
        clientName: formData.anonymous ? 'Anonymous' : formData.name,
        date: new Date().toISOString(),
        verified: false
      }
      
      // Submit to review context
      submitReview(review)
      
      setSubmitting(false)
      setSubmitted(true)
      
      // Reset form
      setRating(0)
      setRatingError('')
      setFormData({
        name: '',
        email: '',
        title: '',
        content: '',
        anonymous: false
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    }, 1000)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleViewAdmin = () => {
    navigate('/admin-panel')
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-success/10 border border-success rounded-xl p-6 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-bold mb-2">Review Submitted!</h3>
        <p className="text-textSecondary mb-4">
          Thank you for your review. It has been added to pending reviews for admin approval.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 bg-success text-white font-semibold rounded-lg hover:bg-success/90 transition-colors"
          >
            Submit Another Review
          </button>
          <button
            onClick={handleViewAdmin}
            className="px-6 py-2 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
          >
            View Admin Panel
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Write a Review</h3>
          <p className="text-textSecondary">Share your experience with this lawyer</p>
          {lawyerName !== 'Unknown Lawyer' && (
            <p className="text-sm text-primary mt-1">Reviewing: {lawyerName}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Your Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star)
                  setRatingError('') // Clear error when rating is selected
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-warning text-warning'
                      : 'fill-border text-border'
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-lg font-semibold">
              {rating > 0 ? `${rating}.0` : 'Select rating'}
            </span>
          </div>
          {/* Warning message */}
          {ratingError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{ratingError}</span>
            </motion.p>
          )}
        </div>

        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!formData.anonymous}
              disabled={formData.anonymous}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required={!formData.anonymous}
              disabled={formData.anonymous}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Anonymous Checkbox */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
              className="rounded border-border"
            />
            <span className="text-sm">Post anonymously</span>
          </label>
          <p className="text-xs text-textSecondary mt-1">
            Your name and email will not be displayed publicly
          </p>
        </div>

        {/* Review Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Review Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary"
            placeholder="Summarize your experience"
          />
        </div>

        {/* Review Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={4}
            maxLength={500}
            className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
            placeholder="Share details of your experience with this lawyer..."
          />
          <div className="text-right text-sm text-textSecondary mt-1">
            {formData.content.length}/500 characters
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleViewAdmin}
            className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
          >
            View Admin Panel
          </button>
          <button
            type="submit"
            disabled={submitting || rating === 1}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
