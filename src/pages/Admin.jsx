import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Settings, BarChart3, Users, MessageSquare, Star, FileText, Bell } from 'lucide-react'
import AdminPanel from '../components/AdminPanel'
import { useReviews } from '../context/ReviewContext'

export default function Admin() {
  const { getStats } = useReviews()
  const stats = getStats()

  const adminStats = [
    { icon: Users, value: '12', label: 'Total Lawyers', color: 'text-primary', change: '+2 this month' },
    { icon: MessageSquare, value: stats.totalPending.toString(), label: 'Pending Reviews', color: 'text-warning', change: 'Needs attention' },
    { icon: Star, value: '4.8', label: 'Avg Rating', color: 'text-accent', change: '+0.2 from last month' },
    { icon: BarChart3, value: `${Math.round((stats.totalApproved / Math.max(stats.totalReviews, 1)) * 100)}%`, label: 'Approval Rate', color: 'text-success', change: 'Excellent' },
  ]

  const recentActivities = [
    { id: 1, type: 'review', user: 'Michael R.', action: 'submitted a review', target: 'Sarah Chen', time: '2 hours ago', status: 'pending' },
    { id: 2, type: 'lawyer', user: 'Admin', action: 'added new lawyer', target: 'Lisa Wang', time: '1 day ago', status: 'completed' },
    { id: 3, type: 'update', user: 'System', action: 'updated categories', target: 'Corporate Law', time: '2 days ago', status: 'completed' },
    { id: 4, type: 'report', user: 'Jennifer P.', action: 'flagged a review', target: 'Robert Kim', time: '3 days ago', status: 'investigating' },
  ]

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/6694549/pexels-photo-6694549.jpeg"
            alt="Admin dashboard with legal documents"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Admin Dashboard</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Directory
              <span className="block gradient-text">Administration</span>
            </h1>
            
            <p className="text-xl text-textSecondary mb-8 max-w-xl">
              Manage lawyers, reviews, and directory settings. Monitor activity and ensure quality across the platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.href = '/admin-panel'}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Manage Reviews
              </button>
              <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                View Reports
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Admin Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {adminStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div 
              key={index}
              className="bg-surface border border-border rounded-xl p-6 hover:border-primary transition-all group cursor-pointer"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${stat.color}/10 flex items-center justify-center group-hover:${stat.color}/20 transition-colors`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${stat.color}/10 ${stat.color}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-textSecondary">{stat.label}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Admin Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-12"
      >
        <AdminPanel />
      </motion.div>

      {/* Recent Activity & Quick Actions */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {/* Recent Activity */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
            <button className="text-primary hover:text-primary/80 transition-colors text-sm">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-surface/50 rounded-lg transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.status === 'pending' ? 'bg-warning/10' :
                  activity.status === 'investigating' ? 'bg-error/10' :
                  'bg-success/10'
                }`}>
                  {activity.type === 'review' && <MessageSquare className="w-5 h-5 text-warning" />}
                  {activity.type === 'lawyer' && <Users className="w-5 h-5 text-primary" />}
                  {activity.type === 'update' && <Settings className="w-5 h-5 text-success" />}
                  {activity.type === 'report' && <Shield className="w-5 h-5 text-error" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{activity.user} {activity.action}</div>
                  <div className="text-sm text-textSecondary">{activity.target}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-textSecondary">{activity.time}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'pending' ? 'bg-warning/10 text-warning' :
                      activity.status === 'investigating' ? 'bg-error/10 text-error' :
                      'bg-success/10 text-success'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl p-4 text-center transition-colors group">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/30 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="font-semibold">Add Lawyer</div>
              <div className="text-sm text-textSecondary mt-1">Add new professional</div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/admin-panel'}
              className="bg-warning/10 hover:bg-warning/20 border border-warning/20 rounded-xl p-4 text-center transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-warning/30 transition-colors">
                <MessageSquare className="w-6 h-6 text-warning" />
              </div>
              <div className="font-semibold">Moderate</div>
              <div className="text-sm text-textSecondary mt-1">Review submissions</div>
            </button>
            
            <button className="bg-success/10 hover:bg-success/20 border border-success/20 rounded-xl p-4 text-center transition-colors group">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-success/30 transition-colors">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
              <div className="font-semibold">Analytics</div>
              <div className="text-sm text-textSecondary mt-1">View reports</div>
            </button>
            
            <button className="bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-xl p-4 text-center transition-colors group">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/30 transition-colors">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div className="font-semibold">Export</div>
              <div className="text-sm text-textSecondary mt-1">Download data</div>
            </button>
          </div>

          {/* System Status */}
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="font-semibold mb-3">Review System Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-textSecondary">Pending Reviews</span>
                <span className={`font-medium ${stats.totalPending > 0 ? 'text-warning' : 'text-success'}`}>
                  {stats.totalPending} pending
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-textSecondary">Approval Rate</span>
                <span className="text-success font-medium">
                  {Math.round((stats.totalApproved / Math.max(stats.totalReviews, 1)) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-textSecondary">Total Reviews</span>
                <span className="font-medium">{stats.totalReviews}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="relative bg-surface border border-border rounded-2xl p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Need Help with Administration?</h2>
              <p className="text-textSecondary mb-6 max-w-2xl">
                Our support team is available 24/7 to help with any administrative tasks, 
                technical issues, or questions about managing the directory.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                  Contact Support
                </button>
                <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors">
                  View Documentation
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-64 h-64 rounded-full bg-gradient-primary opacity-20 flex items-center justify-center">
                <Shield className="w-32 h-32 text-primary opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
