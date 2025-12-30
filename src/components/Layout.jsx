import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useLocalStorage } from '../hooks/useLocalStorage'
import LandingGate from './LandingGate'

export default function Layout({ children }) {
  const [authState] = useLocalStorage('site_auth', null)

  // Check if user is authenticated and token hasn't expired
  const isAuthenticated = () => {
    if (!authState || !authState.authenticated) return false
    
    // Check expiration
    if (authState.expiresAt) {
      const now = new Date()
      const expiresAt = new Date(authState.expiresAt)
      return now < expiresAt
    }
    
    return true
  }

  // If not authenticated, show the landing gate
  if (!isAuthenticated()) {
    return <LandingGate />
  }

  // Otherwise, show the normal layout
  return (
    <div className="min-h-screen flex flex-col bg-background text-text">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
