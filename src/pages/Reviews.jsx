import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ThumbsUp, MessageSquare, Filter, ChevronDown, Check, Shield, Edit, Trash2 } from 'lucide-react'
import ReviewForm from '../components/ReviewForm'

const reviews = [
  {
    id: 1,
    name: 'Michael Rodriguez',
    rating: 5,
    date: '2024-01-15',
    title: 'Exceptional Service During Difficult Times',
    content: 'Sarah was incredibly professional and compassionate during my divorce proceedings. She explained everything clearly and fought hard for my rights. Highly recommended!',
    helpful: 24,
    verified: true,
    lawyer: 'Sarah Chen',
    category: 'Family Law',
    response: {
      lawyer: 'Sarah Chen',
      date: '2024-01-16',
      content: 'Thank you for your kind words, Michael. It was a pleasure helping you through this challenging time. Wishing you all the best moving forward.'
    }
  },
  {
    id: 2,
    name: 'Jennifer Park',
    rating: 4,
    date: '2024-01-10',
    title: 'Great Corporate Advice',
    content: 'Robert helped us navigate complex corporate regulations for our startup. His expertise saved us time and money. Would definitely work with him again.',
    helpful: 18,
    verified: true,
    lawyer: 'Robert Kim',
    category: 'Corporate Law'
  },
  {
    id: 3,
    name: 'David Wilson',
    rating: 5,
    date: '2024-01-05',
    title: 'Saved My Business',
    content: 'Facing a major lawsuit that threatened to shut down my business. Emily\'s strategic approach and relentless dedication resulted in a favorable settlement. Forever grateful.',
    helpful: 32,
    verified: true,
    lawyer: 'Emily Johnson',
    category: 'Corporate Law'
  },
  {
    id: 4,
    name: 'Anonymous',
    rating: 3,
    date: '2024-01-02',
    title: 'Good but Expensive',
    content: 'Competent lawyer but hourly rates were higher than expected. Communication was good but could be more responsive.',
    helpful: 8,
    verified: false,
    lawyer: 'Michael Brown',
    category: 'Real Estate'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    rating: 5,
    date: '2023-12-28',
    title: 'Excellent Employment Lawyer',
    content: 'Lisa helped me navigate a wrongful termination case. She was knowledgeable, responsive, and got me a great settlement. Highly recommend!',
    helpful: 15,
    verified: true,
    lawyer: 'Lisa Wang',
    category: 'Employment Law'
  },
  {
    id: 6,
    name: 'Website User',
    rating: 4,
    date: '2024-01-12',
    title: 'Great Directory Service',
    content: 'Found the perfect lawyer for my needs through this website. The verification system gave me confidence in my choice.',
    helpful: 12,
    verified: true,
    lawyer: 'Website Review',
    category: 'Website Feedback'
  }
]

