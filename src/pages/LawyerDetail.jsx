import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Star, MapPin, Clock, Award, Phone, Mail, Calendar, 
  CheckCircle, Users, FileText, Globe, ChevronLeft,
  Briefcase, Shield, MessageSquare, Download
} from 'lucide-react'
import { getLawyerById } from '../data/lawyers'
import { IntakeForm } from '../components/IntakeForm'

export default function LawyerDetail() {
  const { id } = useParams()
  const [lawyer, setLawyer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showIntakeForm, setShowIntakeForm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // In production, this would fetch from Firestore
    // For now, use mock data
    const foundLawyer = getLawyerById(parseInt(id))
    setLawyer(foundLawyer)
    setLoading(false)
    
    // Simulate Firestore fetch delay
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [id])

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(rating)
                ? 'fill-warning text-warning'
                : 'fill-border text-border'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-bold">{rating.toFixed(1)}</span>
        <span className="text-textSecondary">({lawyer?.reviews} reviews)</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading lawyer profile...</p>
        </div>
      </div>
    )
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-textSecondary" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Lawyer Not Found</h1>
          <p className="text-textSecondary mb-6">
            The lawyer profile you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/all-lawyers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Browse All Lawyers
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'experience', label: 'Experience & Education', icon: Award },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'contact', label: 'Contact & Fees', icon: Phone },
  ]

  const specialties = [
    'Divorce & Separation',
    'Child Custody',
    'Family Mediation',
    'Prenuptial Agreements',
    'Spousal Support',
    'Property Division'
  ]

  const education = [
    { degree: 'Juris Doctor (J.D.)', school: 'University of Calgary Faculty of Law', year: '2010' },
    { degree: 'Bachelor of Arts in Political Science', school: 'University of Alberta', year: '2007' }
  ]

  const certifications = [
    'Certified Family Law Specialist',
    'Accredited Mediator - Alberta Family Mediation Society',
    'Member - Law Society of Alberta',
    'Member - Canadian Bar Association'
  ]

  const reviews = [
    { name: 'Jennifer M.', rating: 5, date: '2 weeks ago', comment: 'Sarah was incredibly compassionate and professional during my divorce. She made a difficult process much easier.' },
    { name: 'Robert K.', rating: 5, date: '1 month ago', comment: 'Excellent attention to detail and always available to answer questions. Highly recommended!' },
    { name: 'Amanda L.', rating: 4, date: '2 months ago', comment: 'Very knowledgeable and helped me navigate a complex custody agreement.' }
  ]

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link
          to="/all-lawyers"
          className="inline-flex items-center gap-2 text-textSecondary hover:text-text transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to All Lawyers
        </Link>
      </div>

      {/* Header Section */}
      <motion.div 
        className="bg-surface border border-border rounded-2xl p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lawyer Image & Basic Info */}
          <div className="lg:w-1/3">
            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden mb-4">
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary fill-secondary/10" />
                    <span className="text-sm font-medium text-secondary">Verified Lawyer</span>
                  </div>
                  {lawyer.featured && (
                    <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-4 bg-surface border border-border rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">
                    ${lawyer.hourlyRate || 300}/hr
                  </div>
                  <div className="text-sm text-textSecondary">Starting hourly rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{lawyer.name}</h1>
              <p className="text-xl text-primary font-medium mb-4">{lawyer.title}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-textSecondary" />
                  <span className="font-medium">{lawyer.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-textSecondary" />
                  <span className="font-medium">{lawyer.experience} experience</span>
                </div>
                {renderStars(lawyer.rating)}
              </div>

              <p className="text-lg text-textSecondary mb-6">
                {lawyer.description}
              </p>
            </div>

            {/* Specialties */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowIntakeForm(true)}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Consultation
              </button>
              <button
                onClick={() => setShowIntakeForm(true)}
                className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Send Message
              </button>
              <button className="px-8 py-3 border border-border text-text font-semibold rounded-lg hover:bg-surface/80 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Profile
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="border-b border-border mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-surface border-t border-l border-r border-border text-primary'
                    : 'text-textSecondary hover:text-text'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-2xl p-8"
      >
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Professional Overview</h3>
              <p className="text-textSecondary leading-relaxed">
                {lawyer.name} is a dedicated {lawyer.title.toLowerCase()} with extensive experience in {lawyer.categories.join(' and ')}. 
                With {lawyer.experience} of practice in Calgary, {lawyer.name.split(' ')[0]} has successfully represented 
                hundreds of clients in complex legal matters, achieving favorable outcomes through strategic 
                negotiation and litigation when necessary.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Practice Approach
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Client-centered representation with regular communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Strategic case evaluation and planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Transparent billing and fee structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Alternative dispute resolution when appropriate</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Languages & Accessibility
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium mb-2">Languages Spoken:</div>
                    <div className="flex flex-wrap gap-2">
                      {lawyer.languages?.map((lang, index) => (
                        <span key={index} className="px-3 py-1 bg-surface border border-border rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-2">Consultation Options:</div>
                    <div className="text-textSecondary">
                      {lawyer.consultationFee} • Virtual and in-person meetings available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Education & Credentials</h3>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="pb-6 border-b border-border last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-lg">{edu.degree}</div>
                        <div className="text-primary">{edu.school}</div>
                      </div>
                      <div className="px-3 py-1 bg-surface border border-border rounded">
                        {edu.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Professional Certifications</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-surface border border-border rounded-lg">
                    <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">Client Reviews</h3>
                <div className="flex items-center gap-4">
                  {renderStars(lawyer.rating)}
                  <span className="text-textSecondary">{lawyer.reviews} total reviews</span>
                </div>
              </div>
              <button className="px-6 py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary/10 transition-colors">
                Write a Review
              </button>
            </div>

            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="p-6 bg-surface border border-border rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-lg mb-1">{review.name}</div>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-warning text-warning'
                                : 'fill-border text-border'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-textSecondary text-sm">{review.date}</div>
                  </div>
                  <p className="text-textSecondary">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Phone Number</div>
                      <div className="text-textSecondary">(403) 555-{Math.floor(1000 + Math.random() * 9000)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-textSecondary">{lawyer.name.toLowerCase().replace(' ', '.')}@example.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Office Address</div>
                      <div className="text-textSecondary">
                        123 Legal Street, Suite 500<br />
                        Calgary, AB T2P 0H1
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Fee Structure</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-surface border border-border rounded-lg">
                    <div className="font-bold text-lg mb-1">Initial Consultation</div>
                    <div className="text-primary font-medium">{lawyer.consultationFee}</div>
                    <div className="text-sm text-textSecondary mt-2">30-minute introductory meeting</div>
                  </div>
                  <div className="p-4 bg-surface border border-border rounded-lg">
                    <div className="font-bold text-lg mb-1">Hourly Rate</div>
                    <div className="text-primary font-medium">${lawyer.hourlyRate || 300}/hour</div>
                    <div className="text-sm text-textSecondary mt-2">Billed in 6-minute increments</div>
                  </div>
                  <div className="p-4 bg-surface border border-border rounded-lg">
                    <div className="font-bold text-lg mb-1">Flat Fee Options</div>
                    <div className="text-primary font-medium">Available for specific services</div>
                    <div className="text-sm text-textSecondary mt-2">Contact for custom quote</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <h4 className="text-lg font-bold mb-4">Schedule a Consultation</h4>
              <p className="text-textSecondary mb-6">
                Ready to discuss your legal needs? Book a consultation to get personalized advice.
              </p>
              <button
                onClick={() => setShowIntakeForm(true)}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Schedule Now
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Related Lawyers */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Similar Lawyers in Calgary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => {
            const similar = getLawyerById(index + 1)
            if (!similar) return null
            return (
              <div key={index} className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img src={similar.image} alt={similar.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold">{similar.name}</div>
                    <div className="text-sm text-primary">{similar.title}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-warning text-warning" />
                      <span className="text-sm font-medium">{similar.rating}</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/lawyer/${similar.id}`}
                  className="block w-full text-center py-2 border border-border rounded-lg hover:bg-surface/80 transition-colors text-sm font-medium"
                >
                  View Profile
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Intake Form Modal */}
      {showIntakeForm && (
        <IntakeForm
          lawyerId={lawyer.id}
          lawyerName={lawyer.name}
          onClose={() => setShowIntakeForm(false)}
          onSuccess={() => {
            alert('✅ Your consultation request has been sent! ' + lawyer.name + ' will contact you within 24 hours.')
            setShowIntakeForm(false)
          }}
        />
      )}
    </div>
  )
}
