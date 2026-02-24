import { useState, useEffect } from 'react';
import {
  Check,
  Shield,
  Star,
  Phone,
  Calendar,
  Search,
  DollarSign,
  Cloud,
  X,
  ChevronRight,
  Lock,
  PhoneCall,
  Clock,
} from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    zipCode: '',
    smsConsent: false,
  });

  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const formSection = document.getElementById('form');

      if (!formSection) {
        setShowStickyBar(window.scrollY > 250);
        return;
      }

      const formStart = formSection.offsetTop;
      const formEnd = formStart + formSection.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight;
      const viewportTop = window.scrollY;

      // Hide sticky bar when form section starts to appear at bottom of viewport
      // Show it again after scrolling completely past the form
      if (viewportTop + window.innerHeight >= formStart - 50) {
        // Form is entering viewport from bottom or we're in the form area
        if (scrollPosition > formEnd + 100) {
          setShowStickyBar(true);
        } else {
          setShowStickyBar(false);
        }
      } else {
        // We're above the form
        setShowStickyBar(window.scrollY > 250);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://formsubmit.co/ajax/grekoroofing@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.firstName,
          phone: formData.phone,
          smsConsent: formData.smsConsent ? 'Yes' : 'No',
          _subject: `New Roof Inspection Request - ${formData.firstName}`,
          _cc: 'Bklik81@gmail.com,picero80@gmail.com',
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === 'false') {
        throw new Error('Failed to submit form');
      }

      setShowSuccessModal(true);
      setFormData({ firstName: '', phone: '', zipCode: '', smsConsent: false });

      const timer = window.setTimeout(() => {
        setShowSuccessModal(false);
      }, 4000);
      setAutoCloseTimer(timer);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please call us at (708) 668-6500 instead.');
    }
  };

  const handleCloseModal = () => {
    // Clear auto-close timer if user manually closes
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
    setShowSuccessModal(false);
  };

  const handleModalInteraction = () => {
    // Pause auto-close when user interacts with modal
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
  };

  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Trust Bar */}
      <div className="bg-[var(--orange-primary)] text-white text-center py-3 px-4">
        <div className="text-[12px] font-bold tracking-wide">
          ✓ Licensed & Insured  ✓ 25 Years of Experience
        </div>
      </div>

      {/* Section 2: Hero */}
      <div
        className="relative bg-gradient-to-br from-[#1A0F00] via-[#2C1A06] to-[#4A2800] text-white py-16 md:py-24 px-4"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(26, 15, 0, 0.85) 0%, rgba(44, 26, 6, 0.75) 60%, rgba(74, 40, 0, 0.85) 100%), url(/hero-roof-inspector.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div style={{
            display: 'inline-block',
            border: '1.5px solid #E8830A',
            borderRadius: '999px',
            padding: '6px 18px',
            fontFamily: "'Lato', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            color: '#F5A335',
            marginBottom: '16px',
            letterSpacing: '0.3px',
          }}>
            🏠 Serving the Greater Chicagoland Area
          </div>
          <h1 className="font-bold text-[38px] md:text-6xl uppercase mb-4 leading-tight">
            CHECK IF YOUR ROOF HAS DAMAGE
            <br />
            <span className="text-[var(--orange-primary)] text-[28px] md:text-[48px] whitespace-nowrap">FREE 20-MINUTE INSPECTION</span>
          </h1>

          <p className="text-[17px] text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Lato, sans-serif' }}>
            No obligation. Most homeowners qualify for insurance-covered repairs.
          </p>

          <a
            href="#form"
            onClick={scrollToForm}
            className="inline-flex items-center justify-center gap-2 bg-[var(--orange-primary)] hover:bg-[var(--orange-dark)] text-white font-bold text-base uppercase px-8 py-5 rounded w-full md:w-auto transition-all hover:scale-105 shadow-lg shadow-orange-500/50"
            style={{ whiteSpace: 'nowrap' }}
          >
            CHECK MY ROOF FOR DAMAGE — FREE
          </a>

          <p className="text-white/70 text-xs text-center mt-2 w-full md:w-auto" style={{ fontFamily: 'Lato, sans-serif' }}>
            No Sales Pressure • We only call to schedule
          </p>

          <a
            href="tel:7086686500"
            style={{
              display: 'block',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.90)',
              fontFamily: "'Lato', sans-serif",
              fontSize: '15px',
              marginTop: '14px',
              marginBottom: '4px',
              textDecoration: 'none',
              letterSpacing: '0.3px',
              fontWeight: 600,
            }}
          >
            📞 (708) 668-6500
          </a>

          <p className="text-[var(--orange-light)] text-sm italic mt-4 flex items-center justify-center gap-2">
            <Clock size={16} />
            We only schedule 8 free inspections per week
          </p>

          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '10px 16px',
              whiteSpace: 'nowrap',
              margin: '16px auto 0',
              width: 'fit-content',
              minWidth: 'unset',
              marginLeft: 'auto',
              marginRight: 'auto',
              cursor: 'default',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24"
              style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span style={{
                color: '#FBBC05',
                fontSize: '16px',
                letterSpacing: '2px',
                lineHeight: '1',
                flexShrink: 0,
              }}>★★★★★</span>
              <span style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: '13px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.90)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>5.0 on Google</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Trust Strip */}
      <section style={{
        background: '#ffffff',
        padding: '4px 16px',
        textAlign: 'center',
        borderTop: '3px solid #E8830A',
        borderBottom: '3px solid #E8830A',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <img
            src="/Screenshot_20260217_085120_Gallery.jpg"
            alt="Greko Roofing & Construction"
            style={{
              maxWidth: '175px',
              width: '100%',
              height: 'auto',
              display: 'block',
              margin: '0 auto 2px',
            }}
          />
          <div style={{
            textAlign: 'center',
            fontSize: '17px',
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            color: '#5A4A3A',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}>
            <div style={{ marginBottom: '10px' }}>IL License #104.019196</div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'nowrap',
              maxWidth: '400px',
              margin: '0 auto',
            }}>
              <div style={{
                flex: '1',
                background: 'white',
                border: '1.5px solid rgba(232, 131, 10, 0.2)',
                borderRadius: '6px',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#5A4A3A',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50px',
                lineHeight: '1.3',
              }}>
                Owens Corning<br />Preferred
              </div>
              <div style={{
                flex: '1',
                background: 'white',
                border: '1.5px solid rgba(232, 131, 10, 0.2)',
                borderRadius: '6px',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#5A4A3A',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50px',
                lineHeight: '1.3',
              }}>
                Velux<br />Certified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Problem Agitation */}
      <div className="bg-[var(--off-white)] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--brown-dark)] text-center mb-4">
            Why Every Illinois Homeowner
            <br />
            Needs a Roof Inspection
          </h2>
          <div className="w-16 h-1 bg-[var(--orange-primary)] mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 text-center border-b-4 border-[var(--orange-primary)] shadow-md">
              <Cloud size={48} className="text-[var(--orange-primary)] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[var(--brown-dark)] mb-3">
                Illinois Weather Takes a Toll Year Round
              </h3>
              <p className="text-sm text-[var(--gray-text)] leading-relaxed">
                Illinois weather is brutal. Storms, hail, freeze cycles, and normal wear gradually weaken your roof. Hidden damage can lead to thousands in repairs if ignored.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center border-b-4 border-[var(--orange-primary)] shadow-md">
              <Search size={48} className="text-[var(--orange-primary)] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[var(--brown-dark)] mb-3">
                Hidden Damage Leads to Bigger Bills
              </h3>
              <p className="text-sm text-[var(--gray-text)] leading-relaxed">
                90% of roof damage is invisible from the ground. By the time you see water stains
                on your ceiling, the repair cost has already doubled.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center border-b-4 border-[var(--orange-primary)] shadow-md">
              <Calendar size={48} className="text-[var(--orange-primary)] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[var(--brown-dark)] mb-3">
                Insurance Claims Have Deadlines
              </h3>
              <p className="text-sm text-[var(--gray-text)] leading-relaxed">
                Most insurance policies require you to file a storm damage claim within 12 months.
                Every day you wait costs you money.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center border-b-4 border-[var(--orange-primary)] shadow-md">
              <DollarSign size={48} className="text-[var(--orange-primary)] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[var(--brown-dark)] mb-3">
                Minor Damage Becomes Major Expense
              </h3>
              <p className="text-sm text-[var(--gray-text)] leading-relaxed">
                A $500 shingle repair ignored for one season can turn into a $12,000 full
                replacement. Prevention is always cheaper.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Bold Statement */}
      <div className="bg-[var(--orange-primary)] py-8 px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-[var(--brown-dark)] uppercase mb-2">
          Delaying Small Roof Repairs Can Lead to Much Higher Costs Later.
        </h2>
        <p className="text-base md:text-lg text-[var(--black-overlay)] opacity-85 mt-2">
          A small issue today can turn into a major expense if ignored.
        </p>
      </div>

      {/* Section 6: Why Choose Us */}
      <div className="bg-[var(--gray-light)] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--brown-dark)] text-center mb-4">
            Why Homeowners Choose Greko Roofing & Construction
          </h2>
          <p className="text-center text-[var(--gray-text)] mb-12 max-w-2xl mx-auto">
            Choosing the right roofing contractor should feel simple and stress-free.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-[var(--orange-primary)]/30 rounded-xl p-8 bg-white shadow-lg">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-base">
                  <Check size={20} className="text-[var(--orange-primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--brown-dark)]">Thorough inspection. We check all visible and hidden damage.</span>
                </li>
                <li className="flex items-start gap-3 text-base">
                  <Check size={20} className="text-[var(--orange-primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--brown-dark)]">We guide you through the insurance process</span>
                </li>
                <li className="flex items-start gap-3 text-base">
                  <Check size={20} className="text-[var(--orange-primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--brown-dark)]">Transparent communication from start to finish</span>
                </li>
                <li className="flex items-start gap-3 text-base">
                  <Check size={20} className="text-[var(--orange-primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--brown-dark)]">5-year workmanship warranty</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Lead Form */}
      <div
        id="form"
        className="bg-gradient-to-br from-[#1A0F00] to-[#2C1A06] py-12 px-4"
      >
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
            FREE 20-MINUTE ROOF INSPECTION
          </h2>
          <p className="text-white/70 text-center text-sm mb-3">
            Check for damage, wear, and hidden issues.
          </p>
          <div className="flex items-center justify-center gap-1 text-[#FBBC05] mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
            <span className="ml-2 text-white/80 text-sm">5.0 on Google</span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-[var(--orange-primary)]/30 rounded-xl p-6 md:p-8"
          >
            <div className="mb-4">
              <label className="block text-white/85 text-sm font-bold mb-2">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Your full name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full h-14 border-2 border-[var(--orange-primary)]/40 rounded-lg bg-white/10 text-white px-4 focus:border-[var(--orange-primary)] focus:bg-white/15 outline-none placeholder-white/45"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white/85 text-sm font-bold mb-2">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="Your best phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-14 border-2 border-[var(--orange-primary)]/40 rounded-lg bg-white/10 text-white px-4 focus:border-[var(--orange-primary)] focus:bg-white/15 outline-none placeholder-white/45"
              />
            </div>

            <button
              type="submit"
              className="w-full h-16 bg-[var(--orange-primary)] hover:bg-[var(--orange-dark)] text-white font-bold text-lg uppercase rounded-lg shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1"
            >
              GET MY FREE INSPECTION
            </button>

            <p className="text-white/60 text-xs text-center mt-3 mb-4">
              We call to schedule • No obligation
            </p>

            <div className="mb-3">
              <label className="flex items-start gap-2 cursor-pointer justify-center">
                <input
                  type="checkbox"
                  checked={formData.smsConsent}
                  onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                  className="mt-0.5"
                />
                <span className="text-white/50 text-xs leading-relaxed">
                  Text me inspection updates (optional). Msg rates may apply.
                </span>
              </label>
            </div>

            <p className="text-white/50 text-xs text-center">
              Prefer to call?{' '}
              <a href="tel:708-668-6500" className="text-[var(--orange-light)] hover:underline">
                (708) 668-6500
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Section 7.5: What Happens Next */}
      <div className="bg-[#2C1A06] py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#E8830A] text-center mb-2">
            What Happens After You Submit?
          </h2>
          <div className="w-12 h-1 bg-[#E8830A] mx-auto mb-8"></div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#E8830A] rounded-full text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-white text-base md:text-lg mb-1">
                  We Call You Within 2 Hours
                </h3>
                <p className="text-sm md:text-base text-white/75 leading-relaxed">
                  A real person from our team calls you directly. No robots. No call centers.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#E8830A] rounded-full text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-white text-base md:text-lg mb-1">
                  We Schedule Your FREE Inspection
                </h3>
                <p className="text-sm md:text-base text-white/75 leading-relaxed">
                  We find a time that works for you. Inspection takes about 20 minutes.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#E8830A] rounded-full text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-white text-base md:text-lg mb-1">
                  We Inspect Your Roof Thoroughly
                </h3>
                <p className="text-sm md:text-base text-white/75 leading-relaxed">
                  Our certified inspector checks for any damage including weather related issues, aging, leaks, and hidden problems that cannot be seen from the ground.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#E8830A] rounded-full text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-white text-base md:text-lg mb-1">
                  You Receive a Written Report
                </h3>
                <p className="text-sm md:text-base text-white/75 leading-relaxed">
                  We give you a full damage report with photos. You keep it regardless of what you
                  decide.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#E8830A] rounded-full text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="font-bold text-white text-base md:text-lg mb-1">
                  We Guide You Through Insurance (If Needed)
                </h3>
                <p className="text-sm md:text-base text-white/75 leading-relaxed">
                  If there's damage, we explain your options and help navigate the insurance claim
                  process.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#E8830A] rounded-full text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                6
              </div>
              <div>
                <h3 className="font-bold text-white text-base md:text-lg mb-1">
                  You Decide. Zero Pressure. Zero Obligation.
                </h3>
                <p className="text-sm md:text-base text-white/75 leading-relaxed">
                  We never push. You choose if and when you want to move forward. Period.
                </p>
              </div>
            </div>
          </div>

          {/* Reassurance Bar */}
          <div className="mt-6 bg-[rgba(232,131,10,0.15)] border border-[rgba(232,131,10,0.3)] rounded-lg p-4 text-center">
            <p className="text-sm text-white/70 leading-relaxed">
              🔒 Your phone number is never sold or shared. We only contact you about your
              inspection request.
            </p>
          </div>
        </div>
      </div>

      {/* Section 9: Social Proof */}
      <div className="bg-[var(--gray-light)] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--brown-dark)] text-center mb-4">
            See What Our Customers Are Saying
          </h2>
          <p className="text-center text-[var(--gray-text)] mb-12 max-w-2xl mx-auto">
            We've helped homeowners across Chicagoland get the repairs they needed without
            breaking the bank.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[var(--orange-primary)]">
              <div className="flex gap-1 text-[var(--orange-primary)] mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-[var(--gray-text)] italic leading-relaxed mb-4">
                "The crew was super friendly, professional, and finished on time. The roof looks absolutely amazing, and they cleaned everything up perfectly after the job. I'd definitely recommend them to anyone who needs roofing work done."
              </p>
              <p className="font-bold text-sm text-[var(--brown-dark)]">
                Joe Fuks, Palos Park, IL
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[var(--orange-primary)]">
              <div className="flex gap-1 text-[var(--orange-primary)] mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-[var(--gray-text)] italic leading-relaxed mb-4">
                "Greg did a fantastic job replacing my gutters and fixing previous issues from another roofing company. Great communication, quality work, and very professional. Highly recommend for any roofing needs!"
              </p>
              <p className="font-bold text-sm text-[var(--brown-dark)]">
                Alexia Neubauer, Homer Glen, IL
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[var(--orange-primary)]">
              <div className="flex gap-1 text-[var(--orange-primary)] mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-[var(--gray-text)] italic leading-relaxed mb-4">
                "Greg and his team put up new siding, roofing, and gutters on our rental. The house looks amazing. Their professionalism and work ethic were top notch. Highly recommend!"
              </p>
              <p className="font-bold text-sm text-[var(--brown-dark)]">
                Robin Barrett, Burr Ridge, IL
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 10: Before/After Gallery */}
      <div className="bg-[var(--off-white)] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--brown-dark)] text-center mb-12">
            Our Work Speaks For Itself
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="relative">
              <img
                src="/Create_a_realistic_2k_202602190505.jpeg"
                alt="Damaged roof before repair"
                className="h-56 w-full rounded-lg object-cover"
              />
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                BEFORE
              </span>
            </div>
            <div className="relative">
              <img
                src="/_create_a_2k_202602190512.jpeg"
                alt="Repaired roof after service"
                className="h-56 w-full rounded-lg object-cover"
              />
              <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded">
                AFTER
              </span>
            </div>
            <div className="relative">
              <img
                src="/before-roof-mid.jpg"
                alt="Damaged roof before repair"
                className="h-56 w-full rounded-lg object-cover"
              />
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                BEFORE
              </span>
            </div>
            <div className="relative">
              <img
                src="/after-roof-mid.jpg"
                alt="Repaired roof after service"
                className="h-56 w-full rounded-lg object-cover"
              />
              <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded">
                AFTER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 11: About/Credentials */}
      <div className="bg-gradient-to-br from-[var(--brown-dark)] to-[var(--black-overlay)] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Meet Greg, Owner of Greko Roofing
            </h2>
            <p className="text-white/90 leading-relaxed mb-6">
              With over 25 years of roofing experience serving Illinois and surrounding suburbs,
              Greg has built his reputation on honest inspections and clear communication.
            </p>
            <p className="text-white/90 leading-relaxed mb-6">
              As an Owens Corning Preferred Contractor, he focuses on protecting homes and helping
              homeowners understand their insurance options. No pressure.
            </p>
            <p className="text-white/90 leading-relaxed mb-8">
              Greg also speaks Polish and is happy to assist Polish speaking homeowners.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-[var(--orange-primary)] mt-1">🔶</div>
                <p className="text-sm leading-relaxed">
                  Greg personally inspects every roof. No detail gets missed.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[var(--orange-primary)] mt-1">🔶</div>
                <p className="text-sm leading-relaxed">
                  Step-by-step guidance through insurance claims
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[var(--orange-primary)] mt-1">🔶</div>
                <p className="text-sm leading-relaxed">
                  25+ years protecting homes across Chicagoland. Not a storm chaser.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="h-96 rounded-lg overflow-hidden">
              <img
                src="/IMG_20260220_124140.png"
                alt="Greg Kobylarczyk - President of Greko Roofing & Construction"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
              />
            </div>
            <p className="text-[var(--orange-light)] text-sm italic text-center mt-4">
              Greg Kobylarczyk, President<br />Greko Roofing & Construction
            </p>
          </div>
        </div>
      </div>

      {/* Section 12: Final CTA */}
      <div className="bg-[var(--orange-primary)] py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--brown-dark)] mb-4">
            Ready To Check Your Roof For Damage?
          </h2>
          <p className="text-base md:text-lg text-[var(--black-overlay)] mb-8 max-w-2xl mx-auto leading-relaxed">
            Don't wait until small damage becomes a major expense. Schedule your free inspection and protect your home.
          </p>
          <a
            href="#form"
            onClick={scrollToForm}
            className="inline-block bg-[var(--brown-dark)] hover:bg-[var(--black-overlay)] text-white font-bold text-xl uppercase px-10 py-5 rounded-lg transition-all w-full md:w-auto"
          >
            GET MY FREE INSPECTION
          </a>
          <p className="text-[var(--brown-dark)] opacity-75 text-sm italic mt-4">
            We only schedule 8 free inspections per week.
          </p>
        </div>
      </div>

      {/* Section 13: Footer */}
      <footer className="bg-[var(--brown-dark)] text-white py-12 px-4">
        <div className="flex justify-center mb-8">
          <img
            src="/greko_logo_white_outline.png"
            alt="GREKO Roofing & Construction"
            className="h-[100px] w-auto object-contain"
          />
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-sm mb-2 font-bold">GREKO Roofing & Construction</p>
            <p className="text-sm mb-2">Greg Kobylarczyk, President</p>
            <div className="space-y-2 mt-4">
              <p className="flex items-center gap-2 text-sm">
                <Phone size={16} /> 708-668-6500
              </p>
              <p className="flex items-center gap-2 text-sm break-all">
                📧 GrekoRoofing@gmail.com
              </p>
              <p className="flex items-center gap-2 text-sm">📍 Serving the Greater Chicagoland Area</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services:</h4>
            <ul className="space-y-2 text-sm">
              <li>• Metal Roofing</li>
              <li>• Shingle Roofing</li>
              <li>• Roofing (Residential & New Construction)</li>
              <li>• Roof Repair</li>
              <li>• Skylight Installation</li>
              <li>• Attic & Bathroom Vent Installation</li>
              <li>• Storm Damage Restoration</li>
              <li>• Exterior Repairs</li>
              <li>• Siding & Gutters</li>
              <li>• Free Inspections & Estimates</li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-white/70">LIC# 104.019196</p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-xs text-white/60">
          <p>© 2024 GREKO Roofing & Construction. All rights reserved.</p>
          <p className="mt-2">Privacy Policy | Terms & Conditions</p>
        </div>
      </footer>

      {/* Sticky Mobile CTA Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--brown-dark)] p-3 shadow-2xl flex gap-2 transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <a
          href="tel:708-668-6500"
          className="flex-1 bg-white border-2 border-[var(--orange-primary)] text-[var(--brown-dark)] font-bold text-base py-4 rounded-lg flex items-center justify-center gap-2"
        >
          <Phone size={20} />
          <span>CALL NOW</span>
        </a>
        <a
          href="#form"
          onClick={scrollToForm}
          className="flex-1 bg-[var(--orange-primary)] text-white font-bold text-[17px] py-4 rounded-lg flex items-center justify-center text-center"
        >
          GET FREE INSPECTION
        </a>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
          onClick={handleCloseModal}
        >
          <div
            className="bg-gradient-to-br from-[#1A0F00] to-[#2C1A06] rounded-[20px] p-8 max-w-md w-full shadow-2xl relative"
            style={{ border: '1px solid #E8830A' }}
            onClick={(e) => {
              e.stopPropagation();
              handleModalInteraction();
            }}
          >
            {/* Close X Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Check
                  size={48}
                  className="text-[var(--orange-primary)]"
                  strokeWidth={3}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Request Received
              </h3>
              <p className="text-white/75 text-base leading-relaxed">
                Thank you. Keep your phone nearby. We will call to schedule your free inspection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
