'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Trash2, Cpu, BatteryCharging, Disc, Droplets, Cog, CheckCircle, Truck, PhoneCall, ArrowRight,
  AlertCircle, Loader2,
} from 'lucide-react';
import { sendEmail } from '@/lib/emailService';

// Forwards style so any inline layout passed to it applies.
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

const wasteStreams = [
  { id: 'plastic', title: 'Plastic Waste Collection', category: 'Category I, II & III', icon: Trash2, desc: 'Authorized collection and processing of rigid plastics (HDPE, PP, PET), flexible films (LDPE, LLDPE), and multi-layered laminates from FMCG, manufacturing, and commercial premises.', details: ['Pre-segregation at source and baling', 'High-capacity wash lines and granulators', 'Full EPR credit generation on CPCB portal', 'Zero landfill diversion guarantee'], image: '/images/waste/plastic.webp' },
  { id: 'electronic', title: 'Electronic Asset Disposition (E-Waste)', category: 'CPCB Rules 2022 Compliant', icon: Cpu, desc: 'Secure decommissioning of enterprise IT assets, servers, computers, telecom gear, and consumer electronics with certified data sanitization and rare earth metal recovery.', details: ['Certified on-site or off-site data destruction (DoD 5220.22-M)', 'Green recycling certificate with serial tracking', 'Environmentally sound mechanical dismantling', 'Refurbishment and component upcycling'], image: '/images/waste/electronic.webp' },
  { id: 'battery', title: 'Used Battery Management', category: 'Lead-Acid & Lithium-Ion', icon: BatteryCharging, desc: 'Compliant channelisation and recycling of industrial UPS batteries, automotive lead-acid packs, and electric vehicle (EV) lithium-ion batteries.', details: ['Acid drainage and neutralisation in closed reactors', 'High purity lead recovery (> 99.97%)', 'Cobalt, Nickel & Lithium hydrometallurgical extraction', 'Complete EPR compliance reports for battery PIBOs'], image: '/images/waste/battery.webp' },
  { id: 'tyre', title: 'End-of-Life Tyre (ELT) Collection', category: 'CPCB Tyre Rules', icon: Disc, desc: 'Bulk aggregation of commercial truck tyres, passenger vehicle tyres, and earthmover tyres to produce high quality crumb rubber and reclaim rubber.', details: ['Steel bead wire and textile debonding', 'Ambient & cryogenic crumb rubber granulation', 'Pyrolysis oil recovery meeting industrial fuel standards', 'Certified credit generation under Tyre EPR guidelines'], image: '/images/waste/tyre.webp' },
  { id: 'oil', title: 'Used Lubricating & Base Oil', category: 'Hazardous Waste Rules', icon: Droplets, desc: 'Safe collection and vacuum distillation re-refining of spent engine oils, industrial hydraulic lubricants, turbine oils, and transformer fluids.', details: ['Spill-proof tanker fleet with digital flow meters', 'De-asphalting and hydrofinishing into virgin-grade base oil', 'Complete Form 6 and Form 10 hazardous manifest tracking', 'Elimination of illegal burning or soil contamination'], image: '/images/waste/oil.webp' },
  { id: 'metal', title: 'Industrial Scrap & Metal Recycling', category: 'Ferrous & Non-Ferrous', icon: Cog, desc: 'Systematic recycling of production line off-cuts, stamped sheet metal, aluminium turnings, copper scrap, and structural industrial steel.', details: ['High precision digital weighbridge calibration', 'Sorting, shearing, and baling for direct furnace feeding', 'Competitive industrial scrap purchasing contracts', '100% emission-controlled smelting partnerships'], image: '/images/waste/metal.webp' },
];

const steps = [
  { t: 'Audit & Scheduling', d: 'Submit waste specifications online or request an on-site waste assessment by our field compliance officer.' },
  { t: 'Certified Weighing', d: 'Pickup vehicles equipped with calibrated scales arrive at your doorstep for transparent on-site tare weighing.' },
  { t: 'GPS-Tracked Transit', d: 'Materials are transported to authorized recycling hubs under strict digital surveillance and Form 6 manifests.' },
  { t: 'Green Certification', d: 'Receive government-valid Recycling and Destruction Certificates with corresponding EPR compliance credits.' },
];

const contacts = [
  { Icon: Truck, t: 'Pan-India Logistics Fleet', d: 'Prompt pickups across Kolkata, West Bengal, and eastern industrial belts.' },
  { Icon: PhoneCall, t: 'Immediate Support Helpline', d: 'Call +91-9316-631-170 for emergency hazardous waste transport.' },
];

const emptyPickup = { businessName: '', contactPerson: '', phone: '', email: '', city: '', wasteType: 'Plastic Waste', approxWeight: '500 Kg - 2 Tonnes', preferredDate: '', specialNotes: '' };

