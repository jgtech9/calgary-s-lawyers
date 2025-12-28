import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Star, MessageSquare, Shield, CheckCircle, XCircle, Edit, Trash2,
  Filter, Search, BarChart3, Download, Eye, Clock, AlertCircle,
  Mail, Phone, Briefcase, Target
} from 'lucide-react'
import { useReviews } from '../context/ReviewContext'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function AdminPanel() {
  const { pendingReviews, approvedReviews, rejectedReviews, approveReview, rejectReview, deleteReview, getStats } = useReviews()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [stats, setStats] = useState({ totalPending: 0, totalApproved: 0, totalRejected: 0, totalReviews: 0 })
  const [intakeLeads, setIntakeLeads] = useState([])
  const [matchLeads, setMatchLeads] = useState([])
  const [leadLoading, setLeadLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState(null)
  const [leadTypeFilter, setLeadTypeFilter] = useState('all')

  useEffect(() => {
    const statsData = getStats()
    setStats(statsData)
  }, [pendingReviews, approvedReviews, rejectedReviews, getStats])

  useEffect(() => {
    const q = query(collection(db, 'intake_leads'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'intake', created_at: doc.data().created_at?.toDate() }));
      setIntakeLeads(leads);
      setLeadLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'match', created_at: doc.data().created_at?.toDate() }));
      setMatchLeads(leads);
    });
    return () => unsubscribe();
  }, []);

  const updateLeadStatus = async (leadId, newStatus, leadType) => {
    try {
      const collection_name = leadType === 'intake' ? 'intake_leads' : 'leads';
      const leadRef = doc(db, collection_name, leadId);
      await updateDoc(leadRef, { status: newStatus, updated_at: new Date() });
      alert(`✅ Status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Failed to update status');
    }
  };

  const deleteLead = async (leadId, leadType) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const collection_name = leadType === 'intake' ? 'intake_leads' : 'leads';
      await deleteDoc(doc(db, collection_name, leadId));
      alert('✅ Lead deleted successfully');
      setSelectedLead(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('❌ Failed to delete lead');
    }
  };

  const filteredPendingReviews = pendingReviews.filter(review =>
    review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.lawyerName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredApprovedReviews = approvedReviews.filter(review =>
    review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.lawyerName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredRejectedReviews = rejectedReviews.filter(review =>
    review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.lawyerName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAllFilteredReviews = () => {
    switch (filterStatus) {
      case 'pending': return filteredPendingReviews.map(r => ({ ...r, status: 'pending' }))
      case 'approved': return filteredApprovedReviews.map(r => ({ ...r, status: 'approved' }))
      case 'rejected': return filteredRejectedReviews.map(r => ({ ...r, status: 'rejected' }))
      default: return [...filteredPendingReviews.map(r => ({ ...r, status: 'pending' })), ...filteredApprovedReviews.map(r => ({ ...r, status: 'approved' })), ...filteredRejectedReviews.map(r => ({ ...r, status: 'rejected' }))]
    }
  }

  const getFilteredLeads = () => {
    let allLeads = [];
    if (leadTypeFilter === 'all' || leadTypeFilter === 'intake') allLeads = [...allLeads, ...intakeLeads];
    if (leadTypeFilter === 'all' || leadTypeFilter === 'match') allLeads = [...allLeads, ...matchLeads];
    return allLeads.filter(lead => {
      const searchLower = searchTerm.toLowerCase();
      return (lead.contact_info?.name?.toLowerCase().includes(searchLower) || lead.contact_info?.firstName?.toLowerCase().includes(searchLower) || lead.contact_info?.lastName?.toLowerCase().includes(searchLower) || lead.contact_info?.email?.toLowerCase().includes(searchLower) || lead.case_summary?.toLowerCase().includes(searchLower) || lead.lawyer_name?.toLowerCase().includes(searchLower));
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status) => {
    const colors = { new: 'bg-blue-100 text-blue-700 border-blue-200', contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200', open: 'bg-green-100 text-green-700 border-green-200', closed: 'bg-gray-100 text-gray-700 border-gray-200' };
    return colors[status] || colors.new;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div className="bg-surface border border-border rounded-xl p-6" whileHover={{ y: -2 }}>
          <div className="flex items-center justify-between">
            <div><div className="text-3xl font-bold">{stats.totalReviews}</div><div className="text-textSecondary">Total Reviews</div></div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><MessageSquare className="w-6 h-6 text-primary" /></div>
          </div>
        </motion.div>
        <motion.div className="bg-surface border border-border rounded-xl p-6" whileHover={{ y: -2 }}>
          <div className="flex items-center justify-between">
            <div><div className="text-3xl font-bold text-warning">{stats.totalPending}</div><div className="text-textSecondary">Pending Reviews</div></div>
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center"><Clock className="w-6 h-6 text-warning" /></div>
          </div>
        </motion.div>
        <motion.div className="bg-surface border border-border rounded-xl p-6" whileHover={{ y: -2 }}>
          <div className="flex items-center justify-between">
            <div><div className="text-3xl font-bold text-blue-600">{intakeLeads.length}</div><div className="text-textSecondary">Direct Contacts</div></div>
            <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center"><Mail className="w-6 h-6 text-blue-600" /></div>
          </div>
        </motion.div>
        <motion.div className="bg-surface border border-border rounded-xl p-6" whileHover={{ y: -2 }}>
          <div className="flex items-center justify-between">
            <div><div className="text-3xl font-bold text-purple-600">{matchLeads.length}</div><div className="text-textSecondary">Match Requests</div></div>
            <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center"><Target className="w-6 h-6 text-purple-600" /></div>
          </div>
        </motion.div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><AlertCircle className="w-5 h-5 text-warning" />Recent Pending Reviews ({pendingReviews.length})</h3>
          <button onClick={() => setActiveTab('reviews')} className="flex items-center gap-2 text-primary hover:text-primary/80">View All<MessageSquare className="w-4 h-4" /></button>
        </div>
        {pendingReviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-success" /></div>
            <h4 className="text-lg font-semibold mb-2">No Pending Reviews</h4>
            <p className="text-textSecondary">All reviews have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReviews.slice(0, 3).map((review) => (
              <div key={review.id} className="flex items-center justify-between p-4 hover:bg-surface/50 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-warning" /></div>
                  <div>
                    <div className="font-medium">{review.title}</div>
                    <div className="text-sm text-textSecondary">By {review.clientName} for {review.lawyerName}</div>
                    <div className="text-xs text-textSecondary mt-1">{formatDate(review.date)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-warning text-warning' : 'fill-border text-border'}`} />))}</div>
                  <div className="flex gap-1">
                    <button onClick={() => approveReview(review.id)} className="p-2 hover:bg-success/10 text-success rounded-lg transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                    <button onClick={() => rejectReview(review.id)} className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><Target className="w-5 h-5 text-blue-600" />Recent Leads ({intakeLeads.length + matchLeads.length})</h3>
          <button onClick={() => setActiveTab('leads')} className="flex items-center gap-2 text-primary hover:text-primary/80">View All<Mail className="w-4 h-4" /></button>
        </div>
        {(intakeLeads.length + matchLeads.length) === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4"><Target className="w-8 h-8 text-textSecondary" /></div>
            <h4 className="text-lg font-semibold mb-2">No Leads Yet</h4>
            <p className="text-textSecondary">New leads will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...intakeLeads, ...matchLeads].slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 hover:bg-surface/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lead.type === 'intake' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                    {lead.type === 'intake' ? <Mail className="w-5 h-5 text-blue-600" /> : <Target className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div>
                    <div className="font-medium">{lead.contact_info?.name || `${lead.contact_info?.firstName} ${lead.contact_info?.lastName}`}</div>
                    <div className="text-sm text-textSecondary">{lead.contact_info?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status || 'new')}`}>{lead.status || 'new'}</span>
                  <span className="text-xs text-textSecondary">{formatDate(lead.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search reviews..." className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-primary text-white' : 'bg-surface border border-border hover:bg-surface/80'}`}>All Reviews</button>
          <button onClick={() => setFilterStatus('pending')} className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'pending' ? 'bg-warning text-white' : 'bg-surface border border-border hover:bg-surface/80'}`}>Pending ({pendingReviews.length})</button>
          <button onClick={() => setFilterStatus('approved')} className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'approved' ? 'bg-success text-white' : 'bg-surface border border-border hover:bg-surface/80'}`}>Approved ({approvedReviews.length})</button>
          <button onClick={() => setFilterStatus('rejected')} className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'rejected' ? 'bg-error text-white' : 'bg-surface border border-border hover:bg-surface/80'}`}>Rejected ({rejectedReviews.length})</button>
        </div>
      </div>
      <div className="space-y-4">
        {getAllFilteredReviews().length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-6"><MessageSquare className="w-12 h-12 text-textSecondary" /></div>
            <h3 className="text-2xl font-bold mb-2">No Reviews Found</h3>
            <p className="text-textSecondary mb-6">{searchTerm ? 'Try a different search term' : 'No reviews available for the selected filter'}</p>
          </div>
        ) : (
          getAllFilteredReviews().map((review) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-xl p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-semibold">{review.clientName}</div>
                    <span className="text-textSecondary">reviewed</span>
                    <div className="font-semibold text-primary">{review.lawyerName}</div>
                  </div>
                  <h4 className="text-lg font-bold mb-2">{review.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-textSecondary mb-3">
                    <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-warning text-warning' : 'fill-border text-border'}`} />))}<span className="ml-1 font-medium">{review.rating}.0</span></div>
                    <span className="text-textSecondary">•</span>
                    <span>{formatDate(review.date)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${review.status === 'approved' ? 'bg-success/10 text-success' : review.status === 'rejected' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}`}>{review.status}</span>
                  </div>
                  <p className="text-textSecondary mb-4">{review.content}</p>
                  {review.email && !review.anonymous && (<div className="text-sm text-textSecondary"><strong>Email:</strong> {review.email}</div>)}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {review.status === 'pending' && (<><button onClick={() => approveReview(review.id)} className="px-4 py-2 bg-success text-white font-semibold rounded-lg hover:bg-success/90 transition-colors flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" />Approve</button><button onClick={() => rejectReview(review.id)} className="px-4 py-2 bg-error text-white font-semibold rounded-lg hover:bg-error/90 transition-colors flex items-center justify-center gap-2"><XCircle className="w-4 h-4" />Reject</button></>)}
                  <button onClick={() => deleteReview(review.id, review.status)} className="px-4 py-2 border border-error text-error font-semibold rounded-lg hover:bg-error/10 transition-colors flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" />Delete</button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )

  const renderLeads = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search leads..." className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setLeadTypeFilter('all')} className={`px-4 py-2 rounded-lg transition-colors ${leadTypeFilter === 'all' ? 'bg-primary text-white' : 'bg-surface border border-border hover:bg-surface/80'}`}>All Leads ({intakeLeads.length + matchLeads.length})</button>
          <button onClick={() => setLeadTypeFilter('intake')} className={`px-4 py-2 rounded-lg transition-colors ${leadTypeFilter === 'intake' ? 'bg-blue-600 text-white' : 'bg-surface border border-border hover:bg-surface/80'}`}>Direct Contacts ({intakeLeads.length})</button>
          <button onClick={() => setLeadTypeFilter('match')} className={`px-4 py-2 rounded-lg transition-colors ${leadTypeFilter === 'match' ? 'bg-purple-600 text-white' : 'bg-surface border border-border hover:bg-surface/80'}`}>Match Requests ({matchLeads.length})</button>
        </div>
      </div>
      {leadLoading ? (
        <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div><p className="text-textSecondary">Loading leads...</p></div>
      ) : getFilteredLeads().length === 0 ? (
        <div className="text-center py-12"><div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-6"><Target className="w-12 h-12 text-textSecondary" /></div><h3 className="text-2xl font-bold mb-2">No Leads Found</h3><p className="text-textSecondary">{searchTerm ? 'Try a different search term' : 'New leads will appear here'}</p></div>
      ) : (
        <div className="space-y-4">
          {getFilteredLeads().map((lead) => (
            <motion.div key={lead.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-xl p-6 hover:border-primary transition-all">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lead.type === 'intake' ? 'bg-blue-100' : 'bg-purple-100'}`}>{lead.type === 'intake' ? <Mail className="w-6 h-6 text-blue-600" /> : <Target className="w-6 h-6 text-purple-600" />}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{lead.contact_info?.name || `${lead.contact_info?.firstName} ${lead.contact_info?.lastName}`}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status || 'new')}`}>{lead.status || 'new'}</span>
                        {lead.type === 'intake' && <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Direct Contact</span>}
                        {lead.type === 'match' && <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">Match Request</span>}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-textSecondary mb-3">
                        <div className="flex items-center gap-1"><Mail className="w-4 h-4" />{lead.contact_info?.email}</div>
                        {lead.contact_info?.phone && (<div className="flex items-center gap-1"><Phone className="w-4 h-4" />{lead.contact_info.phone}</div>)}
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDate(lead.created_at)}</div>
                        {lead.lawyer_name && (<div className="flex items-center gap-1"><Briefcase className="w-4 h-4" /><span className="font-medium text-primary">{lead.lawyer_name}</span></div>)}
                      </div>
                      {lead.category && (<div className="mb-3"><span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{lead.category}</span></div>)}
                      {(lead.case_summary || lead.case_details?.summary) && (
                        <div className="bg-background p-4 rounded-lg"><p className="text-sm text-textSecondary line-clamp-3">{lead.case_summary || lead.case_details?.summary}</p></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  <button onClick={() => setSelectedLead(lead)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"><Eye className="w-4 h-4" />View</button>
                  {lead.status === 'new' && (<button onClick={() => updateLeadStatus(lead.id, 'contacted', lead.type)} className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"><CheckCircle className="w-4 h-4" />Mark Contacted</button>)}
                  {(lead.status === 'contacted' || lead.status === 'open') && (<button onClick={() => updateLeadStatus(lead.id, 'closed', lead.type)} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"><XCircle className="w-4 h-4" />Close</button>)}
                  <button onClick={() => deleteLead(lead.id, lead.type)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div><h1 className="text-2xl font-bold mb-2">Admin Management</h1><p className="text-textSecondary">Manage reviews and leads</p></div>
                        <div className="flex items-center gap-4">
              <div className="text-sm text-textSecondary">Last updated: {new Date().toLocaleDateString()}</div>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">Refresh Data</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {['dashboard', 'reviews', 'leads'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-textSecondary hover:text-text'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'reviews' && renderReviews()}
        {activeTab === 'leads' && renderLeads()}
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-border">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedLead.contact_info?.name || `${selectedLead.contact_info?.firstName} ${selectedLead.contact_info?.lastName}`}</h2>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedLead.status || 'new')}`}>{selectedLead.status || 'new'}</span>
                  {selectedLead.type === 'intake' && <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Direct Contact</span>}
                  {selectedLead.type === 'match' && <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">Match Request</span>}
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-surface rounded-lg transition-colors"><XCircle className="w-6 h-6" /></button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-3">Contact Information</h4>
                <div className="bg-background p-4 rounded-lg space-y-2">
                  <p><strong>Email:</strong> {selectedLead.contact_info?.email}</p>
                  {selectedLead.contact_info?.phone && <p><strong>Phone:</strong> {selectedLead.contact_info.phone}</p>}
                  {selectedLead.contact_info?.preferredContact && <p><strong>Preferred Contact:</strong> {selectedLead.contact_info.preferredContact}</p>}
                  <p><strong>Submitted:</strong> {formatDate(selectedLead.created_at)}</p>
                </div>
              </div>

              {selectedLead.category && (
                <div>
                  <h4 className="font-bold mb-3">Practice Area</h4>
                  <div className="bg-blue-50 p-4 rounded-lg"><span className="font-medium text-blue-700">{selectedLead.category}</span></div>
                </div>
              )}

              {(selectedLead.case_summary || selectedLead.case_details?.summary) && (
                <div>
                  <h4 className="font-bold mb-3">Case Summary</h4>
                  <div className="bg-background p-4 rounded-lg"><p className="text-textSecondary whitespace-pre-wrap">{selectedLead.case_summary || selectedLead.case_details?.summary}</p></div>
                </div>
              )}

              {selectedLead.case_details && (
                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" />Additional Case Details</h4>
                  <div className="bg-background p-4 rounded-lg space-y-2">
                    {selectedLead.case_details.timeline && <p><strong>Timeline:</strong> {selectedLead.case_details.timeline}</p>}
                    {selectedLead.case_details.budget && <p><strong>Budget:</strong> {selectedLead.case_details.budget}</p>}
                    {selectedLead.case_details.urgency && <p><strong>Urgency:</strong> <span className="capitalize">{selectedLead.case_details.urgency}</span></p>}
                  </div>
                </div>
              )}

              {selectedLead.conflict_data && (
                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-yellow-600" />Conflict Check Information</h4>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg space-y-2">
                    {selectedLead.conflict_data.opposingParty && <p><strong>Opposing Party:</strong> {selectedLead.conflict_data.opposingParty}</p>}
                    {selectedLead.conflict_data.opposingLawFirm && <p><strong>Opposing Law Firm:</strong> {selectedLead.conflict_data.opposingLawFirm}</p>}
                    {selectedLead.conflict_data.opposingLawyer && <p><strong>Opposing Lawyer:</strong> {selectedLead.conflict_data.opposingLawyer}</p>}
                  </div>
                </div>
              )}

              {selectedLead.lawyer_name && (
                <div>
                  <h4 className="font-bold mb-3">Assigned Lawyer</h4>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="font-medium text-blue-900">{selectedLead.lawyer_name}</p>
                    {selectedLead.lawyer_id && <p className="text-sm text-blue-700 mt-1">ID: {selectedLead.lawyer_id}</p>}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold mb-3">Lead Status & Actions</h4>
                <div className="flex gap-3">
                  <select value={selectedLead.status || 'new'} onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value, selectedLead.type)} className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary">
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button onClick={() => deleteLead(selectedLead.id, selectedLead.type)} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete Lead</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
