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
  Info,
  Sparkles
} from "lucide-react";

/* ============================================================================
 * FLEET RATES DATASET (PER KM RATES FOR ONE-WAY & ROUND TRIP)
 * ========================================================================= */
const FLEETS = [
  {
    id: "sedan",
    name: "Compact Sedan",
    models: "Etios, Dzire, Aura",
    seats: "4 Passengers",
    luggage: "2 Bags",
    oneWayRate: 13,    // ₹13 / km for One-Way
    roundTripRate: 11, // ₹11 / km for Round Trip
    driverBata: 400,   // Fixed driver bata per day
    badge: "Budget Friendly",
  },
  {
    id: "prime-sedan",
    name: "Prime Sedan",
    models: "Ciaz, Sunny, Honda City",
    seats: "4 Passengers",
    luggage: "3 Bags",
    oneWayRate: 15,    // ₹15 / km
    roundTripRate: 13, // ₹13 / km
    driverBata: 500,
    badge: "Extra Comfort",
  },
  {
    id: "suv",
    name: "Executive SUV",
    models: "Ertiga, Triber, Carens",
    seats: "6 Passengers",
    luggage: "4 Bags",
    oneWayRate: 18,    // ₹18 / km
    roundTripRate: 15, // ₹15 / km
    driverBata: 600,
    badge: "Family Favorite",
  },
  {
    id: "prime-suv",
    name: "Prime SUV",
    models: "Innova Crysta, Hycross",
    seats: "7 Passengers",
    luggage: "5 Bags",
    oneWayRate: 22,    // ₹22 / km
    roundTripRate: 18, // ₹18 / km
    driverBata: 700,
    badge: "Luxury Cruiser",
  }
];

const QUICK_DISTANCES = [100, 250, 400, 550];

