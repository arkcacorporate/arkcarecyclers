'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Calculator, Layers, CheckCircle, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { sendEmail } from '@/lib/emailService';

// Forwards style so inline layout passed to it applies.
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

const eprCategories = [
  { title: 'Plastic Packaging (PWM Rules)', rule: 'MoEFCC 2022 & 2024 Amendments', desc: 'Mandatory recycling, reuse, and end-of-life targets across Category I (Rigid), Category II (Flexible single/multi layer), Category III (Multi-layered plastic with other materials), and Category IV (Compostable).', obligation: 'Up to 100% recycling target with minimum recycled polymer content requirement.' },
  { title: 'E-Waste Management Rules 2022', rule: 'S.O. 5126(E)', desc: 'Applies to manufacturers, producers, and refurbishment entities of electrical and electronic equipment (EEE), covering IT peripherals, solar panels, and consumer appliances.', obligation: 'Progressive annual collection targets reaching 80% with verified metal recovery credits.' },
  { title: 'Battery Waste Management Rules 2022', rule: 'G.S.R. 660(E)', desc: 'Comprehensive responsibility for producers of Portable, Automotive, Industrial, and Electric Vehicle (EV) batteries.', obligation: 'Recovery targets for lead, cobalt, nickel, and lithium with mandatory EPR registration.' },
  { title: 'Waste Tyre EPR Rules', rule: 'CPCB Guidelines', desc: 'Obligations for domestic tyre manufacturers and importers based on new tyres sold or imported into the Indian market.', obligation: 'Production of crumb rubber, reclaim rubber, or pyrolytic oil with verified EPR certificates.' },
  { title: 'Used Lubrication Oil EPR', rule: 'Hazardous Waste Management Rules', desc: 'Mandatory recycling targets for base oil importers and lubricant manufacturers to prevent unauthorized burning and soil dumping.', obligation: 'Re-refining targets based on previous year sales and import volumes.' },
];

const checks = ['100% Audit Readiness', 'Verified Traceable Credits', 'Portal Registration Assistance', 'Zero Penalty Guarantee'];
const inquiryPoints = ['Zero CPCB portal rejection rate', 'Transparent credit pricing with no middlemen', 'Timely filing of quarterly & annual Form returns'];
const who = [
  ['Producers:', ' Entities manufacturing packaging material, electrical devices, batteries, or tyres.'],
  ['Importers:', ' Companies importing finished packaged goods, electronic hardware, or machinery into India.'],
  ['Brand Owners:', ' Brands selling products in consumer packaging, retail goods, e-commerce, or industrial logistics.'],
  ['Waste Processors & Recyclers:', ' Entities converting scrap into secondary raw material.'],
];

const emptyForm = { companyName: '', piboType: 'Brand Owner', wasteStream: 'Plastic Packaging', contactName: '', email: '', phone: '', annualTurnover: '', notes: '' };

