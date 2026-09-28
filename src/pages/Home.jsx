import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent,
  useReducedMotion, useInView, animate,
} from 'framer-motion';
import {
  Trash2, Infinity as InfinityIcon, Leaf, Globe, Recycle, ShieldCheck,
  FileCheck2, Users, Factory, Cog, ArrowRight, CheckCircle, Megaphone, Briefcase,
} from 'lucide-react';
import '../home-redesign.css';

/* ---------------- DATA (unchanged) ---------------- */
const heroTabs = [
  { id: 'plastic', name: 'PLASTIC', title: 'PLASTIC', desc: 'ARKCA Recyclers champions circular polymer economics. We provide certified collection, decontamination, shredding, and pelletizing of industrial and post-consumer plastics under CPCB Category I, II & III EPR guidelines.', bg: '/images/hero/plastic.jpg' },
  { id: 'electronic', name: 'ELECTRONIC', title: 'ELECTRONIC', desc: 'Comprehensive authorized e-waste asset disposition and recycling. We recover precious rare metals and safely neutralize hazardous heavy materials in strict accordance with the E-Waste Management Rules 2022.', bg: '/images/hero/electronic.jpg' },
  { id: 'battery', name: 'BATTERY', title: 'BATTERY', desc: 'Environmentally sound disposal and recycling of industrial lead-acid, lithium-ion, and EV batteries. We empower battery manufacturers and importers to fulfill their annual mandatory recycling obligations.', bg: '/images/hero/battery.webp' },
  { id: 'tyre', name: 'TYRE', title: 'TYRE', desc: 'Sustainable end-of-life tyre management. We turn waste rubber into valuable crumb rubber, reclaim rubber, and pyrolytic fuel oil, eliminating open dumping and burning while meeting EPR quotas.', bg: '/images/hero/tyre.jpg' },
  { id: 'oil', name: 'OIL', title: 'OIL', desc: "ARKCA Recyclers is dedicated to adhere to the Hazardous and Waste Management Rule for simplifying the process of used Base/lubrication oil collection, transportation and recovery of useful materials. Our professional EPR consultants are equipped for offering diverse assistance in fulfilment of yearly EPR for used oil Recycling target for each year, based on last year's import and sales data.", bg: '/images/hero/oil.webp' },
];

const faqs = [
  { q: 'WHAT TYPES OF WASTE DO YOU COLLECT?', a: "We are into collecting all types of Plastic waste, E waste, Battery, and Tyre waste, by complying with EPR for waste collection guidelines. We're soon planning to initiate used oil collection followed by recycling services as well." },
  { q: 'HOW DO I SCHEDULE A WASTE PICKUP?', a: 'You can submit a disposal request right here on our portal, call our helpline at +91-9316-631-170, or email us. Our logistics team will inspect your location, coordinate an authorized vehicle, and issue digital Form 6 manifests upon pickup.' },
  { q: 'WHAT ITEMS CAN BE RECYCLED?', a: 'We process industrial polymers (rigid & flexible), electronic appliances and printed circuit boards, automotive and UPS batteries, commercial and heavy vehicle tyres, base lube oils, and metal scrap from manufacturing plants.' },
  { q: 'HOW SHOULD I PREPARE MY RECYCLABLES?', a: 'Keep recyclables segregated into distinct dry lots. Ensure battery terminals are taped or insulated, and oil is secured in leak-proof drums. Our field engineers provide specialized collection bins and safety instructions.' },
];

const testimonials = [
  { quote: 'ARKCA Recyclers has been an invaluable partner in our sustainability journey. Their professionalism, transparency and commitment to compliance make them a trusted ally.', name: 'John Doe', role: 'CEO' },
  { quote: 'Fulfilling our annual EPR plastic targets was a complex challenge until we collaborated with ARKCA. Their verified documentation and digital portal made our audit flawless.', name: 'Priya Sharma', role: 'Head of Sustainability, FMCG Corp' },
  { quote: 'Reliable industrial e-waste destruction and scrap pickup with guaranteed tamper-proof disposal certificates. Highly recommended for enterprise environmental compliance.', name: 'Rajiv Sengupta', role: 'Operations Director, TechLogistics' },
];

