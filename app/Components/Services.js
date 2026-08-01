"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Car, 
  RotateCcw, 
  PlaneTakeoff, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  ChevronRight,
  Zap,
  Tag
} from "lucide-react";

/* ============================================================================
 * SERVICES DATASET
 * ========================================================================= */
const SERVICES_DATA = [
  {
    id: "oneway",
    title: "One-Way Drop Taxi",
    subtitle: "Pay Only for the Distance You Travel",
    badge: "Most Popular",
    icon: Car,
    image: "/images/carouselimg1.png",
    description: "Travelling outstation and don't need a return journey? Our 100% One-Way Drop Taxi service ensures you only pay for the exact distance travelled—never double fare. Ideal for personal trips, business travel, and city relocation.",
    highlights: [
      "Zero Return Fare Charges",
      "Point-to-Point Pickup & Drop across Tamil Nadu & Interstate",
      "Transparent Billing with No Hidden Fees",
      "Sanitized & Well-Maintained Fleet Options"
    ],
    pricingNote: "Sedan fares from ₹15/KM"
  },
  {
    id: "roundtrip",
    title: "Round Trip Taxi",
    subtitle: "Comfortable Multi-Day Highway Travels",
    badge: "Best Value",
    icon: RotateCcw,
    image: "/images/carouselimg2.png",
    description: "Planning a family vacation, pilgrimage, or business trip that requires a returning ride? Enjoy heavily discounted per-kilometer rates for round-trip intercity rides with dedicated driver support throughout your journey.",
    highlights: [
      "Discounted Per-KM Rates (Sedan ₹14/KM)",
      "Dedicated Experienced Highway Driver",
      "Flexible Sightseeing Stopovers Included",
      "Available for Same-Day & Multi-Day Travel"
    ],
    pricingNote: "Special Package Rates for Multi-Day Tours"
  },
  {
    id: "airport",
    title: "Airport Pickup & Drop",
    subtitle: "On-Time Guaranteed Transfers 24/7",
    badge: "24/7 Express",
    icon: PlaneTakeoff,
    image: "/images/carouselimg3.png",
    description: "Never miss a flight with our prompt, round-the-clock Airport Taxi Services. Serving major airports including Chennai (MAA), Coimbatore (CJB), Trichy (TRZ), Madurai (IXM), and Bengaluru (BLR).",
    highlights: [
      "Real-Time Flight Tracking for Timely Pickups",
      "Flight Delay Hold Time Included",
      "Spacious Luggage Support for Extra Bags",
      "Direct Terminal Doorstep Drop"
    ],
    pricingNote: "Flat Fixed Rates Available for Airport Drops"
  }
];

const FEATURES_LIST = [
  {
    title: "Instant Fare Calculation",
    desc: "Transparent price estimates with driver bata and base mileage included up front.",
    icon: Zap
  },
  {
    title: "Verified Highway Pilots",
    desc: "Background-checked, professional drivers with extensive highway experience.",
    icon: ShieldCheck
  },
  {
    title: "Clean & Sanitized Cabs",
    desc: "Thoroughly inspected, AC-equipped vehicles with ample luggage space.",
    icon: Sparkles
  },
  {
    title: "24/7 On-Demand Support",
    desc: "Round-the-clock customer assistance for real-time trip tracking & updates.",
    icon: Clock
  }
];

