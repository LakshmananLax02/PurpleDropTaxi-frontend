/**
 * ============================================================================
 * lib/booking.js — shared booking domain layer
 * ----------------------------------------------------------------------------
 * Single source of truth for the booking flow, shared by:
 *   - app/Components/BookingSection.js  (page 1: carousel-hero + enquiry form)
 *   - app/estimate/page.js              (page 2: map + fare estimate + confirm)
 *
 * Keeping the schema, vehicle catalogue, design tokens and the (backend-ready)
 * API helpers here means both pages stay in lockstep — change a rate or a
 * validation rule in ONE place.
 * ========================================================================== */

import { z } from "zod";

/* ---- Design tokens -------------------------------------------------------- */
export const COLORS = {
  gradientFrom: "#5815b7",
  gradientTo: "#1bc5d8",
  accent: "#a55cff",
  bg: "#f8f6fc",
  card: "#FFFFFF",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  success: "#22C55E",
};

/* ---- Validation ----------------------------------------------------------- */
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export const bookingFormSchema = z.object({
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

export const defaultFormValues = {
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

// The single source of truth for every displayed and calculated per-kilometre
// rate. The keys match the trip types used by the booking form.
export const VEHICLE_RATES = {
  oneway: { sedan: 15, prime_sedan: 15, suv: 19, prime_suv: 23 },
  roundtrip: { sedan: 14, prime_sedan: 14, suv: 18, prime_suv: 22 },
  airport: { sedan: 15, prime_sedan: 15, suv: 19, prime_suv: 23 },
};

// A fixed driver bata applies to every cab category and every trip type.
export const DRIVER_BATA = 400;

export function normalizeVehicleId(vehicleId) {
  return {
    etios: "prime_sedan",
    "prime-sedan": "prime_sedan",
    innova: "prime_suv",
    "prime-suv": "prime_suv",
  }[vehicleId] ?? vehicleId;
}

export function getVehicleRate(vehicleId, tripType = "oneway") {
  const normalizedVehicleId = normalizeVehicleId(vehicleId);
  const rates = VEHICLE_RATES[tripType] ?? VEHICLE_RATES.oneway;
  return rates[normalizedVehicleId] ?? rates.sedan;
}

export const FALLBACK_VEHICLES = [
  { id: "sedan", label: "Sedan", seats: 4, driverBata: DRIVER_BATA, description: "Comfortable everyday travel." },
  { id: "prime_sedan", label: "Prime Sedan", seats: 4, driverBata: DRIVER_BATA, description: "Extra comfort for relaxed highway travel." },
  { id: "suv", label: "SUV", seats: 6, driverBata: DRIVER_BATA, description: "Extra room for families and small groups." },
  { id: "prime_suv", label: "Prime SUV", seats: 6, driverBata: DRIVER_BATA, description: "Premium SUV with extra legroom." },
];

// Shared calculation rules used by both the public tariff calculator and the
// live Google Maps quote. A round-trip route charges for the outward and return
// journey, while airport pickup follows the one-way rules.
export const FARE_RULES = {
  minimumBillableKm: { oneway: 130, roundtrip: 250, airport: 130 },
  roundTripDistanceMultiplier: 2,
};

export function getTripDistanceKm(distanceKm, tripType = "oneway") {
  const routeDistanceKm = Math.max(0, Number(distanceKm) || 0);
  return tripType === "roundtrip"
    ? routeDistanceKm * FARE_RULES.roundTripDistanceMultiplier
    : routeDistanceKm;
}

export function getTripDurationMins(durationMins, tripType = "oneway") {
  const oneWayDurationMins = Math.max(0, Number(durationMins) || 0);
  return tripType === "roundtrip"
    ? oneWayDurationMins * FARE_RULES.roundTripDistanceMultiplier
    : oneWayDurationMins;
}

export function calculateFareEstimate({ vehicleId, tripType = "oneway", distanceKm = 0, durationMins = 0 }) {
  const normalizedVehicleId = normalizeVehicleId(vehicleId);
  const vehicle = FALLBACK_VEHICLES.find((item) => item.id === normalizedVehicleId)
    ?? FALLBACK_VEHICLES[0];
  const travelDistanceKm = getTripDistanceKm(distanceKm, tripType);
  const minimumBillableKm = FARE_RULES.minimumBillableKm[tripType] ?? FARE_RULES.minimumBillableKm.oneway;
  const billableKm = Math.max(travelDistanceKm, minimumBillableKm);
  const ratePerKm = getVehicleRate(vehicleId, tripType);
  const baseFare = Math.round(billableKm * ratePerKm);
  const driverBata = vehicle.driverBata;

  return {
    fare: Math.round(baseFare + driverBata),
    distanceKm: Math.round(travelDistanceKm * 10) / 10,
    durationMins: Math.round(getTripDurationMins(durationMins, tripType)),
    billableKm,
    minimumBillableKm,
    ratePerKm,
    baseFare,
    driverBata,
    tollCharges: 0,
    hillCharges: 0,
    gst: 0,
  };
}

export const VEHICLE_IMAGES = {
  sedan: "/images/sedanimg.png",
  prime_sedan: "/images/primesedanimg.png",
  etios: "/images/primesedanimg.png",
  suv: "/images/suvimg.png",
  prime_suv: "/images/primesuvimg.png",
};

/* ---- Airports (used when tripType === "airport") -------------------------- */
export const TAMIL_NADU_AIRPORTS = [
  { id: "maa", name: "Chennai International Airport (MAA)", lat: 12.9941, lng: 80.1709 },
  { id: "cjb", name: "Coimbatore International Airport (CJB)", lat: 11.03, lng: 77.0434 },
  { id: "ixm", name: "Madurai Airport (IXM)", lat: 9.8345, lng: 78.0934 },
  { id: "trz", name: "Tiruchirappalli International Airport (TRZ)", lat: 10.7654, lng: 78.7097 },
  { id: "sxv", name: "Salem Airport (SXV)", lat: 11.7833, lng: 78.0708 },
  { id: "tcr", name: "Thoothukudi Airport (TCR)", lat: 8.7242, lng: 78.0257 },
  { id: "nvy", name: "Neyveli Airport (NVY)", lat: 11.61296, lng: 79.52738 },
  { id: "vovr", name: "Vellore Airport (VOVR)", lat: 12.9088, lng: 79.0668 },
  { id: "vo95", name: "Hosur Aerodrome (VO95)", lat: 12.6634, lng: 77.7709 },
];

/* ---- Google Maps config --------------------------------------------------- */
// Declared once, at module scope, so the array identity is stable across
// renders (a new array each render makes useJsApiLoader reload & warn).
export const GOOGLE_MAPS_LIBRARIES = ["places"];
export const DEFAULT_CENTER = { lat: 11.0168, lng: 76.9558 }; // Coimbatore

/* ---- Loading / animation copy --------------------------------------------- */
export const FARE_LOADING_MESSAGES = [
  "Calculating shortest route...",
  "Finding nearest route...",
  "Calculating distance...",
  "Checking available vehicles...",
  "Calculating fare...",
  "Preparing quotation...",
];

export const CONFIRM_LOADING_MESSAGES = [
  "Locking in your fare...",
  "Notifying our tele-calling team...",
  "Reserving your vehicle...",
  "Generating your reference number...",
  "Almost there...",
];

/* ============================================================================
 * API layer (backend-ready; falls back to local calc if the endpoint is absent)
 * ========================================================================== */

export async function apiGetVehicles() {
  try {
    const res = await fetch("/api/vehicles");
    if (!res.ok) throw new Error("vehicle fetch failed");
    return await res.json();
  } catch {
    return FALLBACK_VEHICLES;
  }
}

export async function apiEstimateFare(payload) {
  try {
    const res = await fetch("/api/fare-estimation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("fare estimation failed");
    return await res.json();
  } catch {
    // Local fallback, used until the backend is wired up.
    return calculateFareEstimate(payload);
  }
}

// Sends customer data to the server-side enquiry route. Telegram credentials
// are intentionally never exposed to the browser.
export async function apiSubmitEnquiry(payload, event = "booking-confirmed") {
  const res = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, event }),
  });

  const response = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(response.error || "enquiry submission failed");
  return response;
}

/* ---- Small shared helpers ------------------------------------------------- */
export function vehicleLabel(vehicles, id) {
  return vehicles.find((v) => v.id === id)?.label ?? "—";
}
