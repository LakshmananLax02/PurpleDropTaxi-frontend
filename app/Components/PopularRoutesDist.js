"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

/* ============================================================================
 * ALL DISTRICTS & INTERSTATE ROUTES DATASET
 * (POPULAR / MAJOR HUBS AT THE TOP)
 * ========================================================================= */
const ALL_ROUTES = Object.entries({
  // Popular cities
  "Chennai Drop Taxi": {
    place: "Chennai Central",
    image: "/cities/city1.png",
  },

  "Coimbatore Drop Taxi": {
    place: "Marudhamalai Temple",
    image: "/cities/city2.png",
  },

  "Madurai Drop Taxi": {
    place: "Meenakshi Amman Temple",
    image: "/cities/city3.png",
  },

  "Tiruchirappalli Drop Taxi": {
    place: "Rockfort Temple",
    image: "/cities/city4.png",
  },

  "Salem Drop Taxi": {
    place: "Salem Hills View",
    image: "/cities/city5.png",
  },

  "Bengaluru Drop Taxi": {
    place: "Bengaluru City View",
    image: "/cities/city6.png",
  },

  // Major cities and tourist destinations
  "Puducherry Drop Taxi": {
    place: "Puducherry Rock Beach",
    image: "/cities/city7.png",
  },

  "Tirunelveli Drop Taxi": {
    place: "Nellaiappar Temple",
    image: "/cities/city8.png",
  },

  "Erode Drop Taxi": {
    place: "Cauvery River",
    image: "/cities/city9.png",
  },

  "Vellore Drop Taxi": {
    place: "Vellore Fort",
    image: "/cities/city10.png",
  },

  "Tiruppur Drop Taxi": {
    place: "Noyyal River",
    image: "/cities/city11.png",
  },

  "Thanjavur Drop Taxi": {
    place: "Brihadisvara Temple",
    image: "/cities/city12.png",
  },

  "Dindigul Drop Taxi": {
    place: "Dindigul Fort",
    image: "/cities/city13.png",
  },

  "Nilgiris / Ooty Drop Taxi": {
    place: "Ooty Lake",
    image: "/cities/city14.png",
  },

  "Kanyakumari Drop Taxi": {
    place: "Vivekananda Rock Memorial",
    image: "/cities/city15.png",
  },

  "Kochi Drop Taxi": {
    place: "Kochi Skyline",
    image: "/cities/city16.png",
  },

  "Trivandrum Drop Taxi": {
    place: "Padmanabhaswamy Temple",
    image: "/cities/city17.png",
  },

  // Other Tamil Nadu districts
  "Ariyalur Drop Taxi": {
    place: "Ariyalur Perumal Temple",
    image: "/cities/city18.png",
  },

  "Chengalpattu Drop Taxi": {
    place: "Chengalpattu Lake",
    image: "/cities/city19.png",
  },

  "Cuddalore Drop Taxi": {
    place: "Cuddalore Coastal View",
    image: "/cities/city20.png",
  },

  "Dharmapuri Drop Taxi": {
    place: "Dharmapuri City View",
    image: "/cities/city21.png",
  },

  "Kallakurichi Drop Taxi": {
    place: "Kallakurichi Landscape",
    image: "/cities/city22.png",
  },

  "Kanchipuram Drop Taxi": {
    place: "Vaikunta Perumal Temple",
    image: "/cities/city23.png",
  },

  "Karur Drop Taxi": {
    place: "Karur City View",
    image: "/cities/city24.png",
  },

  "Krishnagiri Drop Taxi": {
    place: "Krishnagiri Temple",
    image: "/cities/city25.png",
  },

  "Mayiladuthurai Drop Taxi": {
    place: "Mayuranathaswamy Temple",
    image: "/cities/city26.png",
  },

  "Nagapattinam Drop Taxi": {
    place: "Velankanni Basilica",
    image: "/cities/city27.png",
  },

  "Namakkal Drop Taxi": {
    place: "Namakkal Fort",
    image: "/cities/city28.png",
  },

  "Perambalur Drop Taxi": {
    place: "Ranjankudi Fort",
    image: "/cities/city29.png",
  },

  "Pudukkottai Drop Taxi": {
    place: "Viralimalai Murugan Temple",
    image: "/cities/city30.png",
  },

  "Ramanathapuram Drop Taxi": {
    place: "Ramanathaswamy Temple",
    image: "/cities/city31.png",
  },

  "Ranipet Drop Taxi": {
    place: "Delhi Gate, Arcot",
    image: "/cities/city32.png",
  },

  "Sivaganga Drop Taxi": {
    place: "Sivaganga",
    image: "/cities/city33.png",
  },

  "Tenkasi Drop Taxi": {
    place: "Kasi Viswanathar Temple",
    image: "/cities/city34.png",
  },

  "Theni Drop Taxi": {
    place: "Theni Western Ghats",
    image: "/cities/city35.png",
  },

  "Thoothukudi Drop Taxi": {
    place: "Our Lady of Snows Basilica",
    image: "/cities/city36.png",
  },

  "Tirupathur Drop Taxi": {
    place: "Yelagiri Hills",
    image: "/cities/city37.png",
  },

  "Tiruvallur Drop Taxi": {
    place: "Tiruvallur",
    image: "/cities/city38.png",
  },

  "Tiruvannamalai Drop Taxi": {
    place: "Arunachaleswarar Temple",
    image: "/cities/city39.png",
  },

  "Tiruvarur Drop Taxi": {
    place: "Thyagaraja Temple",
    image: "/cities/city40.png",
  },

  "Viluppuram Drop Taxi": {
    place: "Viluppuram",
    image: "/cities/city41.png",
  },

  "Virudhunagar Drop Taxi": {
    place: "Virudhunagar City",
    image: "/cities/city42.png",
  },

  // Kerala districts
  "Palakkad Drop Taxi": {
    place: "Palakkad",
    image: "/cities/city43.png",
  },

  "Kozhikode Drop Taxi": {
    place: "Kozhikode Beach",
    image: "/cities/city44.png",
  },

  "Wayanad Drop Taxi": {
    place: "Wayanad Landscape",
    image: "/cities/city45.png",
  },

  "Thrissur Drop Taxi": {
    place: "Thrissur",
    image: "/cities/city46.png",
  },

  "Kannur Drop Taxi": {
    place: "Kannur Skyline",
    image: "/cities/city47.png",
  },
}).map(([name, details]) => ({
  name,
  district: name.replace(/\s+Drop Taxi$/, ""),
  ...details,
}));

