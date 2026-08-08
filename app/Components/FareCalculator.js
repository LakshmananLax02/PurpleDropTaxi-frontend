"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, 
  Car, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Navigation,
  Sparkles
} from "lucide-react";
import { calculateFareEstimate, DRIVER_BATA, getTripDistanceKm } from "../lib/booking";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ============================================================================
 * FLEET RATES DATASET
 * ========================================================================= */
const FLEETS = [
  {
    id: "sedan",
    name: "Sedan",
    models: "Etios, Dzire, Aura",
    seats: "4 Passengers",
    luggage: "2 Bags",
    oneWayRate: 15,    // ₹15 / km for One-Way
    roundTripRate: 14, // ₹14 / km for Round Trip
    driverBata: DRIVER_BATA,
    badge: "Budget Friendly",
    image: "/images/sedanimg.png",
  },
  {
    id: "prime_sedan",
    name: "Prime Sedan",
    models: "Ciaz, Sunny, Honda City",
    seats: "4 Passengers",
    luggage: "3 Bags",
    oneWayRate: 15,    // ₹15 / km
    roundTripRate: 14, // ₹14 / km
    driverBata: DRIVER_BATA,
    badge: "Extra Comfort",
    image: "/images/sedanimg.png",
  },
  {
    id: "suv",
    name: "SUV",
    models: "Ertiga, Triber, Carens",
    seats: "6 Passengers",
    luggage: "4 Bags",
    oneWayRate: 19,    // ₹19 / km
    roundTripRate: 18, // ₹18 / km
    driverBata: DRIVER_BATA,
    badge: "Family Favorite",
    image: "/images/sedanimg.png",
  },
  {
    id: "prime_suv",
    name: "Prime SUV",
    models: "Innova Crysta, Hycross",
    seats: "7 Passengers",
    luggage: "5 Bags",
    oneWayRate: 23,    // ₹23 / km
    roundTripRate: 22, // ₹22 / km
    driverBata: DRIVER_BATA,
    badge: "Luxury Cruiser",
    image: "/images/sedanimg.png",
  }
];

const QUICK_DISTANCES = [100, 250, 400, 550];

