import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Target,
  Eye,
  HeartHandshake,
  CheckCircle2,
  Building2,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Recycle,
  Factory
} from 'lucide-react';
import '../inner-pages.css';

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

export default function KnowUs() {
  const reduce = useReducedMotion();

  return (
    <div className="know-us-page">
      {/* 1. HERO SECTION */}
      <section className="inner-hero">
        <div
          className="inner-hero-bg"
          style={{ backgroundImage: 'url(/images/recycling/facility.jpg)' }}
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
                <Link to="/">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <span>Know Us</span>
              </div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="badge-tag light-theme">PIONEERING CIRCULAR EXCELLENCE</span>
              <h1 className="ip-h1">
                Transforming Waste into Resourceful Value
              </h1>
              <p className="inner-hero-desc">
                ARKCA Recyclers is an authorized sustainability enabler, delivering compliant waste channelisation, certified recycling infrastructure, and EPR advisory across India.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT ARKCA & OUR PURPOSE */}
      <section className="section section-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 'clamp(36px, 5vw, 60px)', alignItems: 'center' }}>
            <Reveal>
              <span className="badge-tag">ABOUT OUR FOUNDATION</span>
              <h2 className="ip-h2 ip-h2-dark" style={{ marginBottom: '24px' }}>
                Dedicated to a <span className="text-highlight">Greener, Zero-Waste</span> Future
              </h2>
              <p className="ip-body ip-body-dark" style={{ marginBottom: '20px' }}>
                Established with a clear vision to bridge India's formal and informal waste ecosystems, ARKCA Recyclers has grown into one of the country's most dependable environmental stewardship organizations.
              </p>
              <p className="ip-body ip-body-dark" style={{ marginBottom: '32px' }}>
                We work in close compliance with Central Pollution Control Board (CPCB) norms and State Pollution Control Boards (SPCBs) to streamline the lifecycle of hazardous and non-hazardous materials. From door-to-door industrial pickups to end-of-life material recovery, we ensure full traceability, regulatory audit readiness, and authentic circular outcomes.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 color="#148C4A" size={22} />
                  <span style={{ fontWeight: 600, color: '#071C19' }}>CPCB & SPCB Registered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 color="#148C4A" size={22} />
                  <span style={{ fontWeight: 600, color: '#071C19' }}>ISO 14001:2015 Certified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 color="#148C4A" size={22} />
                  <span style={{ fontWeight: 600, color: '#071C19' }}>Traceable GPS Logistics</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 color="#148C4A" size={22} />
                  <span style={{ fontWeight: 600, color: '#071C19' }}>Waste Picker Inclusion</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px -10px rgba(7, 28, 25, 0.2)',
                  border: '4px solid #EAF4EE'
                }}>
                  <img
                    src="/images/recycling/waste-pickers.jpg"
                    alt="ARKCA Recyclers community impact"
                    style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                  />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '-20px',
                  background: 'linear-gradient(135deg, #071C19 0%, #0d3228 100%)',
                  color: '#fff',
                  padding: '22px 28px',
                  borderRadius: '16px',
                  border: '1px solid rgba(72, 207, 115, 0.3)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <TrendingUp size={36} color="#3cd070" />
                  <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>10+ Years</div>
                    <div style={{ fontSize: '0.85rem', color: '#9cb5ab' }}>Environmental Dedication</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. MISSION, VISION & ETHOS (PREMIUM RECYCLING CARDS) */}
      <section className="section section-light">
        <div className="container">
          <Reveal style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span className="badge-tag">OUR CORE PURPOSE</span>
            <h2 className="ip-h2 ip-h2-dark">Built on Purpose and Principles</h2>
            <p className="ip-body ip-body-dark" style={{ marginTop: '12px' }}>
              Every decision at ARKCA is driven by our commitment to ecological balance, transparency, and socioeconomic upliftment.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {/* Card 1 */}
            <Reveal delay={0.1} className="ip-card">
              <div className="ip-card-motif" />
              <div className="ip-icon-circle">
                <Target size={28} />
              </div>
              <h3 className="ip-h3" style={{ color: '#071C19', marginBottom: '14px' }}>
                Our Mission
              </h3>
              <p className="ip-body ip-body-dark">
                To lead India's transition to a closed-loop economy by delivering compliant, scientific waste recovery solutions that divert valuable materials away from landfills and into sustainable reuse.
              </p>
            </Reveal>

            {/* Card 2 */}
            <Reveal delay={0.2} className="ip-card">
              <div className="ip-card-motif" />
              <div className="ip-icon-circle">
                <Eye size={28} />
              </div>
              <h3 className="ip-h3" style={{ color: '#071C19', marginBottom: '14px' }}>
                Our Vision
              </h3>
              <p className="ip-body ip-body-dark">
                To become the most reliable pan-India environmental partner for enterprises, municipal councils, and grassroots waste pickers, setting gold standards for traceable EPR compliance.
              </p>
            </Reveal>

            {/* Card 3 */}
            <Reveal delay={0.3} className="ip-card">
              <div className="ip-card-motif" />
              <div className="ip-icon-circle">
                <HeartHandshake size={28} />
              </div>
              <h3 className="ip-h3" style={{ color: '#071C19', marginBottom: '14px' }}>
                Inclusivity & CSR
              </h3>
              <p className="ip-body ip-body-dark">
                Empowering frontline waste aggregators with fair wages, occupational health safety equipment, and integration into the formal digital recycling ecosystem.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. RECYCLING INFRASTRUCTURE (REALISTIC RECYCLING IMAGERY ONLY) */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '50px', alignItems: 'center' }}>
            <Reveal>
              <span className="badge-tag light-theme">ADVANCED RECYCLING HUBS</span>
              <h2 className="ip-h2 ip-h2-light" style={{ marginBottom: '20px' }}>
                State-of-the-Art Processing Facilities
              </h2>
              <p className="ip-body ip-body-light" style={{ marginBottom: '32px' }}>
                Our processing plants operate with advanced emission control systems, high-capacity granulators, pyrolysis processors, and electronic shredders to maximize secondary raw material purity.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="ip-card ip-card-dark" style={{ padding: '22px 26px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="ip-icon-circle" style={{ marginBottom: 0, flexShrink: 0 }}>
                    <Factory size={26} />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Zero Liquid Discharge (ZLD)</h4>
                    <p style={{ color: '#9cb5ab', fontSize: '0.9rem' }}>100% wastewater recycling within closed wash-lines.</p>
                  </div>
                </div>

                <div className="ip-card ip-card-dark" style={{ padding: '22px 26px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="ip-icon-circle" style={{ marginBottom: 0, flexShrink: 0 }}>
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Tamper-Proof Manifest Records</h4>
                    <p style={{ color: '#9cb5ab', fontSize: '0.9rem' }}>Form 6 and Form 10 certified end-to-end audit paperwork.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Realistic Recycling Imagery Grid (No Building Images) */}
            <Reveal delay={0.15} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '220px', border: '1px solid rgba(72,207,115,0.25)' }}>
                <img
                  src="/images/recycling/facility.jpg"
                  alt="ARKCA material recovery plant"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '220px', border: '1px solid rgba(72,207,115,0.25)' }}>
                <img
                  src="/images/services/metal.jpg"
                  alt="Metal recycling processing"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '220px', border: '1px solid rgba(72,207,115,0.25)' }}>
                <img
                  src="/images/services/waste-collection.jpg"
                  alt="Waste collection channelisation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '220px', border: '1px solid rgba(72,207,115,0.25)' }}>
                <img
                  src="/images/hero/oil.webp"
                  alt="Oil distillation facility"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="section section-light" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Reveal>
            <span className="badge-tag">PARTNER WITH US</span>
            <h2 className="ip-h2 ip-h2-dark" style={{ marginBottom: '16px' }}>
              Ready to Accelerate Your Sustainability Goals?
            </h2>
            <p className="ip-body ip-body-dark" style={{ marginBottom: '36px' }}>
              Speak with our senior environmental consultants to assess your industrial waste streams, calculate your EPR credits, and set up compliant collection operations today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/contact-us" className="btn-primary ax-btn-solid">
                Contact Our Consultants <ArrowRight size={18} />
              </Link>
              <Link to="/waste-collection" className="btn-outline">
                Explore Waste Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
