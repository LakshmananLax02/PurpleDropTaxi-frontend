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
  { name: "About Us", href: "#about" },
  { name: "Tariff & Fare Card", href: "#tariff" },
  { name: "Our Fleet", href: "#fleet" },
  { name: "Attach Your Taxi", href: "#attach" },
  { name: "Driver Partner Login", href: "#driver" },
  { name: "Privacy Policy", href: "#privacy" },
  { name: "Terms & Conditions", href: "#terms" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-white relative overflow-hidden font-sans border-t border-purple-900/40">
      
      {/* 🌟 AMBIENT GLOW EFFECTS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================
       * 1. TOP NEWSLETTER & QUICK CALLOUT BANNER
       * ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-purple-950/80 rounded-3xl p-6 sm:p-10 border border-purple-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-2 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-400/30 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Need Immediate Assistance?
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Book Your Outstation Ride In <span className="text-amber-400">60 Seconds</span>
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm font-medium max-w-lg">
              24/7 Doorstep Pickups Across Tamil Nadu, Karnataka & Kerala. Zero Return Fare Guarantee.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto z-10">
            {/* Phone Call CTA */}
            <a
              href="tel:+919876543210"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95"
            >
              <Phone className="w-4 h-4 fill-slate-950" /> Call Dispatch Desk
            </a>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 backdrop-blur-md active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Booking
            </a>
          </div>

        </div>
      </div>

      {/* ========================================================================
       * 2. MAIN FOOTER CONTENT GRID
       * ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-purple-900/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* COLUMN 1: BRAND & APP LINKS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#9333ea] flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Purple<span className="text-purple-400">DropTaxi</span>
              </span>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed font-medium max-w-sm">
              South India's most trusted one-way outstation taxi network. We eliminate return kilometer charges, offering transparent distance-only fares with verified chauffeurs.
            </p>

            {/* Live Operations Badge */}
            <div className="inline-flex items-center gap-2.5 bg-slate-900 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-emerald-300">
                2,400+ Taxis Live On Highway Right Now
              </span>
            </div>

            {/* App Store Mock Badges */}
            <div className="pt-2">
              <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest block mb-3">
                Book Faster via Mobile App
              </span>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 border border-purple-900/50 px-4 py-2 rounded-xl transition-all">
                  <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
                  <div className="text-left">
                    <span className="text-[9px] font-extrabold uppercase text-gray-400 block -mb-0.5">GET IT ON</span>
                    <span className="text-xs font-bold text-white">Google Play</span>
                  </div>
                </button>

                <button className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 border border-purple-900/50 px-4 py-2 rounded-xl transition-all">
                  <Apple className="w-4 h-4 text-purple-400 fill-purple-400" />
                  <div className="text-left">
                    <span className="text-[9px] font-extrabold uppercase text-gray-400 block -mb-0.5">DOWNLOAD ON THE</span>
                    <span className="text-xs font-bold text-white">App Store</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 2: POPULAR CITIES */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-purple-300 uppercase tracking-widest border-l-2 border-[#7c3aed] pl-2.5">
              Major Drop Cities
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-400">
              {TOP_CITIES.map((city, idx) => (
                <li key={idx}>
                  <a href={`#${city}`} className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-purple-500/60" /> {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: POPULAR ROUTES */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-purple-300 uppercase tracking-widest border-l-2 border-[#7c3aed] pl-2.5">
              Top Highway Routes
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-400">
              {POPULAR_ROUTES.map((route, idx) => (
                <li key={idx}>
                  <a href={`#${route}`} className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-purple-500/60" /> {route}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: QUICK LINKS & DISPATCH ADDRESS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-purple-300 uppercase tracking-widest border-l-2 border-[#7c3aed] pl-2.5">
              Company & Help
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-400">
              {QUICK_LINKS.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-purple-500/60" /> {link.name}
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
      <div className="bg-slate-900/60 border-t border-purple-900/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-1.5 text-gray-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Secure Payments
            </span>
            <span className="flex items-center gap-1.5 text-gray-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Zero Hidden Charges
            </span>
            <span className="flex items-center gap-1.5 text-gray-300 font-bold">
              <Clock className="w-4 h-4 text-amber-400" /> 24/7 On-Time Doorstep Pickup
            </span>
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2">
            {["UPI / GPay", "PhonePe", "Credit/Debit", "Net Banking", "Cash to Driver"].map((method, i) => (
              <span 
                key={i} 
                className="bg-slate-950 border border-purple-900/40 text-[10px] font-bold text-purple-300 px-2.5 py-1 rounded-md"
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
      <div className="border-t border-purple-950 py-6 text-xs text-gray-500 font-medium bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-purple-400 font-bold">PurpleDropTaxi</span>. All Rights Reserved. Designed for One-Way Highway Travelers across South India.
          </p>

         <p className="flex items-center gap-1 text-gray-500">
  Designed and Developed By{" "}
  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
  <Link
    href="/"
    className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200 hover:underline"
  >
    Wexoraa Infotech
  </Link>
</p>
        </div>
      </div>

    </footer>
  );
}