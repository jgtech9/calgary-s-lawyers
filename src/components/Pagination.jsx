import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage,
  className = ''
}) {
  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  const pageNumbers = getPageNumbers()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Results Count */}
      <div className="text-sm text-textSecondary">
        Showing <span className="font-semibold text-text">{startItem}-{endItem}</span> of{' '}
        <span className="font-semibold text-text">{totalItems}</span> lawyers
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface hover:bg-surface/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNumber, index) => (
            <React.Fragment key={index}>
              {pageNumber === '...' ? (
                <span className="flex items-center justify-center w-10 h-10 text-textSecondary">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              ) : (
                <motion.button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all ${
                    currentPage === pageNumber
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'border border-border bg-surface hover:bg-surface/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Page ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                >
                  {pageNumber}
                </motion.button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface hover:bg-surface/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-textSecondary">Show:</span>
        <select
          onChange={(e) => {
            // This would typically update itemsPerPage in parent
            const newPerPage = parseInt(e.target.value)
            // Reset to page 1 when changing items per page
            onPageChange(1, newPerPage)
          }}
          className="px-3 py-1.5 text-sm border border-border bg-surface rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          defaultValue="12"
        >
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
        </select>
      </div>
    </div>
  )
}