export default function PopularRoutes() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Show top 6 initial routes (Chennai, Coimbatore, Madurai, Trichy, Salem, Bengaluru), or all when expanded
  const visibleRoutes = showAll ? ALL_ROUTES : ALL_ROUTES.slice(0, 6);

  return (
    <section className="w-full bg-[#f8f6fc] py-10 px-4 sm:px-6 lg:px-8 font-sans select-none">
      
      {/* 🌟 KEYFRAME ANIMATION FOR RUNNING INNER DASH BORDER */}
      <style jsx global>{`
        @keyframes dashMove {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- SECTION TITLE --- */}
        <div className="border-b border-purple-100 pb-4">
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Popular Routes in <span className="text-[#7c3aed]">Tamil Nadu & Interstate</span>
          </h2>
        </div>

        {/* --- CARDS GRID (INITIAL 6 TOP POPULAR CARDS) --- */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {visibleRoutes.map((routeObj, idx) => {
              const routeSlug = routeObj.name.toLowerCase().replace(/\s+/g, "-");
              const isHovered = hoveredIdx === idx;

              return (
                <motion.div
                  key={routeObj.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/booking?route=${routeSlug}`}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="relative group flex items-center justify-start gap-3 w-full p-2.5 rounded-xl cursor-pointer text-decoration-none transition-all duration-300 overflow-hidden"
                    style={{
                      transform: isHovered ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
                    }}
                  >
                    
                    {/* THICK SOLID OUTER BORDER */}
                    <div 
                      className="absolute inset-0 rounded-xl transition-all duration-300 z-0 bg-white"
                      style={{
                        border: isHovered ? "3px solid #7c3aed" : "3.5px solid #7c2bea",
                        boxShadow: isHovered 
                          ? "0 0 0 3px rgba(124, 43, 234, 0.2), 0 8px 16px -4px rgba(124, 43, 234, 0.2)"
                          : "0 2px 6px -1px rgba(124, 43, 234, 0.08)"
                      }}
                    />

                    {/* RUNNING INNER DASH TRACE */}
                    <svg 
                      className="absolute inset-0 w-full h-full pointer-events-none rounded-xl z-0 overflow-visible"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="calc(100% - 4px)"
                        height="calc(100% - 4px)"
                        rx="10"
                        fill="none"
                        stroke="#b16cff"
                        strokeWidth="2"
                        strokeDasharray="16 12"
                        style={{
                          animation: "dashMove 4s linear infinite",
                          opacity: isHovered ? 0.9 : 0.4
                        }}
                      />
                    </svg>

                    {/* LEFT IMAGE */}
                    <div className="relative z-10 w-16 h-14 rounded-lg overflow-hidden shrink-0 border border-purple-100 bg-purple-50">
                      <img
                        src={routeObj.image}
                        alt={routeObj.district}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* RIGHT DISTRICT TEXT */}
                    <div className="relative z-10 flex flex-col justify-center min-w-0 pr-2">
                      <h3 className="text-sm font-black text-gray-900 truncate tracking-tight">
                        {routeObj.district}
                      </h3>
                      <p className="text-[11px] font-extrabold text-[#7c3aed] truncate uppercase tracking-wider">
                        {routeObj.name}
                      </p>
                    </div>

                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* --- VIEW MORE / SHOW LESS BUTTON --- */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 bg-white hover:bg-purple-50 border-2 border-[#7c3aed] text-[#7c3aed] font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
          >
            {showAll ? (
              <>Show Less Routes <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>View All Routes ({ALL_ROUTES.length}) <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
