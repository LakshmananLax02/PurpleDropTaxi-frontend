"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

export default function ServiceRoutesHeroHeader() {
  const { scrollYProgress } = useScroll();
  const heroImageScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.15]);

  return (
    <section className="relative w-full py-10 md:py-10 px-4 sm:px-6 lg:px-8 border-b border-purple-100/60 overflow-hidden bg-[#f8fafc]">
      
      {/* Background Image with Parallax Scale */}
      <motion.div 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ scale: heroImageScale }}
      >
        <img
          src="/images/sedanimg.png"
          alt="PurpleDropTaxi Service Routes Background"
          className="w-full h-full object-cover object-center opacity-90"
        />
      </motion.div>

      {/* Gradient Overlay for Text High Contrast Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc]/50 via-[#f8fafc]/70 to-[#f8fafc] z-0" />

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto text-center space-y-5"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div 
          variants={fadeInUp} 
          className="inline-flex items-center gap-2 bg-white/90 border border-purple-200 text-[#7c3aed] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" /> Interstate & Intercity Coverage
        </motion.div>
        
        <motion.h1 
          variants={fadeInUp} 
          className="text-3xl md:text-5xl lg:text-5xl font-black tracking-tight leading-tight text-gray-900"
        >
          Connecting 100+ Cities Across <br />
          <span className="text-[#7c3aed]">Tamil Nadu, Karnataka & Kerala.</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp} 
          className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-2xl mx-auto"
        >
          From major metro routes to remote hill towns, our smart dispatch network ensures doorstep drop taxi availability wherever your highway travel takes you.
        </motion.p>
      </motion.div>
    </section>
  );
}