const ecoCards = [
  { Icon: Trash2, n: '01', t: 'INDUSTRIAL', s: 'Waste Management', d: 'We offer complete industrial waste management services, from collection to recycling.' },
  { Icon: InfinityIcon, n: '02', t: 'SUSTAINABLE', s: 'Business Solutions', d: 'We help business adopt sustainable and environmentally responsible recycling practices.' },
  { Icon: Leaf, n: '03', t: 'ENVIRONMENTAL', s: 'Quality Services', d: 'We focus on disposing of all waste sustainably and minimizing environmental impact.' },
];

const metrics = [
  { Icon: Globe, val: '1000+', label: 'Businesses Served' },
  { Icon: Recycle, val: '5000+', label: 'Tonnes Recycled' },
  { Icon: ShieldCheck, val: '100%', label: 'Regulatory Compliance' },
];

const impact = [
  { Icon: Recycle, val: '16+', label: 'Tons of Waste Recycled', num: '01' },
  { Icon: Users, val: '349+', label: 'Households Reached', num: '02' },
  { Icon: Megaphone, val: '41+', label: 'Awareness Campaign', num: '03' },
  { Icon: Briefcase, val: '59+', label: 'Customers', num: '04' },
];

const services = [
  { Icon: Trash2, t: 'Waste collection', d: 'Involving modern state-of-art technology for sustainable waste collection and management.' },
  { Icon: FileCheck2, t: 'EPR consultancy', d: 'Our 200+ dedicated EPR consultants provide all-rounder solutions to facilitate EPR compliance fulfillment seamlessly.' },
  { Icon: Leaf, t: 'Corporate social responsibility', d: 'Have a look through our CSR commitments, at a glance.' },
  { Icon: Users, t: 'Community collection programme', d: 'We are responsible towards fostering sustainable waste collection and management in the community.' },
  { Icon: Factory, t: 'Corporate collection programme', d: 'Our corporate tie-ups and partnerships adhering to sustainable waste collection framework.' },
  { Icon: Cog, t: 'Metal Recycling', d: 'Our sustainable metal recycling process as per EPR guidelines.' },
];

const emptyForm = { wasteCategory: '', wasteSubCategory: '', weight: '', date: '', name: '', company: '', email: '', phone: '', pincode: '', message: '' };

/* ---------------- HELPERS ---------------- */
function Reveal({ children, delay = 0, x = 0, y = 32, className = '', as = 'div' }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

// Counts up only the numeric part; the original string (e.g. "1000+") is what ends up on screen.
function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const [text, setText] = useState(value);
  useEffect(() => {
    if (!inView || reduce) return;
    const m = value.match(/^(\d+)(.*)$/);
    if (!m) return;
    const c = animate(0, parseInt(m[1], 10), {
      duration: 1.6, ease: 'easeOut',
      onUpdate: (v) => setText(Math.round(v) + m[2]),
      onComplete: () => setText(value),
    });
    return () => c.stop();
  }, [inView, reduce, value]);
  return <span ref={ref}>{text}</span>;
}

