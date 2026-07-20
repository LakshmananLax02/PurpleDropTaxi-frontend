"use client";

/**
 * ============================================================================
 * HeroSection.jsx
 * ----------------------------------------------------------------------------
 * Rotating hero banner for PurpleDropTaxi. No navbar in here — use your
 * existing navbar component above this on the page.
 *
 * This is a separate component from BookingSection.jsx — on the actual page
 * they're meant to stack, with BookingSection's card overlapping the bottom
 * of this hero (matching your reference design):
 *
 *   <YourExistingNavbar />
 *   <HeroSection />
 *   <BookingSection />   // pulled up with a negative margin, see NOTE below
 *
 * Stack: Next.js 15 (App Router) + JavaScript + Tailwind CSS + Framer Motion
 *        + lucide-react
 *
 * REQUIRED PACKAGES (npm install):
 *   framer-motion lucide-react
 *
 * IMAGES: every slide's background photo is a placeholder right now — see
 * HERO_SLIDES below. Add your own licensed photography/artwork there.
 *
 * NOTE ON OVERLAP: your reference design has the booking card's top edge
 * overlapping the bottom of the hero image. To reproduce that in your page
 * (app/page.jsx or wherever these are composed), wrap BookingSection in a
 * negative top margin, e.g.:
 *
 *   <HeroSection />
 *   <div className="-mt-24 md:-mt-32 relative z-10">
 *     <BookingSection />
 *   </div>
 *
 * MOBILE: the slide subtext/description is hidden below the md breakpoint
 * to shrink the hero's mobile height, so the booking form card that sits
 * below it renders properly without extra scroll.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

/* ============================================================================
 * CONSTANTS / DESIGN TOKENS (kept consistent with BookingSection.jsx)
 * ========================================================================= */

const COLORS = {
  gradientFrom: "#6D28D9",
  gradientTo: "#8B5CF6",
  accent: "#A855F7",
  whatsapp: "#22C55E",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
};

// ---------------------------------------------------------------------------
// HERO SLIDES
// This is the rotating carousel: one background image + one piece of content
// per slide. Add real photos to `image` (e.g. "/hero/slide-1.jpg") and edit
// the copy to match — everything here cycles automatically.
// ---------------------------------------------------------------------------
const HERO_SLIDES = [
  {
    id: "confidence",
    image: "/images/sedanimg.png",
    badge: "No.1 trusted droptaxi service in South India",
    headlinePrefix: "Travel Across Tamil Nadu",
    headlineHighlight: "With Confidence",
    subtext:
      "Experience the pinnacle of luxury travel with South India's premier chauffeur service — precision, safety, and comfort, every mile.",
  },
  {
    id: "outstation",
    image: "/images/sedanimg.png",
    badge: "Outstation cabs, done right",
    headlinePrefix: "One-Way Drops,",
    headlineHighlight: "Zero Return Fare",
    subtext:
      "Book a one-way outstation trip and pay only for the distance you travel — no hidden return charges.",
  },
  {
    id: "airport",
    image: "/images/sedanimg.png",
    badge: "On-time, every time",
    headlinePrefix: "Airport Pickups,",
    headlineHighlight: "Perfectly Timed",
    subtext:
      "Live flight tracking and verified drivers mean your cab is always there when you land — no waiting, no stress.",
  },
];

/* ============================================================================
 * HERO CAROUSEL
 * ========================================================================= */

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = HERO_SLIDES.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(timer);
  }, [paused, count]);

  const goTo = (i) => setIndex(((i % count) + count) % count);
  const slide = HERO_SLIDES[index];

  return (
    <div>
      <section
        className="relative w-full min-h-[300px] sm:min-h-[420px] md:min-h-[520px] flex items-center overflow-hidden pb-20 md:pb-36"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slide backgrounds */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {slide.image ? (
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover object-bottom scale-150 origin-bottom md:scale-100"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#DDE9D8] via-[#C9DFC4] to-[#B9D6B3]" />
            )}
            <div className="absolute inset-0 bg-white/40" />
          </motion.div>
        </AnimatePresence>

        {/* Content — centered */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 w-full flex justify-center">
          <div className="max-w-xl text-center flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <span
                  className="inline-flex items-center gap-1.5 rounded-full text-white text-xs font-semibold px-3.5 py-1.5 mb-5"
                  style={{ background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})` }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {slide.badge}
                </span>

                <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight text-[#1E293B]">
                  {slide.headlinePrefix}
                  <br />
                  <span style={{ color: COLORS.gradientTo }}>{slide.headlineHighlight}</span>
                </h1>

                <p className="hidden md:block mt-4 text-sm md:text-base text-[#475569] max-w-md">
                  {slide.subtext}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Prev / Next arrows — centered against the visible photo area only,
            excluding the bottom space reserved for the booking card overlap */}
        {count > 1 && (
          <div className="absolute inset-x-0 top-0 bottom-20 md:bottom-36 pointer-events-none z-10">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous slide"
              className="pointer-events-auto absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur shadow-md border border-black/5 flex items-center justify-center text-[#1E293B] hover:text-[#8B5CF6] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next slide"
              className="pointer-events-auto absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur shadow-md border border-black/5 flex items-center justify-center text-[#1E293B] hover:text-[#8B5CF6] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}