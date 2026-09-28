import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Cpu,
  BatteryCharging,
  Disc,
  Droplets,
  Cog,
  CheckCircle,
  Truck,
  Scale,
  FileText,
  ShieldCheck,
  ArrowRight,
  Clock,
  Calendar,
  PhoneCall
} from 'lucide-react';

const wasteStreams = [
  {
    id: 'plastic',
    title: 'Plastic Waste Collection',
    category: 'Category I, II & III',
    icon: Trash2,
    desc: 'Authorized collection and processing of rigid plastics (HDPE, PP, PET), flexible films (LDPE, LLDPE), and multi-layered laminates from FMCG, manufacturing, and commercial premises.',
    details: [
      'Pre-segregation at source and baling',
      'High-capacity wash lines and granulators',
      'Full EPR credit generation on CPCB portal',
      'Zero landfill diversion guarantee'
    ],
    image: '/images/waste/plastic.jpg'
  },
  {
    id: 'electronic',
    title: 'Electronic Asset Disposition (E-Waste)',
    category: 'CPCB Rules 2022 Compliant',
    icon: Cpu,
    desc: 'Secure decommissioning of enterprise IT assets, servers, computers, telecom gear, and consumer electronics with certified data sanitization and rare earth metal recovery.',
    details: [
      'Certified on-site or off-site data destruction (DoD 5220.22-M)',
      'Green recycling certificate with serial tracking',
      'Environmentally sound mechanical dismantling',
      'Refurbishment and component upcycling'
    ],
    image: '/images/waste/electronic.jpg'
  },
  {
    id: 'battery',
    title: 'Used Battery Management',
    category: 'Lead-Acid & Lithium-Ion',
    icon: BatteryCharging,
    desc: 'Compliant channelisation and recycling of industrial UPS batteries, automotive lead-acid packs, and electric vehicle (EV) lithium-ion batteries.',
    details: [
      'Acid drainage and neutralisation in closed reactors',
      'High purity lead recovery (> 99.97%)',
      'Cobalt, Nickel & Lithium hydrometallurgical extraction',
      'Complete EPR compliance reports for battery PIBOs'
    ],
    image: '/images/waste/battery.jpg'
  },
  {
    id: 'tyre',
    title: 'End-of-Life Tyre (ELT) Collection',
    category: 'CPCB Tyre Rules',
    icon: Disc,
    desc: 'Bulk aggregation of commercial truck tyres, passenger vehicle tyres, and earthmover tyres to produce high quality crumb rubber and reclaim rubber.',
    details: [
      'Steel bead wire and textile debonding',
      'Ambient & cryogenic crumb rubber granulation',
      'Pyrolysis oil recovery meeting industrial fuel standards',
      'Certified credit generation under Tyre EPR guidelines'
    ],
    image: '/images/waste/tyre.jpg'
  },
  {
    id: 'oil',
    title: 'Used Lubricating & Base Oil',
    category: 'Hazardous Waste Rules',
    icon: Droplets,
    desc: 'Safe collection and vacuum distillation re-refining of spent engine oils, industrial hydraulic lubricants, turbine oils, and transformer fluids.',
    details: [
      'Spill-proof tanker fleet with digital flow meters',
      'De-asphalting and hydrofinishing into virgin-grade base oil',
      'Complete Form 6 and Form 10 hazardous manifest tracking',
      'Elimination of illegal burning or soil contamination'
    ],
    image: '/images/waste/oil.jpg'
  },
  {
    id: 'metal',
    title: 'Industrial Scrap & Metal Recycling',
    category: 'Ferrous & Non-Ferrous',
    icon: Cog,
    desc: 'Systematic recycling of production line off-cuts, stamped sheet metal, aluminium turnings, copper scrap, and structural industrial steel.',
    details: [
      'High precision digital weighbridge calibration',
      'Sorting, shearing, and baling for direct furnace feeding',
      'Competitive industrial scrap purchasing contracts',
      '100% emission-controlled smelting partnerships'
    ],
    image: '/images/waste/metal.jpg'
  }
];

