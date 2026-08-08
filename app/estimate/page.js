"use client";

/**
 * ============================================================================
 * /estimate  —  PAGE 2
 * ----------------------------------------------------------------------------
 * Reads the enquiry from BookingContext (populated on page 1).
 *
 *  LEFT  : fare estimate breakdown + "Confirm Booking".
 *  RIGHT : Google Map with the pickup → drop route (directions).
 *
 * Stages on this page:
 *   "estimate"   → show fare + map
 *   "confirming" → full-card car-running animation while the enquiry submits
 *   "confirmed"  → confetti + confirmation summary
 *
 * Google Maps is optional: with a key, the map draws real directions and the
 * distance feeds the fare. Without a key it shows a graceful placeholder and
 * the fare falls back to a distance-0 estimate until the key is added.
 * ========================================================================== */
//new functionalities added new
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from "@react-google-maps/api";
import {
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Gauge,
  MapPin,
  Navigation,
  Route as RouteIcon,
  ShieldCheck,
  User,
} from "lucide-react";

import { useBooking } from "../context/BookingContext";
import CarLoadingAnimation from "../Components/booking/CarLoadingAnimation";
import Confetti from "../Components/booking/Confetti";
import {
  COLORS,
  FALLBACK_VEHICLES,
  GOOGLE_MAPS_LIBRARIES,
  DEFAULT_CENTER,
  apiEstimateFare,
  apiSubmitEnquiry,
  vehicleLabel,
} from "../lib/booking";

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%", borderRadius: "16px" };

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#1bc5d8] shrink-0">{icon}</span>
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

function formatDuration(minutes) {
  const totalMinutes = Math.max(0, Math.round(Number(minutes) || 0));
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  return hours ? `${hours} hrs ${remainingMinutes} mins` : `${remainingMinutes} mins`;
}

