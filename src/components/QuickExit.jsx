import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Shield } from 'lucide-react'

export default function QuickExit() {
  const [visible, setVisible] = useState(true)
  const [showWarning, setShowWarning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleQuickExit = () => {
    // SECURITY FIX: Use replace() instead of href to prevent back-button navigation
    // This scrubs the history and prevents users from returning to the site
    window.location.replace('https://weather.gc.ca')
  }

  // ESC Key Listener for instant exit
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleQuickExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-error rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-error" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Emergency Exit</h3>
                  <p className="text-textSecondary text-sm">
                    You are about to quickly exit this site
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-text">
                  This will immediately redirect you to a neutral site and scrub your back-button history.
                </p>
                <div className="bg-surface border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="font-semibold">Safety Tips:</span>
                  </div>
                  <ul className="text-sm text-textSecondary space-y-1">
                    <li>• Press <strong>ESC</strong> at any time for instant exit</li>
                    <li>• Clear your browser history after use</li>
                    <li>• Use private/incognito mode</li>
                    <li>• Call 911 if in immediate danger</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleQuickExit}
                  className="flex-1 px-4 py-3 bg-error text-white font-semibold rounded-lg hover:bg-error/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  Exit Now
                </button>
                <button
                  onClick={() => setShowWarning(false)}
                  className="flex-1 px-4 py-3 border border-border text-text font-semibold rounded-lg hover:bg-surface/80 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-4 left-4 z-40"
      >
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={() => setShowWarning(true)}
            className={`
              flex items-center gap-2 px-4 py-3 bg-error text-white font-semibold rounded-lg 
              shadow-lg transition-all duration-300 transform
              ${isHovered ? 'scale-105 shadow-xl shadow-error/30' : 'scale-100'}
              hover:bg-error/90 hover:shadow-2xl hover:shadow-error/40
              active:scale-95 active:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-background
            `}
            aria-label="Quick Exit - Press ESC to immediately leave this site"
          >
            <motion.div
              animate={{ rotate: isHovered ? [0, -10, 10, -10, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              <AlertTriangle className="w-5 h-5" />
            </motion.div>
            <span className="hidden sm:inline">Quick Exit (ESC)</span>
            <motion.span
              className="ml-1"
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.2 }}
            >
              🚀
            </motion.span>
          </button>

          {/* Enhanced Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10
            }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2 pointer-events-none"
          >
            <div className="bg-surface border border-border rounded-lg p-3 w-64 shadow-2xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold mb-1 text-text">Quick Exit Button</div>
                  <p className="text-sm text-textSecondary">
                    Click or press <strong>ESC</strong> to immediately leave this site. Redirects to Weather Canada and scrubs history.
                  </p>
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-textSecondary">
                      <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                      <span>Always visible for your safety</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pulsing Glow Effect */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 -z-10 bg-error/20 rounded-lg blur-xl"
            />
          )}

          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center hover:bg-surface/80 transition-all duration-200 transform hover:scale-110 active:scale-95"
            aria-label="Close quick exit button"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </>
  )
}
