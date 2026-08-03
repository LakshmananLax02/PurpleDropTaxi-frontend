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
  // Popular cities
  {
  "Chennai Drop Taxi": {
    place: "Chennai Central",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/32/Chennai_Central.jpg",
  },

  "Coimbatore Drop Taxi": {
    place: "Marudhamalai Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Maruthamalai_Rajagopuram_1.jpg",
  },

  "Madurai Drop Taxi": {
    place: "Meenakshi Amman Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Meenakshi_Amman_West_Tower.jpg",
  },

  "Tiruchirappalli Drop Taxi": {
    place: "Rockfort Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/fb/Rock_Fortress_-_Tiruchirappalli_-_India.JPG",
  },

  "Salem Drop Taxi": {
    place: "Salem Hills View",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/92/Salem_city_from_Hills.jpg",
  },

  "Bengaluru Drop Taxi": {
    place: "Bengaluru City View",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/cd/View_from_Visvesvaraya_Industrial_and_Technological_Museum_%282025%29_02.jpg",
  },

  // Major cities and tourist destinations
  "Puducherry Drop Taxi": {
    place: "Puducherry Rock Beach",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Pondicherry-Rock_beach_aerial_view.jpg",
  },

  "Tirunelveli Drop Taxi": {
    place: "Nellaiappar Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/9a/Nellaiappar_temple_tower.jpg",
  },

  "Erode Drop Taxi": {
    place: "Cauvery River",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Cauvery_at_Erode.JPG",
  },

  "Vellore Drop Taxi": {
    place: "Vellore Fort",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/ea/Vellorefort.jpg",
  },

  "Tiruppur Drop Taxi": {
    place: "Noyyal River",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/37/Noyyal_River_in_Tiruppur_JEG0334.jpg",
  },

  "Thanjavur Drop Taxi": {
    place: "Brihadisvara Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/81/Thanjavur_2.jpg",
  },

  "Dindigul Drop Taxi": {
    place: "Dindigul Fort",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/53/Temple_atop_the_Dindigul_Fort.jpg",
  },

  "Nilgiris / Ooty Drop Taxi": {
    place: "Ooty Lake",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/db/Ooty_lake.jpg",
  },

  "Kanyakumari Drop Taxi": {
    place: "Vivekananda Rock Memorial",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5b/Vivekananda_Rock_Memorial%2C_Kanyakumari.jpg",
  },

  "Kochi Drop Taxi": {
    place: "Kochi Skyline",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Kochi_Skyline.jpg",
  },

  "Trivandrum Drop Taxi": {
    place: "Padmanabhaswamy Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/ad/Padmanabhaswamy_Temple_Thiruvananthapuram.jpg",
  },

  // Other Tamil Nadu districts
  "Ariyalur Drop Taxi": {
    place: "Ariyalur Perumal Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/60/Ariyalur_perumal_temple.jpg",
  },

  "Chengalpattu Drop Taxi": {
    place: "Chengalpattu Lake",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/35/Chengalpat_lake.jpg",
  },

  "Cuddalore Drop Taxi": {
    place: "Cuddalore Coastal View",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/48/Early_morning_in_cuddalore%2C_india.jpg",
  },

  "Dharmapuri Drop Taxi": {
    place: "Dharmapuri City View",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Aerial_view_dharmapuri.jpg",
  },

  "Kallakurichi Drop Taxi": {
    place: "Kallakurichi Landscape",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/78/Kallai.jpg",
  },

  "Kanchipuram Drop Taxi": {
    place: "Vaikunta Perumal Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c2/Parameswara_Vinnagaram.JPG",
  },

  "Karur Drop Taxi": {
    place: "Karur City View",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/ba/City_of_karur.jpg",
  },

  "Krishnagiri Drop Taxi": {
    place: "Krishnagiri Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Krishnagiri_temple.jpg",
  },

  "Mayiladuthurai Drop Taxi": {
    place: "Mayuranathaswamy Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/21/Gopura_of_the_Mayuranathaswamy_Temple.jpg",
  },

  "Nagapattinam Drop Taxi": {
    place: "Velankanni Basilica",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/93/Velankanni_Church_2026.jpg",
  },

  "Namakkal Drop Taxi": {
    place: "Namakkal Fort",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/9c/Namakkal_Fort_%282%29.jpg",
  },

  "Perambalur Drop Taxi": {
    place: "Ranjankudi Fort",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Ranjankudi_Fort-Perambalur_district-Tamil_Nadu.jpg",
  },

  "Pudukkottai Drop Taxi": {
    place: "Viralimalai Murugan Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/Viralimalai_Murugan_Temple.jpg",
  },

  "Ramanathapuram Drop Taxi": {
    place: "Ramanathaswamy Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/84/Ramanathaswamy_temple7.JPG",
  },

  "Ranipet Drop Taxi": {
    place: "Delhi Gate, Arcot",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Delhi_gate_-_river_side_view.jpg",
  },

  "Sivaganga Drop Taxi": {
    place: "Sivaganga",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Government_medical_college%2C_Sivaganga.jpg",
  },

  "Tenkasi Drop Taxi": {
    place: "Kasi Viswanathar Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Kasi_Viswanathar_temple%2C_Tenkasi_2014_%2813%29.jpg",
  },

  "Theni Drop Taxi": {
    place: "Theni Western Ghats",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/54/Theniviewfromforestroad1.jpg",
  },

  "Thoothukudi Drop Taxi": {
    place: "Our Lady of Snows Basilica",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Our_lady_of_snows_basilica.JPG",
  },

  "Tirupathur Drop Taxi": {
    place: "Yelagiri Hills",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Yelagiri.jpg",
  },

  "Tiruvallur Drop Taxi": {
    place: "Tiruvallur",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Tiruvallur_HD_Image.jpg",
  },

  "Tiruvannamalai Drop Taxi": {
    place: "Arunachaleswarar Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Tiruvannamalai_Montage.jpg",
  },

  "Tiruvarur Drop Taxi": {
    place: "Thyagaraja Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Thyagarajar_temple%2C_Tiruvarur_%289%29.jpg",
  },

  "Viluppuram Drop Taxi": {
    place: "Viluppuram",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c6/Glory_Of_Viluppuram_2.jpg",
  },

  "Virudhunagar Drop Taxi": {
    place: "Virudhunagar City",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/11/%E0%AE%B5%E0%AE%BF%E0%AE%B0%E0%AF%81%E0%AE%A4%E0%AF%81%E0%AE%A8%E0%AE%95%E0%AE%B0%E0%AF%8D_%28%E0%AE%B5%E0%AE%BF%E0%AE%B0%E0%AF%81%E0%AE%A4%E0%AF%81%E0%AE%AA%E0%AE%9F%E0%AF%8D%E0%AE%9F%E0%AE%BF%29.JPG",
  },

  // Kerala districts
  "Palakkad Drop Taxi": {
    place: "Palakkad",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/81/Palakkad_City_collage.jpg",
  },

  "Kozhikode Drop Taxi": {
    place: "Kozhikode Beach",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/45/Kozhikode_beach_kites.jpg",
  },

  "Wayanad Drop Taxi": {
    place: "Wayanad Landscape",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Blue%2C_Green_%26_White.jpg",
  },

  "Thrissur Drop Taxi": {
    place: "Thrissur",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/04/JJP_112.jpg",
  },

  "Kannur Drop Taxi": {
    place: "Kannur Skyline",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/Kannur_Skyline_3.jpg",
  },
}
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