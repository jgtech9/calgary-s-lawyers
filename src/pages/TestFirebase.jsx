import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Upload,
  Download,
  Shield,
  Zap,
  Users,
  FileText
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { migrateLawyersToFirestore } from '../utils/migrateLawyers';
import { getAllLawyers } from '../data/lawyers';

const TestFirebase = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);
  const [lawyerCount, setLawyerCount] = useState(0);
  const [firestoreCount, setFirestoreCount] = useState(0);

  const runConnectionTest = async () => {
    setIsTesting(true);
    setTestResults([]);
    setConnectionStatus('testing');

    const tests = [
      { name: 'Firebase Initialization', test: () => db !== null },
      { name: 'Project ID Check', test: () => db.app.options.projectId !== undefined },
      { name: 'Firestore Instance', test: () => db.type === 'firestore' },
    ];

    const results = [];

    for (const test of tests) {
      try {
        const passed = await Promise.resolve(test.test());
        results.push({
          name: test.name,
          passed,
          message: passed ? 'Success' : 'Failed',
          icon: passed ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
        });
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          message: error.message,
          icon: <XCircle className="w-5 h-5 text-red-500" />
        });
      }
    }

    // Test actual Firestore connection
    try {
      const testCollection = collection(db, '_connection_test');
      await getDocs(testCollection);
      results.push({
        name: 'Firestore Connection',
        passed: true,
        message: 'Connected successfully',
        icon: <CheckCircle className="w-5 h-5 text-green-500" />
      });
      setConnectionStatus('connected');
    } catch (error) {
      results.push({
        name: 'Firestore Connection',
        passed: false,
        message: error.message,
        icon: <XCircle className="w-5 h-5 text-red-500" />
      });
      setConnectionStatus('failed');
    }

    setTestResults(results);
    setIsTesting(false);
    
    // Load counts after test
    loadCounts();
  };

  const loadCounts = async () => {
    // Count lawyers in src/data/lawyers.js
    const lawyers = getAllLawyers();
    setLawyerCount(lawyers.length);

    // Count lawyers in Firestore
    try {
      const lawyersRef = collection(db, 'lawyers');
      const snapshot = await getDocs(lawyersRef);
      setFirestoreCount(snapshot.size);
    } catch (error) {
      console.error('Error counting Firestore lawyers:', error);
      setFirestoreCount(0);
    }
  };

  const runMigration = async () => {
    setIsMigrating(true);
    setMigrationResult(null);

    try {
      const result = await migrateLawyersToFirestore();
      setMigrationResult(result);
      
      if (result.success) {
        // Refresh counts after successful migration
        await loadCounts();
      }
    } catch (error) {
      setMigrationResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const testWritePermission = async () => {
    try {
      const testCollection = collection(db, '_write_test');
      const testDoc = await addDoc(testCollection, {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Firestore write test'
      });

      // Clean up
      await deleteDoc(doc(db, '_write_test', testDoc.id));

      return {
        success: true,
        message: 'Write permission granted'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };

  const runWriteTest = async () => {
    setIsTesting(true);
    const result = await testWritePermission();
    
    setTestResults(prev => [...prev, {
      name: 'Write Permission Test',
      passed: result.success,
      message: result.message,
      icon: result.success ? 
        <CheckCircle className="w-5 h-5 text-green-500" /> : 
        <XCircle className="w-5 h-5 text-red-500" />
    }]);
    
    setIsTesting(false);
  };

  useEffect(() => {
    runConnectionTest();
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-900/20 border-green-800';
      case 'failed': return 'bg-red-900/20 border-red-800';
      default: return 'bg-yellow-900/20 border-yellow-800';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'failed': return 'Connection Failed';
      default: return 'Testing...';
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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Firebase Connection Test</h1>
              <p className="text-gray-400">Verify Firebase configuration and data migration</p>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${getStatusColor()} border`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {connectionStatus === 'connected' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : connectionStatus === 'failed' ? (
                  <XCircle className="w-6 h-6 text-red-500" />
                ) : (
                  <RefreshCw className="w-6 h-6 text-yellow-500 animate-spin" />
                )}
                <div>
                  <h3 className="font-bold text-lg">Connection Status: {getStatusText()}</h3>
                  <p className="text-sm text-gray-400">
                    {connectionStatus === 'connected' 
                      ? 'Firebase is properly configured and connected'
                      : connectionStatus === 'failed'
                      ? 'There are issues with the Firebase configuration'
                      : 'Testing connection...'}
                  </p>
                </div>
              </div>
              <button
                onClick={runConnectionTest}
                disabled={isTesting}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                {isTesting ? 'Testing...' : 'Retest'}
              </button>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tests & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Tests */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Connection Tests
              </h3>
              
              <div className="space-y-3">
                {testResults.map((test, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      test.passed ? 'bg-green-900/10' : 'bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {test.icon}
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-gray-400">{test.message}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      test.passed ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                    }`}>
                      {test.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={runWriteTest}
                  disabled={isTesting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Test Write Permission
                </button>
                <button
                  onClick={runConnectionTest}
                  disabled={isTesting}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  Run All Tests
                </button>
              </div>
            </motion.div>

            {/* Data Migration */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-500" />
                Data Migration
              </h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900/30 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div className="text-sm text-gray-400">Static Data</div>
                  </div>
                  <div className="text-3xl font-bold">{lawyerCount}</div>
                  <div className="text-sm text-gray-400">Lawyers in src/data/lawyers.js</div>
                </div>
                
                <div className="bg-gray-900/30 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-5 h-5 text-green-400" />
                    <div className="text-sm text-gray-400">Firestore</div>
                  </div>
                  <div className="text-3xl font-bold">{firestoreCount}</div>
                  <div className="text-sm text-gray-400">Lawyers in Firestore</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-900/30 rounded-lg">
                  <h4 className="font-bold mb-2">Migration Details</h4>
                  <ul className="text-sm space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Source: <code className="bg-gray-800 px-1 rounded">src/data/lawyers.js</code></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Target: Firestore <code className="bg-gray-800 px-1 rounded">lawyers</code> collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Adds: <code className="bg-gray-800 px-1 rounded">verified: true</code> and <code className="bg-gray-800 px-1 rounded">tier: 'standard'</code> fields</span>
                    </li>
                  </ul>
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
                      Migrating Data...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Migrate Lawyers to Firestore
                    </>
                  )}
                </button>

                {migrationResult && (
                  <div className={`p-4 rounded-lg ${
                    migrationResult.success 
                      ? 'bg-green-900/20 border border-green-800' 
                      : 'bg-red-900/20 border border-red-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {migrationResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-bold">
                        {migrationResult.success ? 'Migration Successful' : 'Migration Failed'}
                      </span>
                    </div>
                    <p className="text-sm">
                      {migrationResult.success 
                        ? 'Lawyer data has been successfully migrated to Firestore.'
                        : migrationResult.error || 'An unknown error occurred.'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Info & Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <a
                  href="/debug-migration"
                  className="block p-3 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg border border-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-medium">Debug Migration</div>
                      <div className="text-sm text-gray-400">Advanced diagnostics</div>
                    </div>
                  </div>
                </a>
                
                <a
                  href="/all-lawyers"
                  className="block p-3 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg border border-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-medium">View Lawyers</div>
                      <div className="text-sm text-gray-400">Browse directory</div>
                    </div>
                  </div>
                </a>
                
                <button
                  onClick={loadCounts}
                  className="w-full p-3 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg border border-gray-700 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="font-medium">Refresh Counts</div>
                      <div className="text-sm text-gray-400">Update data statistics</div>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Configuration Info */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Configuration
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-sm text-gray-400">Environment</div>
                  <div className="font-medium">{import.meta.env.MODE}</div>
                </div>
                
                <div className="p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-sm text-gray-400">Project ID</div>
                  <div className="font-medium font-mono text-sm truncate">
                    {db?.app?.options?.projectId || 'Not configured'}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-sm text-gray-400">Data Source</div>
                  <div className="font-medium">src/data/lawyers.js</div>
                </div>
              </div>
            </motion.div>

            {/* Troubleshooting */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">⚠️ Troubleshooting</h3>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-yellow-900/20 rounded-lg">
                  <div className="font-bold text-yellow-300 mb-1">Migration Not Working?</div>
                  <p className="text-yellow-200/80">
                    Check browser console for detailed error messages
                  </p>
                </div>
                
                <div className="p-3 bg-blue-900/20 rounded-lg">
                  <div className="font-bold text-blue-300 mb-1">Firestore Rules</div>
                  <p className="text-blue-200/80">
                    Ensure Firestore security rules allow writes
                  </p>
                </div>
                
                <div className="p-3 bg-red-900/20 rounded-lg">
                  <div className="font-bold text-red-300 mb-1">Connection Issues</div>
                  <p className="text-red-200/80">
                    Verify Firebase configuration in .env file
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
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
            href="/debug-migration" 
            className="px-6 py-3 bg-blue-900/30 hover:bg-blue-900/50 rounded-lg border border-blue-800 transition-colors"
          >
            Debug Migration →
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default TestFirebase;
