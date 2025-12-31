import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, X, ChevronDown, Shield, Phone, Check, AlertCircle, Calendar, MessageSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Message',
      description: 'Sarah Johnson replied to your consultation request',
      time: '10 min ago',
      read: false,
      type: 'message',
      icon: MessageSquare
    },
    {
      id: 2,
      title: 'Appointment Reminder',
      description: 'Meeting with Michael Chen tomorrow at 2:00 PM',
      time: '1 hour ago',
      read: false,
      type: 'calendar',
      icon: Calendar
    },
    {
      id: 3,
      title: 'Profile Update',
      description: 'Your lawyer profile has been verified successfully',
      time: '2 hours ago',
      read: true,
      type: 'success',
      icon: Check
    },
    {
      id: 4,
      title: 'Important Alert',
      description: 'New legal updates in Family Law regulations',
      time: '1 day ago',
      read: true,
      type: 'alert',
      icon: AlertCircle
    }
  ]);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking on notification button or dropdown
      if (!e.target.closest('.notification-button') && !e.target.closest('.notification-dropdown')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navigation = [
    { name: 'Home', path: '/' },
    { 
      name: 'Legal Areas', 
      path: '/legal-area',
      dropdown: [
        { name: 'Family Law', path: '/family-law', icon: '👨‍👩‍👧‍👦' },
        { name: 'Corporate Law', path: '/corporate-law', icon: '🏢' },
        { name: 'Real Estate', path: '/real-estate', icon: '🏠' },
        { name: 'Criminal Defense', path: '/criminal-defense', icon: '⚖️' },
        { name: 'Employment Law', path: '/employment-law', icon: '💼' },
        { name: 'Civil Law', path: '/civil-law', icon: '📝' },
      ]
    },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Reviews', path: '/reviews' },
  ];

  const handleDropdownToggle = (name, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleSearchClick = () => {
    if (location.pathname === '/') {
      // If already on home page, scroll to search section and focus
      const searchSection = document.querySelector('.search-section');
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Dispatch a custom event to focus the search input
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('focusSearchInput'));
      }, 300);
    } else {
      // Navigate to home page with search state
      navigate('/', { state: { focusSearch: true } });
    }
  };

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications');
  };

  const markAsRead = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const clearNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = (e) => {
    e.stopPropagation();
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIconColor = (type) => {
    switch(type) {
      case 'message': return 'text-primary';
      case 'calendar': return 'text-secondary';
      case 'success': return 'text-success';
      case 'alert': return 'text-warning';
      default: return 'text-textSecondary';
    }
  };

  const getNotificationIconBg = (type) => {
    switch(type) {
      case 'message': return 'bg-primary/10';
      case 'calendar': return 'bg-secondary/10';
      case 'success': return 'bg-success/10';
      case 'alert': return 'bg-warning/10';
      default: return 'bg-surface';
    }
  };

  // Handle review navigation with scroll to top
  const handleReviewsNavigation = (e) => {
    e.preventDefault();
    
    // If already on reviews page, scroll to top
    if (location.pathname === '/reviews') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Navigate to reviews page
      navigate('/reviews');
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Verified Lawyers Only</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Emergency Legal Help: (403) 555-HELP</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="bg-white text-primary px-3 py-1 rounded-full font-semibold hover:bg-white/90 transition-colors">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">CL</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-text">
                  Calgary's<span className="text-primary">Lawyers</span>
                </h1>
                <p className="text-xs text-gray-600 dark:text-textSecondary">Trusted Legal Directory</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <button
                      onClick={(e) => handleDropdownToggle(item.name, e)}
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'text-primary'
                          : 'text-gray-700 dark:text-textSecondary hover:text-primary dark:hover:text-text'
                      }`}
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={item.name === 'Reviews' ? handleReviewsNavigation : undefined}
                      className={`font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'text-primary'
                          : 'text-gray-700 dark:text-textSecondary hover:text-primary dark:hover:text-text'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-surface rounded-xl shadow-2xl border border-gray-100 dark:border-border overflow-hidden">
                      <div className="p-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-surface/80 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-xl">{dropdownItem.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-text">
                                {dropdownItem.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-textSecondary">
                                Expert lawyers available
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearchClick}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-surface hover:bg-gray-200 dark:hover:bg-surface/80 transition-colors group"
                aria-label="Search lawyers"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-textSecondary group-hover:text-primary transition-colors" />
              </button>

              {/* Notifications Button */}
              <div className="relative">
                <button 
                  onClick={handleNotificationClick}
                  className="notification-button relative hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-surface hover:bg-gray-200 dark:hover:bg-surface/80 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-textSecondary" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {activeDropdown === 'notifications' && (
                  <div className="notification-dropdown absolute top-full right-0 mt-2 w-96 bg-white dark:bg-surface rounded-xl shadow-2xl border border-gray-100 dark:border-border overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 dark:border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-text">Notifications</h3>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button 
                              onClick={markAllAsRead}
                              className="text-xs text-primary hover:text-primary/80 transition-colors"
                            >
                              Mark all as read
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button 
                              onClick={clearAllNotifications}
                              className="text-xs text-textSecondary hover:text-text transition-colors"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                      </div>
                      {unreadCount > 0 && (
                        <div className="mt-2 text-xs text-primary">
                          {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-border">
                          {notifications.map((notification) => {
                            const Icon = notification.icon;
                            return (
                              <div 
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-surface/80 transition-colors ${
                                  !notification.read ? 'bg-primary/5' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 rounded-full ${getNotificationIconBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${getNotificationIconColor(notification.type)}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h4 className="font-medium text-gray-900 dark:text-text">
                                          {notification.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-textSecondary mt-1">
                                          {notification.description}
                                        </p>
                                      </div>
                                      {!notification.read && (
                                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                      <span className="text-xs text-gray-500 dark:text-textSecondary">
                                        {notification.time}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {!notification.read && (
                                          <button 
                                            onClick={(e) => markAsRead(notification.id, e)}
                                            className="text-xs text-primary hover:text-primary/80 transition-colors"
                                          >
                                            Mark as read
                                          </button>
                                        )}
                                        <button 
                                          onClick={(e) => clearNotification(notification.id, e)}
                                          className="text-xs text-textSecondary hover:text-text transition-colors"
                                        >
                                          Dismiss
                                        
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-surface flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-gray-400 dark:text-textSecondary" />
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-text mb-2">
                            No notifications
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-textSecondary">
                            You're all caught up! Check back later for updates.
                          </p>
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-4 border-t border-gray-100 dark:border-border">
                        <Link 
                          to="/notifications" 
                          className="block text-center text-primary hover:text-primary/80 transition-colors font-medium"
                          onClick={() => setActiveDropdown(null)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Profile */}
              <button 
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-surface hover:bg-gray-200 dark:hover:bg-surface/80 transition-colors">
                <User className="w-5 h-5 text-gray-600 dark:text-textSecondary" />
                <span className="font-medium text-gray-700 dark:text-text">Sign In</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-surface hover:bg-gray-200 dark:hover:bg-surface/80 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-text" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-text" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-surface shadow-2xl border-t border-gray-100 dark:border-border">
            <div className="container mx-auto px-4 py-6">
              {/* Theme Toggle in Mobile Menu */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-medium">Theme</span>
                <ThemeToggle />
              </div>

              <div className="space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-text px-4 py-3">
                          {item.name}
                        </div>
                        <div className="ml-4 space-y-1">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.path}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-surface/80 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="text-xl">{dropdownItem.icon}</span>
                              <span className="text-gray-700 dark:text-textSecondary">
                                {dropdownItem.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={item.name === 'Reviews' ? handleReviewsNavigation : undefined}
                        className={`block px-4 py-3 rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-700 dark:text-textSecondary hover:bg-gray-50 dark:hover:bg-surface/80'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-border">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      handleSearchClick();
                      setIsMenuOpen(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 dark:bg-surface hover:bg-gray-200 dark:hover:bg-surface/80 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Banner */}
      {location.pathname === '/' && !isScrolled && (
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
          
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium text-white">Trusted by 5,000+ Calgarians</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-primary">Legal Match in Calgary</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
                Connect with verified, experienced lawyers across all legal specialties. 
                Free consultations, transparent pricing, and trusted reviews.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/all-lawyers"
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Browse Lawyers
                </Link>
                <Link 
                  to="/how-it-works"
                  className="px-8 py-3 border-2 border-primary text-white font-semibold rounded-lg hover:bg-primary/10 transition-colors animate-pulse"
                >
                  How It Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