/* ---------------- HERO (scroll-driven, sticky) ---------------- */
function Hero({ onCta }) {
  const wrap = useRef(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.min(heroTabs.length - 1, Math.max(0, Math.floor(p * heroTabs.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const goTo = (i) => {
    const el = wrap.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / heroTabs.length) * range, behavior: reduce ? 'auto' : 'smooth' });
  };

  const tab = heroTabs[active];
  return (
    <section className="ax-hero" ref={wrap} aria-label="Waste streams">
      <div className="ax-hero-stick">
        <div className="ax-hero-stage">
          {heroTabs.map((t, i) => {
            const on = i === active;
            const past = i < active;
            return (
              <div
                key={t.id}
                className="ax-hero-panel"
                aria-hidden={!on}
                style={{
                  opacity: on ? 1 : 0,
                  clipPath: on ? 'inset(0% 0% 0% 0% round 0px)' : past ? 'inset(0% 0% 100% 0% round 28px)' : 'inset(100% 0% 0% 0% round 28px)',
                  transition: reduce ? 'none' : 'clip-path .9s cubic-bezier(.22,1,.36,1), opacity .6s ease',
                }}
              >
                <div
                  className="ax-hero-img"
                  style={{
                    backgroundImage: `url(${t.bg})`,
                    transform: on || reduce ? 'scale(1.02)' : 'scale(1.18)',
                    transition: reduce ? 'none' : 'transform 6s cubic-bezier(.22,1,.36,1)',
                  }}
                />
              </div>
            );
          })}
          <div className="ax-hero-shade" />
        </div>

        <ol className="ax-hero-nav" aria-label="Choose waste stream">
          {heroTabs.map((t, i) => (
            <li key={t.id}>
              <button type="button" className={i === active ? 'on' : ''} aria-current={i === active} onClick={() => goTo(i)}>
                <span className="ax-hero-nav-n">0{i + 1}</span>
                <span className="ax-hero-nav-t">{t.name}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="ax-hero-copy">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="ax-hero-title">{tab.title}</h1>
              <p className="ax-hero-desc">{tab.desc}</p>
              <button type="button" className="ax-btn-glow" onClick={onCta}>
                <span>Disposal Request</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="ax-hero-progress" aria-hidden="true">
          <motion.i style={{ scaleX: barScale }} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- PAGE ---------------- */
export default function Home() {
  const [faqOpen, setFaqOpen] = useState(0);
  const [tIdx, setTIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const reduce = useReducedMotion();

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => { setFormSubmitted(false); setFormData(emptyForm); }, 5000);
  };
  const scrollToDisposal = () => {
    const el = document.getElementById('disposal-section');
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  const goTestimonial = (i) => { setDir(i > tIdx ? 1 : -1); setTIdx(i); };
  const swipe = (_, info) => {
    if (info.offset.x < -60) goTestimonial((tIdx + 1) % testimonials.length);
    else if (info.offset.x > 60) goTestimonial((tIdx - 1 + testimonials.length) % testimonials.length);
  };

  const sel = (name, label, first, opts) => (
    <div className="form-group">
      <label className="form-label" htmlFor={`f-${name}`}>{label}</label>
      <select id={`f-${name}`} name={name} value={formData[name]} onChange={handleFormChange} className="form-select" required>
        <option value="">{first}</option>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
  const inp = (name, label, type, ph, full) => (
    <div className={`form-group ${full ? 'full-width' : ''}`}>
      <label className="form-label" htmlFor={`f-${name}`}>{label}</label>
      <input id={`f-${name}`} type={type} name={name} placeholder={ph} value={formData[name]} onChange={handleFormChange} className="form-input" required />
    </div>
  );

  return (
    <div className="home-page ax">
      {/* 1. HERO */}
      <Hero onCta={scrollToDisposal} />

      {/* 2. ECOSYSTEM */}
      <section className="section section-white ax-sec">
        <div className="container">
          <div className="ecosystem-header ax-head">
            <Reveal>
              <span className="badge-tag">INTEGRATED. RESPONSIBLE. FUTURE-READY.</span>
              <h2 className="section-heading-dark ax-h2">
                One ecosystem. <br />
                <span className="text-highlight">Every waste stream.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="ecosystem-desc">From municipal collection to industrial circular recovery, we integrate every touchpoint of the waste management lifecycle into a unified, traceable, and eco-certified value chain.</p>
            </Reveal>
          </div>
          <div className="ax-eco">
            {ecoCards.map(({ Icon, n, t, s, d }, i) => (
              <Reveal key={n} delay={i * 0.12} className={`ax-eco-card ax-eco-${i}`}>
                <article tabIndex={0}>
                  <span className="ax-eco-num" aria-hidden="true">{n}</span>
                  <div className="ax-eco-icon"><Icon size={26} /></div>
                  <h3 className="ax-eco-title">{t}</h3>
                  <p className="ax-eco-sub">{s}</p>
                  <p className="ax-eco-text">{d}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DISPOSAL */}
      <section id="disposal-section" className="section section-dark ax-sec">
        <div className="container">
          <div className="disposal-wrapper ax-disposal">
            <Reveal x={-40} y={0} className="disposal-info">
              <span className="badge-tag light-theme">PARTNER WITH US</span>
              <h2 className="ax-h2">Responsible <br />Disposal Made Simple</h2>
              <p>Submit a request and our team will get in touch to arrange safe, compliant and hassle-free disposal for your waste.</p>
              <div className="disposal-metrics ax-metrics">
                {metrics.map(({ Icon, val, label }) => (
                  <div className="disposal-metric-item" key={label}>
                    <Icon size={28} className="disposal-metric-icon" />
                    <span className="disposal-metric-val"><CountUp value={val} /></span>
                    <span className="disposal-metric-label">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal x={40} y={0} delay={0.1} className="disposal-form-card ax-glass">
              <div className="disposal-form-header">
                <h3 className="disposal-form-title">Request a Disposal</h3>
                <p className="disposal-form-sub">Fill in your details and we'll handle the rest.</p>
              </div>
              {formSubmitted ? (
                <div role="status" style={{ textAlign: 'center', padding: '30px 10px', color: '#48cf73' }}>
                  <CheckCircle size={48} style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px' }}>Request Submitted Successfully!</h4>
                  <p style={{ color: '#a6c5ba', fontSize: '0.95rem' }}>Our logistics and compliance officer will connect with you within 2 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <div className="disposal-form-grid">
                    {sel('wasteCategory', 'Waste Category', 'Choose...', ['Plastic Waste', 'E-Waste', 'Battery Waste', 'Tyre Waste', 'Used Oil', 'Metal Scrap'])}
                    {sel('wasteSubCategory', 'Waste Sub Category', 'Choose ...', ['Rigid Plastic (Cat I)', 'Flexible Packaging (Cat II)', 'Multi-Layered Plastic (Cat III)', 'IT Equipment & Servers', 'Automotive Lead Batteries', 'Lithium-Ion / EV Cells', 'Commercial Truck Tyres', 'Industrial Lubricant Oil'])}
                    {sel('weight', 'Weight', 'Choose', ['Below 500 Kg', '500 Kg - 2 Tonnes', '2 Tonnes - 10 Tonnes', 'Above 10 Tonnes'])}
                    {inp('date', 'Date', 'date', undefined)}
                    {inp('name', 'Name', 'text', 'Enter Full Name')}
                    {inp('company', 'Company Name /Organization', 'text', 'Enter Company Name /Organization')}
                    {inp('email', 'Email', 'email', 'Enter Your email')}
                    {inp('phone', 'Contact Number', 'tel', 'Enter Contact Number')}
                    {inp('pincode', 'Pincode', 'text', 'Enter Pincode', true)}
                    <div className="form-group full-width">
                      <label className="form-label" htmlFor="f-message">Message</label>
                      <textarea id="f-message" name="message" placeholder="Write Your Message" value={formData.message} onChange={handleFormChange} className="form-textarea" rows={3} />
                    </div>
                  </div>
                  <button type="submit" className="form-submit-btn ax-btn-solid">Send</button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="section section-light ax-sec">
        <div className="container">
          <div className="faq-grid ax-faq">
            <Reveal className="ax-faq-intro">
              <div className="ax-faq-glow" aria-hidden="true" />
              <span className="badge-tag">FREQUENTLY ASKED QUESTIONS</span>
              <h2 className="faq-intro-title ax-h2">Have questions? <br />We have <span className="text-highlight">answers.</span></h2>
              <p className="faq-intro-desc">We have dedicated professional consultants to help you for complying with any query related to waste recycling by aligning with CPCB's waste recycling guidelines.</p>
              <Link to="/contact-us" className="btn-primary ax-btn-solid">View ALL FAQs <ArrowRight size={16} /></Link>
            </Reveal>
            <div className="faq-accordion-list ax-faq-list">
              {faqs.map((faq, index) => {
                const isOpen = faqOpen === index;
                return (
                  <div key={index} className={`faq-accordion-item ax-faq-item ${isOpen ? 'open' : ''}`}>
                    <h3>
                      <button type="button" className="faq-accordion-header ax-faq-q" aria-expanded={isOpen} aria-controls={`faq-${index}`} onClick={() => setFaqOpen(isOpen ? -1 : index)}>
                        <span className="ax-faq-q-left">
                          <span className="ax-faq-num">0{index + 1}</span>
                          <span>{faq.q}</span>
                        </span>
                        <motion.span className="ax-faq-plus" aria-hidden="true" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.4 }}>
                          {isOpen ? '—' : '+'}
                        </motion.span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div id={`faq-${index}`} className="ax-faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                          <div className="faq-accordion-body">{faq.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. IMPACT */}
      <section className="section section-dark ax-sec ax-impact-sec">
        <div className="container">
          <div className="impact-header ax-head ax-impact-head">
            <Reveal className="ax-impact-head-left">
              <span className="badge-tag light-theme">OUR IMPACT IN NUMBERS</span>
              <h2 className="section-heading-light ax-h2">Real change. <br />Measurable results.</h2>
            </Reveal>
            <Reveal delay={0.15} className="ax-impact-head-right">
              <p className="impact-desc">Quantifying sustainable resource recovery through transparent audit trails, certified recycling processes, and direct community empowerment across our regional hubs.</p>
            </Reveal>
          </div>
          <div className="ax-impact-dashboard">
            {impact.map(({ Icon, val, label, num }, i) => (
              <Reveal key={label} delay={i * 0.1} className={`ax-impact-card ax-impact-card-${i}`}>
                <article className="ax-impact-card-inner" tabIndex={0}>
                  <span className="ax-impact-orbit" aria-hidden="true" />
                  <span className="ax-impact-glow" aria-hidden="true" />
                  <div className="ax-impact-top">
                    <div className="ax-impact-icon-wrap">
                      <Icon size={24} />
                    </div>
                    <span className="ax-impact-chip">{num}</span>
                  </div>
                  <div className="ax-impact-body">
                    <div className="ax-impact-val"><CountUp value={val} /></div>
                    <div className="ax-impact-label">{label}</div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SERVICES */}
      <section className="section section-light ax-sec">
        <div className="container">
          <div className="services-section-header ax-head">
            <Reveal>
              <span className="badge-tag">SERVICES FOR INDUSTRIES</span>
              <h2 className="section-heading-dark ax-h2">Tailored solutions <br />for a <span className="text-highlight">sustainable future</span></h2>
            </Reveal>
            <Reveal delay={0.15} className="ax-head-right">
              <p style={{ color: '#526b64', marginBottom: '12px', maxWidth: '420px' }}>From compliance to collection, we help businesses across industries manage waste responsibly.</p>
              <Link to="/waste-collection" className="blog-read-more-link ax-link">Explore All Services <ArrowRight size={16} /></Link>
            </Reveal>
          </div>
          <div className="ax-services">
            {services.map(({ Icon, t, d }, i) => (
              <Reveal key={t} delay={(i % 2) * 0.1} className={`ax-svc ax-svc-${i}`}>
                <article tabIndex={0}>
                  <span className="ax-svc-blob" aria-hidden="true" />
                  <span className="ax-svc-num" aria-hidden="true">0{i + 1}</span>
                  <div className="ax-svc-icon"><Icon size={24} /></div>
                  <h3 className="service-card-title ax-svc-title">{t}</h3>
                  <p className="service-card-desc ax-svc-desc">{d}</p>
                  <ArrowRight className="ax-svc-arrow" size={22} aria-hidden="true" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="section section-dark ax-sec ax-testi-sec">
        <div className="container">
          <div className="testimonials-grid ax-testi">
            <Reveal className="ax-testi-intro">
              <div className="ax-testi-accent-bar" aria-hidden="true" />
              <span className="badge-tag light-theme">TESTIMONIALS</span>
              <h2 className="section-heading-light ax-h2" style={{ marginBottom: '20px' }}>
                Trusted by <br />businesses that care
              </h2>
              <p style={{ color: '#b9cfc7', fontSize: '1.05rem', lineHeight: '1.7', maxWidth: '440px' }}>
                We're proud to partner with organisations that share our vision for a cleaner, greener and more sustainable tomorrow.
              </p>
            </Reveal>
            <div className="ax-testi-wrapper">
              <div className="ax-testi-card-box">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.figure
                    key={tIdx}
                    className="ax-testi-card"
                    custom={dir}
                    drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={swipe}
                    initial={reduce ? false : { opacity: 0, x: 24 * dir }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 * dir }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="ax-testi-quote-mark" aria-hidden="true">“</div>
                    <blockquote className="testimonial-text ax-testi-text">
                      {testimonials[tIdx].quote}
                    </blockquote>
                    <div className="ax-testi-divider" aria-hidden="true" />
                    <figcaption className="testimonial-author ax-testi-author">
                      <img
                        src="/images/recycling/team.jpg"
                        alt={testimonials[tIdx].name}
                        className="testimonial-avatar ax-testi-avatar"
                        loading="lazy"
                        draggable="false"
                      />
                      <div>
                        <h4 className="testimonial-name ax-testi-name">{testimonials[tIdx].name}</h4>
                        <p className="testimonial-role ax-testi-role">{testimonials[tIdx].role}</p>
                      </div>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
              <div className="carousel-indicators ax-testi-dots" role="tablist" aria-label="Testimonials">
                {testimonials.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    role="tab"
                    aria-selected={tIdx === i}
                    aria-label={`Testimonial ${i + 1}`}
                    className={`carousel-dot ax-dot ${tIdx === i ? 'active' : ''}`}
                    onClick={() => goTestimonial(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BLOG */}
      <section className="section section-white ax-sec">
        <div className="container">
          <div className="blog-section-header ax-head">
            <Reveal>
              <span className="badge-tag">FROM OUR BLOG</span>
              <h2 className="blog-title-compound ax-h2">OUR <span className="text-highlight">BLOG</span></h2>
            </Reveal>
            <Reveal delay={0.15} className="ax-head-right">
              <p style={{ color: '#526b64', marginBottom: '12px', maxWidth: '440px' }}>Glide Through our Blog section to know more about sustainable waste recycling mechanisms around us.</p>
              <Link to="/know-us" className="btn-primary ax-btn-solid" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>READ MORE <ArrowRight size={14} /></Link>
            </Reveal>
          </div>
          <div className="blog-grid ax-blog">
            <Reveal className="ax-blog-feat">
              <article className="featured-blog-card ax-lift">
                <div className="featured-blog-img-wrap ax-zoom">
                  <img src="/images/recycling/circular-economy.jpg" alt="From Waste to Wealth" className="featured-blog-img" loading="lazy" />
                </div>
                <div className="featured-blog-content">
                  <h3 className="featured-blog-title">From Waste to Wealth: How Recycling Is Creating Value in the Circular Economy</h3>
                  <p className="featured-blog-snippet">1980s - Waste is the end of this product; it can't be reused. 2026 - This is not waste; we can regenerate value through technical disassembly and clean reprocessing...</p>
                  <Link to="/know-us" className="blog-read-more-link ax-link">Read More »</Link>
                </div>
              </article>
            </Reveal>
            <div className="side-blog-list">
              {[
                { src: '/images/recycling/waste-pickers.jpg', alt: 'EPR and Livelihoods', t: 'EPR and Livelihoods: How EPR Plastic Rules Can Create Opportunities for Waste Pickers' },
                { src: '/images/recycling/facility.jpg', alt: 'Circular Economy Technology', t: 'From Waste to Wealth: How Recycling Is Creating Value in the Circular Economy' },
              ].map((b, i) => (
                <Reveal key={b.alt} delay={0.12 * (i + 1)} x={30} y={0}>
                  <article className="side-blog-card ax-lift">
                    <div className="ax-zoom ax-side-img">
                      <img src={b.src} alt={b.alt} className="side-blog-img" loading="lazy" />
                    </div>
                    <div className="side-blog-content">
                      <h4 className="side-blog-title">{b.t}</h4>
                      <span className="side-blog-date">September 24, 2026</span>
                      <Link to="/know-us" className="blog-read-more-link ax-link">Read More »</Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
