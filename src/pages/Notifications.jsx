import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, AlertCircle, Calendar, MessageSquare, Filter, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const Notifications = () => {
  const { currentUser, userRole } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Fetch notifications from Firestore
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Build query based on user role
    const constraints = [
      where('recipient_id', '==', currentUser.uid),
      orderBy('created_at', 'desc'),
      limit(50)
    ];

    const q = query(collection(db, 'notifications'), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notificationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // If no notifications in Firestore, use static data as fallback
        if (notificationsData.length === 0) {
          console.log('No notifications in Firestore, using static data');
          const staticNotifications = getStaticNotifications(currentUser.uid, userRole);
          setNotifications(staticNotifications);
        } else {
          setNotifications(notificationsData);
        }
        
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching notifications:', err);
        setError(err.message);
        
        // Fallback to static data on error
        const staticNotifications = getStaticNotifications(currentUser.uid, userRole);
        setNotifications(staticNotifications);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, userRole]);

  // Static notifications fallback
  const getStaticNotifications = (userId, role) => {
    const baseNotifications = [
      {
        id: 1,
        title: 'New Message',
        description: 'Sarah Johnson replied to your consultation request',
        time: '10 min ago',
        read: false,
        type: 'message',
        icon: MessageSquare,
        recipient_id: userId,
        created_at: { seconds: Date.now() / 1000 - 600 }
      },
      {
        id: 2,
        title: 'Appointment Reminder',
        description: 'Meeting with Michael Chen tomorrow at 2:00 PM',
        time: '1 hour ago',
        read: false,
        type: 'calendar',
        icon: Calendar,
        recipient_id: userId,
        created_at: { seconds: Date.now() / 1000 - 3600 }
      },
      {
        id: 3,
        title: 'Profile Update',
        description: role === 'lawyer' 
          ? 'Your lawyer profile has been verified successfully' 
          : 'Your account has been activated',
        time: '2 hours ago',
        read: true,
        type: 'success',
        icon: Check,
        recipient_id: userId,
        created_at: { seconds: Date.now() / 1000 - 7200 }
      },
      {
        id: 4,
        title: 'Important Alert',
        description: role === 'lawyer' 
          ? 'New legal updates in your practice area' 
          : 'New features available in your account',
        time: '1 day ago',
        read: true,
        type: 'alert',
        icon: AlertCircle,
        recipient_id: userId,
        created_at: { seconds: Date.now() / 1000 - 86400 }
      },
      {
        id: 5,
        title: 'New Review',
        description: role === 'lawyer' 
          ? 'John Smith left a 5-star review on your profile' 
          : 'Your review has been published',
        time: '2 days ago',
        read: true,
        type: 'success',
        icon: CheckCircle,
        recipient_id: userId,
        created_at: { seconds: Date.now() / 1000 - 172800 }
      }
    ];

    // Add role-specific notifications
    if (role === 'lawyer') {
      baseNotifications.push({
        id: 6,
        title: 'Consultation Request',
        description: 'New consultation request from Emily Wilson',
        time: '3 days ago',
        read: true,
        type: 'message',
        icon: MessageSquare,
        recipient_id: userId,
        created_at: { seconds: Date.now() / 1000 - 259200 }
      });
    }

    if (role === 'admin') {
      baseNotifications.push({
        id: 7,
        title: 'System Report',
        description: 'Monthly system analytics report is ready',
        time: '1 week ago',
        read: true,
        type: 'alert',
        icon: AlertCircle,
        recipient_id: userId,
        created_at: { seconds: Date.now() / 1000 - 604800 }
      });
    }

    return baseNotifications;
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  // Mark notification as read in Firestore
  const markAsRead = async (id) => {
    try {
      const notificationRef = doc(db, 'notifications', id);
      await updateDoc(notificationRef, {
        read: true,
        read_at: serverTimestamp()
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Fallback to local state update
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      unreadNotifications.forEach(notification => {
        const notificationRef = doc(db, 'notifications', notification.id);
        batch.update(notificationRef, {
          read: true,
          read_at: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (err) {
      console.error('Error marking all as read:', err);
      // Fallback to local state update
      setNotifications(notifications.map(notification => ({ 
        ...notification, 
        read: true 
      })));
    }
  };

  // Delete notification from Firestore
  const clearNotification = async (id) => {
    try {
      const notificationRef = doc(db, 'notifications', id);
      await deleteDoc(notificationRef);
    } catch (err) {
      console.error('Error deleting notification:', err);
      // Fallback to local state update
      setNotifications(notifications.filter(notification => notification.id !== id));
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      const batch = writeBatch(db);
      notifications.forEach(notification => {
        const notificationRef = doc(db, 'notifications', notification.id);
        batch.delete(notificationRef);
      });
      
      await batch.commit();
    } catch (err) {
      console.error('Error clearing all notifications:', err);
      // Fallback to local state update
      setNotifications([]);
    }
  };

  // Sync notifications with Firestore
  const syncWithFirestore = async () => {
    if (!currentUser) return;
    
    setSyncing(true);
    try {
      // Check if user has any notifications in Firestore
      const q = query(
        collection(db, 'notifications'),
        where('recipient_id', '==', currentUser.uid),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Create initial notifications for new user
        const batch = writeBatch(db);
        const staticNotifications = getStaticNotifications(currentUser.uid, userRole);
        
        staticNotifications.forEach((notification, index) => {
          const notificationRef = doc(collection(db, 'notifications'));
          batch.set(notificationRef, {
            ...notification,
            id: notificationRef.id,
            recipient_id: currentUser.uid,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
          });
        });
        
        await batch.commit();
      }
      
      setSyncing(false);
    } catch (err) {
      console.error('Error syncing notifications:', err);
      setSyncing(false);
    }
  };

  // Format time display
  const formatTime = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'Recently';
    
    const now = Date.now() / 1000;
    const diff = now - timestamp.seconds;
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diff / 604800)} week${Math.floor(diff / 604800) > 1 ? 's' : ''} ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">Notifications</h1>
              <p className="text-textSecondary">
                Stay updated with your legal activities and alerts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={syncWithFirestore}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync'}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center gap-2 px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center gap-2 text-error">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
            <p className="text-textSecondary text-sm mt-2">
              Using local notifications. Some features may be limited.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-text">{totalCount}</div>
                <div className="text-textSecondary">Total Notifications</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-primary">{unreadCount}</div>
                <div className="text-textSecondary">Unread Notifications</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-success">{totalCount - unreadCount}</div>
                <div className="text-textSecondary">Read Notifications</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-textSecondary hover:bg-surface/80'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-textSecondary hover:bg-surface/80'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'read'
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-textSecondary hover:bg-surface/80'
            }`}
          >
            Read ({totalCount - unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-surface/80 transition-colors ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${getNotificationIconBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${getNotificationIconColor(notification.type)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-text text-lg mb-1">
                              {notification.title}
                            </h3>
                            <p className="text-textSecondary">
                              {notification.description}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                              <span className="text-xs text-primary">New</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-textSecondary">
                            {formatTime(notification.created_at)}
                          </span>
                          <div className="flex items-center gap-3">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="text-sm text-textSecondary hover:text-text transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
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
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-textSecondary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                No notifications found
              </h3>
              <p className="text-textSecondary mb-6">
                {filter === 'all'
                  ? "You don't have any notifications yet."
                  : filter === 'unread'
                  ? "You're all caught up! No unread notifications."
                  : "No read notifications found."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={syncWithFirestore}
                  disabled={syncing}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Notifications'}
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-surface border border-border rounded-xl p-6">
          <h3 className="font-semibold text-text mb-4">Notification Settings</h3>
          <p className="text-textSecondary mb-4">
            Manage your notification preferences to control what alerts you receive.
            {!currentUser && ' Sign in to enable real-time notifications.'}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/settings"
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              Notification Settings
            </Link>
            <Link
              to="/help"
              className="px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface/80 transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
