import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const LSAVerificationBadge = ({ verificationStatus, size = 'md', showDetails = false }) => {
  const getBadgeConfig = () => {
    if (!verificationStatus) {
      return {
        icon: AlertCircle,
        text: 'Not Verified',
        color: 'text-textSecondary',
        bgColor: 'bg-surface',
        borderColor: 'border-border',
        tooltip: 'This lawyer has not been verified by the Law Society of Alberta'
      };
    }

    if (verificationStatus.verified) {
      return {
        icon: CheckCircle,
        text: 'LSA Verified',
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        tooltip: 'Verified by Law Society of Alberta. Active member in good standing.'
      };
    }

    if (verificationStatus.status === 'pending_review') {
      return {
        icon: Clock,
        text: 'Verification Pending',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        tooltip: 'Verification request submitted. Under review by administrators.'
      };
    }

    return {
      icon: AlertCircle,
      text: 'Verification Required',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      tooltip: 'Verification with Law Society of Alberta is required'
    };
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center ${sizeClasses[size]} ${config.bgColor} border ${config.borderColor} rounded-full ${config.color} font-medium`}
      title={config.tooltip}
    >
      <Icon className={`${iconSizes[size]}`} />
      <span>{config.text}</span>
      
      {showDetails && verificationStatus && (
        <div className="ml-2 text-xs opacity-75">
          {verificationStatus.lsa_id && `ID: ${verificationStatus.lsa_id}`}
          {verificationStatus.last_verified && ` • Verified: ${new Date(verificationStatus.last_verified).toLocaleDateString()}`}
        </div>
      )}
    </motion.div>
  );
};

export const LSAVerificationModal = ({ lawyer, isOpen, onClose, onVerify }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface border border-border rounded-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text">LSA Verification</h3>
            <p className="text-textSecondary">Verify with Law Society of Alberta</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-surface border border-border rounded-lg p-4">
            <h4 className="font-semibold text-text mb-2">Lawyer Information</h4>
            <p className="text-text">{lawyer.profile_data?.name}</p>
            <p className="text-sm text-textSecondary">{lawyer.profile_data?.title}</p>
            {lawyer.lsa_id && (
              <p className="text-sm text-textSecondary mt-2">
                LSA ID: <span className="font-mono">{lawyer.lsa_id}</span>
              </p>
            )}
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <h4 className="font-semibold text-text mb-2">Verification Requirements</h4>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Valid LSA membership number
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Name matches LSA records
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Active status with Law Society
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border text-textSecondary rounded-lg hover:bg-surface/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onVerify(lawyer.id)}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Verify Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LSAVerificationBadge;
