'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
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

  const isHome = pathname === '/';
  const navClass = `navbar ${!isHome || scrolled ? 'navbar-scrolled' : ''}`;

  return (
    <>
      <header className={navClass}>
        <div className="container nav-container">
          {/* Brand Logo */}
          <Link href="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
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
              href="/"
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              arkca recyclers
            </Link>
            <Link
              href="/know-us"
              className={`nav-link ${pathname === '/know-us' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Know Us
            </Link>
            <Link
              href="/waste-collection"
              className={`nav-link ${pathname === '/waste-collection' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Waste Collection
            </Link>
            <Link
              href="/epr-consultancy"
              className={`nav-link ${pathname === '/epr-consultancy' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              EPR Consultancy
            </Link>
            <Link
              href="/blog"
              className={`nav-link ${pathname.startsWith('/blog') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact-us"
              className={`nav-link ${pathname === '/contact-us' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>

            <Link
              href="/contact-us"
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
