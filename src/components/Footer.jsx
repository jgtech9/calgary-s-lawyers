import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const navigate = useNavigate()

  // Handle review navigation with scroll to top
  const handleReviewsNavigation = (e) => {
    e.preventDefault()
    
    // If already on reviews page, scroll to top
    if (location.pathname === '/reviews') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      // Navigate to reviews page
      navigate('/reviews')
    }
  }

  const footerLinks = {
    'Legal Areas': [
      { name: 'Family Law', path: '/family-law' },
      { name: 'Corporate Law', path: '/corporate-law' },
      { name: 'Real Estate', path: '/real-estate' },
      { name: 'Criminal Defense', path: '/criminal-defense' },
      { name: 'Employment Law', path: '/employment-law' },
      { name: 'Civil Law', path: '/civil-law' },
    ],
    'Company': [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Reviews', path: '/reviews' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
    ],
    'Resources': [
      { name: 'Legal Blog', path: '/blog' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookie-policy' },
    ],
    'Support': [
      { name: 'Help Center', path: '/support#help-center' },
      { name: 'Live Chat', path: '/support#live-chat' },
      { name: 'Emergency Help', path: '/support#emergency-help' },
      { name: 'Report Issue', path: '/support#report-issue' },
      { name: 'Status', path: '/support#status' },
    ],
  }

  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">CL</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Calgary<span className="text-primary">Lawyers</span></h2>
                <p className="text-textSecondary">Trusted Legal Directory</p>
              </div>
            </Link>
            <p className="text-textSecondary mb-6 max-w-md">
              Connecting Calgarians with trusted, verified legal professionals since 2023. 
              Your trusted partner for finding the right legal representation.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <a href="#" className="p-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      onClick={link.name === 'Reviews' ? handleReviewsNavigation : undefined}
                      className="text-textSecondary hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-textSecondary text-sm">Emergency Legal Help</div>
                <div className="font-semibold">(403) 555-HELP</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="text-textSecondary text-sm">General Inquiries</div>
                <div className="font-semibold">info@calgarylawyers.ca</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-textSecondary text-sm">Head Office</div>
                <div className="font-semibold">Calgary, Alberta</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-textSecondary">
              <Shield className="w-4 h-4" />
              <span>© {currentYear} CalgaryLawyers. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy-policy" className="text-textSecondary hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-textSecondary hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-textSecondary hover:text-primary transition-colors">
                Cookie Policy
              </Link>
              <Link to="/faqs" className="text-textSecondary hover:text-primary transition-colors">
                FAQs
              </Link>
              <Link to="/press" className="text-textSecondary hover:text-primary transition-colors">
                Press
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
