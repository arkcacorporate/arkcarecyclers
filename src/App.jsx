import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Facebook,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

import Home from './pages/Home.jsx';
import KnowUs from './pages/KnowUs.jsx';
import WasteCollection from './pages/WasteCollection.jsx';
import EPRConsultancy from './pages/EPRConsultancy.jsx';
import ContactUs from './pages/ContactUs.jsx';

// Scroll to top on every route navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Navigation Bar
function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isHome = location.pathname === '/';
  const navClass = `navbar ${!isHome || scrolled ? 'navbar-scrolled' : ''}`;

  return (
    <>
      <header className={navClass}>
        <div className="container nav-container">
          {/* Brand Logo */}
          <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/images/logo/arkcarecyclerslogo.webp"
              alt="ARKCA Recyclers"
              className="nav-logo-img"
              width="220"
              height="60"
            />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="nav-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation' : 'Open Navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Nav Links (Desktop & Mobile Drawer) */}
          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`} aria-label="Main Navigation">
            <div className="mobile-nav-header">
              <img
                src="/images/logo/arkcarecyclerslogo.webp"
                alt="ARKCA Recyclers"
                className="nav-logo-img-mobile"
                width="180"
                height="50"
              />
              <button
                type="button"
                className="mobile-nav-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Navigation"
              >
                <X size={24} />
              </button>
            </div>

            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              arkca recyclers
            </Link>
            <Link
              to="/know-us"
              className={`nav-link ${location.pathname === '/know-us' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Know Us
            </Link>
            <Link
              to="/waste-collection"
              className={`nav-link ${location.pathname === '/waste-collection' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Waste Collection
            </Link>
            <Link
              to="/epr-consultancy"
              className={`nav-link ${location.pathname === '/epr-consultancy' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              EPR Consultancy
            </Link>
            <Link
              to="/contact-us"
              className={`nav-link ${location.pathname === '/contact-us' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>

            <Link
              to="/contact-us"
              className="nav-cta-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get in Touch <ArrowRight size={14} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`nav-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}

// Site Footer
function SiteFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Logo & About */}
          <div className="footer-col-about">
            <Link to="/" style={{ display: 'inline-block' }}>
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
                <Link to="/waste-collection">• Waste collection</Link>
              </li>
              <li>
                <Link to="/epr-consultancy">• EPR consultancy</Link>
              </li>
              <li>
                <Link to="/know-us">• Corporate social responsibility</Link>
              </li>
              <li>
                <Link to="/waste-collection">• Metal Recycling</Link>
              </li>
              <li>
                <Link to="/waste-collection">• Used Oil Management</Link>
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
                <input
                  type="email"
                  placeholder="Email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="footer-newsletter-input"
                  required
                />
                <button type="submit" className="footer-newsletter-btn">
                  Send
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ARKCA Recyclers. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/know-us">Privacy Policy</Link>
            <Link to="/know-us">Terms & Conditions</Link>
            <Link to="/epr-consultancy">CPCB Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-layout">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/know-us" element={<KnowUs />} />
            <Route path="/waste-collection" element={<WasteCollection />} />
            <Route path="/epr-consultancy" element={<EPRConsultancy />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </BrowserRouter>
  );
}