export default function WasteCollectionClient() {
  const [selectedStream, setSelectedStream] = useState(wasteStreams[0]);
  const [pickupFormSubmitted, setPickupFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [pickupData, setPickupData] = useState(emptyPickup);
  const reduce = useReducedMotion();

  const handleInputChange = (e) => setPickupData({ ...pickupData, [e.target.name]: e.target.value });
  const handlePickupSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const result = await sendEmail({
      formType: 'pickup',
      formName: 'Pickup Booking Request Form',
      pageName: 'Waste Collection',
      data: pickupData,
      honeypot
    });

    setIsSubmitting(false);

    if (result.success) {
      setPickupFormSubmitted(true);
      setPickupData(emptyPickup);
      setHoneypot('');
      setTimeout(() => {
        setPickupFormSubmitted(false);
      }, 6000);
    } else {
      setErrorMessage(result.error || 'Failed to submit pickup request. Please try again.');
    }
  };

  const inp = (name, label, type, ph) => (
    <div className="form-group">
      <label className="form-label" htmlFor={`p-${name}`}>{label}</label>
      <input id={`p-${name}`} type={type} name={name} placeholder={ph} value={pickupData[name]} onChange={handleInputChange} className="form-input" required />
    </div>
  );
  const sel = (name, label, opts) => (
    <div className="form-group">
      <label className="form-label" htmlFor={`p-${name}`}>{label}</label>
      <select id={`p-${name}`} name={name} value={pickupData[name]} onChange={handleInputChange} className="form-select">
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const Sel = selectedStream;
  return (
    <div className="waste-collection-page wc">
      {/* 1. HERO */}
      <section className="inner-hero wc-hero">
        <div className="inner-hero-bg wc-hero-bg" style={{ backgroundImage: 'url(/images/hero/tyre.webp)' }} />
        <div className="inner-hero-shade" />
        <div className="container">
          <div className="inner-hero-content wc-hero-content">
            <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <div className="breadcrumb">
                <Link href="/">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <span>Waste Collection</span>
              </div>
            </motion.div>
            <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <span className="badge-tag light-theme">TRACEABLE & COMPLIANT PICKUPS</span>
              <h1 className="ip-h1">Industrial & Commercial Waste Collection Services</h1>
              <p className="inner-hero-desc">End-to-end collection, safe transport, certified weighing, and closed-loop recycling across all major hazardous and non-hazardous industrial waste categories.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. WASTE STREAMS EXPLORER */}
      <section className="section section-white wc-sec">
        <div className="container">
          <Reveal className="wc-center-head">
            <span className="badge-tag">COMPLETE WASTE SPECTRUM</span>
            <h2 className="ip-h2 ip-h2-dark">What We Collect & Process</h2>
            <p className="ip-body ip-body-dark">Select a waste stream below to learn more about our collection protocols, recycling technology, and environmental compliance deliverables.</p>
          </Reveal>

          <div className="wc-explorer">
            <div className="wc-list" role="tablist" aria-label="Waste streams">
              {wasteStreams.map((stream, idx) => {
                const Icon = stream.icon;
                const on = Sel.id === stream.id;
                return (
                  <Reveal key={stream.id} delay={idx * 0.06} x={-20} y={0}>
                    <button type="button" role="tab" aria-selected={on} onClick={() => setSelectedStream(stream)} className={`wc-item ${on ? 'on' : ''}`}>
                      <span className="wc-item-icon"><Icon size={22} /></span>
                      <span className="wc-item-body">
                        <span className="ip-h3 wc-item-title" style={{ fontSize: '1.15rem', color: '#071C19' }}>{stream.title}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--ip-accent)', fontWeight: 700 }}>{stream.category}</span>
                        <span className="ip-body ip-body-dark wc-item-desc" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>{stream.desc.slice(0, 95)}...</span>
                      </span>
                      <ArrowRight className="wc-item-arrow" size={18} aria-hidden="true" />
                    </button>
                  </Reveal>
                );
              })}
            </div>

            <div className="wc-detail" role="tabpanel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={Sel.id}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="wc-detail-img wc-zoom">
                    <img src={Sel.image} alt={Sel.title} loading="lazy" decoding="async" />
                  </div>
                  <div className="wc-detail-body">
                    <span className="badge-tag">{Sel.category}</span>
                    <h3 className="ip-h2 ip-h2-dark" style={{ fontSize: '2rem', marginBottom: '12px' }}>{Sel.title}</h3>
                    <p className="ip-body ip-body-dark" style={{ marginBottom: '20px' }}>{Sel.desc}</p>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#071C19', marginBottom: '6px' }}>Key Operational Highlights:</h4>
                    <ul className="wc-points">
                      {Sel.details.map((point) => (
                        <li key={point}>
                          <CheckCircle size={18} color="#148C4A" />
                          <span style={{ fontSize: '0.95rem', color: '#2d433e', fontWeight: 500 }}>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#pickup-booking-section" className="btn-primary ax-btn-solid wc-btn">
                      Schedule {Sel.title.split(' ')[0]} Pickup <ArrowRight size={16} />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKFLOW */}
      <section className="section section-light wc-sec">
        <div className="container">
          <Reveal className="wc-center-head">
            <span className="badge-tag">END-TO-END ASSURANCE</span>
            <h2 className="ip-h2 ip-h2-dark">How Our Waste Collection Works</h2>
            <p className="ip-body ip-body-dark">Standardized, transparent, and hassle-free pickup protocol engineered for audit readiness.</p>
          </Reveal>
          <ol className="wc-steps">
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={0.1 * (i + 1)} className="wc-step">
                <li>
                  <span className="wc-step-num ip-process-num">0{i + 1}</span>
                  <span className="wc-step-dot" aria-hidden="true" />
                  <h3 className="ip-h3" style={{ color: '#071C19', marginBottom: '8px' }}>{s.t}</h3>
                  <p className="ip-body ip-body-dark" style={{ fontSize: '0.92rem' }}>{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. PICKUP FORM */}
      <section id="pickup-booking-section" className="section section-dark wc-sec">
        <div className="container">
          <div className="wc-pickup">
            <Reveal x={-30} y={0}>
              <span className="badge-tag light-theme">DOORSTEP DISPOSAL</span>
              <h2 className="ip-h2 ip-h2-light">Schedule a Commercial Waste Pickup</h2>
              <p className="ip-body ip-body-light">Whether you have one-time factory clearance scrap or require recurring collection agreements, our authorized team will coordinate seamless logistics.</p>
              <div className="wc-contacts">
                {contacts.map(({ Icon, t, d }) => (
                  <div className="wc-contact" key={t}>
                    <div className="ip-icon-circle wc-contact-icon" style={{ marginBottom: 0, background: 'rgba(43, 168, 74, 0.2)', color: '#3cd070' }}><Icon size={24} /></div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700 }}>{t}</h4>
                      <p style={{ color: '#8daaa0', fontSize: '0.88rem' }}>{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal x={30} y={0} delay={0.1}>
              <div className="disposal-form-card wc-glass">
                <div className="disposal-form-header">
                  <h3 className="disposal-form-title">Pickup Booking Request</h3>
                  <p className="disposal-form-sub">Provide your location & waste volume for instant vehicle dispatch.</p>
                </div>
                {pickupFormSubmitted ? (
                  <div role="status" style={{ textAlign: 'center', padding: '30px 10px', color: '#48cf73' }}>
                    <CheckCircle size={48} style={{ margin: '0 auto 12px' }} />
                    <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px' }}>Pickup Request Confirmed!</h4>
                    <p style={{ color: '#a6c5ba', fontSize: '0.95rem' }}>A logistics supervisor has been assigned to schedule vehicle allocation.</p>
                  </div>
                ) : (
                  <form onSubmit={handlePickupSubmit}>
                    <div className="disposal-form-grid">
                      {inp('businessName', 'Business / Industry Name', 'text', 'Company name')}
                      {inp('contactPerson', 'Contact Person', 'text', 'Your full name')}
                      {inp('phone', 'Phone Number', 'tel', '+91-0000000000')}
                      {inp('email', 'Email Address', 'email', 'name@company.com')}
                      {sel('wasteType', 'Primary Waste Type', ['Plastic Waste', 'Electronic E-Waste', 'Battery Waste', 'Tyre Waste', 'Used Lubricant Oil', 'Industrial Metal Scrap'])}
                      {sel('approxWeight', 'Approximate Quantity', ['Under 500 Kg', '500 Kg - 2 Tonnes', '2 - 10 Tonnes', 'Bulk 10+ Tonnes'])}
                      {inp('city', 'Pickup City / Area', 'text', 'e.g. Kolkata / Howrah')}
                      {inp('preferredDate', 'Preferred Date', 'date', undefined)}
                      <div className="form-group full-width">
                        <label className="form-label" htmlFor="p-specialNotes">Special Handling Notes</label>
                        <textarea id="p-specialNotes" name="specialNotes" placeholder="Any hazardous requirements, loading dock details, or timing preferences" value={pickupData.specialNotes} onChange={handleInputChange} className="form-textarea" rows={2} />
                      </div>
                    </div>

                    {/* Anti-spam honeypot (hidden from real users) */}
                    <div style={{ display: 'none' }} aria-hidden="true">
                      <input
                        type="text"
                        name="_wc_hp"
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
                      className="form-submit-btn wc-submit"
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
                          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Confirming...
                        </>
                      ) : (
                        'Confirm Pickup Request'
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
