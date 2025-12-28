import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Download,
  Eye,
  Clock,
  AlertCircle,
  UserCheck,
  FileText
} from 'lucide-react';
import { useAllLawyers, adminUpdateVerification } from '../hooks/useFirestore';
import { batchVerifyLawyers, getPendingVerificationRequests } from '../lib/lsa-verification';
import LSAVerificationBadge from './LSAVerificationBadge';

const AdminVerificationPanel = () => {
  const { lawyers, loading, error } = useAllLawyers();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLawyers, setSelectedLawyers] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState([]);

  useEffect(() => {
    // Load verification requests
    const loadRequests = async () => {
      const requests = await getPendingVerificationRequests();
      setVerificationRequests(requests);
    };
    loadRequests();
  }, []);

  const filteredLawyers = lawyers.filter(lawyer => {
    // Apply filter
    if (filter === 'verified' && !lawyer.is_verified) return false;
    if (filter === 'unverified' && lawyer.is_verified) return false;
    if (filter === 'pending' && lawyer.verification?.status !== 'pending_review') return false;
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = lawyer.profile_data?.name?.toLowerCase() || '';
      const lsaId = lawyer.lsa_id?.toLowerCase() || '';
      const email = lawyer.profile_data?.email?.toLowerCase() || '';
      
      return name.includes(query) || lsaId.includes(query) || email.includes(query);
    }
    
    return true;
  });

  const handleBulkVerify = async () => {
    if (selectedLawyers.length === 0) return;
    
    setIsVerifying(true);
    try {
      const results = await batchVerifyLawyers(selectedLawyers);
      setVerificationResults(results);
      
      // Clear selection after successful verification
      setSelectedLawyers([]);
    } catch (error) {
      console.error('Bulk verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerify = async (lawyerId, verified) => {
    try {
      const result = await adminUpdateVerification(
        lawyerId, 
        verified, 
        `Manually ${verified ? 'verified' : 'rejected'} by admin`
      );
      
      if (result.success) {
        // Update local state
        setVerificationResults(prev => [...prev, {
          lawyerId,
          success: true,
          verified,
          action: 'manual'
        }]);
      }
    } catch (error) {
      console.error('Manual verification error:', error);
    }
  };

  const getStats = () => {
    const total = lawyers.length;
    const verified = lawyers.filter(l => l.is_verified).length;
    const pending = lawyers.filter(l => l.verification?.status === 'pending_review').length;
    const unverified = total - verified - pending;
    
    return { total, verified, pending, unverified };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-xl p-6">
        <div className="flex items-center gap-3 text-error mb-3">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-semibold">Error Loading Lawyers</h3>
        </div>
        <p className="text-textSecondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className="bg-surface border border-border rounded-xl p-4"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-text">{stats.total}</div>
              <div className="text-sm text-textSecondary">Total Lawyers</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-surface border border-border rounded-xl p-4"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-success">{stats.verified}</div>
              <div className="text-sm text-textSecondary">Verified</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-surface border border-border rounded-xl p-4"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <div className="text-sm text-textSecondary">Pending</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-surface border border-border rounded-xl p-4"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-error">{stats.unverified}</div>
              <div className="text-sm text-textSecondary">Unverified</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-error" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
              <input
                type="text"
                placeholder="Search lawyers by name, LSA ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text placeholder:text-textSecondary focus:outline-none focus:border-primary"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:border-primary"
            >
              <option value="all">All Lawyers</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
              <option value="pending">Pending Review</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedLawyers.length > 0 && (
              <button
                onClick={handleBulkVerify}
                disabled={isVerifying}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Verify {selectedLawyers.length} Selected
                  </>
                )}
              </button>
            )}
            
            <button className="px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface/80 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Lawyers Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedLawyers.length === filteredLawyers.length && filteredLawyers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLawyers(filteredLawyers.map(l => l.id));
                      } else {
                        setSelectedLawyers([]);
                      }
                    }}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left p-4 text-textSecondary font-semibold">Lawyer</th>
                <th className="text-left p-4 text-textSecondary font-semibold">LSA ID</th>
                <th className="text-left p-4 text-textSecondary font-semibold">Status</th>
                <th className="text-left p-4 text-textSecondary font-semibold">Last Verified</th>
                <th className="text-left p-4 text-textSecondary font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLawyers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                      <UserCheck className="w-8 h-8 text-textSecondary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text mb-2">No lawyers found</h3>
                    <p className="text-textSecondary">
                      {searchQuery 
                        ? 'No lawyers match your search criteria'
                        : 'No lawyers in the directory yet.'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLawyers.map((lawyer) => (
                  <tr key={lawyer.id} className="hover:bg-surface/50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedLawyers.includes(lawyer.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLawyers([...selectedLawyers, lawyer.id]);
                          } else {
                            setSelectedLawyers(selectedLawyers.filter(id => id !== lawyer.id));
                          }
                        }}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {lawyer.profile_data?.name?.charAt(0) || 'L'}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-text">
                            {lawyer.profile_data?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-textSecondary">
                            {lawyer.profile_data?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="px-2 py-1 bg-surface rounded text-sm">
                        {lawyer.lsa_id || 'Not provided'}
                      </code>
                    </td>
                    <td className="p-4">
                      <LSAVerificationBadge 
                        verificationStatus={{
                          verified: lawyer.is_verified,
                          status: lawyer.verification?.status,
                          lsa_id: lawyer.lsa_id,
                          last_verified: lawyer.verification?.verified_at
                        }}
                        size="sm"
                      />
                    </td>
                    <td className="p-4 text-textSecondary text-sm">
                      {lawyer.verification?.verified_at 
                        ? new Date(lawyer.verification.verified_at).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleManualVerify(lawyer.id, true)}
                          className="p-2 text-success hover:bg-success/10 rounded-lg"
                          title="Mark as verified"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleManualVerify(lawyer.id, false)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg"
                          title="Mark as unverified"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-textSecondary hover:bg-surface/80 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Results */}
      {verificationResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Verification Results
          </h3>
          <div className="space-y-2">
            {verificationResults.slice(0, 5).map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-error" />
                  )}
                  <div>
                    <div className="font-medium text-text">{result.name || `Lawyer ${result.lawyerId}`}</div>
                    <div className="text-sm text-textSecondary">
                      {result.action === 'manual' ? 'Manually updated' : 'Batch verified'}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  result.verified 
                    ? 'bg-success/10 text-success' 
                    : 'bg-error/10 text-error'
                }`}>
                  {result.verified ? 'Verified' : 'Unverified'}
                </div>
              </div>
            ))}
            {verificationResults.length > 5 && (
              <div className="text-center text-textSecondary text-sm pt-2">
                + {verificationResults.length - 5} more results
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Pending Verification Requests */}
      {verificationRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-text flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Pending Verification Requests
              </h3>
              <p className="text-textSecondary">Lawyers requesting LSA verification</p>
            </div>
            <span className="px-3 py-1 bg-warning/10 text-warning rounded-full text-sm font-medium">
              {verificationRequests.length} pending
            </span>
          </div>

          <div className="space-y-4">
            {verificationRequests.map((request) => (
              <div key={request.id} className="border border-border rounded-lg p-4 hover:bg-surface/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {request.lawyer_name?.charAt(0) || 'L'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-text">{request.lawyer_name}</h4>
                        <p className="text-sm text-textSecondary">
                          LSA ID: <code className="ml-1">{request.lsa_id}</code>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-textSecondary">
                      Submitted: {new Date(request.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 text-sm">
                      Approve
                    </button>
                    <button className="px-4 py-2 border border-error text-error rounded-lg hover:bg-error/10 text-sm">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminVerificationPanel;
