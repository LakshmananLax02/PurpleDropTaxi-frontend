"use client";

import React from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  Heart,
  Car,
  CheckCircle2,
  Apple,
  Play
} from "lucide-react";
import Link from "next/link";

/* ============================================================================
 * FOOTER DATASETS
 * ========================================================================= */
const TOP_CITIES = [
  "Chennai Drop Taxi",
  "Coimbatore Drop Taxi",
  "Madurai Drop Taxi",
  "Trichy Drop Taxi",
  "Salem Drop Taxi",
  "Bangalore One-Way Taxi",
  "Pondicherry Drop Taxi",
  "Ooty Outstation Cabs",
];

const POPULAR_ROUTES = [
  "Chennai to Bangalore Taxi",
  "Coimbatore to Chennai Taxi",
  "Madurai to Chennai Taxi",
  "Chennai to Pondicherry Taxi",
  "Coimbatore to Ooty Cab",
  "Bangalore to Coimbatore Taxi",
];

const QUICK_LINKS = [
  { name: "About Us", href: "/about-us" },
  { name: "Tariff & Fare Card", href: "/tariff" },
  { name: "Our Fleet", href: "#fleet" },
  { name: "Service Routes", href: "/service-routes" },
  { name: "Privacy Policy", href: "#privacy" },
  { name: "Terms & Conditions", href: "#terms" },
  { name: "Contact Us", href: "/contact-us" },

];

export default function Footer() {
  return (
    <footer className="w-full bg-[#1f043e] text-white relative overflow-hidden font-sans border-t border-[#5815b7]">
      
      {/* 🌟 AMBIENT GLOW EFFECTS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7c2bea]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-[#1bc5d8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================
       * 1. TOP NEWSLETTER & QUICK CALLOUT BANNER
       * ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="bg-gradient-to-r from-[#26074b] via-[#5815b7] to-[#3d0c79] rounded-3xl p-6 sm:p-10 border border-[#a55cff]/40 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-2 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-[#1bc5d8]/40 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#1bc5d8]" /> Need Immediate Assistance?
            </div>
            <h3 className="section-title-pattern-on-dark">
              Book Your Outstation Ride In <span>60 Seconds</span>
            </h3>
            <p className="text-purple-100 text-xs sm:text-sm font-medium max-w-lg">
              24/7 Doorstep Pickups Across Tamil Nadu, Karnataka & Kerala. Zero Return Fare Guarantee.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto z-10">
            {/* Phone Call CTA */}
            <a
              href="tel:+919876543210"
              className="w-full sm:w-auto bg-[#1bc5d8] hover:bg-[#b8eaf0] text-[#1f043e] font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Phone className="w-4 h-4 fill-[#1f043e]" /> Call Dispatch Desk
            </a>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-white/10 hover:bg-[#1bc5d8]/20 border border-[#1bc5d8]/50 text-[#b8eaf0] font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 backdrop-blur-md active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-[#1bc5d8]" /> WhatsApp Booking
            </a>
          </div>

        </div>
      </div>

      {/* ========================================================================
       * 2. MAIN FOOTER CONTENT GRID
       * ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#5815b7]/60">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* COLUMN 1: BRAND & APP LINKS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5815b7] to-[#1bc5d8] flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Purple<span className="text-[#1bc5d8]">DropTaxi</span>
              </span>
            </div>

            <p className="text-purple-100 text-xs leading-relaxed font-medium max-w-sm">
              South India's most trusted one-way outstation taxi network. We eliminate return kilometer charges, offering transparent distance-only fares with verified chauffeurs.
            </p>

            {/* Live Operations Badge */}
            <div className="inline-flex items-center gap-2.5 bg-[#26074b] border border-[#1bc5d8]/40 px-3.5 py-1.5 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1bc5d8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1bc5d8]"></span>
              </span>
              <span className="text-[11px] font-bold text-[#1bc5d8]">
                2,400+ Taxis Live On Highway Right Now
              </span>
            </div>

            
          </div>

          {/* COLUMN 2: POPULAR CITIES */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-l-2 border-[#1bc5d8] pl-2.5">
              Major Drop Cities
            </h4>
            <ul className="space-y-2 text-xs font-medium text-purple-100">
              {TOP_CITIES.map((city, idx) => (
                <li key={idx}>
                  <Link href="/booking" className="hover:text-[#1bc5d8] transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-[#1bc5d8]/70" /> {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: POPULAR ROUTES */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-l-2 border-[#1bc5d8] pl-2.5">
              Top Highway Routes
            </h4>
            <ul className="space-y-2 text-xs font-medium text-purple-100">
              {POPULAR_ROUTES.map((route, idx) => (
                <li key={idx}>
                  <a href={`#${route}`} className="hover:text-[#1bc5d8] transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-[#1bc5d8]/70" /> {route}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: QUICK LINKS & DISPATCH ADDRESS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-l-2 border-[#1bc5d8] pl-2.5">
              Company & Help
            </h4>
            <ul className="space-y-2 text-xs font-medium text-purple-100">
              {QUICK_LINKS.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-[#1bc5d8] transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-[#1bc5d8]/70" /> {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ========================================================================
       * 3. TRUST & PAYMENT BADGES ROW
       * ========================================================================= */}
      <div className="bg-[#2f075c]/70 border-t border-[#5815b7]/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-purple-100 font-medium">
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-[#1bc5d8]" /> 100% Secure Payments
            </span>
            <span className="flex items-center gap-1.5 text-white font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#a55cff]" /> Zero Hidden Charges
            </span>
            <span className="flex items-center gap-1.5 text-white font-bold">
              <Clock className="w-4 h-4 text-[#1bc5d8]" /> 24/7 On-Time Doorstep Pickup
            </span>
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2">
            {["UPI / GPay", "PhonePe", "Credit/Debit", "Net Banking", "Cash to Driver"].map((method, i) => (
              <span 
                key={i} 
                className="bg-[#26074b] border border-[#5815b7] text-[10px] font-bold text-[#b8eaf0] px-2.5 py-1 rounded-md"
              >
                {method}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* ========================================================================
       * 4. COPYRIGHT & LEGAL BOTTOM BAR
       * ========================================================================= */}
      <div className="border-t border-[#5815b7] py-6 text-xs text-purple-200 font-medium bg-[#26074b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-[#1bc5d8] font-bold">PurpleDropTaxi</span>. All Rights Reserved. Designed for One-Way Highway Travelers across South India.
          </p>

         <p className="flex items-center gap-1 text-purple-200">
  Designed and Developed By{" "}
  <Link
    href="/"
    className="text-[#1bc5d8] hover:text-white font-semibold transition-colors duration-200 hover:underline"
  >
    Wexoraa Infotech
  </Link>
</p>
        </div>
      </div>

    </footer>
  );
}
