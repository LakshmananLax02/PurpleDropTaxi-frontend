"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
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

export default function TariffHeroHeader() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-purple-700/60 bg-[#1f043e]">
      <div className="absolute inset-0 z-0">
        <img src="/images/sedanimg.png" alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f043e]/40 via-[#1f043e]/40 to-black/40" />
      </div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto text-center space-y-5"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div 
          variants={fadeInUp} 
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#1bc5d8]" /> Transparent One-Way Fares
        </motion.div>
        
        <motion.h1 
          variants={fadeInUp} 
          className="page-title-pattern"
        >
          Pay Only For What You Travel. <br />
          <span className="text-[#1bc5d8]">Zero Return Charges.</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp} 
          className="text-white text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-2xl mx-auto"
        >
          Explore fixed kilometer rates for Sedans, SUVs, and Premium Cruisers. Upfront transparent pricing with zero surprise charges or hidden driver bata demands.
        </motion.p>
      </motion.div>
    </section>
  );
}
