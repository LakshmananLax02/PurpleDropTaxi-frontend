"use client";

import React, { useRef } from "react";
import { User, Users, HeartHandshake, Plane, Briefcase, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

/* ============================================================================
 * 1. TRAVELLERS DATASET
 * ========================================================================= */
const TRAVELLERS = [
  {
    id: "solo",
    title: "Travelling Alone",
    icon: User,
    frontImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop",
    shortDesc: "Safe rides with verified drivers and live trip sharing.",
    backDesc: "Enhanced safety protocols for solo travelers, 24/7 route tracking, and verified chauffeurs.",
  },
  {
    id: "family",
    title: "Family Trips",
    icon: Users,
    frontImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop",
    shortDesc: "Spacious cars for a comfortable family journey.",
    backDesc: "Ample luggage space, child-friendly atmosphere, and smooth highway SUVs & Innovas.",
  },
  {
    id: "senior",
    title: "Senior Citizens",
    icon: HeartHandshake,
    frontImage: "https://images.unsplash.com/photo-1581579438747-1dc8d1e2729f?q=80&w=600&auto=format&fit=crop",
    shortDesc: "Extra care and assistance for elderly travellers.",
    backDesc: "Patient chauffeurs trained to assist with boarding, comfort stops, and smooth driving.",
  },
  {
    id: "airport",
    title: "Airport Transfers",
    icon: Plane,
    frontImage: "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=600&auto=format&fit=crop",
    shortDesc: "On-time airport pickups and flight tracking.",
    backDesc: "Real-time flight status tracking with complimentary wait periods for seamless terminal pickups.",
  },
  {
    id: "business",
    title: "Business Travel",
    icon: Briefcase,
    frontImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
    shortDesc: "Reliable, professional and punctual for corporate trips.",
    backDesc: "Executive sedans equipped for work on the go with digital billing and absolute punctuality.",
  },
];

export default function DesignedForTravellers() {
  const scrollRef = useRef(null);

  /* Scroll Carousel Controls (mobile only) */
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.9;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-[#f8f6fc] py-16 px-4 md:px-8 relative overflow-hidden font-sans">
      
      {/* Embedded CSS - Reduced Card Height + Mobile Carousel / Desktop Grid */}
      <style jsx global>{`
        /* Hide scrollbars */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* --- 3D FLIP CARD LAYOUT --- */
        .flip-card {
          width: 100%;
          height: 300px; /* Reduced height from 380px to eliminate internal gaps */
          perspective: 1000px;
        }

        .flip-card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .flip-card:hover .flip-card-inner,
        .flip-card:active .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          border: 3px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.06);
        }

        .flip-card-front {
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          transform: rotateY(0deg);
        }

        .flip-card-back {
          background: linear-gradient(135deg, #5815b7 0%, #3d0c79 100%);
          color: #ffffff;
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transform: rotateY(180deg);
          border-color: #5815b7;
          box-shadow: 0 15px 30px -10px rgba(109, 40, 217, 0.3);
        }

        /* --- RESPONSIVE TRACK: horizontal centered carousel on mobile,
               static grid from the sm breakpoint upward --- */
        .travellers-track {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-left: calc(50% - 130px); /* 130px = half of the 260px mobile card width */
          padding-right: calc(50% - 130px);
        }

        .travellers-track .flip-card {
          width: 260px;
          flex-shrink: 0;
          scroll-snap-align: center;
        }

        @media (min-width: 640px) {
          .travellers-track {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            overflow-x: visible;
            padding-left: 0;
            padding-right: 0;
          }
          .travellers-track .flip-card {
            width: 100%;
            flex-shrink: initial;
          }
        }

        @media (min-width: 1024px) {
          .travellers-track {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        /* The card's Book Now button uses the shared .btn system
           (see globals.css) — .btn-amber is the on-purple variant. */
      `}</style>

      {/* Decorative Background Glows */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c2bea] px-3.5 py-1 rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#7c2bea]" /> Tailored Experiences
          </div>
          <h2 className="section-title-pattern">
            Designed For <span className="text-[#7c2bea]">Every Traveller</span>
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto font-medium">
            Hover over any card to flip and explore our specialized travel accommodations.
          </p>
        </div>

        {/* --- CARDS: mobile carousel w/ arrows, sm+ static grid --- */}
        <div className="relative group/carousel">

          {/* PREV / NEXT — mobile only, grid shows all cards on sm+ so arrows aren't needed there */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Previous traveller type"
            className="btn btn-primary btn-icon sm:hidden absolute -left-1 top-[130px] -translate-y-1/2 z-30 w-11 h-11 shadow-lg shadow-purple-600/30 border-2 border-white"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Next traveller type"
            className="btn btn-primary btn-icon sm:hidden absolute -right-1 top-[130px] -translate-y-1/2 z-30 w-11 h-11 shadow-lg shadow-purple-600/30 border-2 border-white"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div ref={scrollRef} className="travellers-track no-scrollbar py-2">
            {TRAVELLERS.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className="flip-card group cursor-pointer">
                  <div className="flip-card-inner">

                    {/* FRONT FACE */}
                    <div className="flip-card-front rounded-xl">
                      {/* Top Image Container - Reduced to h-32 (128px) */}
                      <div className="relative h-32 w-full overflow-hidden rounded-t-xl shrink-0">
                        <img
                          src={item.frontImage}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>

                      {/* Bottom Details Container - Compact layout */}
                      <div className="p-4 flex-1 flex flex-col justify-between bg-white rounded-b-xl">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded-md bg-purple-100 text-[#7c2bea] flex items-center justify-center shrink-0">
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="text-xs font-black text-gray-900 tracking-tight">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-gray-500 text-[11px] font-medium leading-normal line-clamp-2">
                            {item.shortDesc}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-gray-100 flex items-center text-[10px] font-extrabold text-[#7c2bea]">
                          <span>Hover to explore</span>
                          <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div className="flip-card-back rounded-xl">
                      <div className="space-y-3">
                        {/* Icon & Title Header */}
                        <div className="flex items-center gap-2.5 border-b border-white/20 pb-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md text-amber-300 flex items-center justify-center shrink-0">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <h3 className="text-sm font-black text-white tracking-tight">
                            {item.title}
                          </h3>
                        </div>

                        {/* Detailed Description */}
                        <p className="text-purple-100 text-[11px] font-medium leading-relaxed">
                          {item.backDesc}
                        </p>
                      </div>

                      {/* Shared button system — amber variant reads on purple */}
                      <button
                        type="button"
                        className="btn btn-amber w-full h-[42px] text-xs font-black"
                      >
                        Book Now <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
