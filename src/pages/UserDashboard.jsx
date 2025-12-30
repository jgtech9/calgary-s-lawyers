import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Star, 
  Clock, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Search, 
  Bell, 
  Settings, 
  ChevronDown,
  Award,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Heart,
  Briefcase,
  Home,
  MapPin,
  Phone,
  Mail,
  Edit,
  Eye,
  Download,
  Share,
  Filter,
  MoreVertical,
  Plus,
  X,
  Check,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function UserDashboard() {
  const navigate = useNavigate()
  const { currentUser, userRole, logout } = useAuth()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [notifications, setNotifications] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [savedLawyers, setSavedLawyers] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Use local storage for user-specific data
  const [userPreferences, setUserPreferences] = useLocalStorage(
    `user_preferences_${currentUser?.uid || 'anonymous'}`,
    {
      theme: 'dark',
      notifications: true,
      emailUpdates: true,
      savedSearches: [],
      favoriteCategories: []
    }
  )

  const [userDashboardData, setUserDashboardData] = useLocalStorage(
    `dashboard_data_${currentUser?.uid || 'anonymous'}`,
    {
      lastVisit: null,
      viewCount: 0,
      savedLawyers: [],
      recentSearches: [],
      appointmentHistory: []
    }
  )

  // Initialize user-specific data on component mount
  useEffect(() => {
    if (currentUser) {
      // Update last visit and view count
      setUserDashboardData(prev => ({
        ...prev,
        lastVisit: new Date().toISOString(),
        viewCount: (prev.viewCount || 0) + 1
      }))

      // Load user-specific data from local storage
      loadUserData()
    }
  }, [currentUser])

  const loadUserData = () => {
    setIsLoading(true)
    
    // Simulate loading user-specific data
    setTimeout(() => {
      // Mock notifications - unique per user
      setNotifications([
        {
          id: 1,
          title: 'Welcome to Your Dashboard',
          message: `Welcome back, ${currentUser?.displayName || 'User'}! Your personalized legal dashboard is ready.`,
          time: 'Just now',
          read: false,
          type: 'welcome'
        },
        {
          id: 2,
          title: 'New Lawyer Match',
          message: 'We found 3 lawyers that match your criteria',
          time: '2 hours ago',
          read: false,
          type: 'match'
        },
        {
          id: 3,
          title: 'Appointment Confirmed',
          message: 'Your consultation with John Smith is confirmed for tomorrow',
          time: '1 day ago',
          read: true,
          type: 'appointment'
        },
        {
          id: 4,
          title: 'Document Ready',
          message: 'Your legal document is ready for review',
          time: '2 days ago',
          read: true,
          type: 'document'
        }
      ])

      // Mock recent activity - based on user's history
      setRecentActivity([
        {
          id: 1,
          action: 'Searched for "Family Law"',
          time: 'Today, 10:30 AM',
          icon: Search
        },
        {
          id: 2,
          action: 'Saved lawyer profile',
          time: 'Yesterday, 3:45 PM',
          icon: Heart
        },
        {
          id: 3,
          action: 'Scheduled consultation',
          time: '2 days ago',
          icon: Calendar
        },
        {
          id: 4,
          action: 'Completed intake form',
          time: '3 days ago',
          icon: FileText
        }
      ])

      // Mock saved lawyers - unique to user
      setSavedLawyers([
        {
          id: 1,
          name: 'Sarah Johnson',
          specialty: 'Family Law',
          rating: 4.9,
          reviews: 127,
          experience: '15 years',
          location: 'Downtown Calgary',
          consultationFee: 'Free',
          isAvailable: true,
          image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg',
          savedAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Michael Chen',
          specialty: 'Corporate Law',
          rating: 4.8,
          reviews: 89,
          experience: '12 years',
          location: 'Beltline',
          consultationFee: '$150',
          isAvailable: true,
          image: 'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg',
          savedAt: '2024-01-10'
        }
      ])

      // Mock upcoming appointments - user-specific
      setUpcomingAppointments([
        {
          id: 1,
          lawyerName: 'Sarah Johnson',
          specialty: 'Family Law',
          date: 'Tomorrow',
          time: '2:00 PM',
          type: 'Initial Consultation',
          status: 'confirmed',
          duration: '30 min',
          lawyerId: 1
        },
        {
          id: 2,
          lawyerName: 'Robert Williams',
          specialty: 'Real Estate',
          date: 'Dec 20',
          time: '11:00 AM',
          type: 'Follow-up',
          status: 'pending',
          duration: '45 min',
          lawyerId: 3
        }
      ])

      setIsLoading(false)
    }, 1000)
  }

  const stats = [
    { icon: Target, value: '3', label: 'Active Cases', color: 'text-primary', change: '+1' },
    { icon: MessageSquare, value: '5', label: 'Messages', color: 'text-secondary', change: '+2' },
    { icon: Calendar, value: '2', label: 'Upcoming', color: 'text-accent', change: '0' },
    { icon: Star, value: '4.8', label: 'Avg. Rating', color: 'text-warning', change: '+0.2' }
  ]

  const quickActions = [
    { icon: Search, label: 'Find a Lawyer', description: 'Search our directory', color: 'bg-primary/10 text-primary', path: '/all-lawyers' },
    { icon: FileText, label: 'Legal Forms', description: 'Access templates', color: 'bg-secondary/10 text-secondary', path: '/legal-forms' },
    { icon: Calendar, label: 'Schedule', description: 'Book consultation', color: 'bg-accent/10 text-accent', path: '/schedule' },
    { icon: MessageSquare, label: 'Messages', description: 'Contact lawyers', color: 'bg-success/10 text-success', path: '/messages' }
  ]

  const legalResources = [
    { title: 'Understanding Family Law', category: 'Family Law', readTime: '5 min', icon: BookOpen },
    { title: 'Real Estate Buying Guide', category: 'Real Estate', readTime: '8 min', icon: Home },
    { title: 'Employment Rights in Alberta', category: 'Employment', readTime: '6 min', icon: Briefcase },
    { title: 'Small Claims Court Process', category: 'Civil Law', readTime: '10 min', icon: Award }
  ]

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const saveLawyer = (lawyer) => {
    setSavedLawyers(prev => {
      const exists = prev.find(l => l.id === lawyer.id)
      if (!exists) {
        const updated = [...prev, { ...lawyer, savedAt: new Date().toISOString() }]
        // Update local storage
        setUserDashboardData(prevData => ({
          ...prevData,
          savedLawyers: updated
        }))
        return updated
      }
      return prev
    })
  }

  const removeSavedLawyer = (lawyerId) => {
    setSavedLawyers(prev => {
      const updated = prev.filter(l => l.id !== lawyerId)
      // Update local storage
      setUserDashboardData(prevData => ({
        ...prevData,
        savedLawyers: updated
      }))
      return updated
    })
  }

  const updateUserPreferences = (updates) => {
    setUserPreferences(prev => ({
      ...prev,
      ...updates
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading your personalized dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-text">Calgary Lawyers</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:text-text hover:bg-surface/80'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('lawyers')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'lawyers'
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:text-text hover:bg-surface/80'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  My Lawyers
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'appointments'
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:text-text hover:bg-surface/80'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'documents'
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:text-text hover:bg-surface/80'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'messages'
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:text-text hover:bg-surface/80'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              <div className="relative group">
                <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface/80">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {currentUser?.displayName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-textSecondary" />
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-4 border-b border-border">
                    <p className="font-semibold text-text">
                      {currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-sm text-textSecondary">
                      {currentUser?.email || 'user@example.com'}
                    </p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 rounded-lg"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/10 border border-border rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">
                Welcome back, {currentUser?.displayName || 'User'} 👋
              </h1>
              <p className="text-textSecondary">
                Here's your personalized legal dashboard. Track cases, manage appointments, and connect with lawyers.
              </p>
              <div className="mt-2 text-sm text-textSecondary">
                Last visit: {userDashboardData.lastVisit ? new Date(userDashboardData.lastVisit).toLocaleDateString() : 'First visit'}
                • Views: {userDashboardData.viewCount}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/personalized-match"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Target className="w-4 h-4" />
                Find My Lawyer
              </Link>
              <Link 
                to="/all-lawyers"
                className="flex items-center gap-2 px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors"
              >
                <Search className="w-4 h-4" />
                Browse Directory
              </Link>
              <Link 
                to="/contact"
                className="flex items-center gap-2 px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Get Help
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-text">{stat.value}</div>
                      <div className="text-sm text-textSecondary">{stat.label}</div>
                    </div>
                    <div className={`w-10 h-10 rounded-full ${stat.color}/10 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  {stat.change && (
                    <div className="mt-2 text-xs text-textSecondary">
                      <span className="text-success">↑ {stat.change}</span> from last week
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">Quick Actions</h2>
                <Link to="/all-lawyers" className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
                  View all
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <Link
                      to={action.path}
                      className="block p-4 border border-border rounded-xl hover:border-primary/50 hover:bg-surface/50 transition-all"
                    >
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="font-semibold text-text mb-1">{action.label}</div>
                      <div className="text-sm text-textSecondary">{action.description}</div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Saved Lawyers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-text">Saved Lawyers</h2>
                  <p className="text-textSecondary">Your favorite legal professionals</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-textSecondary">
                    {savedLawyers.length} saved
                  </span>
                  <Link to="/saved-lawyers" className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
                    View all
                    <ChevronDown className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="space-y-4">
                {savedLawyers.length > 0 ? (
                  savedLawyers.map((lawyer, index) => (
                    <motion.div
                      key={lawyer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 border border-border rounded-xl hover:bg-surface/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={lawyer.image}
                            alt={lawyer.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-text truncate">{lawyer.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">{lawyer.rating}</span>
                            <span className="text-xs text-textSecondary">({lawyer.reviews})</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-textSecondary mb-2">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {lawyer.specialty}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lawyer.experience}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lawyer.location}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              lawyer.isAvailable 
                                ? 'bg-success/10 text-success'
                                : 'bg-error/10 text-error'
                            }`}>
                              {lawyer.isAvailable ? 'Available' : 'Busy'}
                            </span>
                            <span className="text-sm text-textSecondary">
                              Consultation: {lawyer.consultationFee}
                            </span>
                            <span className="text-xs text-textSecondary">
                              Saved: {new Date(lawyer.savedAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                              <Calendar className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => removeSavedLawyer(lawyer.id)}
                              className="p-2 text-error hover:bg-error/10 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-textSecondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text mb-2">No saved lawyers yet</h3>
                    <p className="text-textSecondary mb-6">Start exploring our directory to find legal professionals</p>
                    <Link 
                      to="/all-lawyers"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      <Search className="w-4 h-4" />
                      Browse Lawyers
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-text">Upcoming Appointments</h2>
                  <p className="text-textSecondary">Your scheduled consultations</p>
                </div>
                <Link to="/appointments" className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
                  View all
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border border-border rounded-xl hover:bg-surface/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-text">{appointment.lawyerName}</h3>
                          <p className="text-sm text-textSecondary">{appointment.specialty}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          appointment.status === 'confirmed'
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-textSecondary" />
                          <div>
                            <div className="text-sm font-medium text-text">{appointment.date}</div>
                            <div className="text-xs text-textSecondary">Date</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-textSecondary" />
                          <div>
                            <div className="text-sm font-medium text-text">{appointment.time}</div>
                            <div className="text-xs text-textSecondary">Time</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-textSecondary" />
                          <div>
                            <div className="text-sm font-medium text-text">{appointment.type}</div>
                            <div className="text-xs text-textSecondary">Type</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-textSecondary" />
                          <div>
                            <div className="text-sm font-medium text-text">{appointment.duration}</div>
                            <div className="text-xs text-textSecondary">Duration</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                          Join Meeting
                        </button>
                        <button className="flex-1 px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors">
                          Reschedule
                        </button>
                        <button className="p-2 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-textSecondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text mb-2">No upcoming appointments</h3>
                    <p className="text-textSecondary mb-6">Schedule your first consultation with a lawyer</p>
                    <Link 
                      to="/schedule"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Consultation
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-text text-lg">
                    {currentUser?.displayName || 'User'}
                  </h3>
                  <p className="text-textSecondary">Client Account</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">Verified</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-textSecondary">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{currentUser?.email || 'user@example.com'}</span>
                </div>
                <div className="flex items-center gap-3 text-textSecondary">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">(403) 555-0123</span>
                </div>
                <div className="flex items-center gap-3 text-textSecondary">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Calgary, AB</span>
                </div>
              </div>
              
              <button 
                onClick={() => updateUserPreferences({ theme: userPreferences.theme === 'dark' ? 'light' : 'dark' })}
                className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                <Settings className="w-4 h-4" />
                {userPreferences.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-text">Recent Activity</h3>
                <Link to="/activity" className="text-primary hover:text-primary/80 text-sm">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-text">{activity.action}</p>
                        <p className="text-xs text-textSecondary">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-text">Notifications</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearAllNotifications}
                    className="text-xs text-textSecondary hover:text-text"
                  >
                    Clear all
                  </button>
                  <Link to="/notifications" className="text-primary hover:text-primary/80 text-sm">
                    View all
                  </Link>
                </div>
              </div>
              
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg border ${
                        notification.read 
                          ? 'border-border bg-surface/50' 
                          : 'border-primary/20 bg-primary/5'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-text text-sm">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary"></span>
                            )}
                          </div>
                          <p className="text-xs text-textSecondary mb-2">
                            {notification.message}
                          </p>
                          <span className="text-xs text-textSecondary">
                            {notification.time}
                          </span>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="text-xs text-primary hover:text-primary/80"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Bell className="w-8 h-8 text-textSecondary mx-auto mb-2" />
                    <p className="text-sm text-textSecondary">No notifications</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Legal Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <h3 className="font-bold text-text mb-6">Legal Resources</h3>
              
              <div className="space-y-4">
                {legalResources.map((resource, index) => {
                  const Icon = resource.icon
                  return (
                    <div key={index} className="p-3 border border-border rounded-lg hover:bg-surface/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-text text-sm mb-1">
                            {resource.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-textSecondary">
                            <span>{resource.category}</span>
                            <span>•</span>
                            <span>{resource.readTime} read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <Link 
                to="/resources"
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors"
              >
                View All Resources
                <ExternalLink className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/5 border border-border rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-text mb-2">Need Legal Help?</h2>
              <p className="text-textSecondary">
                Connect with verified lawyers for personalized legal assistance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                to="/personalized-match"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Target className="w-4 h-4" />
                Get Matched
              </Link>
              <Link 
                to="/contact"
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
