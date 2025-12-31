import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ReviewForm from './components/ReviewForm';
import QuickExit from './components/QuickExit';
import Pagination from './components/Pagination';
import ProtectedRoute  from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import { ReviewProvider } from './context/ReviewContext';

// Public pages
import Home from './pages/Home';
import AllLawyers from './pages/AllLawyers';
import About from './pages/About';
import Contact from './pages/Contact';
import HowItWorks from './pages/HowItWorks';
import Reviews from './pages/Reviews';
import Blog from './pages/Blog';
import FAQs from './pages/FAQs';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CookiePolicy from './pages/CookiePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Press from './pages/Press';
import Careers from './pages/Careers';
import Support from './pages/Support';

// Legal area pages
import FamilyLaw from './pages/FamilyLaw';
import CriminalDefense from './pages/CriminalDefense';
import RealEstate from './pages/RealEstate';
import CorporateLaw from './pages/CorporateLaw';
import EmploymentLaw from './pages/EmploymentLaw';
import CivilLaw from './pages/CivilLaw';

// Auth pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected pages
import LawyerDashboard from './pages/LawyerDashboard';
import Admin from './pages/Admin';
import Notifications from './pages/Notifications';
import PersonalizedMatch from './pages/PersonalizedMatch';
import UserDashboard from './pages/UserDashboard';

// Development-only pages
import TestFirebase from './pages/TestFirebase';
import DebugMigration from './pages/DebugMigration';

function App() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(null);

  // Function to execute data migration
  const executeDataMigration = async () => {
    if (import.meta.env.DEV) {
      setIsMigrating(true);
      setMigrationStatus({ type: 'info', message: 'Starting data migration...' });
      
      try {
        // Use enhanced migration function
        const { enhancedMigrateLawyers } = await import('./utils/debug-migration');
        const result = await enhancedMigrateLawyers();
        
        if (result.success) {
          setMigrationStatus({ 
            type: 'success', 
            message: `✅ Data migration completed successfully! ${result.totalMigrated} lawyers migrated to Firestore.` 
          });
        } else {
          setMigrationStatus({ 
            type: 'error', 
            message: `❌ Migration failed: ${result.errors?.[0]?.error || 'Unknown error'}` 
          });
        }
      } catch (error) {
        setMigrationStatus({ 
          type: 'error', 
          message: `❌ Migration error: ${error.message}` 
        });
      } finally {
        setIsMigrating(false);
      }
    }
  };

  // Auto-execute migration in development mode on component mount
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔧 Development mode detected. Data migration available.');
      // Uncomment the line below to auto-execute migration on load
      // executeDataMigration();
    }
  }, []);

  return (
    <ThemeProvider>
      <ReviewProvider>
        <Router>
          <div className="min-h-screen bg-background text-text flex flex-col">
            <ScrollToTop />
            <QuickExit />
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="all-lawyers" element={<AllLawyers />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="blog" element={<Blog />} />
                <Route path="faqs" element={<FAQs />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="cookie-policy" element={<CookiePolicy />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="press" element={<Press />} />
                <Route path="careers" element={<Careers />} />
                <Route path="support" element={<Support />} />

                {/* Legal Area Pages */}
                <Route path="family-law" element={<FamilyLaw />} />
                <Route path="criminal-defense" element={<CriminalDefense />} />
                <Route path="real-estate" element={<RealEstate />} />
                <Route path="corporate-law" element={<CorporateLaw />} />
                <Route path="employment-law" element={<EmploymentLaw />} />
                <Route path="civil-law" element={<CivilLaw />} />

                {/* Auth Routes */}
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />

                {/* Protected Routes - Lawyers Only */}
                <Route
                  path="lawyer-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['lawyer', 'admin']}>
                      <LawyerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes - Admin Only */}
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes - All Authenticated Users */}
                <Route
                  path="notifications"
                  element={
                    <ProtectedRoute redirectTo="/login">
                      <Notifications />
                    </ProtectedRoute>
                  }
                />

								 {/* Protected Routes - All Authenticated Users */}
                <Route
                  path="signin"
                  element={
                    <ProtectedRoute redirectTo="/user-dashboard">
                      <Notifications />
                    </ProtectedRoute>
                  }
                />

                {/* Personalized Match - Public Route (auth handled internally) */}
                <Route path="personalized-match" element={<PersonalizedMatch />} />

                {/* Development-only Routes */}
                {import.meta.env.DEV && (
                  <>
                    <Route path="test-firebase" element={<TestFirebase />} />
                    <Route path="debug-migration" element={<DebugMigration />} />
                  </>
                )}

                {/* 404 Page */}
                <Route
                  path="*"
                  element={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                        <a
                          href="/"
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Return Home
                        </a>
                      </div>
                    </div>
                  }
                />
              </Route>
            </Routes>

            {/* Development Migration Controls */}
            {import.meta.env.DEV && (
              <div className="fixed bottom-4 right-4 z-50">
                <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700 max-w-sm">
                  <h3 className="font-bold text-lg mb-2">🔧 Development Tools</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-300 mb-1">Data Migration</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Enhanced migration with chunking & diagnostics
                      </p>
                      
                      <button
                        onClick={executeDataMigration}
                        disabled={isMigrating}
                        className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                          isMigrating 
                            ? 'bg-gray-700 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        {isMigrating ? 'Migrating...' : 'Execute Data Migration'}
                      </button>
                    </div>

                    {migrationStatus && (
                      <div className={`p-3 rounded text-sm ${
                        migrationStatus.type === 'success' ? 'bg-green-900/30 border border-green-800' :
                        migrationStatus.type === 'error' ? 'bg-red-900/30 border border-red-800' :
                        'bg-blue-900/30 border border-blue-800'
                      }`}>
                        {migrationStatus.message}
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-700">
                      <div className="flex flex-col gap-2">
                        <a 
                          href="/test-firebase" 
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Test Firebase Connection →
                        </a>
                        <a 
                          href="/debug-migration" 
                          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Debug Migration Issues →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Router>
      </ReviewProvider>
    </ThemeProvider>
  );
}

export default App;
