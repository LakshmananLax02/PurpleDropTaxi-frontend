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

/* ---- Vehicle catalogue ---------------------------------------------------- */
export const FALLBACK_VEHICLES = [
  { id: "sedan", label: "Sedan", ratePerKm: 15, seats: 4, description: "Comfortable, budget-friendly rides for up to 4 — great for city trips." },
  { id: "etios", label: "Etios", ratePerKm: 16, seats: 4, description: "Reliable and fuel-efficient, ideal for everyday travel." },
  { id: "suv", label: "SUV", ratePerKm: 20, seats: 6, description: "Extra room for families and small groups on longer trips." },
  { id: "prime_suv", label: "Prime SUV", ratePerKm: 22, seats: 6, description: "A step up in comfort — premium SUV with extra legroom." },
];

export const VEHICLE_IMAGES = {
  sedan: "/images/sedanimg.png",
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
  { id: "tcr", name: "Tuticorin Airport (TCR)", lat: 8.7242, lng: 78.0257 },
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
    const vehicle = FALLBACK_VEHICLES.find((v) => v.id === payload.vehicleId) ?? FALLBACK_VEHICLES[0];
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

// TODO(backend): forward this payload to the Telegram bot/channel used by the
// tele-calling team AND persist it to the database.
export async function apiSubmitEnquiry(payload) {
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

/* ---- Small shared helpers ------------------------------------------------- */
export function vehicleLabel(vehicles, id) {
  return vehicles.find((v) => v.id === id)?.label ?? "—";
}
