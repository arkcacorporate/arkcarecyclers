import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  Target,
  Eye,
  HeartHandshake,
  Recycle,
  Building,
  CheckCircle2,
  Users2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileBadge
} from 'lucide-react';

export default function KnowUs() {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <div className="know-us-page">
      {/* 1. HERO SECTION */}
      <section className="inner-hero">
        <div
          className="inner-hero-bg"
          style={{ backgroundImage: 'url(/images/recycling/facility.jpg)' }}
        />
        <div className="container">
          <div className="inner-hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span>Know Us</span>
            </div>
            <span className="badge-tag light-theme">PIONEERING CIRCULAR EXCELLENCE</span>
            <h1 className="inner-hero-title">
              Transforming Waste into Resourceful Value
            </h1>
            <p className="inner-hero-desc">
              ARKCA Recyclers is an authorized sustainability enabler, delivering compliant waste channelisation, certified recycling infrastructure, and EPR advisory across India.
            </p>
          </div>
        </div>
      </section>

      {/* 2. ABOUT ARKCA & OUR PURPOSE */}
      <section className="section section-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span className="badge-tag">ABOUT OUR FOUNDATION</span>
              <h2 className="section-heading-dark" style={{ marginBottom: '24px' }}>
                Dedicated to a <span className="text-highlight">Greener, Zero-Waste</span> Future
              </h2>
              <p style={{ color: '#4a635b', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '20px' }}>
                Established with a clear vision to bridge India's formal and informal waste ecosystems, ARKCA Recyclers has grown into one of the country's most dependable environmental stewardship organizations.
              </p>
              <p style={{ color: '#4a635b', fontSize: '1rem', lineHeight: '1.8', marginBottom: '32px' }}>
                We work in close compliance with Central Pollution Control Board (CPCB) norms and State Pollution Control Boards (SPCBs) to streamline the lifecycle of hazardous and non-hazardous materials. From door-to-door industrial pickups to end-of-life material recovery, we ensure full traceability, regulatory audit readiness, and authentic circular outcomes.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(7, 28, 25, 0.15)',
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
                bottom: '-25px',
                left: '-25px',
                background: '#071C19',
                color: '#fff',
                padding: '24px 28px',
                borderRadius: '12px',
                border: '1px solid rgba(43, 168, 74, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
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
          </div>
        </div>
      </section>

      {/* 3. MISSION, VISION & ETHOS */}
      <section className="section section-light">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span className="badge-tag">OUR CORE PURPOSE</span>
            <h2 className="section-heading-dark">Built on Purpose and Principles</h2>
            <p style={{ color: '#526b64', marginTop: '12px' }}>
              Every decision at ARKCA is driven by our commitment to ecological balance, transparency, and socioeconomic upliftment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {/* Card 1 */}
            <div style={{
              background: '#fff',
              padding: '40px 32px',
              borderRadius: '16px',
              border: '1px solid #dbe8e1',
              boxShadow: '0 4px 16px rgba(7, 28, 25, 0.04)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: '#EAF4EE',
                color: '#148C4A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <Target size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#071C19', marginBottom: '14px' }}>
                Our Mission
              </h3>
              <p style={{ color: '#526b64', lineHeight: '1.7', fontSize: '0.95rem' }}>
                To lead India's transition to a closed-loop economy by delivering compliant, scientific waste recovery solutions that divert valuable materials away from landfills and into sustainable reuse.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{
              background: '#fff',
              padding: '40px 32px',
              borderRadius: '16px',
              border: '1px solid #dbe8e1',
              boxShadow: '0 4px 16px rgba(7, 28, 25, 0.04)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: '#EAF4EE',
                color: '#148C4A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <Eye size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#071C19', marginBottom: '14px' }}>
                Our Vision
              </h3>
              <p style={{ color: '#526b64', lineHeight: '1.7', fontSize: '0.95rem' }}>
                To become the most reliable pan-India environmental partner for enterprises, municipal councils, and grassroots waste pickers, setting gold standards for traceable EPR compliance.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{
              background: '#fff',
              padding: '40px 32px',
              borderRadius: '16px',
              border: '1px solid #dbe8e1',
              boxShadow: '0 4px 16px rgba(7, 28, 25, 0.04)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: '#EAF4EE',
                color: '#148C4A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <HeartHandshake size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#071C19', marginBottom: '14px' }}>
                Inclusivity & CSR
              </h3>
              <p style={{ color: '#526b64', lineHeight: '1.7', fontSize: '0.95rem' }}>
                Empowering frontline waste aggregators with fair wages, occupational health safety equipment, and integration into the formal digital recycling ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RECYCLING INFRASTRUCTURE */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '50px', alignItems: 'center' }}>
            <div>
              <span className="badge-tag light-theme">ADVANCED RECYCLING HUBS</span>
              <h2 className="section-heading-light" style={{ marginBottom: '20px' }}>
                State-of-the-Art Processing Facilities
              </h2>
              <p style={{ color: '#b9cfc7', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '32px' }}>
                Our processing plants operate with advanced emission control systems, high-capacity granulators, pyrolysis processors, and electronic shredders to maximize secondary raw material purity.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  background: '#0B2521',
                  border: '1px solid rgba(43, 168, 74, 0.25)',
                  borderRadius: '10px',
                  padding: '18px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <Building size={28} color="#3cd070" />
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Zero Liquid Discharge (ZLD)</h4>
                    <p style={{ color: '#9cb5ab', fontSize: '0.88rem' }}>100% wastewater recycling within closed wash-lines.</p>
                  </div>
                </div>

                <div style={{
                  background: '#0B2521',
                  border: '1px solid rgba(43, 168, 74, 0.25)',
                  borderRadius: '10px',
                  padding: '18px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <ShieldCheck size={28} color="#3cd070" />
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Tamper-Proof Manifest Records</h4>
                    <p style={{ color: '#9cb5ab', fontSize: '0.88rem' }}>Form 6 and Form 10 certified end-to-end audit paperwork.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <img
                src="/images/services/corporate.jpg"
                alt="ARKCA recycling facility"
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <img
                src="/images/services/metal.jpg"
                alt="Metal recycling"
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <img
                src="/images/services/waste-collection.jpg"
                alt="Waste logistics"
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <img
                src="/images/hero/oil.jpg"
                alt="Oil collection facility"
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="section section-light" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge-tag">PARTNER WITH US</span>
          <h2 className="section-heading-dark" style={{ marginBottom: '16px' }}>
            Ready to Accelerate Your Sustainability Goals?
          </h2>
          <p style={{ color: '#526b64', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '36px' }}>
            Speak with our senior environmental consultants to assess your industrial waste streams, calculate your EPR credits, and set up compliant collection operations today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link to="/contact-us" className="btn-primary">
              Contact Our Consultants <ArrowRight size={18} />
            </Link>
            <Link to="/waste-collection" className="btn-outline">
              Explore Waste Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
