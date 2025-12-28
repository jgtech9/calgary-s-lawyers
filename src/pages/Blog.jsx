import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, User, Clock, Tag, ChevronRight, BookOpen, Search, TrendingUp, Share2, Bookmark } from 'lucide-react'

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Family Law in Alberta: A Comprehensive Guide',
      excerpt: 'Learn about the key aspects of family law in Alberta including divorce, child custody, and spousal support.',
      author: 'Sarah Johnson',
      date: '2024-03-15',
      readTime: '8 min read',
      category: 'Family Law',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
      tags: ['Family Law', 'Alberta', 'Legal Guide'],
    },
    {
      id: 2,
      title: 'Corporate Legal Structures: Choosing the Right One for Your Business',
      excerpt: 'A detailed comparison of different corporate structures and their legal implications for Calgary businesses.',
      author: 'Michael Chen',
      date: '2024-03-10',
      readTime: '12 min read',
      category: 'Corporate Law',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      tags: ['Corporate', 'Business', 'Legal Structure'],
    },
    {
      id: 3,
      title: 'Real Estate Transactions: Common Pitfalls and How to Avoid Them',
      excerpt: 'Essential tips for navigating real estate transactions in Calgary\'s competitive market.',
      author: 'Emma Rodriguez',
      date: '2024-03-05',
      readTime: '6 min read',
      category: 'Real Estate',
      image: 'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg',
      tags: ['Real Estate', 'Property', 'Transactions'],
    },
    {
      id: 4,
      title: 'Know Your Rights: Employment Law Updates for 2024',
      excerpt: 'Recent changes to employment laws in Alberta and what they mean for both employers and employees.',
      author: 'David Wilson',
      date: '2024-02-28',
      readTime: '10 min read',
      category: 'Employment Law',
      image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
      tags: ['Employment', 'Rights', '2024 Updates'],
    },
    {
      id: 5,
      title: 'Criminal Defense: Understanding Your Legal Options',
      excerpt: 'A guide to criminal defense strategies and what to expect when facing criminal charges in Calgary.',
      author: 'Robert Miller',
      date: '2024-02-20',
      readTime: '9 min read',
      category: 'Criminal Defense',
      image: 'https://images.pexels.com/photos/5668479/pexels-photo-5668479.jpeg',
      tags: ['Criminal', 'Defense', 'Legal Rights'],
    },
    {
      id: 6,
      title: 'Civil Litigation: When to Consider Legal Action',
      excerpt: 'Understanding civil litigation processes and determining when legal action is the right choice.',
      author: 'Jennifer Lee',
      date: '2024-02-15',
      readTime: '7 min read',
      category: 'Civil Law',
      image: 'https://images.pexels.com/photos/5668476/pexels-photo-5668476.jpeg',
      tags: ['Civil', 'Litigation', 'Legal Action'],
    },
  ]

  const categories = [
    { name: 'Family Law', count: 12, color: 'bg-primary/10 text-primary' },
    { name: 'Corporate Law', count: 8, color: 'bg-secondary/10 text-secondary' },
    { name: 'Real Estate', count: 15, color: 'bg-accent/10 text-accent' },
    { name: 'Criminal Defense', count: 9, color: 'bg-warning/10 text-warning' },
    { name: 'Employment Law', count: 11, color: 'bg-success/10 text-success' },
    { name: 'Civil Law', count: 7, color: 'bg-error/10 text-error' },
  ]

  const popularTags = [
    'Legal Advice', 'Alberta Law', 'Business', 'Property', 'Family', 
    'Employment', 'Criminal', 'Civil Rights', 'Contracts', 'Litigation'
  ]

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Legal <span className="text-primary">Blog</span>
        </h1>
        <p className="text-xl text-textSecondary max-w-3xl mx-auto mb-8">
          Expert insights, legal updates, and practical advice from Calgary's top legal professionals.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              placeholder="Search blog posts..."
              className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Featured Post */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img
                  src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
                  alt="Featured blog post"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    Family Law
                  </span>
                  <div className="flex items-center gap-2 text-textSecondary">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">March 15, 2024</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Understanding Family Law in Alberta: A Comprehensive Guide
                </h2>
                <p className="text-textSecondary mb-6">
                  Learn about the key aspects of family law in Alberta including divorce, child custody, 
                  and spousal support. Our expert lawyers break down complex legal concepts into 
                  understandable information.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                        alt="Author"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">Sarah Johnson</div>
                      <div className="text-sm text-textSecondary">Family Law Expert</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                      <Bookmark className="w-5 h-5 text-textSecondary" />
                    </button>
                    <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                      <Share2 className="w-5 h-5 text-textSecondary" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Latest Articles</h2>
              <div className="flex items-center gap-2">
                <span className="text-textSecondary">Sort by:</span>
                <select className="bg-surface border border-border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Latest</option>
                  <option>Popular</option>
                  <option>Trending</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary transition-all group"
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-background/80 backdrop-blur-sm text-xs font-semibold rounded">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-sm text-textSecondary">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-textSecondary">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-textSecondary mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-textSecondary" />
                        <span className="text-sm text-textSecondary">{post.author}</span>
                      </div>
                      <Link 
                        to={`/blog/${post.id}`}
                        className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-semibold"
                      >
                        Read More
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-surface border border-border text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* Pagination */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <nav className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center border border-border rounded-lg hover:bg-surface transition-colors">
                ←
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-lg font-semibold">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-border rounded-lg hover:bg-surface transition-colors">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-border rounded-lg hover:bg-surface transition-colors">
                3
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-border rounded-lg hover:bg-surface transition-colors">
                →
              </button>
            </nav>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Categories */}
          <motion.div 
            className="bg-surface border border-border rounded-xl p-6 mb-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Categories
            </h3>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between p-3 hover:bg-surface/50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]}`} />
                    <span>{category.name}</span>
                  </div>
                  <span className="px-2 py-1 bg-surface border border-border text-xs rounded">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Popular Tags */}
          <motion.div 
            className="bg-surface border border-border rounded-xl p-6 mb-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-surface border border-border text-sm rounded-full hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-border rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
            <p className="text-textSecondary mb-4">
              Get the latest legal insights and updates delivered to your inbox.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-textSecondary mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
