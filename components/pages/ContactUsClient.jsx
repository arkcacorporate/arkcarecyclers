'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

function Reveal({ children, delay = 0, y = 28, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ContactUsClient() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'Waste Collection',
    subject: '',
    message: ''
  });

  const reduce = useReducedMotion();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceInterest: 'Waste Collection',
        subject: '',
        message: ''
      });
    }, 5000);
  };

  return (
    <div className="contact-us-page">
      {/* 1. HERO BANNER (REALISTIC RECYCLING FACILITY IMAGE) */}
      <section className="inner-hero">
        <div
          className="inner-hero-bg"
          style={{ backgroundImage: 'url(/images/recycling/facility.webp)' }}
        />
        <div className="inner-hero-shade" />
        <div className="container">
          <div className="inner-hero-content">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="breadcrumb">
                <Link href="/">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <span>Contact Us</span>
              </div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="badge-tag light-theme">WE ARE HERE TO HELP</span>
              <h1 className="ip-h1">
                Connect with Our Sustainability Team
              </h1>
              <p className="inner-hero-desc">
                Have questions regarding waste disposal, EPR compliance certificates, or corporate recycling tie-ups? Our consultants are ready to assist you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CONTACT CHANNELS & FORM */}
      <section className="section section-white">
        <div className="container">
          <div className="ip-contact-grid">
            {/* Left: Contact Info */}
            <Reveal>
              <span className="badge-tag">OFFICE & COMMUNICATIONS</span>
              <h2 className="ip-h2 ip-h2-dark" style={{ marginBottom: '20px' }}>
                Let's Build a <span className="text-highlight">Sustainable Future</span> Together
              </h2>
              <p className="ip-body ip-body-dark" style={{ marginBottom: '36px' }}>
                Reach out to our Kolkata headquarters or request our field recycling specialists to visit your industrial plant or commercial facility.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Address Card */}
                <div className="ip-contact-card-item">
                  <div className="ip-icon-circle" style={{ marginBottom: 0, flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="ip-h3" style={{ fontSize: '1.1rem', color: '#071C19', marginBottom: '4px' }}>
                      Registered Headquarters
                    </h4>
                    <p className="ip-body ip-body-dark" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                      Block 4A, Ecospace Business Park, 6th Floor, Unit 603, Kolkata - 700156, West Bengal, India
                    </p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="ip-contact-card-item">
                  <div className="ip-icon-circle" style={{ marginBottom: 0, flexShrink: 0 }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="ip-h3" style={{ fontSize: '1.1rem', color: '#071C19', marginBottom: '4px' }}>
                      Helpline & Inquiries
                    </h4>
                    <p className="ip-body ip-body-dark" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                      Direct: <a href="tel:+919316631170" style={{ color: 'var(--ip-accent)', fontWeight: 600 }}>+91-9316-631-170</a> <br />
                      Toll-Free Support available Mon-Sat
                    </p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="ip-contact-card-item">
                  <div className="ip-icon-circle" style={{ marginBottom: 0, flexShrink: 0 }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 className="ip-h3" style={{ fontSize: '1.1rem', color: '#071C19', marginBottom: '4px' }}>
                      Official Email
                    </h4>
                    <p className="ip-body ip-body-dark" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                      Inquiries: <a href="mailto:contact@arkcarecyclers.com" style={{ color: 'var(--ip-accent)', fontWeight: 600 }}>contact@arkcarecyclers.com</a> <br />
                      Compliance desk: <a href="mailto:epr@arkcarecyclers.com" style={{ color: 'var(--ip-accent)', fontWeight: 600 }}>epr@arkcarecyclers.com</a>
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="ip-contact-card-item">
                  <div className="ip-icon-circle" style={{ marginBottom: 0, flexShrink: 0 }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 className="ip-h3" style={{ fontSize: '1.1rem', color: '#071C19', marginBottom: '4px' }}>
                      Operating Hours
                    </h4>
                    <p className="ip-body ip-body-dark" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                      Monday – Saturday: 9:30 AM – 6:30 PM IST <br />
                      Emergency Hazardous Transport: 24/7 on call
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: Message Form */}
            <Reveal delay={0.15}>
              <div className="disposal-form-card" style={{ background: '#071C19', borderRadius: '24px', border: '1px solid rgba(72,207,115,0.25)' }}>
                <div className="disposal-form-header">
                  <span className="badge-tag light-theme">DIRECT MESSAGE</span>
                  <h3 className="disposal-form-title">Send Us a Message</h3>
                  <p className="disposal-form-sub">We usually respond within 2 to 4 business hours.</p>
                </div>

                {formSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 10px', color: '#48cf73' }}>
                    <CheckCircle size={52} style={{ margin: '0 auto 16px' }} />
                    <h4 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '8px' }}>
                      Message Sent Successfully!
                    </h4>
                    <p style={{ color: '#a6c5ba', fontSize: '0.95rem' }}>
                      Thank you for reaching out. An ARKCA representative has received your request and will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="disposal-form-grid">
                      <div className="form-group">
                        <label className="form-label" htmlFor="cnt-name">Your Name</label>
                        <input
                          id="cnt-name"
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="cnt-email">Email Address</label>
                        <input
                          id="cnt-email"
                          type="email"
                          name="email"
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="cnt-phone">Phone Number</label>
                        <input
                          id="cnt-phone"
                          type="tel"
                          name="phone"
                          placeholder="+91-0000000000"
                          value={formData.phone}
                          onChange={handleChange}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="cnt-company">Company / Organization</label>
                        <input
                          id="cnt-company"
                          type="text"
                          name="company"
                          placeholder="Organization Name"
                          value={formData.company}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label" htmlFor="cnt-service">Service of Interest</label>
                        <select
                          id="cnt-service"
                          name="serviceInterest"
                          value={formData.serviceInterest}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="Waste Collection">Waste Collection & Disposal</option>
                          <option value="EPR Consultancy">EPR Consultancy & Credit Fulfillment</option>
                          <option value="CSR Initiatives">Corporate Social Responsibility (CSR)</option>
                          <option value="Corporate Programme">Corporate Collection Agreement</option>
                          <option value="Facility Visit">Recycling Plant Audit / Visit</option>
                          <option value="Other">Other Inquiry</option>
                        </select>
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label" htmlFor="cnt-subject">Subject</label>
                        <input
                          id="cnt-subject"
                          type="text"
                          name="subject"
                          placeholder="How can we assist you?"
                          value={formData.subject}
                          onChange={handleChange}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label" htmlFor="cnt-message">Your Message</label>
                        <textarea
                          id="cnt-message"
                          name="message"
                          placeholder="Please provide details regarding your requirements, quantities, or regulatory deadlines."
                          value={formData.message}
                          onChange={handleChange}
                          className="form-textarea"
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="form-submit-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Send size={18} /> Submit Inquiry
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. LOCATION MAP & VISIT US */}
      <section className="section section-light" style={{ paddingBottom: '90px' }}>
        <div className="container">
          <Reveal>
            <div style={{
              background: '#fff',
              borderRadius: '24px',
              border: '1px solid var(--ip-border-light)',
              overflow: 'hidden',
              boxShadow: '0 12px 36px -10px rgba(7, 28, 25, 0.08)'
            }}>
              <div style={{ padding: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5ece8', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <span className="badge-tag">VISIT OUR STRATEGIC HUB</span>
                  <h3 className="ip-h3" style={{ fontSize: '1.6rem', color: '#071C19' }}>
                    Kolkata Ecospace Facility & Corporate Office
                  </h3>
                  <p className="ip-body ip-body-dark" style={{ fontSize: '0.95rem' }}>
                    Located in the heart of Rajarhat New Town IT & Clean Tech corridor.
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=Ecospace+Business+Park+Kolkata"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary ax-btn-solid"
                >
                  Open in Google Maps <ArrowRight size={16} />
                </a>
              </div>

              <div style={{ position: 'relative', width: '100%', height: '360px', background: '#0b2521' }}>
                <iframe
                  title="ARKCA Recyclers Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.076801997084!2d88.46876187588327!3d22.576231932820546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02753381a1728d%3A0xbfa7a4c4e7ce2911!2sEcospace%20Business%20Park!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