export default function EstimatePage() {
  const router = useRouter();
  const { booking, hydrated } = useBooking();

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const mapRef = useRef(null);
  const routeTimeoutRef = useRef(null);
  const [directions, setDirections] = useState(null);
  const [routeMeta, setRouteMeta] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [fare, setFare] = useState(null);
  const [stage, setStage] = useState("estimate"); // estimate | confirming | confirmed
  const [enquiry, setEnquiry] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const form = booking?.form;
  const tripType = booking?.tripType ?? "oneway";
  const pickupCoords = booking?.pickupCoords ?? null;
  const dropCoords = booking?.dropCoords ?? null;
  const selectedVehicleLabel = vehicleLabel(FALLBACK_VEHICLES, form?.vehicle);
  const displayedDistanceKm = fare?.distanceKm ?? routeMeta?.distanceKm;
  const displayedDurationMins = fare?.durationMins ?? routeMeta?.durationMins;

  /* ---- Redirect back to the form if there's no enquiry (e.g. deep link) ---- */
  useEffect(() => {
    if (hydrated && !booking) router.replace("/");
  }, [hydrated, booking, router]);

  /* ---- Compute the driving route once the map + both coords are ready ---- */
  const computeRoute = useCallback(() => {
    if (!isLoaded || !pickupCoords || !dropCoords || !window.google) return;
    if (routeTimeoutRef.current) window.clearTimeout(routeTimeoutRef.current);
    const service = new window.google.maps.DirectionsService();
    routeTimeoutRef.current = window.setTimeout(() => {
      setRouteError("Route calculation timed out. Check the Google Maps API key, billing, and allowed website referrers.");
    }, 12000);
    service.route(
      { origin: pickupCoords, destination: dropCoords, travelMode: window.google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (routeTimeoutRef.current) window.clearTimeout(routeTimeoutRef.current);
        if (status === "OK" && result) {
          setRouteError(null);
          setDirections(result);
          const leg = result.routes[0]?.legs[0];
          if (leg?.distance && leg?.duration) {
            setRouteMeta({
              distanceKm: Math.round((leg.distance.value / 1000) * 10) / 10,
              durationMins: Math.round(leg.duration.value / 60),
            });
          }
          if (mapRef.current && result.routes[0]?.bounds) mapRef.current.fitBounds(result.routes[0].bounds);
        } else {
          setDirections(null);
          setRouteMeta(null);
          setRouteError(
            status === "ZERO_RESULTS"
              ? "Google Maps could not find a driving route for these locations."
              : `Google Maps route request failed (${status}). Enable and allow the Directions API for this key.`
          );
        }
      }
    );
  }, [isLoaded, pickupCoords, dropCoords]);

  useEffect(() => {
    computeRoute();
  }, [computeRoute]);

  useEffect(() => () => {
    if (routeTimeoutRef.current) window.clearTimeout(routeTimeoutRef.current);
  }, []);

  /* ---- (Re)compute the fare: immediately on load, then again when a real
   *      route distance arrives from the Directions API. ---- */
  useEffect(() => {
    if (!form || !routeMeta) return;
    let cancelled = false;
    apiEstimateFare({
      pickup: form.pickup,
      drop: form.drop,
      distanceKm: routeMeta?.distanceKm ?? 0,
      durationMins: routeMeta?.durationMins ?? 0,
      vehicleId: form.vehicle,
      tripType,
    }).then((f) => {
      if (!cancelled) setFare(f);
    });
    return () => {
      cancelled = true;
    };
  }, [form, routeMeta, tripType]);

  /* ---- Confirm → car animation → confirmation ---- */
  const handleConfirm = async () => {
    if (!fare) return;
    setSubmitError(null);
    setStage("confirming");
    try {
      const [record] = await Promise.all([
        apiSubmitEnquiry({ form, fare, tripType, enquiryId: booking?.enquiryId }, "booking-confirmed"),
        new Promise((r) => setTimeout(r, 3600)), // let the animation play through
      ]);
      setEnquiry(record);
      setStage("confirmed");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong while sending your enquiry. Please try again.");
      setStage("estimate");
    }
  };

  /* ---- Loading / empty guards ---- */
  if (!hydrated || (!booking && !enquiry)) {
    return (
      <main className="flex-1 flex items-center justify-center" style={{ background: COLORS.bg }}>
        <p className="text-sm text-[#64748B]">Loading your estimate…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full" style={{ background: COLORS.bg }}>
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#1E293B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Edit booking
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-[#1bc5d8] bg-[#f1fbfc]">
            {tripType === "roundtrip" ? "Round Trip" : tripType === "airport" ? "Airport Pickup" : "One Way"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* ================= LEFT: ESTIMATE + CONFIRM =================
              Mobile: estimate on top, map below. Desktop: estimate left, map right.
              Same rotating-gradient border as the booking form card / fleet
              cards, for visual consistency across the site. */}
          <div
            className="relative order-1 lg:col-span-3 rounded-[20px] shadow-xl overflow-hidden"
            style={{ boxShadow: "0 20px 45px -12px rgba(88,21,183,0.18)" }}
          >
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[200%] w-32 -translate-x-1/2 -translate-y-1/2 animate-spin [animation-duration:6s]"
              style={{ background: "linear-gradient(180deg, #7c2bea 0%, #a55cff 35%, #1bc5d8 70%, #5815b7 100%)" }}
            />
            <div className="absolute inset-[2px] rounded-[18px] bg-white" />

            {/* Actual content, lifted above the inset white plate: without
                explicit positioning here, the plate (position:absolute)
                would paint OVER this content regardless of DOM order, since
                static-positioned elements always sit below positioned ones
                in the same stacking context. */}
            <div className="relative z-10">
            {/* Car animation overlay while confirming */}
            <CarLoadingAnimation
              active={stage === "confirming"}
              pickup={form?.pickup}
              drop={form?.drop}
            />

            <AnimatePresence mode="wait">
              {/* ---------- ESTIMATE ---------- */}
              {stage !== "confirmed" && (
                <motion.div
                  key="estimate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 md:p-8"
                >
                  {/* Route */}
                  <div className="text-center mb-5">
                    <p className="text-sm font-semibold text-[#1E293B]">{form?.pickup}</p>
                    <div className="text-[#1bc5d8] my-0.5">↓</div>
                    <p className="text-sm font-semibold text-[#1E293B]">{form?.drop}</p>
                  </div>

                  {/* Fare */}
                  <div className="rounded-2xl border-2 border-dashed p-6 text-center mb-6" style={{ borderColor: "#b8eaf0", background: "#f1fbfc" }}>
                    {fare ? (
                      <>
                        <p className="text-4xl font-extrabold text-[#1E293B]">₹{fare.fare.toLocaleString("en-IN")}</p>
                        <p className="text-xs font-medium text-[#64748B] mt-1">Estimated Fare</p>
                      </>
                    ) : (
                      <p className="text-sm text-[#64748B]">
                        {loadError
                          ? "Google Maps could not load. Check the API key and enabled APIs."
                          : routeError ?? "Calculating fare…"}
                      </p>
                    )}
                  </div>

                  {/* Details */}
                  {fare && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-6">
                      {/* routeMeta is only set once a real Directions result comes back — without
                          it fare.distanceKm/durationMins are just the 0 fallback, so show a
                          plain "—" instead of a misleading "0 km"/"0 mins". */}
                      <DetailRow icon={<RouteIcon className="w-4 h-4" />} label="Distance" value={routeMeta ? `${fare.distanceKm} km` : "—"} />
                      <DetailRow icon={<Gauge className="w-4 h-4" />} label="Billable Distance" value={`${fare.billableKm} km`} />
                      <DetailRow icon={<User className="w-4 h-4" />} label="Driver Bata" value={`₹${fare.driverBata}`} />
                      <DetailRow icon={<Gauge className="w-4 h-4" />} label="Rate per KM" value={`₹${fare.ratePerKm}`} />
                      <DetailRow icon={<Navigation className="w-4 h-4" />} label="Base Fare" value={`₹${fare.baseFare.toLocaleString("en-IN")}`} />
                      <DetailRow icon={<Clock className="w-4 h-4" />} label="Duration" value={routeMeta ? formatDuration(fare.durationMins) : "—"} />
                      <DetailRow icon={<ShieldCheck className="w-4 h-4" />} label="Tolls & Parking" value="Extra at actuals" />
                      <DetailRow icon={<Car className="w-4 h-4" />} label="Vehicle" value={selectedVehicleLabel} />
                      <DetailRow icon={<Calendar className="w-4 h-4" />} label="Pickup Date" value={form?.pickupDate} />
                      <DetailRow icon={<Clock className="w-4 h-4" />} label="Pickup Time" value={form?.pickupTime} />
                    </div>
                  )}

                  {!routeMeta && (
                    <p className="text-[11px] text-[#94A3B8] mb-3 text-center">
                      {loadError
                        ? "Google Maps could not load. Check the API key and enabled APIs."
                        : routeError ?? "Distance-based pricing activates once the Google Maps route loads."}
                    </p>
                  )}
                  {submitError && <p className="text-xs font-medium text-red-500 mb-3 text-center">{submitError}</p>}

                  <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                    <button
                      onClick={() => router.push("/")}
                      className="btn btn-ghost h-[54px] w-full whitespace-nowrap px-3 text-xs font-bold sm:min-w-0 sm:flex-1 sm:px-6 sm:text-sm"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={!fare || !routeMeta}
                      className="btn btn-primary h-[54px] w-full whitespace-nowrap px-3 text-xs font-black uppercase tracking-[0.08em] sm:min-w-0 sm:flex-1 sm:px-6 sm:text-sm sm:tracking-wider"
                    >
                      Confirm Booking →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ---------- CONFIRMED ---------- */}
              {stage === "confirmed" && enquiry && (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative p-6 md:p-8"
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
                    <h2 className="text-xl font-extrabold text-[#1E293B]">Booking Request Received</h2>
                    <div className="mt-3 w-full max-w-md rounded-2xl border border-[#B8EAF0] bg-[#F1FBFC] p-4 text-left shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#64748B]">
                        Booking reference
                      </p>
                      <p className="mt-1 text-lg font-black tracking-wide text-[#5815B7]">{enquiry.enquiryId}</p>
                      <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                        Our booking team will call{' '}
                        <span className="font-bold text-[#1E293B]">{enquiry.mobile}</span> shortly to confirm your ride
                        details.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] mb-6">
                    <SuccessRow label="Pickup" value={enquiry.pickup} />
                    <SuccessRow label="Drop" value={enquiry.drop} />
                    <SuccessRow label="Vehicle" value={selectedVehicleLabel} />
                    <SuccessRow label="Estimated Fare" value={`₹${Number(enquiry.fare).toLocaleString("en-IN")}`} />
                    <SuccessRow label="Customer Name" value={enquiry.customerName} />
                    <SuccessRow label="Mobile Number" value={enquiry.mobile} />
                    <SuccessRow label="Pickup Date" value={enquiry.pickupDate} />
                    <SuccessRow label="Pickup Time" value={enquiry.pickupTime} />
                  </div>

                  <button
                    onClick={() => router.push("/")}
                    className="btn btn-primary w-full h-[54px] text-sm font-black uppercase tracking-wider"
                  >
                    Book Another Ride
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>

          {/* ================= RIGHT: MAP + DIRECTIONS ================= */}
          <div
            className="order-2 lg:col-span-2 flex flex-col rounded-[20px] border overflow-hidden shadow-lg bg-white"
            style={{ borderColor: COLORS.border }}
          >
            <div className="relative flex-1 min-h-[300px] md:min-h-[420px] p-4 md:p-5">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  center={pickupCoords ?? DEFAULT_CENTER}
                  zoom={11}
                  onLoad={(map) => (mapRef.current = map)}
                  options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
                >
                  {pickupCoords && !directions && <Marker position={pickupCoords} label="P" />}
                  {dropCoords && !directions && <Marker position={dropCoords} label="D" />}
                  {directions && (
                    <DirectionsRenderer
                      directions={directions}
                      options={{ polylineOptions: { strokeColor: COLORS.gradientFrom, strokeWeight: 5 } }}
                    />
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-2 text-[#94A3B8] text-sm font-semibold bg-slate-100">
                  <MapPin className="w-6 h-6" />
                  Map preview
                  <span className="text-[11px] font-normal">Add a Google Maps API key to see live directions</span>
                </div>
              )}

              {routeMeta && (
                <div className="absolute bottom-8 left-8 flex gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-[#1E293B] shadow-md">
                    <RouteIcon className="w-3.5 h-3.5 text-[#1bc5d8]" /> {displayedDistanceKm} km
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-[#1E293B] shadow-md">
                    <Clock className="w-3.5 h-3.5 text-[#1bc5d8]" /> {formatDuration(displayedDurationMins)}
                  </div>
                </div>
              )}
            </div>

            {/* From / To summary under the map — always shown here (not just as
                a pill over the map) so distance/duration stay visible even if
                the map is scrolled, small, or still loading. */}
            <div className="border-t border-[#E2E8F0] p-4 md:p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
                <span className="text-[#64748B]">From</span>
                <span className="font-semibold text-[#1E293B] truncate">{form?.pickup}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#1bc5d8] shrink-0" />
                <span className="text-[#64748B]">To</span>
                <span className="font-semibold text-[#1E293B] truncate">{form?.drop}</span>
              </div>
              {routeMeta && (
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <RouteIcon className="w-3.5 h-3.5 text-[#1bc5d8]" />
                    <span className="text-[#64748B]">Distance</span>
                    <span className="font-semibold text-[#1E293B]">{displayedDistanceKm} km</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-3.5 h-3.5 text-[#1bc5d8]" />
                    <span className="text-[#64748B]">Duration</span>
                    <span className="font-semibold text-[#1E293B]">{formatDuration(displayedDurationMins)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