export default function Reviews() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [helpfulClicked, setHelpfulClicked] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Scroll to top when review form is shown
  useEffect(() => {
    if (showReviewForm) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [showReviewForm])

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true
    if (filter === '5-star') return review.rating === 5
    if (filter === '4-star') return review.rating === 4
    if (filter === '3-star') return review.rating === 3
    if (filter === 'verified') return review.verified
    if (filter === 'with-response') return review.response
    if (filter === 'website') return review.category === 'Website Feedback'
    return true
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date)
    if (sortBy === 'highest') return b.rating - a.rating
    if (sortBy === 'most-helpful') return b.helpful - a.helpful
    return 0
  })

  const handleHelpful = (reviewId) => {
    if (!helpfulClicked.includes(reviewId)) {
      setHelpfulClicked([...helpfulClicked, reviewId])
    }
  }

  const handleAdminAction = (action, reviewId) => {
    switch (action) {
      case 'edit':
        alert(`Edit review ${reviewId}`)
        break
      case 'delete':
        if (window.confirm('Are you sure you want to delete this review?')) {
          alert(`Deleted review ${reviewId}`)
        }
        break
    }
  }

  const handleShowReviewForm = () => {
    setShowReviewForm(true)
    // Scroll to top immediately
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Client <span className="text-primary">Reviews</span>
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto">
          Read honest reviews from verified clients and share your own experience with Calgary lawyers.
        </p>
      </div>

      {/* Stats & CTA */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? 'fill-warning text-warning'
                    : 'fill-border text-border'
                }`}
              />
            ))}
          </div>
          <div className="text-textSecondary">Average Rating</div>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <div className="text-4xl font-bold mb-2">{reviews.length}</div>
          <div className="text-textSecondary">Verified Reviews</div>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-textSecondary mb-4">Share your experience</p>
            <button
              onClick={handleShowReviewForm}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Submit Your Review
            </button>
          </div>
        </div>
      </div>

      {/* Review Form Section */}
      {showReviewForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Write Your Review</h2>
            <button
              onClick={() => setShowReviewForm(false)}
              className="text-textSecondary hover:text-text"
            >
              Close
            </button>
          </div>
          <ReviewForm />
        </motion.div>
      )}

      {/* Filter & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            {['all', '5-star', '4-star', '3-star', 'verified', 'with-response', 'website'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === option
                    ? option === '5-star' ? 'bg-warning text-white' :
                      option === '4-star' ? 'bg-warning/80 text-white' :
                      option === '3-star' ? 'bg-warning/60 text-white' :
                      'bg-primary text-white'
                    : 'bg-surface border border-border hover:bg-surface/80'
                }`}
              >
                {option === 'all' && 'All Reviews'}
                {option === '5-star' && '5 Stars'}
                {option === '4-star' && '4 Stars'}
                {option === '3-star' && '3 Stars'}
                {option === 'verified' && 'Verified Only'}
                {option === 'with-response' && 'With Response'}
                {option === 'website' && 'Website Reviews'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="most-helpful">Most Helpful</option>
          </select>
          
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="px-4 py-2 text-sm bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors"
          >
            {isAdmin ? 'Exit Admin' : 'Admin Mode'}
          </button>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">Rating Breakdown</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-20">
                <span className="text-sm">{stars}</span>
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="text-xs text-textSecondary">({ratingDistribution[stars]})</span>
              </div>
              <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full"
                  style={{
                    width: `${(ratingDistribution[stars] / reviews.length) * 100}%`
                  }}
                />
              </div>
              <div className="text-sm text-textSecondary w-16 text-right">
                {Math.round((ratingDistribution[stars] / reviews.length) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-surface border border-border rounded-xl p-6"
          >
            {/* Review Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-semibold">{review.name}</div>
                  {review.verified && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                      <Shield className="w-3 h-3" />
                      Verified Client
                    </span>
                  )}
                  {review.category === 'Website Feedback' && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                      Website Review
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-textSecondary">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-warning text-warning'
                            : 'fill-border text-border'
                        }`}
                      />
                    ))}
                  </div>
                  <div>{new Date(review.date).toLocaleDateString()}</div>
                  {review.lawyer && review.lawyer !== 'Website Review' && (
                    <div className="font-medium text-primary">{review.lawyer}</div>
                  )}
                  {review.category && (
                    <div className="px-2 py-0.5 bg-surface border border-border rounded-full text-xs">
                      {review.category}
                    </div>
                  )}
                </div>
              </div>
              
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdminAction('edit', review.id)}
                    className="p-2 hover:bg-surface/80 rounded-lg transition-colors"
                    aria-label="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAdminAction('delete', review.id)}
                    className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Review Content */}
            <h3 className="font-bold text-lg mb-3">{review.title}</h3>
            <p className="text-textSecondary mb-6">{review.content}</p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleHelpful(review.id)}
                disabled={helpfulClicked.includes(review.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  helpfulClicked.includes(review.id)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-surface/80'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>

              {review.response && (
                <div className="flex items-center gap-2 text-primary">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Lawyer responded</span>
                </div>
              )}
            </div>

            {/* Lawyer Response */}
            {review.response && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pl-4 border-l-2 border-primary"
              >
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-semibold text-primary">
                      Response from {review.response.lawyer}
                    </div>
                    <span className="text-xs text-textSecondary">
                      {new Date(review.response.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-textSecondary">{review.response.content}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface border border-border flex items-center justify-center">
            <MessageSquare className="w-12 h-12 text-textSecondary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No reviews found</h3>
          <p className="text-textSecondary mb-6">
            Try changing your filters or be the first to submit a review.
          </p>
          <button
            onClick={handleShowReviewForm}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Submit First Review
          </button>
        </div>
      )}

      {/* Load More / Bottom Button */}
      {filteredReviews.length > 0 && (
        <div className="text-center pt-8">
          <button
            onClick={handleShowReviewForm}
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Submit Your Review
          </button>
        </div>
      )}
    </div>
  )
}