export default function WasteCollection() {
  const [selectedStream, setSelectedStream] = useState(wasteStreams[0]);
  const [pickupFormSubmitted, setPickupFormSubmitted] = useState(false);
  const [pickupData, setPickupData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    wasteType: 'Plastic Waste',
    approxWeight: '500 Kg - 2 Tonnes',
    preferredDate: '',
    specialNotes: ''
  });

  const handleInputChange = (e) => {
    setPickupData({ ...pickupData, [e.target.name]: e.target.value });
  };

  const handlePickupSubmit = (e) => {
    e.preventDefault();
    setPickupFormSubmitted(true);
    setTimeout(() => {
      setPickupFormSubmitted(false);
      setPickupData({
        businessName: '',
        contactPerson: '',
        phone: '',
        email: '',
        city: '',
        wasteType: 'Plastic Waste',
        approxWeight: '500 Kg - 2 Tonnes',
        preferredDate: '',
        specialNotes: ''
      });
    }, 5000);
  };

  return (
    <div className="waste-collection-page">
      {/* 1. HERO BANNER */}
      <section className="inner-hero">
        <div
          className="inner-hero-bg"
          style={{ backgroundImage: 'url(/images/hero/tyre.jpg)' }}
        />
        <div className="container">
          <div className="inner-hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span>Waste Collection</span>
            </div>
            <span className="badge-tag light-theme">TRACEABLE & COMPLIANT PICKUPS</span>
            <h1 className="inner-hero-title">
              Industrial & Commercial Waste Collection Services
            </h1>
            <p className="inner-hero-desc">
              End-to-end collection, safe transport, certified weighing, and closed-loop recycling across all major hazardous and non-hazardous industrial waste categories.
            </p>
          </div>
        </div>
      </section>

      {/* 2. OUR WASTE STREAMS (INTERACTIVE EXPLORER) */}
      <section className="section section-white">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 50px' }}>
            <span className="badge-tag">COMPLETE WASTE SPECTRUM</span>
            <h2 className="section-heading-dark">What We Collect & Process</h2>
            <p style={{ color: '#526b64', marginTop: '12px', fontSize: '1.05rem' }}>
              Select a waste stream below to learn more about our collection protocols, recycling technology, and environmental compliance deliverables.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '50px' }}>
            {wasteStreams.map((stream) => {
              const Icon = stream.icon;
              const isSelected = selectedStream.id === stream.id;
              return (
                <div
                  key={stream.id}
                  onClick={() => setSelectedStream(stream)}
                  style={{
                    background: isSelected ? '#EAF4EE' : '#fff',
                    border: isSelected ? '2px solid #148C4A' : '1px solid #dce8e1',
                    borderRadius: '14px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected ? '0 8px 24px rgba(20, 140, 74, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '10px',
                      background: isSelected ? '#148C4A' : '#f0f6f2',
                      color: isSelected ? '#fff' : '#148C4A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#071C19' }}>
                        {stream.title}
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: '#148C4A', fontWeight: 600 }}>
                        {stream.category}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#526b64', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {stream.desc.slice(0, 95)}...
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected Stream Deep Dive Card */}
          <div style={{
            background: '#F5F9F5',
            borderRadius: '20px',
            border: '1px solid #cce4d6',
            padding: '40px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '40px',
            alignItems: 'center'
          }}>
            <div>
              <span className="badge-tag">{selectedStream.category}</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#071C19', marginBottom: '16px' }}>
                {selectedStream.title}
              </h3>
              <p style={{ color: '#4a635b', fontSize: '1rem', lineHeight: '1.7', marginBottom: '24px' }}>
                {selectedStream.desc}
              </p>

              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#071C19', marginBottom: '14px' }}>
                Key Operational Highlights:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                {selectedStream.details.map((point, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={18} color="#148C4A" />
                    <span style={{ fontSize: '0.95rem', color: '#2d433e' }}>{point}</span>
                  </div>
                ))}
              </div>

              <a href="#pickup-booking-section" className="btn-primary">
                Schedule {selectedStream.title.split(' ')[0]} Pickup <ArrowRight size={16} />
              </a>
            </div>

            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '340px', boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}>
              <img
                src={selectedStream.image}
                alt={selectedStream.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP COLLECTION WORKFLOW */}
      <section className="section section-light">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
            <span className="badge-tag">END-TO-END ASSURANCE</span>
            <h2 className="section-heading-dark">How Our Waste Collection Works</h2>
            <p style={{ color: '#526b64', marginTop: '10px' }}>
              Standardized, transparent, and hassle-free pickup protocol engineered for audit readiness.
            </p>
          </div>

          <div className="process-grid">
            {/* Step 1 */}
            <div className="process-card">
              <div className="process-step-num">01</div>
              <h3 className="process-card-title">Audit & Scheduling</h3>
              <p className="process-card-desc">
                Submit waste specifications online or request an on-site waste assessment by our field compliance officer.
              </p>
            </div>

            {/* Step 2 */}
            <div className="process-card">
              <div className="process-step-num">02</div>
              <h3 className="process-card-title">Certified Weighing</h3>
              <p className="process-card-desc">
                Pickup vehicles equipped with calibrated scales arrive at your doorstep for transparent on-site tare weighing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="process-card">
              <div className="process-step-num">03</div>
              <h3 className="process-card-title">GPS-Tracked Transit</h3>
              <p className="process-card-desc">
                Materials are transported to authorized recycling hubs under strict digital surveillance and Form 6 manifests.
              </p>
            </div>

            {/* Step 4 */}
            <div className="process-card">
              <div className="process-step-num">04</div>
              <h3 className="process-card-title">Green Certification</h3>
              <p className="process-card-desc">
                Receive government-valid Recycling and Destruction Certificates with corresponding EPR compliance credits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCHEDULE PICKUP BOOKING FORM */}
      <section id="pickup-booking-section" className="section section-dark">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span className="badge-tag light-theme">DOORSTEP DISPOSAL</span>
              <h2 className="section-heading-light" style={{ marginBottom: '20px' }}>
                Schedule a Commercial Waste Pickup
              </h2>
              <p style={{ color: '#b9cfc7', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '32px' }}>
                Whether you have one-time factory clearance scrap or require recurring collection agreements, our authorized team will coordinate seamless logistics.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(43, 168, 74, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3cd070' }}>
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.05rem' }}>Pan-India Logistics Fleet</h4>
                    <p style={{ color: '#8daaa0', fontSize: '0.85rem' }}>Prompt pickups across Kolkata, West Bengal, and eastern industrial belts.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(43, 168, 74, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3cd070' }}>
                    <PhoneCall size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.05rem' }}>Immediate Support Helpline</h4>
                    <p style={{ color: '#8daaa0', fontSize: '0.85rem' }}>Call +91-9316-631-170 for emergency hazardous waste transport.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="disposal-form-card">
              <div className="disposal-form-header">
                <h3 className="disposal-form-title">Pickup Booking Request</h3>
                <p className="disposal-form-sub">Provide your location & waste volume for instant vehicle dispatch.</p>
              </div>

              {pickupFormSubmitted ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#48cf73' }}>
                  <CheckCircle size={48} style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px' }}>
                    Pickup Request Confirmed!
                  </h4>
                  <p style={{ color: '#a6c5ba', fontSize: '0.95rem' }}>
                    A logistics supervisor has been assigned to schedule vehicle allocation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePickupSubmit}>
                  <div className="disposal-form-grid">
                    <div className="form-group">
                      <label className="form-label">Business / Industry Name</label>
                      <input
                        type="text"
                        name="businessName"
                        placeholder="Company name"
                        value={pickupData.businessName}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contact Person</label>
                      <input
                        type="text"
                        name="contactPerson"
                        placeholder="Your full name"
                        value={pickupData.contactPerson}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91-0000000000"
                        value={pickupData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="name@company.com"
                        value={pickupData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Primary Waste Type</label>
                      <select
                        name="wasteType"
                        value={pickupData.wasteType}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="Plastic Waste">Plastic Waste</option>
                        <option value="Electronic E-Waste">Electronic E-Waste</option>
                        <option value="Battery Waste">Battery Waste</option>
                        <option value="Tyre Waste">Tyre Waste</option>
                        <option value="Used Lubricant Oil">Used Lubricant Oil</option>
                        <option value="Industrial Metal Scrap">Industrial Metal Scrap</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Approximate Quantity</label>
                      <select
                        name="approxWeight"
                        value={pickupData.approxWeight}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="Under 500 Kg">Under 500 Kg</option>
                        <option value="500 Kg - 2 Tonnes">500 Kg - 2 Tonnes</option>
                        <option value="2 - 10 Tonnes">2 - 10 Tonnes</option>
                        <option value="Bulk 10+ Tonnes">Bulk 10+ Tonnes</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pickup City / Area</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="e.g. Kolkata / Howrah"
                        value={pickupData.city}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred Date</label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={pickupData.preferredDate}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Special Handling Notes</label>
                      <textarea
                        name="specialNotes"
                        placeholder="Any hazardous requirements, loading dock details, or timing preferences"
                        value={pickupData.specialNotes}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows={2}
                      />
                    </div>
                  </div>

                  <button type="submit" className="form-submit-btn">
                    Confirm Pickup Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
