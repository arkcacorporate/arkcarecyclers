'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Facebook,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { sendEmail } from '@/lib/emailService';

export default function SiteFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const result = await sendEmail({
      formType: 'newsletter',
      formName: 'Newsletter Subscription Form',
      pageName: 'Global Site Footer',
      data: { email: newsletterEmail },
      honeypot
    });

    setIsSubmitting(false);

    if (result.success) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setHoneypot('');
      setTimeout(() => {
        setNewsletterSubscribed(false);
      }, 5000);
    } else {
      setErrorMessage(result.error || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Logo & About */}
          <div className="footer-col-about">
            <Link href="/" style={{ display: 'inline-block' }}>
              <img
                src="/images/logo/arkcarecyclerslogo.webp"
                alt="ARKCA Recyclers"
                className="footer-logo-img"
                loading="lazy"
                decoding="async"
                width="200"
                height="54"
              />
            </Link>
            <p>
              Arkca Recycler is driven with a commitment to connect with a maximum number of waste handlers and pickers looking ahead to integrate with the EPR regime.
            </p>
            <div className="footer-social-row">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Our Services */}
          <div>
            <h4 className="footer-heading">OUR SERVICES</h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/waste-collection">• Waste collection</Link>
              </li>
              <li>
                <Link href="/epr-consultancy">• EPR consultancy</Link>
              </li>
              <li>
                <Link href="/know-us">• Corporate social responsibility</Link>
              </li>
              <li>
                <Link href="/waste-collection">• Metal Recycling</Link>
              </li>
              <li>
                <Link href="/waste-collection">• Used Oil Management</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h4 className="footer-heading">CONTACT US</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <MapPin size={20} />
                <span>
                  Block 4A, Ecospace Business Park, 6th Floor, Unit 603, Kolkata - 700156, West Bengal, India
                </span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} />
                <span>+91-9316-631-170</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} />
                <span>contact@arkcarecyclers.com</span>
              </div>
            </div>
          </div>

          {/* Column 4: Stay Updated */}
          <div className="footer-newsletter">
            <h4 className="footer-heading">STAY UPDATED</h4>
            <p>Stay up to date with our latest news and events</p>
            {newsletterSubscribed ? (
              <div style={{ color: '#48cf73', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <CheckCircle size={18} /> Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
                {/* Anti-spam honeypot (hidden from real users) */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="_news_hp"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="footer-newsletter-input"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="footer-newsletter-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    opacity: isSubmitting ? 0.75 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
            )}
            {errorMessage && (
              <div style={{ color: '#ff8a8a', fontSize: '0.8rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ARKCA Recyclers. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/know-us">Privacy Policy</Link>
            <Link href="/know-us">Terms & Conditions</Link>
            <Link href="/epr-consultancy">CPCB Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
