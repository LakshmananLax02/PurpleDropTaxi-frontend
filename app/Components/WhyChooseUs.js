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
    accentColor: "from-purple-500 to-indigo-600",
    floatDelay: 0,
  },
  {
    id: "safety-first",
    icon: ShieldCheck,
    title: "Women & Family Safe",
    description: "Equipped with live 24/7 GPS route tracking, emergency SOS assistance, and specially trained chauffeurs for maximum peace of mind.",
    highlight: "24/7 GPS Tracked",
    accentColor: "from-indigo-500 to-purple-600",
    floatDelay: 0.4,
  },
  {
    id: "verified-drivers",
    icon: UserCheck,
    title: "Verified Professional Drivers",
    description: "Background-checked, highly experienced outstation drivers who know state routes, highway regulations, and safety protocols thoroughly.",
    highlight: "100% Verified",
    accentColor: "from-purple-600 to-violet-600",
    floatDelay: 0.8,
  },
  {
    id: "timely-pickup",
    icon: Clock,
    title: "On-Time Guarantee",
    description: "Punctual doorstep pickups for early morning flights, outstation trips, or train connections without flight-delay penalty surcharges.",
    highlight: "Zero Delay Guarantee",
    accentColor: "from-violet-500 to-purple-600",
    floatDelay: 0.2,
  },
  {
    id: "fleet-comfort",
    icon: Sparkles,
    title: "Sanitized & Luxury Fleet",
    description: "Choose from pristine, climate-controlled Sedans, spacious SUVs, and Luxury Innova models inspected before every trip.",
    highlight: "Top Rated Fleet",
    accentColor: "from-purple-500 to-fuchsia-600",
    floatDelay: 0.6,
  },
  {
    id: "247-support",
    icon: Headphones,
    title: "Dedicated Tele-Support",
    description: "Our dedicated dispatch management team is available around the clock to assist you with route adjustments or immediate bookings.",
    highlight: "24/7 Assistance",
    accentColor: "from-fuchsia-600 to-purple-600",
    floatDelay: 1.0,
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
    <section className="w-full bg-[#f8fafc] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* STATIC/INFINITE ANIMATION: Ambient Background Orbs Floating continuously */}
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
        
        {/* --- SCROLL EFFECT: HEADER SECTION --- */}
        <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c3aed] px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm"
          >
            {/* STATIC ANIMATION: Pulsing Icon */}
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

        {/* --- SCROLL & STATIC ANIMATED CARDS GRID --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {FEATURES.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={cardScrollVariants}
                className="group relative"
              >
                {/* STATIC ANIMATION: Gentle continuous vertical floating for each card */}
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: feature.floatDelay,
                  }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-purple-900/[0.03] hover:shadow-2xl hover:shadow-purple-600/15 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
                >
                  {/* Top Progress Line Glow on Hover */}
                  <span className={`absolute top-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r ${feature.accentColor} transition-all duration-500 ease-out`} />

                  <div>
                    {/* Icon & Badge Header */}
                    <div className="flex items-center justify-between mb-6">
                      <motion.div 
                        whileHover={{ scale: 1.15, rotate: 6 }}
                        className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-gradient-to-br group-hover:from-[#7c3aed] group-hover:to-[#6D28D9] flex items-center justify-center text-[#7c3aed] group-hover:text-white transition-colors duration-300 shadow-inner"
                      >
                        <IconComponent className="w-7 h-7 stroke-[2.2]" />
                      </motion.div>

                      {/* STATIC ANIMATION: Breathing Badge */}
                      <motion.span 
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[10px] font-extrabold uppercase tracking-wider text-[#7c3aed] bg-purple-50 px-3 py-1 rounded-full border border-purple-100/60 group-hover:bg-purple-100 transition-colors"
                      >
                        {feature.highlight}
                      </motion.span>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-[#7c3aed] transition-colors mb-3 tracking-tight">
                      {feature.title}
                    </h3>

                    <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Interactive Footer */}
                  <div className="pt-6 mt-6 border-t border-gray-50 flex items-center text-xs font-bold text-[#7c3aed] group-hover:text-[#5b21b6] transition-colors">
                    <span>Learn more</span>
                    <motion.div
                      className="inline-block ml-1.5"
                      initial={{ x: 0 }}
                      whileHover={{ x: 6 }}
                    >
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* --- SCROLL EFFECT & STATIC ANIMATION: BOTTOM STATS CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-purple-900/30"
        >
          {/* STATIC ANIMATION: Continuous Pulsing Ambient Aura */}
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