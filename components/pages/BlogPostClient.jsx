'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Clock,
  Calendar,
  Share2,
  Check,
  ArrowRight,
  CheckCircle2,
  Info,
  Linkedin,
  MessageCircle,
  Twitter,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

function Reveal({ children, delay = 0, y = 28, x = 0, className = '', style }) {
  const reduce = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const initialX = isMobile ? 0 : x;
  const initialY = isMobile ? (y ? 14 : 0) : y;
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y: initialY, x: initialX }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-40px', amount: 0.12 }}
      transition={{ duration: 0.65, delay: isMobile ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function BlogPostClient({ post, relatedPosts }) {
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://arkcarecyclers.com/blog/${post.slug}`;
  const shareTitle = encodeURIComponent(post.title);

  return (
    <div className="blog-page">
      {/* 1. ARTICLE HEADER / HERO */}
      <header className="blog-hero">
        <div className="blog-hero-bg" style={{ backgroundImage: `url(${post.featuredImage})` }} />
        <div className="blog-hero-shade" />
        <div className="container">
          <div className="blog-hero-content">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="breadcrumb" style={{ marginBottom: '20px' }}>
              <Link href="/">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link href="/blog">Blog</Link>
              <span className="breadcrumb-separator">/</span>
              <span style={{ color: 'var(--primary-green, #148C4A)', fontWeight: 600 }}>{post.category}</span>
            </nav>

            <div className="blog-header-badge-row">
              <span className="blog-category-badge">{post.category}</span>
              <span className="blog-read-time">
                <Clock size={15} /> {post.readTime}
              </span>
            </div>

            {/* Primary Semantic H1 */}
            <h1 className="blog-article-h1">{post.title}</h1>

            {/* Author & Date Meta Bar */}
            <div className="blog-author-meta-bar">
              <div className="blog-author-pill">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="blog-author-avatar-sm"
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <div className="blog-author-info-sm">
                  <h4>{post.author.name}</h4>
                  <p>{post.author.role}</p>
                </div>
              </div>

              <div className="blog-date-group">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} /> Published: {post.publishDateFormatted}
                </span>
                {post.modifiedDateFormatted && post.modifiedDateFormatted !== post.publishDateFormatted && (
                  <span style={{ color: '#8daaa0', fontSize: '0.8rem' }}>
                    (Updated: {post.modifiedDateFormatted})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. FEATURED IMAGE BANNER */}
      <div className="container">
        <div className="blog-featured-media">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="blog-featured-img-wrap"
          >
            <img
              src={post.featuredImage}
              alt={post.imageAlt || post.title}
              width="1200"
              height="600"
              loading="eager"
            />
          </motion.div>
        </div>
      </div>

      {/* 3. MAIN ARTICLE LAYOUT (CONTENT + SIDEBAR) */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: '80px' }}>
        <div className="container">
          <div className="blog-article-layout">
            {/* Left Main Article Column */}
            <main className="blog-content-column">
              <article className="blog-article-body">
                {post.contentHtml.map((block, idx) => {
                  if (block.type === 'intro') {
                    return (
                      <p key={idx} className="blog-intro-lead">
                        {block.text}
                      </p>
                    );
                  }
                  if (block.type === 'h2') {
                    return <h2 key={idx}>{block.text}</h2>;
                  }
                  if (block.type === 'h3') {
                    return <h3 key={idx}>{block.text}</h3>;
                  }
                  if (block.type === 'p') {
                    return <p key={idx}>{block.text}</p>;
                  }
                  if (block.type === 'callout') {
                    return (
                      <div key={idx} className="blog-callout-card">
                        <div className="blog-callout-title">
                          <Info size={18} color="#148C4A" /> {block.title}
                        </div>
                        <p>{block.text}</p>
                      </div>
                    );
                  }
                  if (block.type === 'quote') {
                    return (
                      <blockquote key={idx} className="blog-blockquote-card">
                        <p className="blog-quote-text">{block.quote}</p>
                        {block.cite && <cite className="blog-quote-cite">— {block.cite}</cite>}
                      </blockquote>
                    );
                  }
                  if (block.type === 'checklist') {
                    return (
                      <div key={idx} className="blog-checklist-card">
                        <h4 className="blog-checklist-title">{block.title}</h4>
                        <ul className="blog-checklist-list">
                          {block.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <CheckCircle2 size={18} color="#148C4A" style={{ flexShrink: 0, marginTop: '3px' }} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  return null;
                })}

                {/* Footer Tags & Share Action Bar */}
                <div className="blog-footer-actions">
                  {/* Topic Tags */}
                  <div className="blog-tags-row">
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--dark-green, #071C19)' }}>
                      Tags:
                    </span>
                    {post.tags.map((tag) => (
                      <Link key={tag} href="/blog" className="blog-tag-pill">
                        #{tag}
                      </Link>
                    ))}
                  </div>

                  {/* Social Share Buttons */}
                  <div className="blog-share-row">
                    <span className="blog-share-label">Share Article:</span>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-share-btn"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin size={16} color="#0077b5" /> LinkedIn
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-share-btn"
                      aria-label="Share on WhatsApp"
                    >
                      <MessageCircle size={16} color="#25D366" /> WhatsApp
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-share-btn"
                      aria-label="Share on X"
                    >
                      <Twitter size={16} /> X (Twitter)
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="blog-share-btn"
                      style={{
                        backgroundColor: copied ? '#148C4A' : '#FFFFFF',
                        color: copied ? '#FFFFFF' : 'inherit',
                        borderColor: copied ? '#148C4A' : '#cfe0d6',
                      }}
                    >
                      {copied ? <Check size={16} /> : <Share2 size={16} />}
                      {copied ? 'Link Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              </article>
            </main>

            {/* Right Sticky Sidebar */}
            <aside className="blog-sidebar">
              {/* E-E-A-T Author Card */}
              <div className="blog-author-sidebar-card">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="blog-author-sidebar-avatar"
                  width="90"
                  height="90"
                  loading="lazy"
                />
                <h3 className="blog-author-sidebar-name">{post.author.name}</h3>
                <p className="blog-author-sidebar-role">{post.author.role}</p>
                <p className="blog-author-sidebar-bio">{post.author.bio}</p>
              </div>

              {/* Sidebar Action / Consultation CTA */}
              <div className="blog-sidebar-cta">
                <span className="badge-tag light-theme" style={{ marginBottom: '12px' }}>
                  CPCB COMPLIANCE
                </span>
                <h3>Need EPR Compliance Assistance?</h3>
                <p>
                  Connect with our team of 200+ certified environmental consultants to fulfill annual recycling obligations and audit requirements.
                </p>
                <Link href="/epr-consultancy" className="blog-sidebar-cta-btn">
                  Consult an EPR Specialist <ArrowRight size={16} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 4. RELATED POSTS SECTION */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="blog-related-section">
          <div className="container">
            <div className="blog-related-header">
              <Reveal>
                <span className="badge-tag">RECOMMENDED READING</span>
                <h2 className="ip-h2 ip-h2-dark" style={{ margin: '8px 0 0' }}>
                  Related Articles & Case Studies
                </h2>
              </Reveal>
            </div>

            <div className="blog-grid-2">
              {relatedPosts.map((relPost, idx) => (
                <Reveal key={relPost.slug} delay={idx * 0.12} y={28}>
                  <article className="blog-card-item">
                    <Link href={`/blog/${relPost.slug}`} className="blog-card-img-wrap" tabIndex={-1} aria-hidden="true">
                      <img src={relPost.featuredImage} alt={relPost.imageAlt} loading="lazy" decoding="async" />
                    </Link>
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span className="blog-card-category">{relPost.category}</span>
                        <span className="blog-card-date">{relPost.readTime}</span>
                      </div>
                      <h3 className="blog-card-title">
                        <Link href={`/blog/${relPost.slug}`}>{relPost.title}</Link>
                      </h3>
                      <p className="blog-card-snippet">{relPost.excerpt}</p>
                      <Link href={`/blog/${relPost.slug}`} className="blog-card-link">
                        Read Article <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
