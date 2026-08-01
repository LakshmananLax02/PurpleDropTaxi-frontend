"use client";

import React, { useRef } from "react";
import { MapPin, ChevronLeft, ChevronRight, ArrowRight, Clock, Navigation } from "lucide-react";

/* ============================================================================
 * 1. POPULAR ROUTES DATASET
 * ========================================================================= */
const POPULAR_ROUTES = [
  {
    id: "chennai-bangalore",
    origin: "Chennai",
    destination: "Bangalore",
    distance: "350 KM",
    duration: "6 Hrs",
    fare: "4,350",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "coimbatore-chennai",
    origin: "Coimbatore",
    destination: "Chennai",
    distance: "500 KM",
    duration: "8 Hrs",
    fare: "4,850",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "coimbatore-ooty",
    origin: "Coimbatore",
    destination: "Ooty",
    distance: "90 KM",
    duration: "2.5 Hrs",
    fare: "1,750",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "madurai-chennai",
    origin: "Madurai",
    destination: "Chennai",
    distance: "450 KM",
    duration: "7.5 Hrs",
    fare: "4,250",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "coimbatore-munnar",
    origin: "Coimbatore",
    destination: "Munnar",
    distance: "160 KM",
    duration: "4.5 Hrs",
    fare: "2,450",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "chennai-pondicherry",
    origin: "Chennai",
    destination: "Pondicherry",
    distance: "150 KM",
    duration: "3 Hrs",
    fare: "1,950",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop",
  },
];

export default function PopularRoutes() {
  const scrollRef = useRef(null);

  /* Scroll Carousel Controls */
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-[#f8f6fc] py-5 px-4 md:px-8 relative overflow-hidden font-sans select-none">
      
      {/* Embedded CSS - Fixed Stacking, Hover Animation, and Mobile Centering */}
      <style jsx global>{`
        /* Hide scrollbars */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* CAROUSEL TRACK - snap behavior */
        .route-track {
          scroll-snap-type: x mandatory;
        }

        /* On mobile (one card visible at a time), add side padding so the
           active card can rest dead-center in the viewport, and snap each
           card to that center point. On larger screens (multiple cards
           visible) we drop the centering padding since it isn't needed. */
        @media (max-width: 767px) {
          .route-track {
            padding-left: calc(50% - 110px); /* 110px = half of 220px card width */
            padding-right: calc(50% - 110px);
          }
        }

        /* CARD CONTAINER */
        .glow-route-card {
          position: relative;
          width: 220px;
          height: 295px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3px; /* Creates room for glowing border */
          border-radius: 14px;
          cursor: pointer;
          color: #0f172a;
          flex-shrink: 0;
          transition: all 0.4s ease;
          scroll-snap-align: center;
        }

        /* ROTATING GRADIENT BACKGROUND LAYER */
        .glow-route-card::before {
          content: '';
          position: absolute;
          inset: 0;
          left: -3px;
          margin: auto;
          width: 226px;
          height: 301px;
          border-radius: 16px;
          background: linear-gradient(-45deg, #5815b7 0%, #7c2bea 50%, #1bc5d8 100%);
          z-index: 1;
          pointer-events: none;
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* AMBIENT BLUR GLOW AURA */
        .glow-route-card::after {
          content: "";
          z-index: 0;
          position: absolute;
          inset: 0;
          background: linear-gradient(-45deg, #7c2bea 0%, #1bc5d8 100%);
          transform: translate3d(0, 0, 0) scale(0.95);
          filter: blur(18px);
          opacity: 0.35;
          transition: filter 0.5s ease, opacity 0.5s ease;
        }

        /* HOVER INTERACTIONS */
        .glow-route-card:hover::after {
          filter: blur(28px);
          opacity: 0.8;
        }

        .glow-route-card:hover::before {
          transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c2bea] px-3.5 py-1 rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#7c2bea]" /> Top Outstation Routes
            </div>
            <h2 className="section-title-pattern">
              Popular <span className="text-[#7c2bea]">One-Way Drop Routes</span>
            </h2>
          </div>

          <a 
            href="#all-routes" 
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#7c2bea] hover:text-[#5815b7] transition-colors group"
          >
            <span>View All Routes</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* --- CAROUSEL WITH PREV / NEXT ARROWS --- */}
        <div className="relative group/carousel px-2 py-6">
          
          {/* PREVIOUS BUTTON */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Previous route"
            className="btn btn-primary btn-icon absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 shadow-lg shadow-purple-600/30 border-2 border-white"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* NEXT BUTTON */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Next route"
            className="btn btn-primary btn-icon absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 shadow-lg shadow-purple-600/30 border-2 border-white"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* CAROUSEL TRACK */}
          <div
            ref={scrollRef}
            className="route-track flex items-center gap-8 overflow-x-auto no-scrollbar py-6 px-4 scroll-smooth"
          >
            {POPULAR_ROUTES.map((route) => (
              <div key={route.id} className="glow-route-card group/card">
                
                {/* Inner Card Content Plate (Sits above glowing pseudo elements) */}
                <div className="relative z-10 w-full h-full bg-white rounded-[12px] overflow-hidden flex flex-col justify-between">
                  
                  {/* Top Image */}
                  <div className="relative h-32 w-full overflow-hidden shrink-0">
                    <img
                      src={route.image}
                      alt={`${route.origin} to ${route.destination}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide border border-white/20">
                      Outstation
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 tracking-tight leading-snug line-clamp-1">
                        {route.origin} <span className="text-[#7c2bea]">→</span> {route.destination}
                      </h3>

                      <div className="mt-2 flex items-center gap-2.5 text-[10px] font-bold text-gray-400">
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-[#7c2bea]" /> {route.distance}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#7c2bea]" /> {route.duration}
                        </span>
                      </div>
                    </div>

                    {/* Footer Pricing & Added Button */}
                    <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase text-gray-400 block -mb-1">
                          Starting from
                        </span>
                        <span className="text-lg font-black text-[#7c2bea]">
                          ₹{route.fare}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider shrink-0"
                      >
                        Book Route →
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
