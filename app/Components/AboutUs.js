"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Phone,
  Zap,
  Navigation,
  DollarSign,
  Car,
  Headphones,
  UserCheck,
  Ban
} from "lucide-react";
import Cars from './Cars';

/* ============================================================================
 * ANIMATION VARIANTS
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
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

/* ============================================================================
 * DATASETS
 * ========================================================================= */
const STATS = [
  { label: "Completed Drop Rides", value: "2.5M+", icon: Navigation },
  { label: "Highway Certified Drivers", value: "2,400+", icon: Users },
  { label: "Cities & Towns Covered", value: "100+", icon: MapPin },
  { label: "Customer Rating", value: "4.9 / 5", icon: Award },
];

const FEATURES = [
  {
    title: "100% One-Way Billing",
    desc: "Pay strictly for the kilometers you travel to your destination. Zero return charges guaranteed.",
    icon: DollarSign,
  },
  {
    title: "Upfront Fare Guarantee",
    desc: "All base fares, toll estimates, and driver bata are presented transparently before booking.",
    icon: Zap,
  },
  {
    title: "Doorstep Pickup & Drop",
    desc: "Hassle-free door-to-door connections across 100+ cities in Tamil Nadu, Karnataka & Kerala.",
    icon: Car,
  },
  {
    title: "Police-Verified Chauffeurs",
    desc: "Experienced, background-checked long-distance drivers focused on passenger safety.",
    icon: UserCheck,
  },
  {
    title: "24/7 Dispatch Support",
    desc: "Round-the-clock live route monitoring and emergency helpline for continuous peace of mind.",
    icon: Headphones,
  },
  {
    title: "Zero Cancellation Fees",
    desc: "Plans changed? Cancel anytime before driver dispatch with zero penalty or hidden charges.",
    icon: Ban,
  },
];

const COMPARISONS = [
  {
    feature: "Distance Billing",
    traditional: "Charged for 2-way roundtrip distance",
    purple: "100% One-Way Drop Kilometer billing",
  },
  {
    feature: "Pricing Transparency",
    traditional: "Surprise driver demands & hidden charges",
    purple: "Fixed upfront fare estimate with zero surprises",
  },
  {
    feature: "Vehicle Standards",
    traditional: "Uncertain car cleanliness & maintenance",
    purple: "Sanitized, dual-AC highway cruisers",
  },
  {
    feature: "Driver Verification",
    traditional: "Unverified third-party drivers",
    purple: "Police-verified, highway certified chauffeurs",
  },
  {
    feature: "Support & Safety",
    traditional: "Limited or no live trip tracking",
    purple: "24/7 Dispatch desk & live GPS trip sharing",
  },
];

const SAFETY_FEATURES = [
  {
    title: "Verified Chauffeurs",
    desc: "Every driver undergoes background checks, drug screenings, and long-distance driving evaluations.",
    icon: ShieldCheck,
  },
  {
    title: "Live GPS Tracking",
    desc: "Share your live route coordinates with family members for continuous peace of mind.",
    icon: Navigation,
  },
  {
    title: "24/7 Dispatch Desk",
    desc: "Our round-the-clock support team monitors highway routes and traffic conditions continuously.",
    icon: Clock,
  },
  {
    title: "Zero Hidden Fees",
    desc: "All toll estimates, state permit charges, and driver bata are presented transparently before booking.",
    icon: Zap,
  },
];

