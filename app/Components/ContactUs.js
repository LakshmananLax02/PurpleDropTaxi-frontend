"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Headphones,
  Car,
  AlertCircle,
  Navigation,
  User
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

/* ============================================================================
 * ANIMATION VARIANTS (FOR SCROLL EFFECTS)
 * ========================================================================= */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

/* ============================================================================
 * CONTACT CARDS DATASET
 * ========================================================================= */
const CONTACT_CARDS = [
  {
    title: "24/7 Dispatch Desk",
    detail: "+91 81108 80500",
    subtext: "Instant phone booking & emergency highway assistance.",
    icon: Phone,
    action: "tel:+918110880500",
  },
  {
    title: "WhatsApp Booking",
    detail: "+91 81108 80500",
    subtext: "Get instant fare quotes and vehicle options on WhatsApp.",
    icon: WhatsAppIcon,
    action: "https://wa.me/918110880500",
  },
  {
    title: "Email Support",
    detail: "support@purpledrop.in",
    subtext: "For corporate billing, GST invoices, and feedback.",
    icon: Mail,
    action: "mailto:support@purpledroptaxi.com",
  },
  {
    title: "Central Hub",
    detail: "Dindigul",
    subtext: "Serving 100+ cities across TN, Karnataka & Kerala.",
    icon: MapPin,
    action: "#map-section",
  },
];

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your API call logic here (e.g., Post to Formspree, Nodemailer, etc.)
    console.log("Form Submitted:", formData);
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      // Reset form fields to empty
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 5000);
  };

  return (
    <div className="w-full bg-[#f8f6fc] text-gray-900 relative overflow-hidden font-sans select-none">
      
      {/* 🎨 CUSTOM UIVERSE EXPANDING HOVER STYLES (THEMED PURPLE) */}
      <style jsx global>{`
        .uiverse-hover-card {
          position: relative;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          z-index: 0;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        .uiverse-hover-card::before {
          content: '';
          position: absolute;
          z-index: -1;
          top: -16px;
          right: -16px;
          background: linear-gradient(135deg, #7c2bea, #3d0c79);
          height: 32px;
          width: 32px;
          border-radius: 32px;
          transform: scale(1);
          transform-origin: 50% 50%;
          transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .uiverse-go-corner {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          width: 2.2em;
          height: 2.2em;
          overflow: hidden;
          top: 0;
          right: 0;
          background: linear-gradient(135deg, #7c2bea, #1bc5d8);
          border-radius: 0 16px 0 24px;
        }
        /* Hover Effects */
        .uiverse-hover-card:hover::before { transform: scale(32); }
        .uiverse-hover-card:hover .uiverse-card-title { color: #ffffff !important; }
        .uiverse-hover-card:hover .uiverse-card-desc { color: rgba(255, 255, 255, 0.95) !important; }
        .uiverse-hover-card:hover .uiverse-card-sub { color: rgba(255, 255, 255, 0.8) !important; }
        .uiverse-hover-card:hover .uiverse-card-icon {
          background-color: rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* 🌟 AMBIENT GLOW EFFECTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 z-0" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ========================================================================
       * 1. HERO HEADER SECTION (PARALLAX BACKGROUND)
       * ========================================================================= */}
      <section className="relative w-full overflow-hidden py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-purple-700/60 bg-[#1f043e]">
        <div className="absolute inset-0 z-0">
          <img src="/images/carouselimg3.png" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f043e]/40 via-[#1f043e]/40 to-black/40" />
        </div>

        <motion.div 
          className="relative z-10 max-w-4xl mx-auto text-center space-y-5"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#1bc5d8]" /> Command & Dispatch Center
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="page-title-pattern">
            We&apos;re On The Highway 24/7 <br />
            <span className="text-[#1bc5d8]">Get In Touch Instantly.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-white text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            Need an instant quote, modifying a booking, or stuck on the highway? Our dispatch desk is active 24/7 across South India. Choose your fastest way to connect below.
          </motion.p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10 space-y-20">

        {/* ========================================================================
         * 2. 4 QUICK CONTACT CARDS (UIVERSE EXPANDING HOVER)
         * ========================================================================= */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {CONTACT_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={i}
                href={card.action}
                variants={fadeInUp}
                className="uiverse-hover-card p-6 shadow-lg shadow-slate-200/50 flex flex-col justify-between block group"
              >
                <div className="uiverse-go-corner">
                  <ArrowRight className="w-3.5 h-3.5 text-white -mt-0.5 -mr-0.5" />
                </div>

                <div className="space-y-4">
                  <div className="uiverse-card-icon w-12 h-12 rounded-xl bg-purple-100 text-[#7c2bea] flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="uiverse-card-title text-sm font-bold text-gray-900 transition-colors">{card.title}</h3>
                    <p className="uiverse-card-desc text-lg sm:text-xl font-black text-[#7c2bea] mt-1 transition-colors">{card.detail}</p>
                  </div>
                  <p className="uiverse-card-sub text-xs text-gray-500 font-medium leading-relaxed transition-colors border-t border-gray-100/50 pt-3">
                    {card.subtext}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </motion.section>

        {/* ========================================================================
         * 3. MAIN FORM & LIVE DISPATCH HUB GRID
         * ========================================================================= */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
        >
          
          {/* LEFT: CONTACT FORM (7 COLUMNS) */}
          <motion.div variants={fadeInUp} className="lg:col-span-7 bg-white border border-purple-100 p-6 sm:p-10 rounded-3xl shadow-xl shadow-purple-500/5 space-y-8 relative overflow-hidden">
            
            <Car className="absolute -bottom-10 -right-10 w-64 h-64 text-slate-50 opacity-50 pointer-events-none rotate-12" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c2bea] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                Inquiry Form
              </div>
              <h2 className="section-title-pattern">
                Send Us A <span className="text-[#7c2bea]">Message</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Have a question or feedback? Fill out the form below and our team will get back to you shortly.
              </p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 text-center h-[350px] relative z-10"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Message Sent Successfully!</h3>
                  <p className="text-sm text-emerald-700 mt-2 font-medium">Thank you for contacting PurpleDropTaxi. We will review your message and respond via email or phone shortly.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {/* Field 1: Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-[#b8eaf0] hover:border-[#1bc5d8] focus:border-[#7c2bea] focus:hover:border-[#7c2bea] focus:bg-white focus:ring-4 focus:ring-[#7c2bea]/10 text-sm text-gray-900 rounded-xl p-3.5 pl-10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Field 2: Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-[#b8eaf0] hover:border-[#1bc5d8] focus:border-[#7c2bea] focus:hover:border-[#7c2bea] focus:bg-white focus:ring-4 focus:ring-[#7c2bea]/10 text-sm text-gray-900 rounded-xl p-3.5 pl-10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Field 3: Mobile Number */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="phone"
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="Enter 10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-[#b8eaf0] hover:border-[#1bc5d8] focus:border-[#7c2bea] focus:hover:border-[#7c2bea] focus:bg-white focus:ring-4 focus:ring-[#7c2bea]/10 text-sm text-gray-900 rounded-xl p-3.5 pl-10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Field 4: Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Your Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    placeholder="Type your message, inquiry, or feedback here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-[#b8eaf0] hover:border-[#1bc5d8] focus:border-[#7c2bea] focus:hover:border-[#7c2bea] focus:bg-white focus:ring-4 focus:ring-[#7c2bea]/10 text-sm text-gray-900 rounded-xl p-3.5 outline-none transition-all font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary min-h-[52px] w-full text-xs font-black uppercase tracking-widest"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* RIGHT: LIVE DISPATCH CARD & ADVANTAGES (5 COLUMNS) */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-gradient-to-br from-purple-900 via-[#7c2bea] to-purple-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-purple-900/20 space-y-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              
              <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  Live Desk Active
                </span>
                <Clock className="w-5 h-5 text-purple-200" />
              </div>

              <div className="relative z-10">
                <h3 className="section-title-pattern-on-dark">Need A Taxi <span>Right Now?</span></h3>
                <p className="text-sm text-purple-100 font-medium mt-2 leading-relaxed">
                  Our automated highway dispatch system routes your vehicle in less than 15 minutes. Call for emergencies.
                </p>
              </div>

              <div className="pt-2 space-y-3 relative z-10">
                <a
                  href="tel:+918110880500"
                  className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 block text-center"
                >
                  <Phone className="w-4 h-4 fill-gray-950" /> Call Dispatch Now
                </a>

                <a
                  href="https://wa.me/918110880500"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#1FAF53] border border-[#25D366] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 active:scale-95 block text-center"
                >
                  <WhatsAppIcon className="w-4 h-4" /> WhatsApp Direct
                </a>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-lg shadow-slate-200/40 space-y-5">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">
                Help & Support Guarantees
              </h4>

              <div className="space-y-4 text-sm text-gray-600 font-medium">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-1.5 rounded-lg shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#7c2bea]" />
                  </div>
                  <span className="pt-1">Instant GST Invoices for Corporate Bookings</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-1.5 rounded-lg shrink-0">
                    <Headphones className="w-4 h-4 text-[#7c2bea]" />
                  </div>
                  <span className="pt-1">24/7 Route & Highway Breakdown Assistance</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-1.5 rounded-lg shrink-0">
                    <AlertCircle className="w-4 h-4 text-[#7c2bea]" />
                  </div>
                  <span className="pt-1">Zero Cancellation Charge Before Dispatch</span>
                </div>
              </div>
            </div>

          </motion.div>

        </motion.section>

      </div>

      {/* ========================================================================
       * 4. WIDER MAP SCREEN SECTION AT THE BOTTOM
       * ========================================================================= */}
      <motion.section 
        id="map-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full pt-12 relative overflow-hidden bg-white border-t border-purple-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c2bea] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              Our Depot Location
            </div>
            <h2 className="section-title-pattern">
              Visit Our <span className="text-[#7c2bea]">Dindigul Dispatch Hub</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Conveniently located for highway pickups and 24/7 driver partner onboarding.
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/CJXcEoN2Efaore7A9"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-md active:scale-95 shrink-0"
          >
            <Navigation className="w-4 h-4 text-purple-400" /> Get Directions
          </a>
        </div>

        {/* WIDER MAP EMBED CONTAINER */}
        <div className="w-full h-[450px] sm:h-[500px] relative border-t border-b border-gray-200 shadow-inner overflow-hidden">
          
          {/* FLOATING OVERLAY INFO CARD */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 bg-white/95 backdrop-blur-md border border-purple-100 p-4 sm:p-5 rounded-2xl shadow-xl max-w-xs sm:max-w-sm hidden xs:block">
            <div className="flex items-center gap-2.5 text-[#7c2bea]">
              <MapPin className="w-5 h-5 shrink-0" />
              <p className="text-xs font-black uppercase tracking-wider">Main Dispatch Terminal</p>
            </div>
            <p className="text-sm font-black text-gray-900 mt-2">Sri Murugan Cinemas A/C 4K Dolby Atmos</p>
            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
              Serving Coimbatore, Chennai, Salem, Madurai & All Highway Routes across TN.
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-700">
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Open 24/7
              </span>
              <span>Hotline: +91 98765 43210</span>
            </div>
          </div>

          {/* UPDATED GOOGLE MAP IFRAME */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d298861.4291513764!2d77.55736514611415!3d10.201573973343152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDA5JzU1LjAiTiA3N8KwNTAnNTMuNCJF!5e0!3m2!1sen!2sin!4v1785593358690!5m2!1sen!2sin" 
            className="w-full h-full border-0"
            style={{ border: 0 }} 
            allowFullScreen
            loading="lazy" 
            referrerPolicy="strict-origin-when-cross-origin"
            title="PurpleDropTaxi Location Map"
          />
        </div>
      </motion.section>

    </div>
  );
}
