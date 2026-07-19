"use client";

/**
 * ============================================================================
 * BookingSection.jsx
 * ----------------------------------------------------------------------------
 * Premium, production-ready Taxi ENQUIRY section.
 *
 * This is a lead-generation form, not a live booking engine: once a customer
 * submits it, our tele-calling team reaches out to confirm the ride. There is
 * no live driver assignment, receipt download, or booking tracking here.
 *
 * Stack: Next.js 15 (App Router) + JavaScript + Tailwind CSS + Framer Motion
 *        + React Hook Form + Zod + Google Maps / Places / Directions API
 *
 * REQUIRED PACKAGES (npm install):
 *   framer-motion react-hook-form zod @hookform/resolvers
 *   @react-google-maps/api lucide-react
 *
 * REQUIRED ENV VAR (.env.local):
 *   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
 *   -> Enable "Maps JavaScript API", "Places API" and "Directions API"
 *      for this key in Google Cloud Console.
 *
 * FONT: This file assumes "Inter" (with "Poppins" fallback) is registered as
 * the default sans font, e.g. via next/font/google in your root layout:
 *
 *   import { Inter } from "next/font/google";
 *   const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
 *
 * BACKEND CONTRACT (endpoint is not live yet — placeholder only):
 *   GET  /api/vehicles        -> VehicleOption[]
 *   POST /api/fare-estimation -> FareEstimate
 *   POST /api/enquiry         -> EnquiryRecord
 *
 * NOTE ON BACKEND: `apiSubmitEnquiry` below is where the submitted form is
 * sent. When the backend is ready, wire it to:
 *   1) forward the payload to our Telegram bot/channel so the tele team is
 *      notified instantly, and
 *   2) persist the enquiry to the database.
 * Until then it falls back to a local mock response so the UI keeps working.
 *
 * VEHICLE IMAGES: every vehicle image is a placeholder right now. Drop real
 * photos into `VEHICLE_IMAGES` below (or return an `image` field from
 * GET /api/vehicles) and they'll show up automatically in both the fleet
 * showcase and the "select cab type" cards.
 *
 * Everything for this feature — state, validation, map logic, the animated
 * loading sequence, fare estimation and enquiry confirmation — lives in this
 * one self-contained component, organized into clearly commented sections.
 * ============================================================================
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  Calendar,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gauge,
  ImageOff,
  Loader2,
  Luggage,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Route as RouteIcon,
  ShieldCheck,
  User,
  UserCircle2,
  Users,
} from "lucide-react";

/* ============================================================================
 * 1. VALIDATION SCHEMA (React Hook Form + Zod)
 * ========================================================================= */

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