export default function FareCalculator() {
  const [tripType, setTripType] = useState("oneWay"); // "oneWay" or "roundTrip"
  const [kilometers, setKilometers] = useState(250);   // Default 250 km
  const [selectedFleet, setSelectedFleet] = useState("sedan");
  const [showTable, setShowTable] = useState(false);

  // Billable Distance: One-Way is 1x, Round Trip doubles the distance
  const billableKm = tripType === "roundTrip" ? kilometers * 2 : kilometers;

  // Estimated Travel Time Calculation (~50 km/hr average highway speed)
  const estimatedHours = Math.floor(kilometers / 50);
  const estimatedMinutes = Math.round(((kilometers % 50) / 50) * 60);

  // Helper function to calculate total fare for any fleet item
  const calculateFare = (fleet) => {
    const ratePerKm = tripType === "oneWay" ? fleet.oneWayRate : fleet.roundTripRate;
    const baseFare = billableKm * ratePerKm;
    const totalFare = baseFare + fleet.driverBata;
    return { ratePerKm, baseFare, totalFare };
  };

  const handleGetEstimation = () => {
    setShowTable(true);
    setTimeout(() => {
      document.getElementById("estimation-table")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="w-full bg-[#f8fafc] py-16 px-4 sm:px-6 lg:px-8 font-sans select-none relative overflow-hidden">
      
      {/* 🌟 AMBIENT GLOW EFFECTS */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">

        {/* --- 1. SECTION HEADER --- */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-purple-200 text-[#7c3aed] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md shadow-purple-500/10 backdrop-blur-md">
            <Calculator className="w-3.5 h-3.5 text-[#7c3aed]" /> Instant Fare Estimator
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Calculate Your <span className="text-[#7c3aed]">Highway Trip Fare</span>
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">
            Type your travel distance in kilometers below to generate instant, transparent price estimates.
          </p>
        </div>

        {/* --- 2. MAIN CALCULATOR CARD --- */}
        <div className="bg-white border-2 border-purple-100/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-purple-500/10 space-y-8">
          
          {/* 💡 TOP INTIMATION BANNER */}
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex items-center gap-3 text-purple-950 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-[#7c3aed] text-white flex items-center justify-center shrink-0 shadow-md">
              <Info className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-bold leading-relaxed">
              <span className="text-[#7c3aed] font-black uppercase tracking-wider">How To Check:</span> Enter your trip distance in kilometers below to instantly preview fare estimations across all fleet options!
            </p>
          </div>

          {/* TABS: ONE-WAY vs ROUND TRIP */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-gray-200/80 w-full max-w-md shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setTripType("oneWay");
                  setShowTable(false);
                }}
                className={`flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                  tripType === "oneWay"
                    ? "bg-[#7c3aed] text-white shadow-lg shadow-purple-600/30 scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                100% One-Way Drop
              </button>
              <button
                type="button"
                onClick={() => {
                  setTripType("roundTrip");
                  setShowTable(false);
                }}
                className={`flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                  tripType === "roundTrip"
                    ? "bg-[#7c3aed] text-white shadow-lg shadow-purple-600/30 scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Round Trip
              </button>
            </div>
          </div>

          {/* INPUT FIELDS & QUICK METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* KILOMETER INPUT WITH CLEAR INTIMATION & GLOW */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="km-input" className="block text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#7c3aed]" /> Enter Distance
                </label>

                {/* Animated Pulsing Hint Badge */}
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#7c3aed] bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 animate-pulse">
                  <Navigation className="w-3 h-3" /> Type KMs Below
                </span>
              </div>

              {/* Input Wrapper with Ring Glow */}
              <div className="relative group">
                <input
                  id="km-input"
                  type="number"
                  min="10"
                  max="3000"
                  placeholder="e.g. 250"
                  value={kilometers}
                  onChange={(e) => {
                    setKilometers(Math.max(1, Number(e.target.value)));
                    setShowTable(false);
                  }}
                  className="w-full bg-slate-50 border-2 border-purple-200 focus:border-[#7c3aed] focus:bg-white focus:ring-4 focus:ring-purple-500/15 text-xl font-black text-gray-900 rounded-2xl p-4 pr-16 outline-none transition-all shadow-md shadow-purple-500/5 group-hover:border-purple-400"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-[#7c3aed] bg-purple-100/80 border border-purple-200 px-2.5 py-1 rounded-lg">
                  KM
                </span>
              </div>

              {/* Quick Distance Preset Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Preset KMs:</span>
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
                        ? "bg-[#7c3aed] text-white border-[#7c3aed] shadow-md shadow-purple-500/20"
                        : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                    }`}
                  >
                    {dist} KM
                  </button>
                ))}
              </div>
            </div>

            {/* BILLABLE DISTANCE DISPLAY CARD */}
            <div className="bg-purple-50/70 border-2 border-purple-100 p-4 sm:p-5 rounded-2xl flex items-center gap-4 shadow-md shadow-purple-500/5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-[#7c3aed] flex items-center justify-center shrink-0 shadow-sm">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-purple-900">
                  Billable Mileage
                </p>
                <p className="text-xl font-black text-gray-900">
                  {billableKm} <span className="text-xs font-bold text-gray-500">KM Total</span>
                </p>
                {tripType === "roundTrip" && (
                  <p className="text-[10px] text-purple-700 font-bold">(2x Round Trip Distance)</p>
                )}
              </div>
            </div>

            {/* ESTIMATED DURATION DISPLAY CARD */}
            <div className="bg-purple-50/70 border-2 border-purple-100 p-4 sm:p-5 rounded-2xl flex items-center gap-4 shadow-md shadow-purple-500/5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-[#7c3aed] flex items-center justify-center shrink-0 shadow-sm">
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
              <Sparkles className="w-4 h-4 text-[#7c3aed]" /> Fleet Fare Preview for {kilometers} KM:
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
                        ? "bg-purple-50/90 border-[#7c3aed] shadow-xl shadow-purple-500/15 -translate-y-1"
                        : "bg-white border-gray-100 hover:border-purple-300 hover:shadow-lg hover:shadow-slate-200/50"
                    }`}
                  >
                    {/* Badge */}
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md self-start mb-2 ${
                      isSelected ? "bg-[#7c3aed] text-white shadow-sm" : "bg-slate-100 text-gray-600 border border-gray-200"
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
                        <span className="text-[#7c3aed] font-black">₹{ratePerKm} / KM</span>
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
              className="px-10 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-600/30 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              Get Full Tariff Estimation Table <ChevronDown className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* --- 4. DETAILED ESTIMATION TABLE (TRIGGERS ON CLICK) --- */}
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
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Complete Tariff Breakdown
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                    Estimated Comparison for {kilometers} KM ({tripType === "oneWay" ? "One-Way Drop" : "Round Trip"})
                  </h3>
                </div>
                <div className="text-xs font-bold text-gray-500 bg-slate-50 px-4 py-2 rounded-xl border border-gray-200">
                  Estimated Duration: <span className="text-gray-900 font-black">{estimatedHours} Hours {estimatedMinutes} Mins</span>
                </div>
              </div>

              {/* TABLE CONTAINER */}
              <div className="overflow-x-auto rounded-2xl border-2 border-gray-100 shadow-inner">
                <table className="w-full min-w-[650px] text-left text-xs sm:text-sm text-gray-700 table-fixed">
                  <thead className="bg-purple-50 text-[#7c3aed] font-black uppercase tracking-wider text-[11px] border-b-2 border-purple-100">
                    <tr>
                      <th className="p-4 sm:p-5 w-[25%]">Fleet Category</th>
                      <th className="p-4 sm:p-5 w-[15%]">Rate / KM</th>
                      <th className="p-4 sm:p-5 w-[20%]">Base Fare ({billableKm} KM)</th>
                      <th className="p-4 sm:p-5 w-[15%]">Driver Bata</th>
                      <th className="p-4 sm:p-5 w-[25%] text-right">Total Est. Fare</th>
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
                          <td className="p-4 sm:p-5 font-black text-gray-900 flex items-center gap-2">
                            <Car className="w-4 h-4 text-[#7c3aed]" />
                            <span>{fleet.name}</span>
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
                            <span className="text-[#7c3aed]">₹{totalFare.toLocaleString()}</span>
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
                  <ShieldCheck className="w-4 h-4 text-[#7c3aed] shrink-0" />
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