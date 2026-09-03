import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import ChatWidget from './ChatWidget'

const PROJECT_IMAGES = {
  hero: '/images/WhatsApp_Image_2026-08-30_at_11.23.13_AM.jpeg',
  family: '/images/WhatsApp_Image_2026-08-30_at_11.23.12_AM_(3).jpeg',
  location: '/images/WhatsApp_Image_2026-08-30_at_11.23.12_AM_(2).jpeg',
  plan: '/images/WhatsApp_Image_2026-08-30_at_11.23.12_AM_(4).jpeg',
  brochure: '/images/WhatsApp_Image_2026-08-30_at_11.23.13_AM_(1).jpeg',
}

const AMENITIES = [
  {
    title: 'Club House',
    desc: 'A sprawling 7,060 sq. yd. (7 bigha) clubhouse — the social heart of The Highway Farms.',
    img: 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Swimming Pool',
    desc: 'Resort-style swimming pools designed for relaxation and leisure across all seasons.',
    img: 'https://images.pexels.com/photos/9400976/pexels-photo-9400976.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Golf Course',
    desc: 'A professionally designed golf course offering a premium sporting lifestyle.',
    img: 'https://images.pexels.com/photos/9736758/pexels-photo-9736758.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Restaurant',
    desc: 'Fine dining restaurant serving gourmet cuisine in an elegant setting.',
    img: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Kids Playing Area',
    desc: 'Safe, modern play zones designed to keep children engaged and active.',
    img: 'https://images.pexels.com/photos/8060005/pexels-photo-8060005.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Live Music Area',
    desc: 'An open-air live music arena for evenings of entertainment under the stars.',
    img: 'https://images.pexels.com/photos/9298951/pexels-photo-9298951.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

const LOCATIONS = [
  { name: 'Galgotias University', distance: '5 min drive' },
  { name: 'Jaypee Sports City', distance: '5 min drive' },
  { name: 'International Cricket Stadium', distance: '5 min drive' },
  { name: 'International Buddha Circuit', distance: '5 min drive' },
  { name: 'Yamuna Expressway', distance: '5 min drive' },
  { name: 'IT Hub', distance: '5 min drive' },
  { name: 'Film City', distance: '10 min drive' },
  { name: 'Noida International Airport (Jewar)', distance: '15 min drive' },
]

const SPECS = [
  { icon: '🏡', value: '30 Acres', label: 'Total Project Area' },
  { icon: '🌿', value: '106 Units', label: 'Land Parcels' },
  { icon: '📐', value: '1,008 sq. yd.', label: 'Each Land Parcel' },
  { icon: '⚡', value: 'Approved', label: 'Government Electricity' },
]

const GALLERY_IMAGES = [
  { src: '/images/WhatsApp_Image_2026-08-30_at_11.23.13_AM.jpeg', alt: 'The Highway Farms site overview' },
  { src: '/images/WhatsApp_Image_2026-08-30_at_11.23.13_AM_(1).jpeg', alt: 'The Highway Farms brochure' },
  { src: '/images/WhatsApp_Image_2026-08-30_at_11.23.12_AM_(2).jpeg', alt: 'The Highway Farms location map' },
  { src: '/images/WhatsApp_Image_2026-08-30_at_11.23.12_AM_(3).jpeg', alt: 'The Highway Farms family lifestyle' },
  { src: '/images/WhatsApp_Image_2026-08-30_at_11.23.12_AM_(4).jpeg', alt: 'The Highway Farms master plan' },
]

const TEAM = [
  { name: 'Vansh Thakur', role: 'Founder', photo: '/images/Vansh_Thakur.jpeg' },
  { name: 'Deepanshu Goyal', role: 'Co-Founder', photo: '/images/Deepanshu_Goyal.jpeg' },
  { name: 'Rimple Kaur', role: 'General Manager', photo: '/images/Rimple_Kaur.jpeg' },
]

const PROJECT_TEAM = [
  { name: 'Gaurav Kumar', role: 'Developer' },
  { name: 'Vihan Raj', role: 'Developer' },
  { name: 'Ashvi', role: 'Contributor' },
  { name: 'Suryansh Pandey', role: 'Contributor' },
]

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const submittedForm = new FormData(e.currentTarget)
    const name = String(submittedForm.get('name') ?? '').trim()
    const phone = String(submittedForm.get('phone') ?? '').trim()
    const email = String(submittedForm.get('email') ?? '').trim()
    const message = String(submittedForm.get('message') ?? '').trim()

    if (!name || !phone) {
      setFormError('Please fill in at least your name and phone number to submit the form.')
      setFormStatus('error')
      return
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid phone number (at least 10 digits).')
      setFormStatus('error')
      return
    }

    setFormStatus('submitting')
    setFormError('')
    try {
      const { error } = await supabase.from('leads').insert({
        name,
        phone,
        email: email || null,
        message: message || null,
        source: 'contact-form',
        status: 'new',
        qualified: false,
      })

      if (error) throw error

      setFormStatus('success')
      setForm({ name: '', phone: '', email: '', message: '' })

      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-lead`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ name, phone, email, message }),
        })
      } catch {
        // notification is best-effort
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again or call us at +91 93193 07289.')
      setFormStatus('error')
    }
  }

  function scrollToSection(id: string) {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <div className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            VD Vanchers
          </div>
          <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a onClick={() => scrollToSection('about')}>About</a>
            <a onClick={() => scrollToSection('amenities')}>Amenities</a>
            <a onClick={() => scrollToSection('location')}>Location</a>
            <a onClick={() => scrollToSection('investment')}>Why Invest</a>
            <a onClick={() => scrollToSection('gallery')}>Gallery</a>
            <a onClick={() => scrollToSection('pricing')}>Pricing</a>
            <a onClick={() => scrollToSection('team')}>Team</a>
            <button className="navbar-cta" onClick={() => scrollToSection('contact')}>Enquire Now</button>
          </div>
          <button className="navbar-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <img src={PROJECT_IMAGES.hero} alt="The Highway Farms land project near Jaypee Sports City" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">✦ Premium Land Investment Opportunity</div>
          <h1>
            The <span className="gold">Highway Farms</span>
            <br />
            Where Luxury Meets Nature
          </h1>
          <p>
            106 premium land parcels spread across 30 acres near Yamuna Expressway.
            Build the farmhouse lifestyle you envision with planned amenities, approved electricity,
            and unmatched connectivity to Noida International Airport.
          </p>
          <div className="hero-cta-group">
            <button className="hero-cta-primary" onClick={() => scrollToSection('contact')}>
              Book a Site Visit
            </button>
            <button className="hero-cta-secondary" onClick={() => scrollToSection('pricing')}>
              View Pricing
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">30</div>
              <div className="hero-stat-label">Acres</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">106</div>
              <div className="hero-stat-label">Land Parcels</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">1,008</div>
              <div className="hero-stat-label">Per Parcel</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">15 min</div>
              <div className="hero-stat-label">To Jewar Airport</div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">Scroll to explore ↓</div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="about" id="about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-image">
              <img src={PROJECT_IMAGES.plan} alt="The Highway Farms master plan" />
            </div>
            <div className="about-text">
              <span className="section-label">About The Project</span>
              <h2>A Premium Land Community Designed for Your Future</h2>
              <p>
                <strong>The Highway Farms</strong> by VD Vanchers is an exclusive gated community of
                106 premium land parcels set across 30 acres of planned landscape. Each parcel offers
                1,008 sq. yd. (9,072 sq. ft.) — giving you the space to create the farmhouse,
                garden, and retreat you envision, subject to applicable approvals.
              </p>
              <p>
                With government-approved electricity, a grand 7,060 sq. yd. clubhouse, and proximity
                to Yamuna Expressway, this is land positioned for a connected lifestyle near Film City,
                Jaypee Sports City, and Noida International Airport.
              </p>
              <div className="about-highlights">
                <div className="about-highlight">
                  <div className="about-highlight-icon">📐</div>
                  <div className="about-highlight-text">
                    <strong>1,008 sq. yd.</strong>
                    Each land parcel
                  </div>
                </div>
                <div className="about-highlight">
                  <div className="about-highlight-icon">⚡</div>
                  <div className="about-highlight-text">
                    <strong>Govt. Electricity</strong>
                    Approved & ready
                  </div>
                </div>
                <div className="about-highlight">
                  <div className="about-highlight-icon">🏟️</div>
                  <div className="about-highlight-text">
                    <strong>7,060 sq. yd.</strong>
                    Clubhouse area
                  </div>
                </div>
                <div className="about-highlight">
                  <div className="about-highlight-icon">📍</div>
                  <div className="about-highlight-text">
                    <strong>Yamuna Expressway</strong>
                    5 min away
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AMENITIES ===== */}
      <section className="amenities" id="amenities">
        <div className="section-inner">
          <span className="section-label">Planned Lifestyle Amenities</span>
          <h2 className="section-title">Everything You Need for Luxury Living</h2>
          <p className="section-subtitle">
            Seven planned amenities designed to support the lifestyle you want to build on your own land.
            Final specifications, approvals, and delivery timelines are subject to project documentation.
          </p>
          <div className="amenities-grid">
            {AMENITIES.map((item) => (
              <div className="amenity-card" key={item.title}>
                <div className="amenity-card-image">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="amenity-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
            <div className="amenity-card">
              <div className="amenity-card-image">
                <img src="https://images.pexels.com/photos/31953686/pexels-photo-31953686.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Stud Farming" />
              </div>
              <div className="amenity-card-body">
                <h3>Stud Farming</h3>
                <p>Premium stud farming facilities — a rare lifestyle amenity for equestrian enthusiasts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOCATION ===== */}
      <section className="location" id="location">
        <div className="section-inner">
          <span className="section-label">Strategic Location</span>
          <h2 className="section-title">Connected to Everything That Matters</h2>
          <p className="section-subtitle">
            The Highway Farms is positioned at the heart of upcoming infrastructure —
            minutes from education, sports, entertainment, and aviation hubs.
          </p>
          <div className="location-grid">
            <div className="location-list">
              {LOCATIONS.map((loc) => (
                <div className="location-item" key={loc.name}>
                  <div className="location-item-icon">📍</div>
                  <div className="location-item-text">
                    <div className="location-item-name">{loc.name}</div>
                    <div className="location-item-distance">{loc.distance}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="location-map">
              <iframe
                title="The Highway Farms Location"
                src="https://www.google.com/maps?q=Galgotias+University+Yamuna+Expressway+Greater+Noida&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== INVESTMENT HIGHLIGHT ===== */}
      <section className="investment" id="investment">
        <div className="section-inner">
          <span className="section-label">Why Invest Now</span>
          <h2 className="section-title">Prices Are Poised to Rise Sharply</h2>
          <p className="section-subtitle">
            The surrounding region is seeing rapid infrastructure development. Investing early
            means locking in today's price before the next revision.
          </p>
          <div className="investment-grid">
            <div className="investment-card">
              <div className="investment-card-icon">📈</div>
              <h3>Adani Acquires Jaypee Sports City</h3>
              <p>
                The Adani Group has acquired Jaypee Sports City — the massive sports township
                adjacent to The Highway Farms. This acquisition is expected to drive significant
                infrastructure investment and land appreciation in the immediate surrounding area.
              </p>
            </div>
            <div className="investment-card">
              <div className="investment-card-icon">✈️</div>
              <h3>Noida International Airport (Jewar)</h3>
              <p>
                India's largest upcoming international airport is just 15 minutes away. Airport-driven
                development typically causes land prices in the surrounding 20 km radius to multiply
                significantly within a few years.
              </p>
            </div>
            <div className="investment-card">
              <div className="investment-card-icon">🎬</div>
              <h3>Upcoming Film City</h3>
              <p>
                The proposed International Film City near Yamuna Expressway is 10 minutes away.
                Once operational, it will attract studios, production houses, and thousands of jobs —
                all driving demand for nearby land.
              </p>
            </div>
            <div className="investment-card">
              <div className="investment-card-icon">💰</div>
              <h3>Price Revision Expected Soon</h3>
              <p>
                With multiple mega-projects converging around this corridor, current pricing
                is introductory. Prices are likely to be revised upward as these projects near
                completion. Booking now means securing the lowest available price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="gallery" id="gallery">
        <div className="section-inner">
          <span className="section-label">Project Gallery</span>
          <h2 className="section-title">See The Highway Farms</h2>
          <p className="section-subtitle">
            Site photos, master plan, location map, and brochure — everything you need to see before your visit.
          </p>
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((img, i) => (
              <div className={`gallery-item ${i === 0 ? 'gallery-item-large' : ''}`} key={i}>
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="pricing" id="pricing">
        <div className="section-inner">
          <span className="section-label">Transparent Pricing</span>
          <h2 className="section-title">Your Investment, Clearly Broken Down</h2>
          <p className="section-subtitle">
            No hidden charges. Every cost is listed upfront so you know exactly what you're paying for.
          </p>
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>The Highway Farms — Land Parcel</h3>
              <p>1,008 sq. yd. (9,072 sq. ft.) | 6.66 Kattha | 842.82 sq. m. land parcel</p>
              <div className="pricing-total">Rs. 1,64,27,392</div>
              <div className="pricing-total-label">Total Price (All Inclusive)</div>
            </div>
            <div className="pricing-body">
              <div className="pricing-row">
                <span className="pricing-row-label">Base Price (Rs. 15,499 per sq. yd.)</span>
                <span className="pricing-row-value">Rs. 1,56,22,992</span>
              </div>
              <div className="pricing-row">
                <span className="pricing-row-label">Development Charges (Rs. 500 per sq. yd.)</span>
                <span className="pricing-row-value">Rs. 5,04,000</span>
              </div>
              <div className="pricing-row">
                <span className="pricing-row-label">Electricity Charges (Rs. 50 per sq. yd.)</span>
                <span className="pricing-row-value">Rs. 50,400</span>
              </div>
              <div className="pricing-row">
                <span className="pricing-row-label">Club Membership</span>
                <span className="pricing-row-value">Rs. 2,50,000</span>
              </div>
              <div className="pricing-row">
                <span className="pricing-row-label">Maintenance Charges (Rs. 8 per sq. yd. annually)</span>
                <span className="pricing-row-value">Rs. 8,064 / year</span>
              </div>
              <div className="pricing-row">
                <span className="pricing-row-label">Corner Plot Premium (PLC)</span>
                <span className="pricing-row-value gold">+10%</span>
              </div>
            </div>
            <div className="pricing-note">
              Corner plots carry a 10% premium on the base price. Government electricity approved.
              Maintenance charges are annual. Prices are subject to revision without notice.
              With Adani's acquisition of Jaypee Sports City and the upcoming Noida International Airport,
              prices in this corridor are expected to rise significantly. Current pricing is introductory.
            </div>
          </div>
        </div>
      </section>

      {/* ===== SPECS ===== */}
      <section className="specs" id="specs">
        <div className="section-inner">
          <span className="section-label">Project Specifications</span>
          <h2 className="section-title">The Numbers Behind The Lifestyle</h2>
          <p className="section-subtitle">
            A thoughtfully planned community with generous space, approved infrastructure, and premium positioning.
          </p>
          <div className="specs-grid">
            {SPECS.map((spec) => (
              <div className="spec-card" key={spec.label}>
                <div className="spec-card-icon">{spec.icon}</div>
                <div className="spec-card-value">{spec.value}</div>
                <div className="spec-card-label">{spec.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT / LEAD FORM ===== */}
      <section className="contact" id="contact">
        <div className="section-inner">
          <div className="contact-grid">
            <div className="contact-info">
              <span className="section-label">Get In Touch</span>
              <h2>Book Your Site Visit Today</h2>
              <p>
                Fill out the form and our team will get in touch with you within 24 hours to
                schedule a personalized site visit to The Highway Farms. Limited units remaining.
              </p>
              <div className="contact-info-item">
                <div className="contact-info-icon">📞</div>
                <div className="contact-info-text">
                  <a href="tel:+919319307289">+91 93193 07289</a>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">✉️</div>
                <div className="contact-info-text">
                  <a href="mailto:gs3121753@gmail.com">gs3121753@gmail.com</a>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">📍</div>
                <div className="contact-info-text">
                  Yamuna Expressway, Greater Noida
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              {formStatus === 'success' && (
                <div className="form-success">
                  Thank you! Your enquiry has been received. Our team will contact you within 24 hours.
                </div>
              )}
              {formStatus === 'error' && (
                <div className="form-error">
                  {formError || 'Please fill in at least your name and phone number to submit the form.'}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email (Optional)</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Any specific questions or requirements?"
                />
              </div>
              <button
                type="submit"
                className="form-submit"
                disabled={formStatus === 'submitting'}
              >
                {formStatus === 'submitting' ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="team" id="team">
        <div className="section-inner">
          <span className="section-label">Our Leadership</span>
          <h2 className="section-title">The People Behind VD Vanchers</h2>
          <p className="section-subtitle">
            A dedicated team committed to delivering premium land opportunities with transparency and trust.
          </p>
          <div className="team-grid">
            {TEAM.map((member) => (
              <div className="team-card" key={member.name}>
                <div className="team-photo">
                  <img src={member.photo} alt={member.name} loading="lazy" />
                </div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
          <div className="project-team-section">
            <span className="section-label">Project Team</span>
            <h3 className="project-team-title">Built By</h3>
            <div className="project-team-grid">
              {PROJECT_TEAM.map((member) => (
                <div className="project-team-card" key={member.name}>
                  <div className="project-team-avatar">{member.name.charAt(0)}</div>
                  <div className="project-team-name">{member.name}</div>
                  <div className="project-team-role">{member.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <h3>VD Vanchers</h3>
              <p>
                The Highway Farms — 106 premium land parcels across 30 acres near Yamuna Expressway.
                Premium land investment with planned amenities and unmatched connectivity.
              </p>
              <p className="footer-brand-team">
                <strong>Founder:</strong> Vansh Thakur &nbsp;|&nbsp;
                <strong>Co-Founder:</strong> Deepanshu Goyal &nbsp;|&nbsp;
                <strong>General Manager:</strong> Rimple Kaur
              </p>
              <p className="footer-brand-team">
                <strong>Developed by:</strong> Gaurav Kumar, Vihan Raj, Ashvi, Suryansh Pandey
              </p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <a onClick={() => scrollToSection('about')}>About</a>
              <a onClick={() => scrollToSection('amenities')}>Amenities</a>
              <a onClick={() => scrollToSection('location')}>Location</a>
              <a onClick={() => scrollToSection('pricing')}>Pricing</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="tel:+919319307289">+91 93193 07289</a>
              <a href="mailto:gs3121753@gmail.com">gs3121753@gmail.com</a>
              <a onClick={() => scrollToSection('contact')}>Book a Visit</a>
            </div>
            <div className="footer-col">
              <h4>Project</h4>
              <a onClick={() => scrollToSection('specs')}>Specifications</a>
              <a onClick={() => scrollToSection('home')}>The Highway Farms</a>
              <a onClick={() => scrollToSection('contact')}>Enquire Now</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 VD Vanchers. All rights reserved. The Highway Farms.</p>
            <p>Yamuna Expressway, Greater Noida, Uttar Pradesh</p>
            <p className="footer-credits">Designed &amp; Developed by Gaurav Kumar</p>
          </div>
        </div>
      </footer>

      {/* ===== CHAT WIDGET ===== */}
      <ChatWidget />
    </>
  )
}