export default function FareCalculator() {
  const [tripType, setTripType] = useState("oneway");
  const [kilometers, setKilometers] = useState(250);   // Default 250 km
  const [selectedFleet, setSelectedFleet] = useState("sedan");
  const [showTable, setShowTable] = useState(false);

  /* ============================================================================
   * SILENT BACKGROUND CALCULATION LOGIC
   * (Minimum threshold applied behind the scenes)
   * ========================================================================= */
  const actualTotalKm = getTripDistanceKm(kilometers, tripType);

  // Estimated Travel Time Calculation (~50 km/hr average highway speed)
  const estimatedHours = Math.floor(actualTotalKm / 50);
  const estimatedMinutes = Math.round(((actualTotalKm % 50) / 50) * 60);

  // Calculate total fare for any fleet item
  const calculateFare = (fleet) => {
    const estimate = calculateFareEstimate({ vehicleId: fleet.id, tripType, distanceKm: kilometers });
    return { ratePerKm: estimate.ratePerKm, baseFare: estimate.baseFare, totalFare: estimate.fare };
  };

  const handleGetEstimation = () => {
    setShowTable(true);
    setTimeout(() => {
      document.getElementById("estimation-table")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="w-full bg-[#f8f6fc] py-16 px-4 sm:px-6 lg:px-8 font-sans select-none relative overflow-hidden">
      
      {/* 🌟 AMBIENT GLOW EFFECTS */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">

        {/* --- 1. SECTION HEADER --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-purple-200 text-[#7c2bea] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md shadow-purple-500/10 backdrop-blur-md">
            <Calculator className="w-3.5 h-3.5 text-[#7c2bea]" /> Instant Fare Estimator
          </div>
          <h2 className="section-title-pattern">
            Calculate Your <span className="text-[#7c2bea]">Highway Trip Fare</span>
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">
            Select your trip type and enter your travel distance to view transparent fare estimates across all fleets.
          </p>
        </motion.div>

        {/* --- 2. MAIN CALCULATOR CARD --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="bg-white border-2 border-purple-100/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-purple-500/10 space-y-8"
        >

          {/* TABS: ONE-WAY, ROUND TRIP, AIRPORT PICKUP */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-gray-200/80 w-full max-w-xl shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setTripType("oneway");
                  setShowTable(false);
                }}
                className={`flex-1 py-3 px-2 sm:px-4 rounded-xl text-[10px] sm:text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                  tripType === "oneway"
                    ? "bg-[#7c2bea] text-white shadow-lg shadow-purple-600/30 scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                100% One-Way Drop
              </button>
              <button
                type="button"
                onClick={() => {
                  setTripType("roundtrip");
                  setShowTable(false);
                }}
                className={`flex-1 py-3 px-2 sm:px-4 rounded-xl text-[10px] sm:text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                  tripType === "roundtrip"
                    ? "bg-[#7c2bea] text-white shadow-lg shadow-purple-600/30 scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Round Trip
              </button>
              <button
                type="button"
                onClick={() => {
                  setTripType("airport");
                  setShowTable(false);
                }}
                className={`flex-1 py-3 px-2 sm:px-4 rounded-xl text-[10px] sm:text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                  tripType === "airport"
                    ? "bg-[#7c2bea] text-white shadow-lg shadow-purple-600/30 scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Airport Pickup
              </button>
            </div>
          </div>

          {/* INPUT FIELDS & QUICK METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* KILOMETER INPUT */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="km-input" className="block text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#7c2bea]" /> Enter Distance
                </label>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#7c2bea] bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 animate-pulse">
                  <Navigation className="w-3 h-3" /> Type KMs Below
                </span>
              </div>

              <div className="relative group">
                <input
                  id="km-input"
                  type="number"
                  min="1"
                  max="3000"
                  placeholder="e.g. 250"
                  value={kilometers}
                  onChange={(e) => {
                    setKilometers(Math.max(1, Number(e.target.value)));
                    setShowTable(false);
                  }}
                  className="w-full bg-slate-50 border-2 border-[#b8eaf0] focus:border-[#7c2bea] focus:hover:border-[#7c2bea] focus:bg-white focus:ring-4 focus:ring-[#7c2bea]/15 text-xl font-black text-gray-900 rounded-2xl p-4 pr-16 outline-none transition-all shadow-md shadow-purple-500/5 group-hover:border-[#1bc5d8]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-[#7c2bea] bg-purple-100/80 border border-purple-200 px-2.5 py-1 rounded-lg">
                  KM
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Presets:</span>
                {QUICK_DISTANCES.map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => {
                      setKilometers(dist);
                      setShowTable(false);
                    }}
                    className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border transition-all ${
                      kilometers === dist
                        ? "bg-[#7c2bea] text-white border-[#7c2bea] shadow-md shadow-purple-500/20"
                        : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                    }`}
                  >
                    {dist} KM
                  </button>
                ))}
              </div>
            </div>

            {/* TOTAL MILEAGE CARD */}
            <div className="bg-purple-50/70 border-2 border-purple-100 p-4 sm:p-5 rounded-2xl flex items-center gap-4 shadow-md shadow-purple-500/5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-[#7c2bea] flex items-center justify-center shrink-0 shadow-sm">
                <Car className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-black uppercase tracking-wider text-purple-900">
                  Total Trip Mileage
                </p>
                <p className="text-xl font-black text-gray-900">
                  {actualTotalKm} <span className="text-xs font-bold text-gray-500">KM</span>
                </p>
                <p className="text-[10px] text-gray-500 font-bold">
                  {tripType === "roundtrip" ? "Round Trip Total" : tripType === "airport" ? "Airport Transfer Distance" : "One-Way Distance"}
                </p>
              </div>
            </div>

            {/* ESTIMATED DURATION DISPLAY CARD */}
            <div className="bg-purple-50/70 border-2 border-purple-100 p-4 sm:p-5 rounded-2xl flex items-center gap-4 shadow-md shadow-purple-500/5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-[#7c2bea] flex items-center justify-center shrink-0 shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-purple-900">
                  Estimated Travel Time
                </p>
                <p className="text-xl font-black text-gray-900">
                  {estimatedHours}h {estimatedMinutes > 0 ? `${estimatedMinutes}m` : ""}
                  <span className="text-xs font-bold text-gray-500"> approx</span>
                </p>
              </div>
            </div>

          </div>

          {/* --- 3. FLEET SELECTION CARDS --- */}
          <div className="space-y-4">
            <p className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#7c2bea]" /> Fleet Preview:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FLEETS.map((fleet) => {
                const isSelected = selectedFleet === fleet.id;
                const { ratePerKm, totalFare } = calculateFare(fleet);

                return (
                  <div
                    key={fleet.id}
                    onClick={() => {
                      setSelectedFleet(fleet.id);
                      setShowTable(false);
                    }}
                    className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-purple-50/90 border-[#7c2bea] shadow-xl shadow-purple-500/15 -translate-y-1"
                        : "bg-white border-gray-100 hover:border-purple-300 hover:shadow-lg hover:shadow-slate-200/50"
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md self-start mb-2 ${
                      isSelected ? "bg-[#7c2bea] text-white shadow-sm" : "bg-slate-100 text-gray-600 border border-gray-200"
                    }`}>
                      {fleet.badge}
                    </span>

                    <div className="space-y-1">
                      <h3 className="text-base font-black text-gray-900">{fleet.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">{fleet.models}</p>
                    </div>

                    <div className="my-4 pt-3 border-t border-gray-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span>Rate:</span>
                        <span className="text-[#7c2bea] font-black">₹{ratePerKm} / KM</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span>Driver Bata:</span>
                        <span>₹{fleet.driverBata}</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border-2 border-purple-100 flex items-center justify-between shadow-sm">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Est. Total:</span>
                      <span className="text-lg font-black text-gray-900">₹{totalFare.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GET ESTIMATION BUTTON */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleGetEstimation}
              className="px-10 py-4 bg-[#7c2bea] hover:bg-[#5815b7] text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-600/30 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              Get Full Tariff Estimation Table <ChevronDown className="w-4 h-4" />
            </button>
          </div>

        </motion.div>

        {/* --- 4. DETAILED ESTIMATION TABLE --- */}
        <AnimatePresence>
          {showTable && (
            <motion.div
              id="estimation-table"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-2 border-purple-200 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-purple-500/10 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tariff Breakdown
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                    Estimated Comparison for {kilometers} KM ({tripType === "oneway" ? "One-Way Drop" : tripType === "roundtrip" ? "Round Trip" : "Airport Pickup"})
                  </h3>
                </div>
                <div className="text-xs font-bold text-gray-500 bg-slate-50 px-4 py-2 rounded-xl border border-gray-200">
                  Estimated Duration: <span className="text-gray-900 font-black">{estimatedHours} Hours {estimatedMinutes} Mins</span>
                </div>
              </div>

              {/* TABLE CONTAINER */}
              <div className="overflow-x-auto rounded-2xl border-2 border-gray-100 shadow-inner">
                <table className="w-full min-w-[650px] text-left text-xs sm:text-sm text-gray-700 table-fixed">
                  <thead className="bg-purple-50 text-[#7c2bea] font-black uppercase tracking-wider text-[11px] border-b-2 border-purple-100">
                    <tr>
                      <th className="p-4 sm:p-5 w-[30%]">Fleet Category</th>
                      <th className="p-4 sm:p-5 w-[15%]">Rate / KM</th>
                      <th className="p-4 sm:p-5 w-[20%]">Base Fare</th>
                      <th className="p-4 sm:p-5 w-[15%]">Driver Bata</th>
                      <th className="p-4 sm:p-5 w-[20%] text-right">Total Est. Fare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {FLEETS.map((fleet) => {
                      const { ratePerKm, baseFare, totalFare } = calculateFare(fleet);
                      const isCurrent = fleet.id === selectedFleet;

                      return (
                        <tr 
                          key={fleet.id} 
                          className={`transition-colors ${
                            isCurrent ? "bg-purple-50/60 font-bold" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="p-4 sm:p-5 font-black text-gray-900">
                            <div className="flex items-center gap-3">
                              <img
                                src={fleet.image}
                                alt={fleet.name}
                                className="w-12 h-8 object-contain shrink-0 drop-shadow-sm"
                              />
                              <span>{fleet.name}</span>
                            </div>
                          </td>

                          <td className="p-4 sm:p-5 text-gray-700 font-bold">
                            ₹{ratePerKm} / km
                          </td>
                          <td className="p-4 sm:p-5 text-gray-600">
                            ₹{baseFare.toLocaleString()}
                          </td>
                          <td className="p-4 sm:p-5 text-gray-600">
                            ₹{fleet.driverBata}
                          </td>
                          <td className="p-4 sm:p-5 text-right font-black text-gray-900 text-base">
                            <span className="text-[#7c2bea]">₹{totalFare.toLocaleString()}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* FOOTNOTE DISCLAIMER */}
              <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl text-xs text-gray-500 font-medium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7c2bea] shrink-0" />
                  <span>* Toll charges, state permits, and parking fees (if applicable) are extra at actuals.</span>
                </div>

                <a
                  href="/booking"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black uppercase text-[11px] tracking-wider rounded-xl transition-all inline-flex items-center gap-1.5 shrink-0 shadow-md active:scale-95"
                >
                  Proceed To Book <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