const bookingFormSchema = z.object({
  pickup: z.string().min(1, "Pickup location is required"),
  drop: z.string().min(1, "Drop location is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  vehicle: z.string().min(1, "Please select a cab type"),
  customerName: z.string().min(2, "Enter your full name"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(INDIAN_MOBILE_REGEX, "Enter a valid 10-digit Indian mobile number"),
  email: z.union([z.literal(""), z.string().email("Enter a valid email address")]),
  womanAlone: z.boolean(),
  seniorCitizen: z.boolean(),
  travellingWithInfant: z.boolean(),
  extraLuggage: z.boolean(),
});

const defaultFormValues = {
  pickup: "",
  drop: "",
  pickupDate: "",
  pickupTime: "",
  vehicle: "",
  customerName: "",
  mobile: "",
  email: "",
  womanAlone: false,
  seniorCitizen: false,
  travellingWithInfant: false,
  extraLuggage: false,
};

/* ============================================================================
 * 2. CONSTANTS / DESIGN TOKENS
 * ========================================================================= */

const COLORS = {
  gradientFrom: "#6D28D9",
  gradientTo: "#8B5CF6",
  accent: "#A855F7",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  success: "#22C55E",
};

const FALLBACK_VEHICLES = [
  {
    id: "sedan",
    label: "Sedan",
    ratePerKm: 15,
    seats: 4,
    description: "Comfortable, budget-friendly rides for up to 4 — great for city trips.",
  },
  {
    id: "etios",
    label: "Etios",
    ratePerKm: 16,
    seats: 4,
    description: "Reliable and fuel-efficient, ideal for everyday travel.",
  },
  {
    id: "suv",
    label: "SUV",
    ratePerKm: 20,
    seats: 6,
    description: "Extra room for families and small groups on longer trips.",
  },
  {
    id: "prime_suv",
    label: "Prime SUV",
    ratePerKm: 22,
    seats: 6,
    description: "A step up in comfort — premium SUV with extra legroom.",
  },
];

// ---------------------------------------------------------------------------
// AIRPORT PICKUP
// Static list for now — used to populate the "drop location" field whenever
// the customer picks the "Airport pickup" trip type, and to give the map a
// coordinate to route to. Once the Google Maps API key is added, this can be
// swapped for a live Places Autocomplete restricted to `types: ["airport"]`
// so it stays current automatically; until then this list needs to be kept
// up to date by hand.
// ---------------------------------------------------------------------------
const TAMIL_NADU_AIRPORTS = [
  { id: "maa", name: "Chennai International Airport (MAA)", lat: 12.9941, lng: 80.1709 },
  { id: "cjb", name: "Coimbatore International Airport (CJB)", lat: 11.03, lng: 77.0434 },
  { id: "ixm", name: "Madurai Airport (IXM)", lat: 9.8345, lng: 78.0934 },
  { id: "trz", name: "Tiruchirappalli International Airport (TRZ)", lat: 10.7654, lng: 78.7097 },
  { id: "sxv", name: "Salem Airport (SXV)", lat: 11.7833, lng: 78.0708 },
  { id: "tcr", name: "Tuticorin Airport (TCR)", lat: 8.7242, lng: 78.0257 },
];

// ---------------------------------------------------------------------------
// VEHICLE IMAGES
// Add the real photo URL/path for each vehicle id here (e.g. "/vehicles/
// sedan.png" or a CDN URL). Anything left empty falls back to a placeholder
// so the layout never breaks while images are still being sourced.
// ---------------------------------------------------------------------------
const VEHICLE_IMAGES = {
 sedan: "/images/primesedanimg.png",
  etios: "/images/sedanimg.png",
  suv: "/images/suvimg.png",
  prime_suv: "/images/primesuvimg.png",
};

const LOADING_MESSAGES = [
  "Calculating shortest route...",
  "Finding nearest route...",
  "Calculating distance...",
  "Checking available vehicles...",
  "Calculating fare...",
  "Preparing quotation...",
];

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
  borderRadius: "16px",
};

const DEFAULT_CENTER = { lat: 11.0168, lng: 76.9558 }; // Coimbatore
const GOOGLE_MAPS_LIBRARIES = ["places"];

/* ============================================================================
 * 3. API LAYER (backend-ready; falls back to local calc if endpoint is absent)
 * ========================================================================= */

async function apiGetVehicles() {
  try {
    const res = await fetch("/api/vehicles");
    if (!res.ok) throw new Error("vehicle fetch failed");
    return await res.json();
  } catch {
    return FALLBACK_VEHICLES;
  }
}

async function apiEstimateFare(payload) {
  try {
    const res = await fetch("/api/fare-estimation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("fare estimation failed");
    return await res.json();
  } catch {
    // Local fallback calculation, used only until the backend is wired up.
    const vehicle =
      FALLBACK_VEHICLES.find((v) => v.id === payload.vehicleId) ?? FALLBACK_VEHICLES[0];
    const distance = payload.tripType === "roundtrip" ? payload.distanceKm * 2 : payload.distanceKm;
    const base = distance * vehicle.ratePerKm;
    const driverBata = 400;
    const tollCharges = distance > 80 ? 120 : 0;
    const hillCharges = 0;
    const gst = Math.round((base + driverBata + tollCharges) * 0.05);
    const fare = Math.round(base + driverBata + tollCharges + hillCharges + gst);
    return {
      fare,
      distanceKm: Math.round(distance),
      durationMins: payload.durationMins,
      ratePerKm: vehicle.ratePerKm,
      driverBata,
      tollCharges,
      hillCharges,
      gst,
    };
  }
}

// Submits the enquiry. TODO(backend): forward this payload to the Telegram
// bot/channel used by the tele-calling team AND persist it to the database.
// Until /api/enquiry exists, we just mock a successful response so the UI
// flow can be demoed end to end.
async function apiSubmitEnquiry(payload) {
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("enquiry submission failed");
    return await res.json();
  } catch {
    return {
      enquiryId: `ENQ-${Math.floor(100000 + Math.random() * 900000)}`,
      pickup: payload.form.pickup,
      drop: payload.form.drop,
      vehicle: payload.form.vehicle,
      fare: payload.fare.fare,
      customerName: payload.form.customerName,
      mobile: payload.form.mobile,
      pickupDate: payload.form.pickupDate,
      pickupTime: payload.form.pickupTime,
    };
  }
}

/* ============================================================================
 * 4. SMALL PRESENTATIONAL HELPERS
 * ========================================================================= */

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-red-500">{message}</p>;
}

