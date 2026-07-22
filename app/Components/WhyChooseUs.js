"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Receipt, 
  Clock, 
  UserCheck, 
  Sparkles, 
  Headphones, 
  ArrowRight 
} from "lucide-react";

/* ============================================================================
 * 1. FEATURES DATASET
 * ========================================================================= */
const FEATURES = [
  {
    id: "transparent-pricing",
    icon: Receipt,
    title: "100% One-Way Pricing",
    description: "Pay strictly for the distance you travel. Zero return kilometer charges, zero hidden driver fees, and complete fare clarity upfront.",
    highlight: "No Return Charges",
  },
  {
    id: "safety-first",
    icon: ShieldCheck,
    title: "Women & Family Safe",
    description: "Equipped with live 24/7 GPS route tracking, emergency SOS assistance, and specially trained chauffeurs for maximum peace of mind.",
    highlight: "24/7 GPS Tracked",
  },
  {
    id: "verified-drivers",
    icon: UserCheck,
    title: "Verified Professional Drivers",
    description: "Background-checked, highly experienced outstation drivers who know state routes, highway regulations, and safety protocols thoroughly.",
    highlight: "100% Verified",
  },
  {
    id: "timely-pickup",
    icon: Clock,
    title: "On-Time Guarantee",
    description: "Punctual doorstep pickups for early morning flights, outstation trips, or train connections without flight-delay penalty surcharges.",
    highlight: "Zero Delay Guarantee",
  },
  {
    id: "fleet-comfort",
    icon: Sparkles,
    title: "Sanitized & Luxury Fleet",
    description: "Choose from pristine, climate-controlled Sedans, spacious SUVs, and Luxury Innova models inspected before every trip.",
    highlight: "Top Rated Fleet",
  },
  {
    id: "247-support",
    icon: Headphones,
    title: "Dedicated Tele-Support",
    description: "Our dedicated dispatch management team is available around the clock to assist you with route adjustments or immediate bookings.",
    highlight: "24/7 Assistance",
  },
];

/* ============================================================================
 * 2. ANIMATION VARIANTS
 * ========================================================================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardScrollVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.7, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  },
};

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-[#f8fafc] py-5 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* --- EMBEDDED STYLES FOR THE 3D STACKED HOVER CARD EFFECT --- */}
      <style jsx global>{`
        .card-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          border-radius: 24px;
          line-height: 1.6;
          transition: transform 0.48s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          padding: 32px;
          width: 100%;
          border-radius: 22px;
          color: #ffffff;
          overflow: visible; /* Allows stacked layers to peek out */
          background: #6D28D9; /* Purple Brand Color */
          transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .content::before {
          position: absolute;
          content: "";
          top: -4%;
          left: 50%;
          width: 90%;
          height: 90%;
          transform: translate(-50%, 0);
          background: #DDD6FE; /* Purple Accent Layer 1 */
          z-index: -1;
          transform-origin: bottom;
          border-radius: inherit;
          transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .content::after {
          position: absolute;
          content: "";
          top: -8%;
          left: 50%;
          width: 80%;
          height: 80%;
          transform: translate(-50%, 0);
          background: #EDE9FE; /* Purple Accent Layer 2 */
          z-index: -2;
          transform-origin: bottom;
          border-radius: inherit;
          transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .content svg {
          width: 32px;
          height: 32px;
        }

        .content .para {
          z-index: 1;
          opacity: 1;
          font-size: 13px;
          color: #e9d5ff;
          line-height: 1.6;
          transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .content .link {
          z-index: 1;
          color: #fde047; /* Yellow Accent Link */
          text-decoration: none;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .content .link:hover {
          text-decoration: underline;
        }

        /* --- HOVER STATES --- */
        .card-wrapper:hover {
          transform: translateY(-16px) !important;
        }

        .card-wrapper:hover .content::before {
          transform: translate(-50%, 0) rotate(-8deg);
          top: 0;
          width: 100%;
          height: 100%;
        }

        .card-wrapper:hover .content::after {
          transform: translate(-50%, 0) rotate(8deg);
          top: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>

      {/* Ambient Background Glow Orbs */}
      <motion.div 
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{
          y: [0, 20, 0],
          x: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-10 -right-20 w-[450px] h-[450px] bg-purple-400/20 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c3aed] px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-[#7c3aed]" />
            </motion.div>
            <span>Why Choose PurpleDropTaxi</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight"
          >
            The Premier Choice for <br />
            <span className="text-[#7c3aed]">One-Way Outstation Travel</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed"
          >
            We combine transparent pricing, certified highway safety, and premium vehicle comfort so you can travel across Tamil Nadu & South India worry-free.
          </motion.p>
        </div>

        {/* --- 3D STACKED CARDS GRID --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-6"
        >
          {FEATURES.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={cardScrollVariants}
                className="card-wrapper cursor-pointer"
              >
                <div className="content">
                  
                  {/* Top Icon & Badge Header */}
                  <div className="w-full flex items-center justify-between z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                      <IconComponent />
                    </div>

                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-200 bg-white/10 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                      {feature.highlight}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-white tracking-tight z-10">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="para">
                    {feature.description}
                  </p>

                  {/* Link */}
                  <a href="#book" className="link">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </a>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* --- BOTTOM STATS CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-purple-900/30"
        >
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-purple-900/50">
            <motion.div 
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="space-y-1 transition-transform cursor-default"
            >
              <h4 className="text-3xl sm:text-4xl font-black text-white tracking-tight">50,000+</h4>
              <p className="text-purple-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest">Successful Rides</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="space-y-1 pt-6 md:pt-0 transition-transform cursor-default"
            >
              <h4 className="text-3xl sm:text-4xl font-black text-white tracking-tight">200+</h4>
              <p className="text-purple-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest">Cities Covered</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="space-y-1 pt-6 md:pt-0 transition-transform cursor-default"
            >
              <h4 className="text-3xl sm:text-4xl font-black text-white tracking-tight">4.9 ★</h4>
              <p className="text-purple-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest">Customer Rating</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="space-y-1 pt-6 md:pt-0 transition-transform cursor-default"
            >
              <h4 className="text-3xl sm:text-4xl font-black text-white tracking-tight">0 ₹</h4>
              <p className="text-purple-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest">Return Charges</p>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}