export default function ServicesPage() {
  return (
    <div className="w-full overflow-x-hidden bg-[#f8f6fc] font-sans text-[#1E293B] select-none">
      
      {/* 🌟 1. HERO BANNER SECTION (SERVICES CONTENT + BACKGROUND IMAGE) */}
      <section className="relative w-full overflow-hidden border-b border-purple-700/60 bg-[#1f043e] px-4 py-16 sm:px-6 md:py-16 lg:px-8">
        {/* Shared About-page hero image treatment */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/carouselimg1.png"
            alt=""
            className="h-full w-full object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f043e]/40 via-[#1f043e]/40 to-black/40" />
        </div>

        {/* Hero Banner Content */}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center space-y-5 text-center">
          
          {/* Top Badge Highlighting Services */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#1bc5d8]" /> Premium Outstation & Airport Taxi
          </motion.div>

          {/* Main Hero Headings focused on One-Way, Round Trip, & Airport Pickup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="page-title-pattern">
              One-Way, Round Trip <br />
              <span>Airport Pickup.</span>
            </h1>
          </motion.div>

          {/* Subtitle listing the key taxi services */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-xs font-medium leading-relaxed text-white sm:text-sm md:text-base"
          >
            Whether you need a single drop outstation, a multi-day family round trip, or guaranteed 24/7 airport transfers—enjoy transparent per-km rates with zero hidden charges.
          </motion.p>

          {/* Quick Service Badges Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-bold text-white"
          >
            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#1bc5d8]" /> One-Way Drop
            </span>
            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-[#1bc5d8]" /> Round Trip
            </span>
            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15 flex items-center gap-1.5">
              <PlaneTakeoff className="w-3.5 h-3.5 text-[#1bc5d8]" /> Airport Transfer
            </span>
          </motion.div>

        </div>
      </section>

      {/* 🌟 2. MAIN SERVICES DETAILED SECTION (SCROLL ANIMATED) */}
      <section className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        
        {SERVICES_DATA.map((service, index) => {
          const Icon = service.icon;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8 rounded-3xl border border-[#b8eaf0] bg-white p-5 shadow-xl shadow-[#5815b7]/5 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#5815b7]/10 sm:p-8 lg:gap-10 lg:p-10`}
            >
              
              {/* SERVICE IMAGE CONTAINER */}
              <div className="group relative h-72 w-full shrink-0 overflow-hidden rounded-2xl border border-[#b8eaf0] shadow-lg sm:h-96 lg:w-1/2">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Floating Badge on Image */}
                <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-[#5815b7] to-[#1bc5d8] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white shadow-md">
                  {service.badge}
                </span>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1bc5d8]" />
                    <span className="text-xs font-bold">Doorstep Pickup Available</span>
                  </div>
                  <span className="text-xs font-black bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                    {service.pricingNote}
                  </span>
                </div>
              </div>

              {/* SERVICE CONTENT DETAILS */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[#b8eaf0] bg-[#f1fbfc] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#5815b7]">
                    <Icon className="w-4 h-4" /> {service.subtitle}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {service.title}
                  </h2>
                </div>

                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">
                  {service.description}
                </p>

                {/* Key Highlights Checklist */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-black text-gray-900 uppercase tracking-wider">
                    Service Highlights:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-bold text-gray-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1bc5d8]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/booking?service=${service.id}`}
                    className="btn btn-primary h-[46px] px-6 text-xs font-black uppercase tracking-widest"
                  >
                    Book This Ride <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <Link
                    href="/tariff"
                    className="btn btn-outline h-[46px] px-6 text-xs font-black uppercase tracking-widest"
                  >
                    <Tag className="h-4 w-4 text-[#5815b7]" /> Estimate Fare
                  </Link>
                </div>

              </div>

            </motion.div>
          );
        })}

      </section>

      {/* 🌟 3. WHY CHOOSE US / FEATURES GRID */}
      <section className="relative overflow-hidden bg-[#1f043e] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Why Travel With <span className="text-[#1bc5d8]">PurpleDropTaxi</span>?
            </h2>
            <p className="text-xs font-medium text-purple-100 sm:text-sm">
              We redefine outstation cab travel with unmatched safety standards, clear pricing structures, and courteous drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES_LIST.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="space-y-3 rounded-2xl border border-[#1bc5d8]/25 bg-white/5 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#1bc5d8]/60 hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1bc5d8]/40 bg-[#5815b7]/50 text-[#1bc5d8]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white">{feat.title}</h3>
                  <p className="text-xs text-purple-100 font-medium leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 🌟 4. BOTTOM CALL TO ACTION BANNER */}
      <section className="mx-auto my-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#5815b7] to-[#1bc5d8] p-8 text-white shadow-2xl shadow-[#5815b7]/30 sm:flex-row sm:p-12">
          
          <div className="space-y-2 text-center sm:text-left relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to Book Your Journey?</h3>
            <p className="text-xs font-medium text-white/85 sm:text-sm">
              Instant booking with guaranteed doorstep pickups across Tamil Nadu & Bangalore.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <a
              href="tel:+918110880500"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-black uppercase tracking-widest text-[#5815b7] shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
            >
              <PhoneCall className="w-4 h-4" /> Call For Booking
            </a>

            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-[#26074b]/25 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#26074b]/45 active:scale-95"
            >
              Book Online Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
