'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, Tag, BookOpen } from 'lucide-react';
import { getAllPosts } from '@/lib/blogData';

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

export default function BlogListingClient() {
  const allPosts = getAllPosts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const reduce = useReducedMotion();

  const categories = ['All', 'Circular Economy', 'EPR Compliance', 'E-Waste Recycling'];

  const filteredPosts = selectedCategory === 'All'
    ? allPosts
    : allPosts.filter((p) => p.category === selectedCategory);

  const featuredPost = allPosts[0];

  return (
    <div className="blog-page">
      {/* 1. HERO BANNER */}
      <section className="blog-hero">
        <div className="blog-hero-bg" style={{ backgroundImage: 'url(/images/recycling/circular-economy.webp)' }} />
        <div className="blog-hero-shade" />
        <div className="container">
          <div className="blog-hero-content">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="breadcrumb">
                <Link href="/">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <span>Blog</span>
              </div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="badge-tag light-theme">SUSTAINABILITY & EPR INSIGHTS</span>
              <h1 className="ip-h1" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)' }}>
                Knowledge Hub & Industry Analysis
              </h1>
              <p className="inner-hero-desc">
                Explore expert perspectives, CPCB regulatory updates, circular economy breakthroughs, and industrial waste management strategies from ARKCA Recyclers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED POST & CATEGORY FILTER */}
      <section className="section section-white" style={{ paddingBottom: '90px' }}>
        <div className="container">
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedCategory === cat ? 'var(--primary-green, #148C4A)' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-dark, #071C19)',
                  borderColor: selectedCategory === cat ? 'var(--primary-green, #148C4A)' : '#dce8e0',
                  boxShadow: selectedCategory === cat ? '0 6px 18px rgba(20, 140, 74, 0.3)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="blog-grid-3">
            {filteredPosts.map((post, idx) => (
              <Reveal key={post.slug} delay={idx * 0.1} y={30}>
                <article className="blog-card-item">
                  <Link href={`/blog/${post.slug}`} className="blog-card-img-wrap" tabIndex={-1} aria-hidden="true">
                    <img src={post.featuredImage} alt={post.imageAlt} loading="lazy" decoding="async" />
                  </Link>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span className="blog-card-category">{post.category}</span>
                      <span className="blog-card-date">{post.readTime}</span>
                    </div>
                    <h2 className="blog-card-title">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="blog-card-snippet">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="blog-card-link">
                      Read Full Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