export default function EPRConsultancyClient() {
  const [calcStream, setCalcStream] = useState('plastic-cat1');
  const [calcVolume, setCalcVolume] = useState('100');
  const [calcResult, setCalcResult] = useState(null);
  const [eprFormSubmitted, setEprFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [eprForm, setEprForm] = useState(emptyForm);
  const reduce = useReducedMotion();

  const handleCalculate = (e) => {
    e.preventDefault();
    const vol = parseFloat(calcVolume) || 0;
    let targetPercent = 0.7; // default 70%
    let estimatedCredits = 0;
    if (calcStream === 'plastic-cat1') targetPercent = 0.8;
    else if (calcStream === 'plastic-cat2') targetPercent = 0.7;
    else if (calcStream === 'plastic-cat3') targetPercent = 0.6;
    else if (calcStream === 'ewaste') targetPercent = 0.7;
    else if (calcStream === 'battery') targetPercent = 0.75;
    else if (calcStream === 'tyre') targetPercent = 1.0;
    estimatedCredits = Math.round(vol * targetPercent);
    setCalcResult({ volume: vol, targetPercent: targetPercent * 100, credits: estimatedCredits });
  };

  const handleFormChange = (e) => setEprForm({ ...eprForm, [e.target.name]: e.target.value });
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const result = await sendEmail({
      formType: 'epr',
      formName: 'EPR Advisory Consultation Form',
      pageName: 'EPR Consultancy',
      data: eprForm,
      honeypot
    });

    setIsSubmitting(false);

    if (result.success) {
      setEprFormSubmitted(true);
      setEprForm(emptyForm);
      setHoneypot('');
      setTimeout(() => {
        setEprFormSubmitted(false);
      }, 6000);
    } else {
      setErrorMessage(result.error || 'Failed to submit EPR assessment request. Please try again.');
    }
  };

  const inp = (name, label, type, ph) => (
    <div className="form-group">
      <label className="form-label" htmlFor={`e-${name}`}>{label}</label>
      <input id={`e-${name}`} type={type} name={name} placeholder={ph} value={eprForm[name]} onChange={handleFormChange} className="form-input" required />
    </div>
  );
  const sel = (name, label, opts) => (
    <div className="form-group">
      <label className="form-label" htmlFor={`e-${name}`}>{label}</label>
      <select id={`e-${name}`} name={name} value={eprForm[name]} onChange={handleFormChange} className="form-select">
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="epr-consultancy-page ec">
      {/* 1. HERO */}
      <section className="inner-hero ec-hero">
        <div className="inner-hero-bg ec-hero-bg" style={{ backgroundImage: 'url(/images/services/epr-consultancy.webp)' }} />
        <div className="inner-hero-shade" />
        <div className="container">
          <div className="inner-hero-content ec-hero-content">
            <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <div className="breadcrumb">
                <Link href="/">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <span>EPR Consultancy</span>
              </div>
            </motion.div>
            <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <span className="badge-tag light-theme">CPCB AUTHORIZED COMPLIANCE PARTNER</span>
              <h1 className="ip-h1">Complete Extended Producer Responsibility (EPR) Solutions</h1>
              <p className="inner-hero-desc">Navigating Central Pollution Control Board (CPCB) compliance with guaranteed credits, audit representation, and zero-liability assurance for Producers, Importers, and Brand Owners (PIBOs).</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. OVERVIEW */}
      <section className="section section-white ec-sec">
        <div className="container">
          <div className="ec-overview">
            <Reveal x={-35} y={0}>
              <span className="badge-tag">MANDATORY REGULATORY COMPLIANCE</span>
              <h2 className="ip-h2 ip-h2-dark">
                Seamless Fulfillment of <br />
                <span className="text-highlight">CPCB Mandates & Audits</span>
              </h2>
              <p className="ip-body ip-body-dark">Extended Producer Responsibility (EPR) is legally enforced in India under the Environment (Protection) Act. Any enterprise manufacturing, importing, or selling products packaged in plastic, electronic goods, automotive batteries, or tyres must register on the Central CPCB portal and achieve strictly audited annual recycling quotas.</p>
              <p className="ip-body ip-body-dark">At ARKCA Recyclers, our team of over 200 environmental consultants, chartered engineers, and legal compliance specialists manage your entire EPR lifecycle—from initial portal filing to certificate exchange and annual return defense.</p>
              <ul className="ec-checks">
                {checks.map((c) => (
                  <li key={c}>
                    <CheckCircle color="#148C4A" size={20} />
                    <span style={{ fontWeight: 600, color: '#071C19' }}>{c}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15} x={35} y={0}>
              <div className="ip-card ip-card-dark ec-who" style={{ borderRadius: '24px' }}>
                <span className="ec-who-ring" aria-hidden="true" />
                <div className="ec-who-head">
                  <ShieldCheck size={32} color="#3cd070" />
                  <h3 className="ip-h3" style={{ color: '#fff' }}>Who Needs EPR in India?</h3>
                </div>
                <ul className="ec-who-list" style={{ color: '#c7ded5', fontSize: '0.95rem' }}>
                  {who.map(([b, t]) => (
                    <li key={b}>
                      <span style={{ color: '#3cd070', fontWeight: 800 }}>•</span>
                      <span><strong>{b}</strong>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="section section-light ec-sec">
        <div className="container">
          <Reveal className="ec-center-head">
            <span className="badge-tag">STATUTORY REGIMES</span>
            <h2 className="ip-h2 ip-h2-dark">EPR Categories We Cover</h2>
            <p className="ip-body ip-body-dark">We provide comprehensive advisory, credit generation, and return filing across all central waste notifications.</p>
          </Reveal>

          <div className="ec-cats">
            {eprCategories.map((cat, idx) => (
              <Reveal key={cat.title} delay={idx * 0.08} className={`ec-cat ec-cat-${idx}`}>
                <article tabIndex={0}>
                  <span className="ec-cat-num" aria-hidden="true">0{idx + 1}</span>
                  <span className="ec-cat-ring" aria-hidden="true" />
                  <div className="ec-cat-main">
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ip-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>{cat.rule}</span>
                    <h3 className="ip-h3" style={{ color: '#071C19', margin: '10px 0 12px' }}>{cat.title}</h3>
                    <p className="ip-body ip-body-dark" style={{ fontSize: '0.92rem', lineHeight: '1.65' }}>{cat.desc}</p>
                  </div>
                  <div className="ec-cat-obl" style={{ background: '#F5F9F5', borderLeft: '3px solid var(--ip-accent)', fontSize: '0.85rem', color: '#2d433e', fontWeight: 600 }}>{cat.obligation}</div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALCULATOR */}
      <section className="section section-white ec-sec">
        <div className="container">
          <Reveal className="ip-calc-container ec-calc">
            <div>
              <span className="badge-tag light-theme">QUICK CALCULATOR</span>
              <h2 className="ip-h2 ip-h2-light" style={{ fontSize: '2.2rem' }}>Estimate Your EPR Obligation</h2>
              <p className="ip-body ip-body-light" style={{ marginBottom: '24px' }}>Select your regulated waste category and enter your estimated annual procurement or sales weight (in metric tonnes) to see your approximate annual recycling credit target.</p>
              <form onSubmit={handleCalculate} className="ec-calc-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="c-stream">Regulated Waste Stream</label>
                  <select id="c-stream" value={calcStream} onChange={(e) => setCalcStream(e.target.value)} className="form-select">
                    <option value="plastic-cat1">Plastic Packaging - Cat I (Rigid)</option>
                    <option value="plastic-cat2">Plastic Packaging - Cat II (Flexible)</option>
                    <option value="plastic-cat3">Plastic Packaging - Cat III (Multi-Layer)</option>
                    <option value="ewaste">Electronic & Electrical Equipment (E-Waste)</option>
                    <option value="battery">Battery Waste (Automotive / Industrial)</option>
                    <option value="tyre">Waste Tyres (Passenger / Commercial)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="c-volume">Annual Volume Placed on Market (Tonnes)</label>
                  <input id="c-volume" type="number" min="1" value={calcVolume} onChange={(e) => setCalcVolume(e.target.value)} className="form-input" placeholder="Enter tonnes (e.g. 250)" required />
                </div>
                <button type="submit" className="btn-primary ax-btn-solid" style={{ marginTop: '8px' }}>
                  <Calculator size={18} /> Calculate EPR Requirement
                </button>
              </form>
            </div>

            <div className="ip-calc-result-box ec-result" aria-live="polite">
              {calcResult ? (
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#8daaa0', textTransform: 'uppercase', letterSpacing: '1px' }}>Calculated Annual Target</span>
                  <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#3cd070', margin: '12px 0' }}>
                    {calcResult.credits} <span style={{ fontSize: '1.4rem', color: '#fff' }}>Tonnes</span>
                  </div>
                  <p style={{ color: '#b9cfc7', fontSize: '0.95rem', marginBottom: '24px' }}>
                    Based on an applicable statutory obligation of <strong>{calcResult.targetPercent}%</strong> for your selected category.
                  </p>
                  <a href="#epr-inquiry-form" className="btn-primary ax-btn-solid" style={{ width: '100%' }}>Procure Traceable EPR Credits</a>
                </div>
              ) : (
                <div style={{ padding: '20px' }}>
                  <Layers size={52} color="#148C4A" style={{ margin: '0 auto 16px' }} />
                  <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px', fontWeight: 700 }}>Instant Target Projection</h4>
                  <p style={{ color: '#8daaa0', fontSize: '0.9rem', lineHeight: '1.6' }}>Input your annual production or import volume on the left to view required recycling credits and compliance roadmaps.</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. INQUIRY FORM */}
      <section id="epr-inquiry-form" className="section section-light ec-sec">
        <div className="container">
          <div className="ec-inquiry">
            <Reveal x={-30} y={0}>
              <span className="badge-tag">GET COMPLIANCE EXPERTS ON YOUR SIDE</span>
              <h2 className="ip-h2 ip-h2-dark">Request an EPR Compliance Audit</h2>
              <p className="ip-body ip-body-dark">Whether you need fresh CPCB registration, credit procurement to close annual deficits, or defense during state audit notices, our certified consultants are ready to assist.</p>
              <ul className="ec-points">
                {inquiryPoints.map((p) => (
                  <li key={p}>
                    <CheckCircle color="#148C4A" size={20} />
                    <span style={{ color: '#2d433e', fontWeight: 600 }}>{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal x={30} y={0} delay={0.1}>
              <div className="disposal-form-card ec-glass">
                <div className="disposal-form-header">
                  <h3 className="disposal-form-title">EPR Advisory Consultation</h3>
                  <p className="disposal-form-sub">Fill in your corporate details for an assessment report.</p>
                </div>
                {eprFormSubmitted ? (
                  <div role="status" style={{ textAlign: 'center', padding: '30px 10px', color: '#48cf73' }}>
                    <CheckCircle size={48} style={{ margin: '0 auto 12px' }} />
                    <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px' }}>Audit Request Received!</h4>
                    <p style={{ color: '#a6c5ba', fontSize: '0.95rem' }}>A Senior EPR Consultant will reach out with a detailed compliance roadmap within 4 business hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div className="disposal-form-grid">
                      {inp('companyName', 'Enterprise / Company Name', 'text', 'e.g. Acme Consumer Goods Ltd')}
                      {sel('piboType', 'PIBO Entity Type', ['Brand Owner', 'Producer / Manufacturer', 'Importer', 'Recycler / Processor'])}
                      {sel('wasteStream', 'Primary Regulated Stream', ['Plastic Packaging', 'E-Waste Equipment', 'Batteries', 'Tyres', 'Used Lubricating Oil'])}
                      {inp('contactName', 'Contact Person', 'text', 'Your Name')}
                      {inp('email', 'Official Work Email', 'email', 'compliance@acme.com')}
                      {inp('phone', 'Direct Phone', 'tel', '+91 98765 43210')}
                      <div className="form-group full-width">
                        <label className="form-label" htmlFor="e-notes">Specific Compliance Goals or Deadlines</label>
                        <textarea id="e-notes" name="notes" placeholder="Mention whether you need CPCB registration, target fulfillment credits, or annual return audit defense." value={eprForm.notes} onChange={handleFormChange} className="form-textarea" rows={2} />
                      </div>
                    </div>

                    {/* Anti-spam honeypot (hidden from real users) */}
                    <div style={{ display: 'none' }} aria-hidden="true">
                      <input
                        type="text"
                        name="_epr_hp"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {errorMessage && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff8a8a', fontSize: '0.9rem', marginBottom: '14px', background: 'rgba(255, 75, 75, 0.12)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 75, 75, 0.25)' }}>
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-submit-btn ec-submit"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: isSubmitting ? 0.75 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Scheduling...
                        </>
                      ) : (
                        'Schedule Free EPR Assessment'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