function InputShell({ icon, children, hasError }) {
  return (
    <div
      className={[
        "flex items-center gap-2.5 h-[50px] rounded-xl bg-white border px-3.5 transition-all duration-200",
        "focus-within:ring-2 focus-within:ring-[#8B5CF6]/40 focus-within:border-[#8B5CF6]",
        hasError ? "border-red-400" : "border-[#E2E8F0]",
      ].join(" ")}
    >
      <span className="text-[#8B5CF6] shrink-0">{icon}</span>
      {children}
    </div>
  );
}

function CheckboxPill({ label, icon, checked, onChange }) {
  return (
    <label
      className={[
        "flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer select-none transition-colors",
        checked ? "border-[#8B5CF6] bg-[#F5F3FF]" : "border-[#E2E8F0] bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className={checked ? "text-[#8B5CF6]" : "text-[#64748B]"}>{icon}</span>
      <span className="text-sm font-medium text-[#1E293B]">{label}</span>
    </label>
  );
}

// Renders a vehicle photo if one has been provided in VEHICLE_IMAGES /
// the /api/vehicles response, otherwise a neutral placeholder box so the
// layout stays intact while real photography is still being added.
function VehicleImage({ src, alt, className }) {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }
  return (
    <div
      className={[
        className,
        "flex items-center justify-center bg-slate-100 text-slate-300",
      ].join(" ")}
    >
      <ImageOff className="w-1/3 h-1/3" strokeWidth={1.5} />
    </div>
  );
}

/* ============================================================================
 * 5. FLEET CAROUSEL (auto-playing image + content slides, sits under the map)
 * ========================================================================= */

function FleetCarousel({ vehicles }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = vehicles.length;

  // Autoplay — advances every 4s, pauses while the user is hovering/reading.
  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 4000);
    return () => clearInterval(timer);
  }, [paused, count]);

  // Keep the index valid if the vehicle list changes size (e.g. after the
  // real /api/vehicles response comes back).
  useEffect(() => {
    setIndex((i) => (count === 0 ? 0 : i % count));
  }, [count]);

  if (count === 0) return null;
  const vehicle = vehicles[index];
  const goTo = (i) => setIndex(((i % count) + count) % count);

  return (
    <div
      className="px-4 md:px-5 pb-4 md:pb-5 pt-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="text-xs font-semibold text-[#64748B] mb-2.5 uppercase tracking-wide">
        Our Fleet
      </p>

      <div className="relative rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col sm:flex-row items-center gap-4 p-4"
          >
            <VehicleImage
              src={VEHICLE_IMAGES[vehicle.id]}
              alt={vehicle.label}
              className="w-full sm:w-40 h-28 object-contain rounded-xl shrink-0"
            />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-bold text-[#1E293B]">{vehicle.label}</p>
              {vehicle.description && (
                <p className="text-xs text-[#64748B] mt-0.5">{vehicle.description}</p>
              )}
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                <span className="text-xs font-semibold text-[#8B5CF6]">₹{vehicle.ratePerKm}/km</span>
                <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                  <Users className="w-3.5 h-3.5" /> {vehicle.seats} seats
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous vehicle"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#8B5CF6] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next vehicle"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#8B5CF6] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {vehicles.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${v.label}`}
              className={[
                "h-1.5 rounded-full transition-all",
                i === index ? "w-5 bg-[#8B5CF6]" : "w-1.5 bg-[#E2E8F0]",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * 5b. TRIP TYPE TABS (One Way / Round trip / Airport pickup — top of form)
 * ========================================================================= */

function TripTypeTabs({ value, onChange }) {
  const options = [
    { id: "oneway", label: "One Way" },
    { id: "roundtrip", label: "Round trip" },
    { id: "airport", label: "Airport pickup" },
  ];
  return (
    <div className="flex rounded-xl bg-[#F1F5F9] p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={[
            "flex-1 h-9 rounded-lg text-xs font-bold transition-colors",
            value === opt.id ? "text-white shadow" : "text-[#64748B] hover:text-[#1E293B]",
          ].join(" ")}
          style={
            value === opt.id
              ? { background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})` }
              : undefined
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ============================================================================
 * 5c. VEHICLE SELECT CARDS ("Select Cab Type" — the actual form control)
 * ========================================================================= */

function VehicleSelectGrid({ vehicles, value, onChange, hasError }) {
  const selected = vehicles.find((v) => v.id === value);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
          Select Cab Type
        </label>
        {selected && (
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{
              background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})`,
            }}
          >
            {selected.label.toUpperCase()} ₹{selected.ratePerKm}/km
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {vehicles.map((v) => {
          const isSelected = v.id === value;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onChange(v.id)}
              className={[
                "flex flex-col items-center gap-1.5 rounded-xl border-2 px-2.5 py-3 transition-all duration-150",
                isSelected
                  ? "text-white border-transparent shadow-md"
                  : "text-[#1E293B] bg-white border-[#E2E8F0] hover:border-[#C4B5FD]",
              ].join(" ")}
              style={
                isSelected
                  ? { background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})` }
                  : undefined
              }
            >
              <VehicleImage
                src={VEHICLE_IMAGES[v.id]}
                alt={v.label}
                className="w-12 h-9 object-contain"
              />
              <span className="text-xs font-bold">{v.label}</span>
              <span className={isSelected ? "text-white/85 text-[11px] font-semibold" : "text-[#8B5CF6] text-[11px] font-semibold"}>
                ₹{v.ratePerKm}/km
              </span>
              <span className={["flex items-center gap-1 text-[10px]", isSelected ? "text-white/75" : "text-[#94A3B8]"].join(" ")}>
                <Users className="w-3 h-3" /> {v.seats}
              </span>
            </button>
          );
        })}
      </div>
      {hasError && <p className="mt-1.5 text-xs font-medium text-red-500">Please select a cab type</p>}
    </div>
  );
}

/* ============================================================================
 * 7. LOADING ANIMATION OVERLAY (Uber/Ola-style animated taxi sequence)
 * ========================================================================= */

function TaxiLoadingOverlay({ active }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setMessageIndex(0);
      setProgress(0);
      return;
    }
    const messageTimer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 650);
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(100, p + 100 / 40));
    }, 100);
    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[20px] bg-gradient-to-b from-[#1E1B4B] to-[#312E81] overflow-hidden"
        >
          {/* Drifting clouds */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute top-8 h-6 w-16 rounded-full bg-white/10 blur-sm"
              style={{ left: `${-20 + i * 10}%`, top: `${20 + i * 18}px` }}
              animate={{ x: ["-10%", "120%"] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center gap-8 px-8">
            <p className="text-white/70 text-xs tracking-[0.2em] font-semibold uppercase">
              Preparing your quote
            </p>

            {/* Road with moving taxi */}
            <div className="relative w-72 h-24">
              <motion.div
                className="absolute left-2 z-10"
                initial={{ x: 0 }}
                animate={{ x: [0, 230] }}
                transition={{ duration: 3.6, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                >
                  <Car className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                </motion.div>
              </motion.div>

              {/* road */}
              <div className="absolute bottom-4 w-full h-2 rounded-full bg-white/15" />
              <div className="absolute bottom-[19px] w-full flex justify-between overflow-hidden px-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="h-[3px] w-5 bg-white/40 rounded-full"
                    animate={{ x: [0, -40] }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                  />
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-72 h-1.5 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#8B5CF6]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Rotating message */}
            <div className="h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white text-sm font-medium"
                >
                  {LOADING_MESSAGES[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Arrival check */}
            {progress >= 100 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <CheckCircle2 className="w-12 h-12 text-[#22C55E]" />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================================
 * 8. CONFETTI (lightweight, no external deps)
 * ========================================================================= */

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 1.2,
        color: [COLORS.accent, COLORS.gradientFrom, COLORS.gradientTo, COLORS.success][i % 4],
        rotate: Math.random() * 360,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 w-2 h-3 rounded-sm"
          style={{ left: `${p.left}%`, background: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: 420, opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/* ============================================================================
 * 9. MAIN COMPONENT
 * ========================================================================= */

export default function BookingSection() {
  /* ---- Google Maps loader --------------------------------------------- */
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const mapRef = useRef(null);
  const pickupAutocompleteRef = useRef(null);
  const dropAutocompleteRef = useRef(null);

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [directions, setDirections] = useState(null);
  const [routeMeta, setRouteMeta] = useState(null);

  /* ---- App / flow state -------------------------------------------------- */
  const [stage, setStage] = useState("form"); // "form" | "loading" | "fare" | "success"
  const [vehicles, setVehicles] = useState(FALLBACK_VEHICLES);
  const [tripType, setTripType] = useState("oneway"); // "oneway" | "roundtrip"
  const [fareEstimate, setFareEstimate] = useState(null);
  const [enquiry, setEnquiry] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  /* ---- React Hook Form ---------------------------------------------------- */
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: defaultFormValues,
    mode: "onBlur",
  });

  /* Load vehicles from backend on mount (falls back to static list) */
  useEffect(() => {
    apiGetVehicles().then(setVehicles);
  }, []);

  /* Drop location switches between free-text and an airport picker depending
   * on trip type, so clear it whenever the trip type changes to avoid a
   * stale value/coordinate mismatch. */
  useEffect(() => {
    setValue("drop", "");
    setDropCoords(null);
    setDirections(null);
    setRouteMeta(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripType]);

  /* ---- Directions calculation whenever both points are known ---------- */
  const computeRoute = useCallback(() => {
    if (!pickupCoords || !dropCoords || !window.google) return;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickupCoords,
        destination: dropCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          const leg = result.routes[0]?.legs[0];
          if (leg?.distance && leg?.duration) {
            setRouteMeta({
              distanceKm: Math.round((leg.distance.value / 1000) * 10) / 10,
              durationMins: Math.round(leg.duration.value / 60),
            });
          }
          if (mapRef.current && result.routes[0]?.bounds) {
            mapRef.current.fitBounds(result.routes[0].bounds);
          }
        }
      }
    );
  }, [pickupCoords, dropCoords]);

  useEffect(() => {
    computeRoute();
  }, [computeRoute]);

  const onPickupPlaceChanged = () => {
    const place = pickupAutocompleteRef.current?.getPlace();
    const loc = place?.geometry?.location;
    if (loc) setPickupCoords({ lat: loc.lat(), lng: loc.lng() });
  };

  const onDropPlaceChanged = () => {
    const place = dropAutocompleteRef.current?.getPlace();
    const loc = place?.geometry?.location;
    if (loc) setDropCoords({ lat: loc.lat(), lng: loc.lng() });
  };

  /* ---- Submit: form -> loading -> fare ------------------------------------ */
  const onSubmit = async (values) => {
    setSubmitError(null);
    setStage("loading");

    const selectedVehicle = vehicles.find((v) => v.id === values.vehicle) ?? vehicles[0];

    const distanceKm = routeMeta?.distanceKm ?? 0;
    const durationMins = routeMeta?.durationMins ?? 0;

    const [fare] = await Promise.all([
      apiEstimateFare({
        pickup: values.pickup,
        drop: values.drop,
        distanceKm,
        durationMins,
        vehicleId: selectedVehicle.id,
        tripType,
      }),
      new Promise((resolve) => setTimeout(resolve, 3600)), // keeps the animation feeling premium
    ]);

    setFareEstimate(fare);
    setStage("fare");
  };

  const handleBackToForm = () => setStage("form");

  // Submits the enquiry — this is where the lead reaches our tele team.
  const handleSubmitEnquiry = async () => {
    if (!fareEstimate) return;
    try {
      const record = await apiSubmitEnquiry({ form: getValues(), fare: fareEstimate });
      setEnquiry(record);
      setStage("success");
    } catch {
      setSubmitError("Something went wrong while sending your enquiry. Please try again.");
    }
  };

  const handleBookAnother = () => {
    setStage("form");
    setDirections(null);
    setRouteMeta(null);
    setFareEstimate(null);
    setEnquiry(null);
  };

  const selectedVehicleLabel =
    vehicles.find((v) => v.id === getValues("vehicle"))?.label ?? "—";

  /* ======================================================================
   * RENDER
   * ==================================================================== */
  return (
    <section
      className="w-full py-10 md:py-16"
      style={{ background: COLORS.bg, fontFamily: "'Inter', 'Poppins', sans-serif" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* ================= LEFT: MAP + FLEET SHOWCASE ================= */}
          <div
            className="lg:col-span-3 flex flex-col rounded-[20px] border overflow-hidden shadow-lg bg-white"
            style={{ borderColor: COLORS.border }}
          >
            <div className="relative h-[300px] md:h-[360px] p-4 md:p-5 pb-0">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  center={pickupCoords ?? DEFAULT_CENTER}
                  zoom={12}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {pickupCoords && !directions && <Marker position={pickupCoords} label="P" />}
                  {dropCoords && !directions && <Marker position={dropCoords} label="D" />}
                  {directions && (
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        polylineOptions: { strokeColor: COLORS.gradientFrom, strokeWeight: 5 },
                        suppressMarkers: false,
                      }}
                    />
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full rounded-2xl flex items-center justify-center text-[#64748B] text-sm gap-2 bg-slate-50">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading map...
                </div>
              )}

              {/* Live distance / duration pill */}
              {routeMeta && (
                <div className="absolute bottom-4 left-8 flex gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-[#1E293B] shadow-md">
                    <RouteIcon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    {routeMeta.distanceKm} km
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-[#1E293B] shadow-md">
                    <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    {routeMeta.durationMins} min
                  </div>
                </div>
              )}
            </div>

            {/* Fleet showcase carousel — swap in real photos via VEHICLE_IMAGES */}
            <FleetCarousel vehicles={vehicles} />
          </div>

          {/* ================= RIGHT: ENQUIRY CARD ================= */}
          <div
            className="lg:col-span-2 relative rounded-[20px] bg-white shadow-xl overflow-hidden"
            style={{ boxShadow: "0 20px 45px -12px rgba(109,40,217,0.18)" }}
          >
            <TaxiLoadingOverlay active={stage === "loading"} />

            <AnimatePresence mode="wait">
              {/* ---------------- STAGE 1: ENQUIRY FORM ---------------- */}
              {stage === "form" && (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35 }}
                  className="p-6 md:p-7 space-y-4 max-h-[720px] overflow-y-auto"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <span
                      className="flex items-center justify-center w-9 h-9 rounded-xl text-white"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})`,
                      }}
                    >
                      <Car className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B]">Book Your Taxi</h2>
                      <p className="text-xs text-[#64748B]">
                        Get an instant quote — our team will call to confirm
                      </p>
                    </div>
                  </div>

                  {/* Trip type */}
                  <TripTypeTabs value={tripType} onChange={setTripType} />

                  {/* Pickup */}
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] mb-1 block">
                      Pickup Location
                    </label>
                    <Controller
                      name="pickup"
                      control={control}
                      render={({ field }) => (
                        <InputShell icon={<MapPin className="w-4 h-4" />} hasError={!!errors.pickup}>
                          {isLoaded ? (
                            <Autocomplete
                              onLoad={(a) => (pickupAutocompleteRef.current = a)}
                              onPlaceChanged={onPickupPlaceChanged}
                              className="w-full"
                            >
                              <input
                                {...field}
                                placeholder="Enter pickup location"
                                className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400"
                              />
                            </Autocomplete>
                          ) : (
                            <input
                              {...field}
                              placeholder="Enter pickup location"
                              className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400"
                            />
                          )}
                        </InputShell>
                      )}
                    />
                    <FieldError message={errors.pickup?.message} />
                  </div>

                  {/* Drop */}
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] mb-1 block">
                      {tripType === "airport" ? "Airport" : "Drop Location"}
                    </label>
                    <Controller
                      name="drop"
                      control={control}
                      render={({ field }) =>
                        tripType === "airport" ? (
                          // Static list for now — once the Google Maps API key is
                          // added this can become a live Places Autocomplete
                          // restricted to types: ["airport"] for dynamic results.
                          <InputShell icon={<MapPin className="w-4 h-4" />} hasError={!!errors.drop}>
                            <select
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                const airport = TAMIL_NADU_AIRPORTS.find(
                                  (a) => a.name === e.target.value
                                );
                                if (airport) setDropCoords({ lat: airport.lat, lng: airport.lng });
                              }}
                              className="w-full bg-transparent outline-none text-sm text-[#1E293B] appearance-none"
                            >
                              <option value="" disabled>
                                Select an airport
                              </option>
                              {TAMIL_NADU_AIRPORTS.map((a) => (
                                <option key={a.id} value={a.name}>
                                  {a.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          </InputShell>
                        ) : (
                          <InputShell icon={<MapPin className="w-4 h-4" />} hasError={!!errors.drop}>
                            {isLoaded ? (
                              <Autocomplete
                                onLoad={(a) => (dropAutocompleteRef.current = a)}
                                onPlaceChanged={onDropPlaceChanged}
                                className="w-full"
                              >
                                <input
                                  {...field}
                                  placeholder="Enter drop location"
                                  className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400"
                                />
                              </Autocomplete>
                            ) : (
                              <input
                                {...field}
                                placeholder="Enter drop location"
                                className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400"
                              />
                            )}
                          </InputShell>
                        )
                      }
                    />
                    <FieldError message={errors.drop?.message} />
                  </div>

                  {/* Date / Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#64748B] mb-1 block">
                        Pickup Date
                      </label>
                      <InputShell icon={<Calendar className="w-4 h-4" />} hasError={!!errors.pickupDate}>
                        <input
                          type="date"
                          {...register("pickupDate")}
                          className="w-full bg-transparent outline-none text-sm text-[#1E293B]"
                        />
                      </InputShell>
                      <FieldError message={errors.pickupDate?.message} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#64748B] mb-1 block">
                        Pickup Time
                      </label>
                      <InputShell icon={<Clock className="w-4 h-4" />} hasError={!!errors.pickupTime}>
                        <input
                          type="time"
                          {...register("pickupTime")}
                          className="w-full bg-transparent outline-none text-sm text-[#1E293B]"
                        />
                      </InputShell>
                      <FieldError message={errors.pickupTime?.message} />
                    </div>
                  </div>

                  {/* Vehicle selection — image cards replace the old dropdowns */}
                  <Controller
                    name="vehicle"
                    control={control}
                    render={({ field }) => (
                      <VehicleSelectGrid
                        vehicles={vehicles}
                        value={field.value}
                        onChange={field.onChange}
                        hasError={!!errors.vehicle}
                      />
                    )}
                  />

                  {/* Name / Mobile */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#64748B] mb-1 block">
                        Customer Name
                      </label>
                      <InputShell icon={<User className="w-4 h-4" />} hasError={!!errors.customerName}>
                        <input
                          {...register("customerName")}
                          placeholder="Full name"
                          className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400"
                        />
                      </InputShell>
                      <FieldError message={errors.customerName?.message} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#64748B] mb-1 block">
                        Mobile Number
                      </label>
                      <InputShell icon={<Phone className="w-4 h-4" />} hasError={!!errors.mobile}>
                        <input
                          {...register("mobile")}
                          placeholder="10-digit number"
                          inputMode="numeric"
                          maxLength={10}
                          className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400"
                        />
                      </InputShell>
                      <FieldError message={errors.mobile?.message} />
                    </div>
                  </div>

                  {/* Special requirements */}
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] mb-2 block">
                      Special Requirements <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Controller
                        name="womanAlone"
                        control={control}
                        render={({ field }) => (
                          <CheckboxPill
                            label="Woman Travelling Alone"
                            icon={<ShieldCheck className="w-4 h-4" />}
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <Controller
                        name="seniorCitizen"
                        control={control}
                        render={({ field }) => (
                          <CheckboxPill
                            label="Senior Citizen"
                            icon={<UserCircle2 className="w-4 h-4" />}
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <Controller
                        name="travellingWithInfant"
                        control={control}
                        render={({ field }) => (
                          <CheckboxPill
                            label="Travelling with Infant"
                            icon={<User className="w-4 h-4" />}
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <Controller
                        name="extraLuggage"
                        control={control}
                        render={({ field }) => (
                          <CheckboxPill
                            label="Extra Luggage"
                            icon={<Luggage className="w-4 h-4" />}
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ y: -2, boxShadow: "0 12px 24px -8px rgba(109,40,217,0.45)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-[54px] rounded-[14px] text-white font-bold text-sm tracking-wide disabled:opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})`,
                    }}
                  >
                    Get Fare Estimation
                  </motion.button>
                </motion.form>
              )}

              {/* ---------------- STAGE 2 (post-loading): FARE ESTIMATION ---------------- */}
              {stage === "fare" && fareEstimate && (
                <motion.div
                  key="fare"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                  className="p-6 md:p-7"
                >
                  {/* Trip type (chosen up front in the form) */}
                  <div className="flex justify-center mb-5">
                    <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-[#8B5CF6] bg-[#F5F3FF]">
                      {tripType === "roundtrip"
                        ? "Round Trip"
                        : tripType === "airport"
                        ? "Airport Pickup"
                        : "One Way"}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="text-center mb-4">
                    <p className="text-sm font-semibold text-[#1E293B]">{getValues("pickup")}</p>
                    <div className="text-[#8B5CF6] my-0.5">↓</div>
                    <p className="text-sm font-semibold text-[#1E293B]">{getValues("drop")}</p>
                  </div>

                  {/* Fare card */}
                  <div
                    className="rounded-2xl border-2 border-dashed p-6 text-center mb-5"
                    style={{ borderColor: "#C4B5FD", background: "#F5F3FF" }}
                  >
                    <p className="text-4xl font-extrabold text-[#1E293B]">
                      ₹{fareEstimate.fare.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs font-medium text-[#64748B] mt-1">Estimated Fare</p>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-6">
                    <DetailRow icon={<RouteIcon className="w-4 h-4" />} label="Distance" value={`${fareEstimate.distanceKm} km`} />
                    <DetailRow icon={<User className="w-4 h-4" />} label="Driver Bata" value={`₹${fareEstimate.driverBata}`} />
                    <DetailRow icon={<Gauge className="w-4 h-4" />} label="Rate per KM" value={`₹${fareEstimate.ratePerKm}`} />
                    <DetailRow icon={<Navigation className="w-4 h-4" />} label="Toll Charges" value={fareEstimate.tollCharges ? `₹${fareEstimate.tollCharges}` : "Included"} />
                    <DetailRow icon={<Clock className="w-4 h-4" />} label="Duration" value={`${fareEstimate.durationMins} mins`} />
                    <DetailRow icon={<ShieldCheck className="w-4 h-4" />} label="Hill Charges" value={fareEstimate.hillCharges ? `₹${fareEstimate.hillCharges}` : "None"} />
                    <DetailRow icon={<Car className="w-4 h-4" />} label="Vehicle" value={selectedVehicleLabel} />
                    <DetailRow icon={<Calendar className="w-4 h-4" />} label="Pickup Date" value={getValues("pickupDate")} />
                    <DetailRow icon={<Clock className="w-4 h-4" />} label="Pickup Time" value={getValues("pickupTime")} />
                    <DetailRow icon={<Gauge className="w-4 h-4" />} label="GST" value={`₹${fareEstimate.gst}`} />
                  </div>

                  {submitError && (
                    <p className="text-xs font-medium text-red-500 mb-3 text-center">{submitError}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleBackToForm}
                      className="flex-1 h-[54px] rounded-[14px] border border-[#E2E8F0] font-bold text-sm text-[#1E293B] hover:bg-slate-50 transition-colors"
                    >
                      ← Back
                    </button>
                    <motion.button
                      onClick={handleSubmitEnquiry}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 h-[54px] rounded-[14px] text-white font-bold text-sm"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})`,
                      }}
                    >
                      Send Enquiry →
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ---------------- STAGE 3: ENQUIRY SUBMITTED ---------------- */}
              {stage === "success" && enquiry && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative p-6 md:p-7"
                >
                  <Confetti />
                  <div className="relative flex flex-col items-center text-center mb-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                      style={{ background: "#DCFCE7" }}
                    >
                      <CheckCircle2 className="w-9 h-9" style={{ color: COLORS.success }} />
                    </motion.div>
                    <h2 className="text-xl font-extrabold text-[#1E293B]">Enquiry Sent!</h2>
                    <p className="text-sm text-[#64748B] mt-1 max-w-xs">
                      Reference <span className="font-semibold text-[#1E293B]">{enquiry.enquiryId}</span>.
                      Our team will call you shortly on {enquiry.mobile} to confirm your ride.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] mb-6">
                    <SuccessRow label="Pickup" value={enquiry.pickup} />
                    <SuccessRow label="Drop" value={enquiry.drop} />
                    <SuccessRow label="Vehicle" value={selectedVehicleLabel} />
                    <SuccessRow label="Estimated Fare" value={`₹${enquiry.fare.toLocaleString("en-IN")}`} />
                    <SuccessRow label="Customer Name" value={enquiry.customerName} />
                    <SuccessRow label="Mobile Number" value={enquiry.mobile} />
                    <SuccessRow label="Pickup Date" value={enquiry.pickupDate} />
                    <SuccessRow label="Pickup Time" value={enquiry.pickupTime} />
                  </div>

                  <motion.button
                    onClick={handleBookAnother}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-[54px] rounded-[14px] text-white font-bold text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})`,
                    }}
                  >
                    Book Another Ride
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * 10. TINY LOCAL SUB-COMPONENTS (kept in-file per project constraint)
 * ========================================================================= */

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#8B5CF6] shrink-0">{icon}</span>
      <div>
        <p className="text-[11px] text-[#64748B] leading-none">{label}</p>
        <p className="text-sm font-semibold text-[#1E293B] mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

function SuccessRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
      <span className="text-[#64748B]">{label}</span>
      <span className="font-semibold text-[#1E293B]">{value || "—"}</span>
    </div>
  );
}