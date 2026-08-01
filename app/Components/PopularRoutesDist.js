"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

/* ============================================================================
 * ALL DISTRICTS & INTERSTATE ROUTES DATASET
 * (POPULAR / MAJOR HUBS AT THE TOP)
 * ========================================================================= */
const ALL_ROUTES = [
  // --- TOP POPULAR & HIGH-DEMAND HUBS (FIRST 6 PREVIEWED INITIALLY) ---
  { name: "Chennai Drop Taxi", district: "Chennai", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Coimbatore Drop Taxi", district: "Coimbatore", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Madurai Drop Taxi", district: "Madurai", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Tiruchirappalli Drop Taxi", district: "Tiruchirappalli (Trichy)", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Salem Drop Taxi", district: "Salem", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Bengaluru Drop Taxi", district: "Bengaluru", state: "Karnataka", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },

  // --- MAJOR CITIES & TOURIST DESTINATIONS ---
  { name: "Puducherry Drop Taxi", district: "Puducherry", state: "Union Territory", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Tirunelveli Drop Taxi", district: "Tirunelveli", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Erode Drop Taxi", district: "Erode", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Vellore Drop Taxi", district: "Vellore", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Tiruppur Drop Taxi", district: "Tiruppur", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Thanjavur Drop Taxi", district: "Thanjavur", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Dindigul Drop Taxi", district: "Dindigul", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Nilgiris / Ooty Drop Taxi", district: "Nilgiris (Ooty)", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Kanyakumari Drop Taxi", district: "Kanyakumari", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Kochi Drop Taxi", district: "Ernakulam / Kochi", state: "Kerala", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Trivandrum Drop Taxi", district: "Thiruvananthapuram", state: "Kerala", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },

  // --- OTHER TAMIL NADU DISTRICTS ---
  { name: "Ariyalur Drop Taxi", district: "Ariyalur", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Chengalpattu Drop Taxi", district: "Chengalpattu", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Cuddalore Drop Taxi", district: "Cuddalore", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Dharmapuri Drop Taxi", district: "Dharmapuri", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Kallakurichi Drop Taxi", district: "Kallakurichi", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Kanchipuram Drop Taxi", district: "Kanchipuram", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Karur Drop Taxi", district: "Karur", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Krishnagiri Drop Taxi", district: "Krishnagiri", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Mayiladuthurai Drop Taxi", district: "Mayiladuthurai", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Nagapattinam Drop Taxi", district: "Nagapattinam", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Namakkal Drop Taxi", district: "Namakkal", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Perambalur Drop Taxi", district: "Perambalur", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Pudukkottai Drop Taxi", district: "Pudukkottai", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Ramanathapuram Drop Taxi", district: "Ramanathapuram", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Ranipet Drop Taxi", district: "Ranipet", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Sivaganga Drop Taxi", district: "Sivaganga", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Tenkasi Drop Taxi", district: "Tenkasi", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Theni Drop Taxi", district: "Theni", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Thoothukudi Drop Taxi", district: "Thoothukudi", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Tirupathur Drop Taxi", district: "Tirupathur", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Tiruvallur Drop Taxi", district: "Tiruvallur", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Tiruvannamalai Drop Taxi", district: "Tiruvannamalai", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Tiruvarur Drop Taxi", district: "Tiruvarur", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Viluppuram Drop Taxi", district: "Viluppuram", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Virudhunagar Drop Taxi", district: "Virudhunagar", state: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },

  // --- KERALA MAIN DISTRICTS ---
  { name: "Palakkad Drop Taxi", district: "Palakkad", state: "Kerala", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Kozhikode Drop Taxi", district: "Kozhikode", state: "Kerala", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Wayanad Drop Taxi", district: "Wayanad", state: "Kerala", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Thrissur Drop Taxi", district: "Thrissur", state: "Kerala", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" },
  { name: "Kannur Drop Taxi", district: "Kannur", state: "Kerala", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop" }
];

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