export default function AboutUs() {
  return (
    <div className="w-full bg-[#f8f6fc] text-gray-900 relative overflow-hidden font-sans select-none">
      
      {/* 🎨 CUSTOM UIVERSE EXPANDING HOVER STYLES */}
      <style jsx global>{`
        /* Uiverse Expanding Circle Hover Card */
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
          transition: all 0.3s ease;
        }

        /* Hover States */
        .uiverse-hover-card:hover::before {
          transform: scale(32);
        }

        .uiverse-hover-card:hover .uiverse-card-title {
          color: #ffffff !important;
          transition: color 0.35s ease;
        }

        .uiverse-hover-card:hover .uiverse-card-desc {
          color: rgba(255, 255, 255, 0.85) !important;
          transition: color 0.35s ease;
        }

        .uiverse-hover-card:hover .uiverse-card-icon {
          background-color: rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
          transition: all 0.35s ease;
        }
      `}</style>

      {/* 🌟 AMBIENT GLOW EFFECTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 z-0" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ========================================================================
       * 1. HERO HEADER SECTION
       * ========================================================================= */}
      <section className="relative w-full overflow-hidden py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-purple-700/60 bg-[#1f043e]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/carouselimg1.png"
            alt=""
            className="h-full w-full object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f043e]/40 via-[#1f043e]/40 to-black/40" />
        </div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto text-center space-y-5"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#1bc5d8]" /> South India&apos;s Premier Drop Taxi
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="page-title-pattern">
            Driven By Integrity. <br />
            <span className="text-[#1bc5d8]">Powered By Transparency.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-white text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            PurpleDropTaxi was founded with one clear mission: to eliminate unfair return-kilometer charges for one-way outstation travelers. Pay strictly for the distance you travel, with zero compromise on comfort and safety.
          </motion.p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-3 relative z-10 space-y-24">

        {/* ========================================================================
         * 2. STATS TICKER GRID
         * ========================================================================= */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white border border-gray-100 shadow-xl shadow-slate-200/50 p-6 rounded-2xl text-center space-y-2 hover:border-purple-200 transition-colors group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-[#7c2bea] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                <p className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.section>

        {/* ========================================================================
         * 3. PURPLE DROP TAXI KEY FEATURES (UIVERSE EXPANDING HOVER CARDS)
         * ========================================================================= */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c2bea] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Why Choose Us
            </div>
            <h2 className="section-title-pattern">
              Features Built For <span className="text-[#7c2bea]">Highway Travelers</span>
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">
              Designed from the ground up to offer the most convenient and cost-effective outstation ride experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={i} 
                  variants={fadeInUp}
                  className="uiverse-hover-card p-6 shadow-lg shadow-slate-200/50 flex flex-col justify-between"
                >
                  {/* Uiverse Corner Arrow Badge */}
                  <div className="uiverse-go-corner">
                    <ArrowRight className="w-3.5 h-3.5 text-white -mt-0.5 -mr-0.5" />
                  </div>

                  <div className="space-y-3">
                    <div className="uiverse-card-icon w-10 h-10 rounded-xl bg-purple-100 text-[#7c2bea] flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="uiverse-card-title text-base font-bold text-gray-900 transition-colors">{item.title}</h3>
                    <p className="uiverse-card-desc text-xs text-gray-500 leading-relaxed font-medium transition-colors">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ========================================================================
         * 4. OUR STORY & MISSION SECTION
         * ========================================================================= */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white border border-purple-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-purple-500/5"
        >
          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c2bea] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Our Journey
            </div>
            
            <h2 className="section-title-pattern">
              Why Pay For The <span className="text-[#7c2bea]">Driver&apos;s Return Journey?</span>
            </h2>

            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-medium">
              For decades, travelers heading from Chennai to Bangalore, Coimbatore to Ooty, or Madurai to Chennai were forced to pay double mileage—covering the cost of returning an empty car back to the origin city.
            </p>

            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-medium">
              We changed the highway landscape by building an interconnected smart dispatch system across Tamil Nadu, Karnataka, and Kerala. When you take a drop taxi, our platform matches your vehicle with a returning traveler, eliminating unnecessary fees and passing the savings directly to you.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-gray-700">
              <span className="flex items-center gap-1.5 bg-purple-50/60 border border-purple-100 px-3 py-1.5 rounded-lg text-purple-900">
                <CheckCircle2 className="w-4 h-4 text-[#7c2bea]" /> Doorstep Pickups
              </span>
              <span className="flex items-center gap-1.5 bg-purple-50/60 border border-purple-100 px-3 py-1.5 rounded-lg text-purple-900">
                <CheckCircle2 className="w-4 h-4 text-[#7c2bea]" /> Dual-AC Fleets
              </span>
              <span className="flex items-center gap-1.5 bg-purple-50/60 border border-purple-100 px-3 py-1.5 rounded-lg text-purple-900">
                <CheckCircle2 className="w-4 h-4 text-[#7c2bea]" /> Zero Cancellation Fees
              </span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative rounded-2xl overflow-hidden border border-purple-100 shadow-xl group">
            <img 
              src="/images/carouselimg2.png" 
              alt="PurpleDropTaxi Highway Drive" 
              className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <p className="text-xs font-black text-[#7c2bea] uppercase tracking-widest">Highway Guarantee</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">Prompt door-to-door connections across 100+ cities.</p>
            </div>
          </motion.div>
        </motion.section>
        
        <Cars />
        
        {/* ========================================================================
         * 5. TRADITIONAL VS PURPLE DROP TAXI COMPARISON
         * ========================================================================= */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-2">
            <h2 className="section-title-pattern">
              Traditional Cabs vs. <span className="text-[#7c2bea]">PurpleDropTaxi</span>
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">
              See how our distance-only model saves you up to 40% on every outstation route.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xl shadow-slate-200/40">
            <table className="w-full min-w-[640px] text-left text-xs sm:text-sm text-gray-700 table-fixed">
              <thead className="bg-purple-50 text-[#7c2bea] font-black uppercase tracking-wider text-[11px] border-b border-purple-100">
                <tr>
                  <th className="p-4 sm:p-5 w-[34%]">Feature</th>
                  <th className="p-4 sm:p-5 w-[33%] text-rose-600">Traditional Cabs</th>
                  <th className="p-4 sm:p-5 w-[33%] text-emerald-600">PurpleDropTaxi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {COMPARISONS.map((row, i) => (
                  <tr key={i} className="hover:bg-purple-50/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-gray-900 align-top">
                      {row.feature}
                    </td>

                    <td className="p-4 sm:p-5 text-gray-500 align-top">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /> 
                        <span>{row.traditional}</span>
                      </div>
                    </td>

                    <td className="p-4 sm:p-5 text-gray-900 font-bold align-top bg-purple-50/20">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                        <span className="text-gray-900">{row.purple}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.section>

        {/* ========================================================================
         * 6. SAFETY & TRUST CARDS (UIVERSE EXPANDING HOVER CARDS)
         * ========================================================================= */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-2">
            <h2 className="section-title-pattern">
              Safety & <span className="text-[#7c2bea]">Passenger Protection</span>
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">
              Built for solo travelers, families, seniors, and corporate executives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAFETY_FEATURES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={i} 
                  variants={fadeInUp}
                  className="uiverse-hover-card p-6 shadow-lg shadow-slate-200/40 flex flex-col justify-between"
                >
                  <div className="uiverse-go-corner">
                    <ArrowRight className="w-3.5 h-3.5 text-white -mt-0.5 -mr-0.5" />
                  </div>

                  <div className="space-y-3">
                    <div className="uiverse-card-icon w-10 h-10 rounded-xl bg-purple-100 text-[#7c2bea] flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="uiverse-card-title text-sm font-bold text-gray-900 transition-colors">{item.title}</h3>
                    <p className="uiverse-card-desc text-xs text-gray-500 leading-relaxed font-medium transition-colors">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ========================================================================
         * 7. CALL TO ACTION BANNER
         * ========================================================================= */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0b1120] p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-2xl shadow-slate-900/30 text-white relative overflow-hidden"
        >
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="section-title-pattern-on-dark">
              Ready For <span>Your Next Outstation Journey?</span>
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm font-medium">
              Book your ride in less than 60 seconds with instant fare calculation and zero advance deposit requirements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
            <button
              type="button"
              className="btn btn-primary px-8 py-3.5 text-xs font-black uppercase tracking-wider shadow-lg"
            >
              Book Drop Taxi Now <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:+918110880500"
              className="btn btn-primary px-8 py-3.5 text-xs font-black uppercase tracking-wider shadow-lg"
            >
              <Phone className="w-4 h-4" /> Call Dispatch Desk
            </a>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
