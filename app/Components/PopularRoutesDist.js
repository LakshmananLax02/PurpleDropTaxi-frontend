"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car } from "lucide-react";

/* ============================================================================
 * ALL DISTRICT ROUTES DATASET
 * ========================================================================= */
const DISTRICT_ROUTES = [
  "Madurai Drop Taxi",
  "Chennai Drop Taxi",
  "Ariyalur Drop Taxi",
  "Chengalpattu Drop Taxi",
  "Coimbatore Drop Taxi",
  "Cuddalore Drop Taxi",
  "Dharmapuri Drop Taxi",
  "Dindigul Drop Taxi",
  "Erode Drop Taxi",
  "Kallakurichi Drop Taxi",
  "Kanchipuram Drop Taxi",
  "Kanyakumari Drop Taxi",
  "Krishnagiri Drop Taxi",
  "Mayiladuthurai Drop Taxi",
  "Nagapattinam Drop Taxi",
  "Namakkal Drop Taxi",
  "Nilgiris Drop Taxi",
  "Perambalur Drop Taxi",
  "Pudukkottai Drop Taxi",
  "Ranipet Drop Taxi",
  "Ramanathapuram Drop Taxi",
  "Salem Drop Taxi",
  "Sivaganga Drop Taxi",
  "Tenkasi Drop Taxi",
  "Thanjavur Drop Taxi",
  "Theni Drop Taxi",
  "Thoothukudi Drop Taxi",
  "Tiruchirappalli Drop Taxi",
  "Tirunelveli Drop Taxi",
  "Tirupathur Drop Taxi",
  "Tiruppur Drop Taxi",
  "Tiruvallur Drop Taxi",
  "Tiruvannamalai Drop Taxi",
  "Tiruvarur Drop Taxi",
  "Vellore Drop Taxi",
  "Virudhunagar Drop Taxi",
  "Kodaikanal Drop Taxi",
  "Rameswaram Drop Taxi",
  "Kumbakonam Drop Taxi",
  "Bengaluru Drop Taxi",
  "Puducherry Drop Taxi",
];

export default function PopularRoutes() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="w-full bg-[#f8f6fc] py-10 px-4 sm:px-2 lg:px-8 font-sans select-none">
      
      {/* 🌟 KEYFRAME ANIMATION FOR THE RUNNING INNER DASH BORDER */}
      <style jsx global>{`
        @keyframes dashMove {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- SECTION TITLE --- */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="section-title-pattern">
            Popular <span>Routes</span>
          </h2>
        </div>

        {/* --- 4-COLUMN RESPONSIVE GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {DISTRICT_ROUTES.map((route, idx) => {
            const routeSlug = route.toLowerCase().replace(/\s+/g, "-");
            const isHovered = hoveredIdx === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: (idx % 8) * 0.02 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/booking?route=${routeSlug}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative group flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl cursor-pointer text-decoration-none transition-all duration-300"
                  style={{
                    transform: isHovered ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
                  }}
                >
                  
                  {/* 1. THICK SOLID OUTER BORDER (THICK PURPLE BEFORE HOVER -> THICK WHITE ON HOVER) */}
                  <div 
                    className="absolute inset-0 rounded-xl transition-all duration-300 z-0"
                    style={{
                      backgroundColor: isHovered ? "#7c2bea" : "#ffffff",
                      border: isHovered ? "3px solid #ffffff" : "4px solid #7c2bea", // Thick 3px border
                      boxShadow: isHovered 
                        ? "0 0 0 4px rgba(124, 43, 234, 0.4), 0 10px 20px -5px rgba(124, 43, 234, 0.4)"
                        : "0 2px 6px -1px rgba(124, 43, 234, 0.12)"
                    }}
                  />

                  {/* 2. RUNNING INNER DASH TRACE */}
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
                      stroke={isHovered ? "#ffffff" : "#b16cff"}
                      strokeWidth="2"
                      strokeDasharray="16 12"
                      style={{
                        animation: "dashMove 4s linear infinite",
                        opacity: isHovered ? 0.9 : 0.5
                      }}
                    />
                  </svg>

                  {/* 3. TAXI ICON */}
                  <Car 
                    className="w-4 h-4 shrink-0 relative z-10 transition-all duration-300"
                    style={{
                      color: isHovered ? "#ffffff" : "#7c2bea",
                      transform: isHovered ? "scale(1.15) translateX(1px)" : "scale(1)"
                    }}
                  />

                  {/* 4. ROUTE TEXT LABEL */}
                  <span 
                    className="relative z-10 text-xs sm:text-sm font-bold truncate transition-colors duration-300"
                    style={{
                      color: isHovered ? "#ffffff" : "#1e293b",
                    }}
                  >
                    {route}
                  </span>

                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
