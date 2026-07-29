"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const { scrollYProgress } = useScroll();
  const heroImageScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.12]);

  return (
    <div className="w-full bg-[#f8fafc] text-gray-900 relative overflow-hidden font-sans select-none">
      
      {/* 🌟 AMBIENT GLOW EFFECTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 z-0" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ========================================================================
       * 1. HERO HEADER SECTION WITH DIRECT /images/sedanimg.png IMAGE
       * ========================================================================= */}
      <section className="relative w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-purple-100/60 overflow-hidden bg-[#f8fafc]">
        
        {/* Parallax Background Image Layer */}
        <motion.div 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ scale: heroImageScale }}
        >
          <img
            src="/images/sedanimg.png"
            alt="PurpleDropTaxi Highway Drive Background"
            className="w-full h-full object-cover object-center opacity-90"
          />
        </motion.div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc]/40 via-[#f8fafc]/40 to-[#f8fafc] z-0" />

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto text-center space-y-5"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/90 border border-purple-200 text-[#7c3aed] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" /> South India's Premier Drop Taxi
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-gray-900">
            Driven By Integrity. <br />
            <span className="text-[#7c3aed]">Powered By Transparency.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            PurpleDropTaxi was founded with one clear mission: to eliminate unfair return-kilometer charges for one-way outstation travelers. Pay strictly for the distance you travel, with zero compromise on comfort and safety.
          </motion.p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10 space-y-24">

        {/* ========================================================================
         * 2. STATS TICKER GRID (SCROLL ANIMATED)
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
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-[#7c3aed] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                <p className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.section>

        {/* ========================================================================
         * 3. PURPLE DROP TAXI KEY FEATURES
         * ========================================================================= */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c3aed] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Why Choose Us
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
              Features Built For <span className="text-[#7c3aed]">Highway Travelers</span>
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
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white border border-gray-100 p-6 rounded-2xl space-y-3 shadow-lg shadow-slate-200/40 hover:border-purple-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7c3aed] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
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
            <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c3aed] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Our Journey
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 leading-snug">
              Why Pay For The <span className="text-[#7c3aed]">Driver's Return Journey?</span>
            </h2>

            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-medium">
              For decades, travelers heading from Chennai to Bangalore, Coimbatore to Ooty, or Madurai to Chennai were forced to pay double mileage—covering the cost of returning an empty car back to the origin city.
            </p>

            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-medium">
              We changed the highway landscape by building an interconnected smart dispatch system across Tamil Nadu, Karnataka, and Kerala. When you take a drop taxi, our platform matches your vehicle with a returning traveler, eliminating unnecessary fees and passing the savings directly to you.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-gray-700">
              <span className="flex items-center gap-1.5 bg-purple-50/60 border border-purple-100 px-3 py-1.5 rounded-lg text-purple-900">
                <CheckCircle2 className="w-4 h-4 text-[#7c3aed]" /> Doorstep Pickups
              </span>
              <span className="flex items-center gap-1.5 bg-purple-50/60 border border-purple-100 px-3 py-1.5 rounded-lg text-purple-900">
                <CheckCircle2 className="w-4 h-4 text-[#7c3aed]" /> Dual-AC Fleets
              </span>
              <span className="flex items-center gap-1.5 bg-purple-50/60 border border-purple-100 px-3 py-1.5 rounded-lg text-purple-900">
                <CheckCircle2 className="w-4 h-4 text-[#7c3aed]" /> Zero Cancellation Fees
              </span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative rounded-2xl overflow-hidden border border-purple-100 shadow-xl group">
            <img 
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop" 
              alt="PurpleDropTaxi Highway Drive" 
              className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <p className="text-xs font-black text-[#7c3aed] uppercase tracking-widest">Highway Guarantee</p>
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
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
              Traditional Cabs vs. <span className="text-[#7c3aed]">PurpleDropTaxi</span>
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">
              See how our distance-only model saves you up to 40% on every outstation route.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xl shadow-slate-200/40">
            <table className="w-full text-left text-xs sm:text-sm text-gray-700">
              <thead className="bg-purple-50 text-[#7c3aed] font-black uppercase tracking-wider text-[11px] border-b border-purple-100">
                <tr>
                  <th className="p-4 sm:p-5">Feature</th>
                  <th className="p-4 sm:p-5 text-rose-600">Traditional Cabs</th>
                  <th className="p-4 sm:p-5 text-emerald-600">PurpleDropTaxi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {COMPARISONS.map((row, i) => (
                  <tr key={i} className="hover:bg-purple-50/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-gray-900">{row.feature}</td>
                    <td className="p-4 sm:p-5 text-gray-500 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" /> {row.traditional}
                    </td>
                    <td className="p-4 sm:p-5 text-gray-900 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {row.purple}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.section>

        {/* ========================================================================
         * 6. SAFETY & TRUST CARDS
         * ========================================================================= */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-2">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
              Safety & <span className="text-[#7c3aed]">Passenger Protection</span>
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
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white border border-gray-100 p-6 rounded-2xl space-y-3 shadow-lg shadow-slate-200/40 hover:border-purple-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7c3aed] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ========================================================================
         * 7. CALL TO ACTION BANNER (POP ANIMATION)
         * ========================================================================= */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-900 via-[#7c3aed] to-purple-950 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-2xl shadow-purple-900/20 text-white relative overflow-hidden"
        >
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready For Your Next Outstation Journey?
            </h2>
            <p className="text-purple-100 text-xs sm:text-sm font-medium">
              Book your ride in less than 60 seconds with instant fare calculation and zero advance deposit requirements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
            <button
              type="button"
              className="btn btn-primary px-8 py-3.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 rounded-xl shadow-lg active:scale-95 bg-amber-400 hover:bg-amber-300 text-gray-950 border-none transition-transform"
            >
              Book Drop Taxi Now <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:+919876543210"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 active:scale-95 backdrop-blur-md"
            >
              <Phone className="w-4 h-4 text-amber-300" /> Call Dispatch Desk
            </a>
          </div>
        </motion.section>

      </div>
    </div>
  );
}