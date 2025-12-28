import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, MessageSquare, Filter, ChevronDown, Check } from 'lucide-react'

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
    verified: true
  },
  {
    id: 3,
    name: 'David Wilson',
    rating: 5,
    date: '2024-01-05',
    title: 'Saved My Business',
    content: 'Facing a major lawsuit that threatened to shut down my business. Emily\'s strategic approach and relentless dedication resulted in a favorable settlement. Forever grateful.',
    helpful: 32,
    verified: true
  },
  {
    id: 4,
    name: 'Anonymous',
    rating: 3,
    date: '2024-01-02',
    title: 'Good but Expensive',
    content: 'Competent lawyer but hourly rates were higher than expected. Communication was good but could be more responsive.',
    helpful: 8,
    verified: false
  }
]

export default function ReviewList({ lawyerId }) {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [helpfulClicked, setHelpfulClicked] = useState([])

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true
    if (filter === '5-star') return review.rating === 5
    if (filter === '4-star') return review.rating === 4
    if (filter === '3-star') return review.rating === 3
    if (filter === 'with-response') return review.response
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
      // In a real app, you would update the helpful count in your database
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Client Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating)
                          ? 'fill-warning text-warning'
                          : 'fill-border text-border'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-textSecondary">
                  Based on {reviews.length} reviews
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Sort */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter & Sort
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface border border-border rounded-xl p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rating Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Filter by Rating</h4>
                  <div className="space-y-2">
                    {['all', '5-star', '4-star', '3-star', 'with-response'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setFilter(option)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                          filter === option
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-surface/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {option === 'all' && 'All Reviews'}
                          {option === '5-star' && (
                            <>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                                ))}
                              </div>
                              <span>({ratingDistribution[5]})</span>
                            </>
                          )}
                          {option === '4-star' && (
                            <>
                              <div className="flex">
                                {[...Array(4)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                                ))}
                              </div>
                              <span>({ratingDistribution[4]})</span>
                            </>
                          )}
                          {option === '3-star' && (
                            <>
                              <div className="flex">
                                {[...Array(3)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                                ))}
                              </div>
                              <span>({ratingDistribution[3]})</span>
                            </>
                          )}
                          {option === 'with-response' && 'With Lawyer Response'}
                        </div>
                        {filter === option && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h4 className="font-semibold mb-3">Sort by</h4>
                  <div className="space-y-2">
                    {['newest', 'highest', 'most-helpful'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setSortBy(option)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                          sortBy === option
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-surface/80'
                        }`}
                      >
                        <span>
                          {option === 'newest' && 'Newest First'}
                          {option === 'highest' && 'Highest Rated'}
                          {option === 'most-helpful' && 'Most Helpful'}
                        </span>
                        {sortBy === option && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Distribution */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <h4 className="font-semibold mb-3">Rating Breakdown</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm w-4">{stars}</span>
                <Star className="w-4 h-4 fill-warning text-warning" />
              </div>
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full"
                  style={{
                    width: `${(ratingDistribution[stars] / reviews.length) * 100}%`
                  }}
                />
              </div>
              <div className="text-sm text-textSecondary w-12 text-right">
                {ratingDistribution[stars]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-surface border border-border rounded-xl p-6"
            >
              {/* Review Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold">{review.name}</div>
                    {review.verified && (
                      <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                        Verified Client
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-textSecondary">
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
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <h3 className="font-bold text-lg mb-2">{review.title}</h3>
              <p className="text-textSecondary mb-4">{review.content}</p>

              {/* Helpful Button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleHelpful(review.id)}
                  disabled={helpfulClicked.includes(review.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
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
                  className="mt-4 pl-4 border-l-2 border-primary"
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
        </AnimatePresence>
      </div>

      {/* Load More */}
      {filteredReviews.length > 0 && (
        <div className="text-center pt-6">
          <button className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  )
}
