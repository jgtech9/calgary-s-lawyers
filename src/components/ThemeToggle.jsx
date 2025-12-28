import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-surface border border-border flex items-center p-1 transition-colors hover:bg-surface/80"
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        animate={{
          x: theme === 'light' ? 0 : 26,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {theme === 'light' ? (
          <Sun className="w-4 h-4 text-white" />
        ) : (
          <Moon className="w-4 h-4 text-white" />
        )}
      </motion.div>
      
      {/* Background indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className="w-4 h-4 text-textSecondary" />
        <Moon className="w-4 h-4 text-textSecondary" />
      </div>
    </motion.button>
  )
}
