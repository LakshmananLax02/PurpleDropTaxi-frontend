"use client";

/**
 * ============================================================================
 * FleetSection.jsx
 * ----------------------------------------------------------------------------
 * "Our Fleet" section for PurpleDropTaxi — a grid of cab cards, each wrapped
 * in an animated rotating-gradient border (adapted from the Uiverse.io
 * "glowing border card" concept by bhaveshxrawat, reworked for a light theme
 * to match the rest of the site instead of the original dark card).
 *
 * Stack: Next.js (App Router) + JavaScript + Tailwind CSS
 *
 * HOW THE BORDER EFFECT WORKS (Tailwind-only, no custom CSS file needed):
 *   1. Each card is a relative, overflow-hidden wrapper.
 *   2. A thin gradient bar sits centered behind the content and spins
 *      continuously using Tailwind's built-in `animate-spin` keyframe
 *      (sped up via an arbitrary animation-duration utility).
 *   3. The actual card content sits on top in a white plate that's inset by
 *      a couple of pixels, so only a slim rotating gradient ring peeks out
 *      around the edge — same trick as the original ::before/::after card,
 *      just sized for a real content card instead of a small logo tile.
 *
 * IMAGES: swap the `image` paths in FLEET_CARS for your real car photos.
 * ============================================================================
 */

import React from "react";

const FLEET_CARS = [
  {
    id: "sedan",
    name: "Sedan",
    image: "/images/sedanimg.png",
    oneWay: "15",
    roundTrip: "14",
  },
  {
    id: "etios",
    name: "Etios",
    image: "/images/primesedanimg.png",
    oneWay: "16",
    roundTrip: "14",
  },
  {
    id: "suv",
    name: "SUV",
    image: "/images/suvimg.png",
    oneWay: "20",
    roundTrip: "19",
  },
  {
    id: "innova",
    name: "Innova Crysta",
    image: "/images/primesuvimg.png",
    oneWay: "24",
    roundTrip: "22",
  },
];

function FleetCard({ car }) {
  return (
    <div
      className="
        group relative overflow-hidden rounded-[15px] bg-gray-300
        border border-gray-100
        shadow-[0_20px_45px_-10px_rgba(15,23,42,0.25)]
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-[0_28px_60px_-8px_rgba(139,92,246,0.35)]
      "
    >
      {/* Rotating gradient bar — spins slow by default, speeds up on hover */}
      <div
        className="
          pointer-events-none absolute left-1/2 top-1/2 h-[160%] w-24
          -translate-x-1/2 -translate-y-1/2
          animate-spin [animation-duration:4s]
          group-hover:[animation-duration:2.5s]
        "
        style={{
          background:
            "linear-gradient(180deg, #38BDF8 0%, #22D3EE 35%, #34D399 70%, #38BDF8 100%)",
        }}
      />

      {/* Inset white plate — leaves a thin gradient ring visible around it */}
      <div className="absolute inset-[3px] rounded-[19px] bg-white" />

      {/* Actual card content, above both layers */}
      <div className="relative z-10 flex flex-col">
        {/* Image */}
        <div className="overflow-hidden rounded-t-[19px] bg-gray-50 px-6 pt-8 pb-6">
          <img
            src={car.image || "/placeholder.svg"}
            alt={car.name}
            className="mx-auto h-36 w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>

        {/* Details */}
        <div className="px-6 pb-6 pt-2">
          <h3 className="text-lg font-extrabold uppercase tracking-wide text-[#1E293B]">
            {car.name}
          </h3>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                One way
              </p>
              <p className="mt-1 text-lg font-bold text-[#0EA5E9]">₹{car.oneWay}/km</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Round trip
              </p>
              <p className="mt-1 text-lg font-bold text-[#0EA5E9]">₹{car.roundTrip}/km</p>
            </div>
          </div>

          <button
            type="button"
            className="
              mt-5 flex w-full items-center justify-center gap-2 rounded-full
              bg-gradient-to-r from-[#22D3EE] to-[#34D399]
              px-5 py-3 text-sm font-bold text-white shadow-md
              transition-all duration-300
              hover:brightness-110 hover:scale-[1.02] active:scale-95
            "
          >
            Book This Cab
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FleetSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#0EA5E9]">
            Our Fleet
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#0F172A] md:text-4xl lg:text-[2.5rem]">
            Choose Your Comfort — Cabs for Every Budget
          </h2>
          <span className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#22D3EE] to-[#34D399]" />
        </div>

        {/* Grid — wrapped in one large rotating-gradient border so the whole
            fleet block reads as a single glowing panel, on top of each
            card's own border */}
        <div className="relative mt-14 overflow-hidden rounded-[32px] p-[3px]">
          <div
            className="
              pointer-events-none absolute left-1/2 top-1/2 h-[200%] w-40
              -translate-x-1/2 -translate-y-1/2
              animate-spin [animation-duration:8s]
            "
            style={{
              background:
                "linear-gradient(180deg, #38BDF8 0%, #22D3EE 35%, #34D399 70%, #38BDF8 100%)",
            }}
          />
          <div className="absolute inset-[3px] rounded-[30px] bg-white" />

          <div className="relative z-10 grid grid-cols-1 gap-8 p-6 sm:grid-cols-2 lg:grid-cols-4 md:p-10">
            {FLEET_CARS.map((car) => (
              <FleetCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}