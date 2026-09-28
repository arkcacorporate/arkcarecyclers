import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Target, Eye, HeartHandshake, CheckCircle2, ShieldCheck, TrendingUp, ArrowRight, Factory,
} from 'lucide-react';
import '../inner-pages.css';
import '../know-us-redesign.css';

// Now forwards style, so the centred header and mosaic grid actually apply.
function Reveal({ children, delay = 0, y = 28, x = 0, className = '', style }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const checks = ['CPCB & SPCB Registered', 'ISO 14001:2015 Certified', 'Traceable GPS Logistics', 'Waste Picker Inclusion'];

const pillars = [
  { Icon: Target, t: 'Our Mission', d: "To lead India's transition to a closed-loop economy by delivering compliant, scientific waste recovery solutions that divert valuable materials away from landfills and into sustainable reuse." },
  { Icon: Eye, t: 'Our Vision', d: 'To become the most reliable pan-India environmental partner for enterprises, municipal councils, and grassroots waste pickers, setting gold standards for traceable EPR compliance.' },
  { Icon: HeartHandshake, t: 'Inclusivity & CSR', d: 'Empowering frontline waste aggregators with fair wages, occupational health safety equipment, and integration into the formal digital recycling ecosystem.' },
];

const features = [
  { Icon: Factory, t: 'Zero Liquid Discharge (ZLD)', d: '100% wastewater recycling within closed wash-lines.' },
  { Icon: ShieldCheck, t: 'Tamper-Proof Manifest Records', d: 'Form 6 and Form 10 certified end-to-end audit paperwork.' },
];

const mosaic = [
  { src: '/images/recycling/facility.jpg', alt: 'ARKCA material recovery plant' },
  { src: '/images/services/metal.jpg', alt: 'Metal recycling processing' },
  { src: '/images/services/waste-collection.jpg', alt: 'Waste collection channelisation' },
  { src: '/images/hero/oil.webp', alt: 'Oil distillation facility' },
];

export default function KnowUs() {
  const reduce = useReducedMotion();

  return (
    <div className="know-us-page ku">
      {/* 1. HERO */}
      <section className="inner-hero ku-hero">
        <div className="inner-hero-bg ku-hero-bg" style={{ backgroundImage: 'url(/images/recycling/facility.jpg)' }} />
        <div className="inner-hero-shade" />
        <div className="container">
          <div className="inner-hero-content ku-hero-content">
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
              <h1 className="ip-h1">Transforming Waste into Resourceful Value</h1>
              <p className="inner-hero-desc">
                ARKCA Recyclers is an authorized sustainability enabler, delivering compliant waste channelisation, certified recycling infrastructure, and EPR advisory across India.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT */}
      <section className="section section-white ku-sec">
        <div className="container">
          <div className="ku-about">
            <Reveal className="ku-about-copy">
              <span className="badge-tag">ABOUT OUR FOUNDATION</span>
              <h2 className="ip-h2 ip-h2-dark">
                Dedicated to a <span className="text-highlight">Greener, Zero-Waste</span> Future
              </h2>
              <p className="ip-body ip-body-dark">
                Established with a clear vision to bridge India's formal and informal waste ecosystems, ARKCA Recyclers has grown into one of the country's most dependable environmental stewardship organizations.
              </p>
              <p className="ip-body ip-body-dark">
                We work in close compliance with Central Pollution Control Board (CPCB) norms and State Pollution Control Boards (SPCBs) to streamline the lifecycle of hazardous and non-hazardous materials. From door-to-door industrial pickups to end-of-life material recovery, we ensure full traceability, regulatory audit readiness, and authentic circular outcomes.
              </p>
              <ul className="ku-checks">
                {checks.map((c) => (
                  <li key={c}>
                    <CheckCircle2 color="#148C4A" size={22} />
                    <span style={{ fontWeight: 600, color: '#071C19' }}>{c}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15} x={30} y={0} className="ku-about-media">
              <span className="ku-frame" aria-hidden="true" />
              <div className="ku-photo ku-zoom">
                <img src="/images/recycling/waste-pickers.jpg" alt="ARKCA Recyclers community impact" loading="lazy" />
              </div>
              <div className="ku-stat">
                <TrendingUp size={36} color="#3cd070" />
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>10+ Years</div>
                  <div style={{ fontSize: '0.85rem', color: '#9cb5ab' }}>Environmental Dedication</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. PURPOSE */}
      <section className="section section-light ku-sec">
        <div className="container">
          <Reveal className="ku-center-head">
            <span className="badge-tag">OUR CORE PURPOSE</span>
            <h2 className="ip-h2 ip-h2-dark">Built on Purpose and Principles</h2>
            <p className="ip-body ip-body-dark">
              Every decision at ARKCA is driven by our commitment to ecological balance, transparency, and socioeconomic upliftment.
            </p>
          </Reveal>

          <div className="ku-pillars">
            {pillars.map(({ Icon, t, d }, i) => (
              <Reveal key={t} delay={0.1 * (i + 1)} className={`ku-pillar ku-pillar-${i}`}>
                <article tabIndex={0}>
                  <span className="ku-pillar-num" aria-hidden="true">0{i + 1}</span>
                  <span className="ku-pillar-ring" aria-hidden="true" />
                  <div className="ku-pillar-icon"><Icon size={26} /></div>
                  <h3 className="ip-h3" style={{ color: '#071C19' }}>{t}</h3>
                  <p className="ip-body ip-body-dark">{d}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INFRASTRUCTURE */}
      <section className="section section-dark ku-sec">
        <div className="container">
          <div className="ku-infra">
            <Reveal>
              <span className="badge-tag light-theme">ADVANCED RECYCLING HUBS</span>
              <h2 className="ip-h2 ip-h2-light">State-of-the-Art Processing Facilities</h2>
              <p className="ip-body ip-body-light">
                Our processing plants operate with advanced emission control systems, high-capacity granulators, pyrolysis processors, and electronic shredders to maximize secondary raw material purity.
              </p>
              <div className="ku-features">
                {features.map(({ Icon, t, d }) => (
                  <div className="ku-feature" key={t}>
                    <div className="ku-feature-icon"><Icon size={24} /></div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{t}</h4>
                      <p style={{ color: '#9cb5ab', fontSize: '0.9rem' }}>{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15} className="ku-mosaic">
              {mosaic.map((m, i) => (
                <figure key={m.alt} className={`ku-tile ku-zoom ku-tile-${i}`}>
                  <img src={m.src} alt={m.alt} loading="lazy" />
                </figure>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="section section-light ku-sec" style={{ textAlign: 'center' }}>
        <div className="container">
          <Reveal className="ku-cta">
            <span className="ku-cta-blob" aria-hidden="true" />
            <span className="badge-tag">PARTNER WITH US</span>
            <h2 className="ip-h2 ip-h2-dark">Ready to Accelerate Your Sustainability Goals?</h2>
            <p className="ip-body ip-body-dark">
              Speak with our senior environmental consultants to assess your industrial waste streams, calculate your EPR credits, and set up compliant collection operations today.
            </p>
            <div className="ku-cta-btns">
              <Link to="/contact-us" className="btn-primary ku-btn">
                Contact Our Consultants <ArrowRight size={18} />
              </Link>
              <Link to="/waste-collection" className="btn-outline ku-btn">Explore Waste Services</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
