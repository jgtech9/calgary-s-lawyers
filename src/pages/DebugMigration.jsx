import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Database,
  Shield,
  Zap,
  BarChart,
  FileText
} from 'lucide-react';
import { 
  diagnoseMigrationIssue, 
  enhancedMigrateLawyers, 
  checkFirestoreState 
} from '../utils/debug-migration';

const DebugMigration = () => {
  const [diagnosis, setDiagnosis] = useState(null);
  const [migrationResult, setMigrationResult] = useState(null);
  const [firestoreState, setFirestoreState] = useState(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState('diagnosis');

  const runDiagnosis = async () => {
    setIsDiagnosing(true);
    setDiagnosis(null);
    
    try {
      const result = await diagnoseMigrationIssue();
      setDiagnosis(result);
    } catch (error) {
      setDiagnosis({
        success: false,
        error: error.message,
        stack: error.stack
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  const runMigration = async () => {
    setIsMigrating(true);
    setMigrationResult(null);
    
    try {
      const result = await enhancedMigrateLawyers();
      setMigrationResult(result);
      
      // Refresh Firestore state after migration
      await checkFirestoreState();
    } catch (error) {
      setMigrationResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const checkState = async () => {
    setIsChecking(true);
    
    try {
      const result = await checkFirestoreState();
      setFirestoreState(result);
    } catch (error) {
      setFirestoreState({
        error: error.message
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Auto-check Firestore state on mount
    checkState();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <RefreshCw className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-900/20 border-green-800';
      case 'failed': return 'bg-red-900/20 border-red-800';
      case 'warning': return 'bg-yellow-900/20 border-yellow-800';
      default: return 'bg-gray-900/20 border-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            🔧 Migration Debug Center
          </h1>
          <p className="text-gray-400">
            Diagnose and fix data migration issues between static data and Firebase Firestore
          </p>
        </motion.header>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'diagnosis', label: 'Diagnosis', icon: Search },
            { id: 'migration', label: 'Migration', icon: Database },
            { id: 'state', label: 'Firestore State', icon: BarChart },
            { id: 'actions', label: 'Quick Actions', icon: Zap }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Diagnosis Card */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">System Diagnosis</h3>
                  <p className="text-sm text-gray-400">Identify migration issues</p>
                </div>
              </div>
              
              <button
                onClick={runDiagnosis}
                disabled={isDiagnosing}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isDiagnosing
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isDiagnosing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Diagnosing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Run Full Diagnosis
                  </>
                )}
              </button>
            </motion.div>

            {/* Migration Card */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Enhanced Migration</h3>
                  <p className="text-sm text-gray-400">Migrate with chunking & retry</p>
                </div>
              </div>
              
              <button
                onClick={runMigration}
                disabled={isMigrating}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isMigrating
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isMigrating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Migrating...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Execute Enhanced Migration
                  </>
                )}
              </button>
            </motion.div>

            {/* Firestore State Card */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center">
                  <BarChart className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Firestore State</h3>
                  <p className="text-sm text-gray-400">Check current data</p>
                </div>
              </div>
              
              <button
                onClick={checkState}
                disabled={isChecking}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isChecking
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <BarChart className="w-4 h-4" />
                    Check Firestore State
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {activeTab === 'diagnosis' && diagnosis && (
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Diagnosis Results</h3>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    diagnosis.success 
                      ? 'bg-green-900/30 text-green-300' 
                      : 'bg-red-900/30 text-red-300'
                  }`}>
                    {diagnosis.success ? 'System OK' : 'Issues Found'}
                  </div>
                </div>

                {diagnosis.diagnostics && (
                  <div className="space-y-4">
                    {Object.entries(diagnosis.diagnostics).map(([key, phase]) => (
                      <div 
                        key={key}
                        className={`p-4 rounded-lg border ${getStatusColor(phase.status)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(phase.status)}
                            <span className="font-semibold">{phase.name}</span>
                          </div>
                          <span className="text-sm text-gray-400 capitalize">{phase.status}</span>
                        </div>
                        
                        {phase.details && Object.keys(phase.details).length > 0 && (
                          <div className="mt-2 text-sm">
                            {Object.entries(phase.details).map(([detailKey, value]) => (
                              <div key={detailKey} className="flex justify-between py-1 border-b border-gray-800/50 last:border-0">
                                <span className="text-gray-400">{detailKey}:</span>
                                <span className="font-mono text-xs">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {diagnosis.summary?.recommendations?.length > 0 && (
                  <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-800">
                    <h4 className="font-bold text-yellow-300 mb-2">⚠️ Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {diagnosis.summary.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'migration' && migrationResult && (
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Migration Results</h3>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    migrationResult.success 
                      ? 'bg-green-900/30 text-green-300' 
                      : 'bg-red-900/30 text-red-300'
                  }`}>
                    {migrationResult.success ? 'Success' : 'Failed'}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{migrationResult.totalLawyers || 0}</div>
                    <div className="text-sm text-gray-400">Total Lawyers</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{migrationResult.totalMigrated || 0}</div>
                    <div className="text-sm text-gray-400">Migrated</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{migrationResult.chunksProcessed || 0}</div>
                    <div className="text-sm text-gray-400">Chunks</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{migrationResult.failedChunks || 0}</div>
                    <div className="text-sm text-gray-400">Failed</div>
                  </div>
                </div>

                {migrationResult.verification && (
                  <div className="mb-6 p-4 bg-gray-900/30 rounded-lg">
                    <h4 className="font-bold mb-2">🔍 Verification</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">In Firestore</div>
                        <div className="text-lg font-bold">{migrationResult.verification.totalInFirestore}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Expected</div>
                        <div className="text-lg font-bold">{migrationResult.verification.expected}</div>
                      </div>
                    </div>
                    {migrationResult.verification.match === false && (
                      <div className="mt-2 text-sm text-yellow-400">
                        ⚠️ Count mismatch - some documents may not have been written
                      </div>
                    )}
                  </div>
                )}

                {migrationResult.errors && migrationResult.errors.length > 0 && (
                  <div className="p-4 bg-red-900/20 rounded-lg border border-red-800">
                    <h4 className="font-bold text-red-300 mb-2">❌ Errors</h4>
                    <div className="space-y-2">
                      {migrationResult.errors.map((error, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-semibold">Chunk {error.chunk}: {error.error}</div>
                          <div className="text-gray-400 text-xs mt-1">Code: {error.code}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'state' && firestoreState && (
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-bold mb-6">Firestore State</h3>
                
                {firestoreState.error ? (
                  <div className="p-4 bg-red-900/20 rounded-lg border border-red-800">
                    <div className="flex items-center gap-2 text-red-300">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">Error checking Firestore</span>
                    </div>
                    <div className="mt-2 text-sm">{firestoreState.error}</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <div className="text-sm text-gray-400">Collection Exists</div>
                        <div className="text-lg font-bold flex items-center gap-2">
                          {firestoreState.exists ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              Yes
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-500" />
                              No
                            </>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <div className="text-sm text-gray-400">Document Count</div>
                        <div className="text-lg font-bold">{firestoreState.count || 0}</div>
                      </div>
                    </div>

                    {firestoreState.sample && firestoreState.sample.length > 0 && (
                      <div>
                        <h4 className="font-bold mb-3">Sample Documents</h4>
                        <div className="space-y-3">
                          {firestoreState.sample.map((doc, index) => (
                            <div key={index} className="p-3 bg-gray-900/30 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-semibold">{doc.name}</div>
                                  <div className="text-sm text-gray-400">ID: {doc.id}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {doc.verified && (
                                    <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded">
                                      Verified
                                    </span>
                                  )}
                                  {doc.tier && (
                                    <span className="px-2 py-1 text-xs bg-blue-900/30 text-blue-300 rounded">
                                      {doc.tier}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {doc.categories && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {doc.categories.slice(0, 3).map((cat, catIndex) => (
                                    <span 
                                      key={catIndex}
                                      className="px-2 py-1 text-xs bg-gray-800 rounded"
                                    >
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!firestoreState.exists && (
                      <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-800">
                        <div className="flex items-center gap-2 text-yellow-300">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-semibold">No data found</span>
                        </div>
                        <p className="mt-2 text-sm">
                          The 'lawyers' collection doesn't exist or is empty. 
                          Run the migration to populate Firestore with lawyer data.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'actions' && (
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      runDiagnosis();
                      setActiveTab('diagnosis');
                    }}
                    className="p-4 bg-blue-900/30 hover:bg-blue-900/50 rounded-lg border border-blue-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Search className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold">Run Full Diagnosis</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Comprehensive system check to identify all migration issues
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      runMigration();
                      setActiveTab('migration');
                    }}
                    className="p-4 bg-purple-900/30 hover:bg-purple-900/50 rounded-lg border border-purple-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Database className="w-5 h-5 text-purple-400" />
                      <span className="font-semibold">Force Migration</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Execute enhanced migration with chunking and retry logic
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      checkState();
                      setActiveTab('state');
                    }}
                    className="p-4 bg-green-900/30 hover:bg-green-900/50 rounded-lg border border-green-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart className="w-5 h-5 text-green-400" />
                      <span className="font-semibold">Refresh State</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Check current Firestore data and collection status
                    </p>
                  </button>

                  <a
                    href="/test-firebase"
                    className="p-4 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg border border-gray-700 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold">Firebase Test</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Test Firebase connection and basic configuration
                    </p>
                  </a>
                </div>

                <div className="mt-mt-6 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                  <h4 className="font-bold mb-2">⚡ Troubleshooting Tips</h4>
                  <ul className="text-sm space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>If migration fails, check browser console for detailed errors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Ensure Firebase security rules allow writes to 'lawyers' collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Check network connectivity and CORS settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Verify environment variables are correctly set</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {!diagnosis && !migrationResult && !firestoreState && activeTab !== 'actions' && (
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-900/50 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">No Data Yet</h3>
                <p className="text-gray-400 mb-6">
                  Run a diagnosis or migration to see results here
                </p>
                <button
                  onClick={runDiagnosis}
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Start Diagnosis
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <motion.div 
          className="mt-8 flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <a 
            href="/" 
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            ← Return to Home
          </a>
          <a 
            href="/all-lawyers" 
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            View Lawyer Directory →
          </a>
          <a 
            href="/test-firebase" 
            className="px-6 py-3 bg-blue-900/30 hover:bg-blue-900/50 rounded-lg border border-blue-800 transition-colors"
          >
            Test Firebase Connection
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default DebugMigration;
