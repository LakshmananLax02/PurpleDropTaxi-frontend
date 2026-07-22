"use client";

import React from "react";
import { Sparkles } from "lucide-react";

const FLEET_CARS = [
  {
    id: "sedan",
    name: "Sedan",
    image: "/images/sedanimg.png",
    oneWay: "15",
    roundTrip: "14",
    seats: "4 Seater",
  },
  {
    id: "etios",
    name: "Etios",
    image: "/images/primesedanimg.png",
    oneWay: "16",
    roundTrip: "14",
    seats: "4 Seater",
  },
  {
    id: "suv",
    name: "SUV",
    image: "/images/suvimg.png",
    oneWay: "20",
    roundTrip: "19",
    seats: "6 Seater",
  },
  {
    id: "innova",
    name: "Innova Crysta",
    image: "/images/primesuvimg.png",
    oneWay: "24",
    roundTrip: "22",
    seats: "7 Seater",
  },
];

function FleetCard({ car }) {
  return (
    <div
      className="
        group relative overflow-hidden rounded-[20px] bg-purple-100/60
        border border-purple-100
        shadow-[0_15px_35px_-10px_rgba(109,40,217,0.15)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-[0_25px_50px_-8px_rgba(124,58,237,0.3)]
      "
    >
      {/* Rotating Purple Gradient Border */}
      <div
        className="
          pointer-events-none absolute left-1/2 top-1/2 h-[180%] w-28
          -translate-x-1/2 -translate-y-1/2
          animate-spin [animation-duration:4s]
          group-hover:[animation-duration:2.2s]
        "
        style={{
          background:
            "linear-gradient(180deg, #7c3aed 0%, #a855f7 35%, #c084fc 70%, #6D28D9 100%)",
        }}
      />

      {/* Inset White Content Plate */}
      <div className="absolute inset-[2px] rounded-[18px] bg-white" />

      {/* Card Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Vehicle Image Header */}
          <div className="relative overflow-hidden rounded-t-[18px] bg-purple-50/40 px-6 pt-10 pb-4 flex flex-col items-center">
            
            {/* Seater Badge: z-20 prevents image overlap */}
            <span className="absolute top-3 right-3 z-20 text-[10px] font-extrabold uppercase tracking-wider text-[#7c3aed] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-purple-200/80 shadow-sm">
              👤 {car.seats}
            </span>

            {/* Car Image: z-10 stays under badge */}
            <img
              src={car.image || "/placeholder.svg"}
              alt={car.name}
              className="relative z-10 mx-auto h-32 w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>

          {/* Vehicle Details */}
          <div className="px-6 pt-4 pb-2">
            <h3 className="text-base font-black uppercase tracking-tight text-gray-900 group-hover:text-[#7c3aed] transition-colors">
              {car.name}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100/60">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  One way
                </p>
                <p className="mt-0.5 text-base font-black text-[#7c3aed]">
                  ₹{car.oneWay}<span className="text-xs font-bold text-gray-500">/km</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  Round trip
                </p>
                <p className="mt-0.5 text-base font-black text-[#7c3aed]">
                  ₹{car.roundTrip}<span className="text-xs font-bold text-gray-500">/km</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button using 3D Animated Jello Style */}
        <div className="px-6 pb-6 pt-4">
          <button
            type="button"
            className="btn-3d-purple w-full py-3.5 text-xs font-black uppercase tracking-wider text-white"
          >
            Book This Cab →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FleetSection() {
  return (
    <section className="w-full bg-[#f8fafc] py-20 px-4 md:px-8 relative overflow-hidden font-sans">
      
      {/* Ambient Backdrop Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c3aed] px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-4 h-4" /> Our Fleet
          </div>
          <h2 className="text-3xl font-black text-gray-900 md:text-4xl lg:text-5xl tracking-tight">
            Choose Your Comfort — <span className="text-[#7c3aed]">Cabs for Every Budget</span>
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-lg font-medium">
            Pristine, climate-controlled outstation vehicles with transparent per-kilometer rates and certified professional chauffeurs.
          </p>
        </div>

        {/* Outer Rotating Glowing Panel */}
        <div className="relative mt-12 overflow-hidden rounded-[32px] p-[2px]">
          <div
            className="
              pointer-events-none absolute left-1/2 top-1/2 h-[220%] w-48
              -translate-x-1/2 -translate-y-1/2
              animate-spin [animation-duration:8s]
            "
            style={{
              background:
                "linear-gradient(180deg, #7c3aed 0%, #a855f7 35%, #c084fc 70%, #6D28D9 100%)",
            }}
          />
          <div className="absolute inset-[2px] rounded-[30px] bg-white/90 backdrop-blur-xl" />

          {/* Grid Layout Container */}
          <div className="relative z-10 grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4 md:p-8">
            {FLEET_CARS.map((car) => (
              <FleetCard key={car.id} car={car} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}