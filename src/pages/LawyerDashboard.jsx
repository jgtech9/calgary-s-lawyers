import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIntakeLeads, useLawyerProfile } from '../hooks/useFirestore';
import { updateDoc, doc, collection, addDoc, query, where, orderBy, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Calendar, 
  FileText, 
  Download, 
  Upload, 
  Filter, 
  Search, 
  MoreVertical,
  ChevronDown,
  BarChart3,
  Users,
  Clock,
  Award,
  Bell,
  Settings,
  LogOut,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Send,
  Paperclip,
  Smile,
  Video,
  Phone,
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Star,
  TrendingUp,
  DollarSign,
  Target,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800', icon: Bell },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800', icon: MessageSquare },
  { value: 'consultation_scheduled', label: 'Consultation Scheduled', color: 'bg-purple-100 text-purple-800', icon: Calendar },
  { value: 'retained', label: 'Retained', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'declined', label: 'Declined', color: 'bg-red-100 text-red-800', icon: XCircle }
];

const CATEGORY_OPTIONS = [
  'Family Law',
  'Criminal Defense', 
  'Real Estate',
  'Corporate Law',
  'Employment Law',
  'Civil Law',
  'Immigration',
  'Personal Injury',
  'Estate Planning',
  'Bankruptcy'
];

const LawyerDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { lawyer, loading: profileLoading } = useLawyerProfile(currentUser?.uid);
  const { leads, loading: leadsLoading } = useIntakeLeads(currentUser?.uid);
  const [activeTab, setActiveTab] = useState('leads');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('month');

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, 'messages'),
      where('conversation_id', '==', `lawyer_${currentUser?.uid}_client_${activeChat}`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [activeChat, currentUser?.uid]);

  // Fetch appointments
  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, 'appointments'),
      where('lawyer_id', '==', currentUser.uid),
      where('date', '>=', new Date().toISOString().split('T')[0]),
      orderBy('date', 'asc'),
      orderBy('time', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Fetch documents
  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, 'documents'),
      where('lawyer_id', '==', currentUser.uid),
      orderBy('uploaded_at', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const documentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(documentsData);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await updateDoc(doc(db, 'intake_leads', leadId), {
        status: newStatus,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Failed to update lead status');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    try {
      await addDoc(collection(db, 'messages'), {
        conversation_id: `lawyer_${currentUser?.uid}_client_${activeChat}`,
        sender_id: currentUser?.uid,
        sender_name: lawyer?.profile_data?.name || currentUser?.displayName,
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedLeads.length === 0) return;

    try {
      const batch = writeBatch(db);
      selectedLeads.forEach(leadId => {
        const leadRef = doc(db, 'intake_leads', leadId);
        batch.update(leadRef, {
          status: status,
          updated_at: new Date().toISOString()
        });
      });
      await batch.commit();
      setSelectedLeads([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error updating bulk status:', error);
      alert('Failed to update leads');
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (filter === 'all') return true;
    return lead.status === filter;
  }).filter(lead => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.contact_info?.name?.toLowerCase().includes(query) ||
      lead.case_summary?.toLowerCase().includes(query) ||
      lead.category?.toLowerCase().includes(query)
    );
  });

  if (profileLoading || leadsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const activeLeadsCount = leads.filter(l => ['contacted', 'consultation_scheduled'].includes(l.status)).length;
  const retainedCount = leads.filter(l => l.status === 'retained').length;
  const conversionRate = leads.length > 0 ? Math.round((retainedCount / leads.length) * 100) : 0;

  // Mock analytics data
  const analyticsData = {
    leadsOverTime: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [12, 19, 8, 15, 22, 18]
    },
    categoryDistribution: [
      { category: 'Family Law', count: 15, color: '#9E7FFF' },
      { category: 'Criminal Defense', count: 12, color: '#38bdf8' },
      { category: 'Real Estate', count: 8, color: '#f472b6' },
      { category: 'Corporate Law', count: 6, color: '#10b981' },
      { category: 'Other', count: 9, color: '#f59e0b' }
    ],
    revenue: {
      current: 45280,
      previous: 38250,
      growth: 18.4
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-bold text-text">Lawyer Dashboard</h1>
                  <p className="text-xs text-textSecondary">
                    {lawyer?.profile_data?.firm || 'Independent Practice'}
                  </p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'leads'
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:text-text hover:bg-surface/80'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Leads ({leads.length})
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
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'calendar'
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:text-text hover:bg-surface/80'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Calendar
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
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:text-text hover:bg-surface/80'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="relative group">
                <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface/80">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {lawyer?.profile_data?.name?.charAt(0) || 'L'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-textSecondary" />
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-4 border-b border-border">
                    <p className="font-semibold text-text">
                      {lawyer?.profile_data?.name || currentUser?.displayName}
                    </p>
                    <p className="text-sm text-textSecondary">
                      {lawyer?.profile_data?.email || currentUser?.email}
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
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
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
                Welcome back, {lawyer?.profile_data?.name || currentUser?.displayName} 👋
              </h1>
              <p className="text-textSecondary">
                Here's what's happening with your practice today
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <Calendar className="w-4 h-4" />
                Schedule Appointment
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors">
                <FileText className="w-4 h-4" />
                Upload Document
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface transition-colors">
                <BarChart3 className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-text">{newLeadsCount}</div>
                  <div className="text-sm text-textSecondary">New Leads</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-textSecondary">
                <span className="text-success">↑ 12%</span> from last week
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-text">{activeLeadsCount}</div>
                  <div className="text-sm text-textSecondary">Active Cases</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-textSecondary">
                <span className="text-success">↑ 8%</span> from last week
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-text">{conversionRate}%</div>
                  <div className="text-sm text-textSecondary">Conversion Rate</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-textSecondary">
                <span className="text-success">↑ 5%</span> from last month
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-text">${analyticsData.revenue.current.toLocaleString()}</div>
                  <div className="text-sm text-textSecondary">Revenue</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-textSecondary">
                <span className="text-success">↑ {analyticsData.revenue.growth}%</span> from last month
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Leads & Messages */}
          <div className="lg:col-span-2 space-y-8">
            {/* Leads Section */}
            <AnimatePresence mode="wait">
              {activeTab === 'leads' && (
                <motion.div
                  key="leads"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-surface border border-border rounded-2xl overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-text">Client Leads</h2>
                        <p className="text-textSecondary">Manage and track your potential clients</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
                          <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text placeholder:text-textSecondary focus:outline-none focus:border-primary"
                          />
                        </div>
                        
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="px-4 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:border-primary"
                        >
                          <option value="all">All Status</option>
                          {STATUS_OPTIONS.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Actions */}
                  {selectedLeads.length > 0 && (
                    <div className="px-6 py-3 bg-primary/5 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-text">
                            {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
                          </span>
                          <button
                            onClick={() => setSelectedLeads([])}
                            className="text-sm text-textSecondary hover:text-text"
                          >
                            Clear selection
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-textSecondary">Update status to:</span>
                          {STATUS_OPTIONS.map(status => (
                            <button
                              key={status.value}
                              onClick={() => handleBulkStatusUpdate(status.value)}
                              className="px-3 py-1 text-sm rounded-lg bg-surface border border-border hover:bg-surface/80"
                            >
                              {status.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Leads List */}
                  <div className="divide-y divide-border">
                    {filteredLeads.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-textSecondary" />
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-2">No leads found</h3>
                        <p className="text-textSecondary">
                          {searchQuery 
                            ? 'No leads match your search criteria'
                            : 'New client inquiries will appear here when they contact you.'
                          }
                        </p>
                      </div>
                    ) : (
                      filteredLeads.map((lead, index) => {
                        const StatusIcon = STATUS_OPTIONS.find(s => s.value === lead.status)?.icon || Bell;
                        return (
                          <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 hover:bg-surface/50 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={selectedLeads.includes(lead.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedLeads([...selectedLeads, lead.id]);
                                    } else {
                                      setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                                    }
                                  }}
                                  className="mt-1"
                                />
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg text-text truncate">
                                      {lead.contact_info?.name || 'Anonymous'}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                      STATUS_OPTIONS.find(s => s.value === lead.status)?.color
                                    }`}>
                                      <StatusIcon className="w-3 h-3" />
                                      {STATUS_OPTIONS.find(s => s.value === lead.status)?.label}
                                    </span>
                                    {lead.urgency === 'emergency' && (
                                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-error text-white">
                                        🚨 EMERGENCY
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-3 text-sm text-textSecondary mb-3">
                                    <span className="flex items-center gap-1">
                                      <FileText className="w-3 h-3" />
                                      {lead.category || 'Not specified'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {new Date(lead.created_at).toLocaleDateString()}
                                    </span>
                                    {lead.contact_info?.phone && (
                                      <a 
                                        href={`tel:${lead.contact_info.phone}`}
                                        className="flex items-center gap-1 text-primary hover:text-primary/80"
                                      >
                                        <Phone className="w-3 h-3" />
                                        {lead.contact_info.phone}
                                      </a>
                                    )}
                                  </div>

                                  {/* Case Summary Preview */}
                                  {lead.case_summary && (
                                    <div className="bg-surface border border-border rounded-lg p-4 mb-3">
                                      <h4 className="font-semibold text-text mb-2">Case Summary:</h4>
                                      <p className="text-textSecondary text-sm line-clamp-2">
                                        {lead.case_summary}
                                      </p>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => {
                                        setActiveTab('messages');
                                        setActiveChat(lead.contact_info?.email || lead.id);
                                      }}
                                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface"
                                    >
                                      <MessageSquare className="w-3 h-3" />
                                      Message
                                    </button>
                                    <button
                                      onClick={() => setActiveTab('calendar')}
                                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface"
                                    >
                                      <Calendar className="w-3 h-3" />
                                      Schedule
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface">
                                      <Eye className="w-3 h-3" />
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Status Dropdown */}
                              <div className="relative group">
                                <select
                                  value={lead.status}
                                  onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                  className="appearance-none pl-4 pr-10 py-2 border-2 border-border rounded-lg bg-background text-text hover:border-primary focus:border-primary focus:outline-none"
                                >
                                  {STATUS_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none" />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}

              {/* Messages Section */}
              {activeTab === 'messages' && (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-surface border border-border rounded-2xl overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-text">Messages</h2>
                    <p className="text-textSecondary">Communicate with your clients</p>
                  </div>
                  
                  <div className="flex h-[600px]">
                    {/* Conversations List */}
                    <div className="w-1/3 border-r border-border">
                      <div className="p-4 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
                          <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text placeholder:text-textSecondary focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      
                      <div className="divide-y divide-border">
                        {leads.slice(0, 5).map(lead => (
                          <button
                            key={lead.id}
                            onClick={() => setActiveChat(lead.contact_info?.email || lead.id)}
                            className={`w-full p-4 text-left hover:bg-surface/50 transition-colors ${
                              activeChat === (lead.contact_info?.email || lead.id) ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-semibold text-primary">
                                  {lead.contact_info?.name?.charAt(0) || 'C'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-text truncate">
                                    {lead.contact_info?.name || 'Client'}
                                  </h4>
                                  <span className="text-xs text-textSecondary">
                                    {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-sm text-textSecondary truncate">
                                  {lead.case_summary?.substring(0, 50) || 'No message yet'}...
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                      {activeChat ? (
                        <>
                          {/* Chat Header */}
                          <div className="p-4 border-b border-border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="font-semibold text-primary">C</span>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-text">Client</h3>
                                  <p className="text-sm text-textSecondary">Online</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                                  <Phone className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                                  <Video className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Messages */}
                          <div className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                              {messages.length > 0 ? (
                                messages.map(message => (
                                  <div
                                    key={message.id}
                                    className={`flex ${message.sender_id === currentUser?.uid ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div className={`max-w-[70%] rounded-2xl p-4 ${
                                      message.sender_id === currentUser?.uid
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-surface border border-border rounded-bl-none'
                                    }`}>
                                      <p>{message.content}</p>
                                      <p className={`text-xs mt-2 ${
                                        message.sender_id === currentUser?.uid
                                          ? 'text-white/70'
                                          : 'text-textSecondary'
                                      }`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-12">
                                  <MessageSquare className="w-12 h-12 text-textSecondary mx-auto mb-4" />
                                  <p className="text-textSecondary">No messages yet</p>
                                  <p className="text-sm text-textSecondary mt-2">Start the conversation</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Message Input */}
                          <div className="p-4 border-t border-border">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                                <Paperclip className="w-5 h-5" />
                              </button>
                              <button className="p-2 text-textSecondary hover:text-text hover:bg-surface/80 rounded-lg">
                                <Smile className="w-5 h-5" />
                              </button>
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-text placeholder:text-textSecondary focus:outline-none focus:border-primary"
                              />
                              <button
                                onClick={sendMessage}
                                disabled={!newMessage.trim()}
                                className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Send className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center">
                            <MessageSquare className="w-16 h-16 text-textSecondary mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-text mb-2">Select a conversation</h3>
                            <p className="text-textSecondary">Choose a client from the list to start messaging</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Calendar Section */}
              {activeTab === 'calendar' && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-surface border border-border rounded-2xl overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-text">Calendar</h2>
                        <p className="text-textSecondary">Manage your appointments and consultations</p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                        <Calendar className="w-4 h-4" />
                        New Appointment
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Upcoming Appointments */}
                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-text mb-4">Upcoming Appointments</h3>
                        <div className="space-y-3">
                          {appointments.length > 0 ? (
                            appointments.slice(0, 5).map(appointment => (
                              <div key={appointment.id} className="p-4 border border-border rounded-lg hover:bg-surface/50">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold text-text">{appointment.title}</h4>
                                    <p className="text-sm text-textSecondary">{appointment.client_name}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-text">
                                      {new Date(appointment.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-textSecondary">{appointment.time}</div>
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    appointment.type === 'consultation' 
                                      ? 'bg-purple-100 text-purple-800'
                                      : appointment.type === 'meeting'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {appointment.type}
                                  </span>
                                  <span className="text-sm text-textSecondary">
                                    {appointment.duration} minutes
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <Calendar className="w-12 h-12 text-textSecondary mx-auto mb-4" />
                              <p className="text-textSecondary">No upcoming appointments</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Calendar Widget */}
                      <div>
                        <h3 className="font-semibold text-text mb-4">This Week</h3>
                        <div className="bg-surface border border-border rounded-lg p-4">
                          <div className="grid grid-cols-7 gap-1 mb-4">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                              <div key={day} className="text-center text-sm text-textSecondary">{day}</div>
                            ))}
                          </div>
                          <div className="text-center py-8">
                            <Calendar className="w-16 h-16 text-textSecondary mx-auto mb-4" />
                            <p className="text-textSecondary">Calendar integration coming soon</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Documents Section */}
              {activeTab === 'documents' && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-surface border border-border rounded-2xl overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-text">Documents</h2>
                        <p className="text-textSecondary">Manage your case files and documents</p>
                      </div>
                      <button 
                        onClick={() => setShowDocumentUpload(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Document
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {documents.length > 0 ? (
                        documents.map(doc => (
                          <div key={doc.id} className="border border-border rounded-lg p-4 hover:bg-surface/50">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-text truncate">{doc.name}</h4>
                                <p className="text-sm text-textSecondary">{doc.type}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-textSecondary">
                                    {new Date(doc.uploaded_at).toLocaleDateString()}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button className="p-1 text-textSecondary hover:text-text">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 text-textSecondary hover:text-text">
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <FileText className="w-16 h-16 text-textSecondary mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-text mb-2">No documents yet</h3>
                          <p className="text-textSecondary mb-6">Upload your first document to get started</p>
                          <button 
                            onClick={() => setShowDocumentUpload(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 mx-auto"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Document
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Analytics Section */}
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-surface border border-border rounded-2xl overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-text">Analytics</h2>
                        <p className="text-textSecondary">Track your practice performance</p>
                      </div>
                      <select
                        value={analyticsPeriod}
                        onChange={(e) => setAnalyticsPeriod(e.target.value)}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-text"
                      >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      {/* Leads Over Time */}
                      <div className="bg-surface border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-semibold text-text">Leads Over Time</h3>
                          <LineChart className="w-5 h-5 text-primary" />
                        </div>
                        <div className="h-48 flex items-end gap-2">
                          {analyticsData.leadsOverTime.data.map((value, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-primary rounded-t-lg transition-all hover:opacity-80"
                                style={{ height: `${(value / Math.max(...analyticsData.leadsOverTime.data)) * 100}%` }}
                              />
                              <span className="text-xs text-textSecondary mt-2">
                                {analyticsData.leadsOverTime.labels[index]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Category Distribution */}
                      <div className="bg-surface border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-semibold text-text">Case Categories</h3>
                          <PieChart className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="space-y-4">
                          {analyticsData.categoryDistribution.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-text">{item.category}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-semibold text-text">{item.count}</span>
                                <div className="w-32 h-2 bg-surface rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full"
                                    style={{ 
                                      width: `${(item.count / analyticsData.categoryDistribution.reduce((sum, i) => sum + i.count, 0)) * 100}%`,
                                      backgroundColor: item.color
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-surface border border-border rounded-xl p-4">
                        <div className="text-2xl font-bold text-text">{conversionRate}%</div>
                        <div className="text-sm text-textSecondary">Conversion Rate</div>
                      </div>
                      <div className="bg-surface border border-border rounded-xl p-4">
                        <div className="text-2xl font-bold text-text">24h</div>
                        <div className="text-sm text-textSecondary">Avg. Response Time</div>
                      </div>
                      <div className="bg-surface border border-border rounded-xl p-4">
                        <div className="text-2xl font-bold text-text">4.8</div>
                        <div className="text-sm text-textSecondary">Client Rating</div>
                      </div>
                      <div className="bg-surface border border-border rounded-xl p-4">
                        <div className="text-2xl font-bold text-text">92%</div>
                        <div className="text-sm text-textSecondary">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Profile & Quick Actions */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {lawyer?.profile_data?.name?.charAt(0) || 'L'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-text text-lg">
                    {lawyer?.profile_data?.name || currentUser?.displayName}
                  </h3>
                  <p className="text-textSecondary">{lawyer?.profile_data?.title || 'Lawyer'}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-textSecondary ml-1">
                      {lawyer?.metrics?.rating?.toFixed(1) || '5.0'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-textSecondary">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{lawyer?.profile_data?.email || currentUser?.email}</span>
                </div>
                {lawyer?.profile_data?.phone && (
                  <div className="flex items-center gap-3 text-textSecondary">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{lawyer?.profile_data?.phone}</span>
                  </div>
                )}
                {lawyer?.profile_data?.address && (
                  <div className="flex items-center gap-3 text-textSecondary">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{lawyer?.profile_data?.address}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold text-text mb-3">Practice Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {lawyer?.profile_data?.categories?.slice(0, 3).map(category => (
                    <span
                      key={category}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                  {lawyer?.profile_data?.categories?.length > 3 && (
                    <span className="px-3 py-1 bg-surface text-textSecondary text-sm rounded-full">
                      +{lawyer?.profile_data?.categories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <button className="w-full mt-6 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold text-text mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-surface/50 transition-colors">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-text">Create Invoice</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-surface/50 transition-colors">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span className="text-text">Schedule Follow-up</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-surface/50 transition-colors">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  <span className="text-text">Send Bulk Message</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-surface/50 transition-colors">
                  <BarChart3 className="w-5 h-5 text-success" />
                  <span className="text-text">Generate Report</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold text-text mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {leads.slice(0, 3).map(lead => (
                  <div key={lead.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text">
                        New lead from <span className="font-semibold">{lead.contact_info?.name || 'Client'}</span>
                      </p>
                      <p className="text-xs text-textSecondary">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;
