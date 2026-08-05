"use client";

/**
 * ============================================================================
 * BookingSection.js  —  PAGE 1 (homepage hero)
 * ----------------------------------------------------------------------------
 * Layout: an auto-sliding CAROUSEL is the BACKGROUND of the whole section.
 *   - LEFT  column: the carousel's marketing content (headline/badge/subtext),
 *     which changes with each auto-advancing slide.
 *   - RIGHT column: the enquiry FORM card, sitting on top of the carousel.
 *
 * Submitting the form no longer flips an in-page stage machine. Instead it
 * saves the enquiry to BookingContext (+ sessionStorage) and navigates to
 * /estimate (page 2), where the map, fare and confirmation live.
 *
 * The Google Maps key is optional here: Places Autocomplete upgrades the
 * pickup/drop inputs when a key is present, and captures lat/lng so page 2 can
 * draw directions. Without a key the inputs are plain text and page 2 falls
 * back gracefully.
 * ========================================================================== */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import {
  Calendar,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  ImageOff,
  Luggage,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  UserCircle2,
  Users,
} from "lucide-react";

import { useBooking } from "../context/BookingContext";
import {
  COLORS,
  FALLBACK_VEHICLES,
  VEHICLE_IMAGES,
  TAMIL_NADU_AIRPORTS,
  GOOGLE_MAPS_LIBRARIES,
  DEFAULT_CENTER,
  bookingFormSchema,
  defaultFormValues,
  apiGetVehicles,
  apiSubmitEnquiry,
  calculateFareEstimate,
  getVehicleRate,
} from "../lib/booking";

/* ============================================================================
 * CAROUSEL SLIDES (background image + left-side content)
 * ========================================================================== */
const SLIDES = [
  {
    id: "confidence",
    image: "/images/carouselimg1.png",
    badge: "No.1 trusted drop taxi service in South India",
    prefix: "Travel Across Tamil Nadu",
    highlight: "With Confidence",
    subtext:
      "Precision, safety and comfort on every mile — South India's premier chauffeur service.",
  },
  {
    id: "oneway",
    image: "/images/carouselimg2.png",
    badge: "Outstation cabs, done right",
    prefix: "One-Way Drops,",
    highlight: "Zero Return Fare",
    subtext: "Pay only for the distance you travel — no hidden return charges, ever.",
  },
  {
    id: "airport",
    image: "/images/carouselimg3.png",
    badge: "On-time, every time",
    prefix: "Airport Pickups,",
    highlight: "Perfectly Timed",
    subtext: "Verified drivers and live tracking mean your cab is there when you land.",
  },
  // {
  //   id: "fleet",
  //   image: "/images/primesuvimg.png",
  //   badge: "Premium fleet",
  //   prefix: "Ride in Comfort,",
  //   highlight: "Prime SUVs & Sedans",
  //   subtext: "A clean, well-maintained fleet for families, groups and business travel.",
  // },
];

/* ============================================================================
 * SMALL PRESENTATIONAL HELPERS
 * ========================================================================== */
function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-red-500">{message}</p>;
}

function InputShell({ icon, children, hasError }) {
  return (
    <div
      className={[
        "flex h-[50px] items-center gap-2 px-2.5 sm:gap-2.5 sm:px-3.5 rounded-xl bg-white border transition-all duration-200",
        "focus-within:ring-2 focus-within:ring-[#7c2bea]/25 focus-within:border-[#7c2bea] focus-within:hover:border-[#7c2bea]",
        hasError ? "border-red-400" : "border-[#b8eaf0] hover:border-[#1bc5d8]",
      ].join(" ")}
    >
      <span className="text-[#1bc5d8] shrink-0">{icon}</span>
      {children}
    </div>
  );
}

// Uses the current Places Autocomplete Data API while keeping the project's
// existing branded input design. The older google.maps.places.Autocomplete
// widget is unavailable for new Google Cloud customers.
function PlacesAutocompleteInput({ value, onValueChange, onPlaceSelect, onBlur, placeholder, dropdownAlign = "left" }) {
  const [suggestions, setSuggestions] = useState([]);
  const [placesLibrary, setPlacesLibrary] = useState(null);
  const requestIdRef = React.useRef(0);

  useEffect(() => {
    let active = true;
    if (!window.google?.maps?.importLibrary) return undefined;

    window.google.maps.importLibrary("places")
      .then(({ AutocompleteSuggestion }) => {
        if (active) setPlacesLibrary({ AutocompleteSuggestion });
      })
      .catch((error) => {
        console.error("Google Places library could not be loaded:", error);
        if (active) setPlacesLibrary(null);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    const query = value?.trim();
    if (!placesLibrary || !query) {
      return undefined;
    }

    const requestId = ++requestIdRef.current;
    const timer = window.setTimeout(async () => {
      try {
        const { suggestions: nextSuggestions = [] } = await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: query,
          includedRegionCodes: ["in"],
        });
        if (requestId === requestIdRef.current) {
          setSuggestions(nextSuggestions.filter((item) => item.placePrediction));
        }
      } catch (error) {
        console.error("Google place recommendations could not be loaded:", error);
        if (requestId === requestIdRef.current) setSuggestions([]);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [value, placesLibrary]);

  const selectSuggestion = async (suggestion) => {
    const prediction = suggestion.placePrediction;
    if (!prediction) return;

    try {
      const place = prediction.toPlace();
      await place.fetchFields({ fields: ["displayName", "formattedAddress", "location"] });
      const address = place.formattedAddress || place.displayName || prediction.text?.text || value;
      const location = place.location;
      onValueChange(address);
      if (location) onPlaceSelect({ lat: location.lat(), lng: location.lng() });
    } catch (error) {
      console.error("Google place details could not be loaded:", error);
      onValueChange(prediction.text?.text || value);
    } finally {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onBlur={() => {
          window.setTimeout(() => setSuggestions([]), 150);
          onBlur?.();
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400"
      />
      {value?.trim() && suggestions.length > 0 && (
        <div
          className={[
            "absolute top-[calc(100%+12px)] z-50 w-[min(17rem,calc(100vw-3rem))] max-w-[calc(100vw-3rem)] overflow-hidden rounded-xl border border-[#b8eaf0] bg-white shadow-xl sm:left-0 sm:right-0 sm:w-auto",
            dropdownAlign === "right" ? "right-0" : "left-0",
          ].join(" ")}
        >
          {suggestions.map((suggestion, index) => {
            const prediction = suggestion.placePrediction;
            return (
              <button
                key={`${prediction.placeId ?? prediction.text?.text ?? "place"}-${index}`}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className="flex w-full items-start gap-2.5 border-b border-slate-100 px-3 py-2.5 text-left text-sm text-[#1E293B] last:border-b-0 hover:bg-[#f1fbfc]"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1bc5d8]" />
                <span className="line-clamp-2">{prediction.text?.text}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---- 12-hour circular clock-face time picker ------------------------------
 * <input type="time"> always renders in whatever 12h/24h format the user's
 * OS/browser locale is set to — there is no HTML/CSS way to force 12h+AM/PM
 * on the native control, so this is a fully custom dial: tap a field to open
 * a popover with a round clock face (12 numbers arranged in a circle, like a
 * real clock) — tap a number to set the hour, it auto-advances to minutes,
 * tap a minute mark, then pick AM/PM. The composed value is stored as a
 * single "hh:mm AM/PM" string — exactly how it's displayed verbatim on the
 * estimate/confirmation pages later, so no conversion needed downstream. */
const CLOCK_HOURS = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i)); // 12,1,2,...,11
const CLOCK_MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,10,...,55 marks

function parseTimeValue(value) {
  const m = /^(\d{2}):(\d{2})\s?(AM|PM)$/i.exec(value || "");
  if (!m) return { hour: "", minute: "", period: "" };
  return { hour: m[1], minute: m[2], period: m[3].toUpperCase() };
}

function formatTimeValue({ hour, minute, period }) {
  return hour && minute && period ? `${hour}:${minute} ${period}` : "";
}

// Position for clock number `n` (1-12 for hours, 0/5/10.../55 for minutes,
// treated as "steps" 0-11 around the dial) on a circle of radius R centered
// at (cx, cy). Step 0 is placed at the top (12 o'clock), going clockwise.
function clockPointFor(stepIndex, cx, cy, r) {
  const angle = (stepIndex / 12) * 2 * Math.PI - Math.PI / 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function ClockFace({ mode, hour, minute, onPickHour, onPickMinute }) {
  const cx = 110, cy = 110, r = 82;
  const selectedStep =
    mode === "hour"
      ? hour
        ? (Number(hour) % 12)
        : null
      : minute !== ""
      ? Math.round(Number(minute) / 5) % 12
      : null;
  const handPoint = selectedStep !== null ? clockPointFor(selectedStep, cx, cy, r) : null;

  return (
    <svg viewBox="0 0 220 220" className="w-full h-auto select-none" role="img" aria-label={`${mode} dial`}>
      <circle cx={cx} cy={cy} r={100} fill="#f1fbfc" />
      {handPoint && (
        <>
          <line x1={cx} y1={cy} x2={handPoint.x} y2={handPoint.y} stroke={COLORS.gradientFrom} strokeWidth={2} />
          <circle cx={handPoint.x} cy={handPoint.y} r={16} fill={COLORS.gradientFrom} />
        </>
      )}
      <circle cx={cx} cy={cy} r={3.5} fill={COLORS.gradientFrom} />
      {mode === "hour"
        ? CLOCK_HOURS.map((h, i) => {
            const { x, y } = clockPointFor(i, cx, cy, r);
            const isSelected = hour && Number(hour) === h;
            return (
              <text
                key={h}
                x={x}
                y={y}
                dy="0.32em"
                textAnchor="middle"
                onClick={() => onPickHour(String(h).padStart(2, "0"))}
                className="cursor-pointer text-[15px] font-bold"
                fill={isSelected ? "#FFFFFF" : "#1E293B"}
              >
                {h}
              </text>
            );
          })
        : CLOCK_MINUTES.map((m, i) => {
            const { x, y } = clockPointFor(i, cx, cy, r);
            const isSelected = minute !== "" && Number(minute) === m;
            return (
              <text
                key={m}
                x={x}
                y={y}
                dy="0.32em"
                textAnchor="middle"
                onClick={() => onPickMinute(String(m).padStart(2, "0"))}
                className="cursor-pointer text-[15px] font-bold"
                fill={isSelected ? "#FFFFFF" : "#1E293B"}
              >
                {String(m).padStart(2, "0")}
              </text>
            );
          })}
    </svg>
  );
}

/* Shared modal shell for both pickers below. Fixed + viewport-centered
 * (not anchored to the trigger field) so it can NEVER overflow off-screen
 * regardless of where the field sits in the layout — the failure mode of
 * an absolute-positioned dropdown on a narrow mobile viewport. Clicking the
 * backdrop closes it. */
function PickerModal({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[280px] rounded-2xl bg-white shadow-2xl p-4"
      >
        {/* Explicit dismiss affordance — closes without changing anything
            already picked, same as tapping the backdrop, just more
            discoverable (esp. on touch where the backdrop isn't obvious). */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 text-xs font-bold text-[#64748B] hover:text-[#1E293B] mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        {children}
      </div>
    </div>
  );
}

function TimePicker12h({ value, onChange }) {
  // Local state, independent of `value`: the composed "hh:mm AM/PM" string
  // is only non-empty once ALL THREE parts are picked, so deriving parts
  // purely from `value` would blank an in-progress selection the instant
  // only one part (e.g. just the hour) has been chosen so far.
  const [parts, setParts] = useState(() => parseTimeValue(value));
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("hour"); // "hour" | "minute"
  const { hour, minute, period } = parts;

  // Functional updater — reads the LATEST state, not the value captured in
  // this render's closure. Two picks fired in quick succession (e.g. tapping
  // a minute then immediately AM/PM) can both get scheduled before React
  // re-renders in between; with a plain `{...parts, ...patch}` closure both
  // updates would start from the same stale snapshot and the second one
  // would silently overwrite the first's change.
  const update = (patch) => setParts((prev) => ({ ...prev, ...patch }));

  // Notify the parent form whenever the composed parts actually change —
  // decoupled from the click handlers above, so it always sees the final,
  // fully-applied state rather than whatever a given click's closure had.
  useEffect(() => {
    onChange(formatTimeValue(parts));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parts.hour, parts.minute, parts.period]);

  const openAt = (m) => {
    setMode(m);
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openAt(hour ? "minute" : "hour")}
        className="w-full text-left bg-transparent outline-none text-sm text-[#1E293B]"
      >
        {hour && minute && period ? `${hour}:${minute} ${period}` : <span className="text-slate-400">--:-- --</span>}
      </button>

      {open && (
        <PickerModal onClose={() => setOpen(false)}>
          {/* Digital readout + AM/PM toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1 text-lg font-black">
              <button
                type="button"
                onClick={() => setMode("hour")}
                className={mode === "hour" ? "text-[#5815b7]" : "text-[#1E293B]"}
              >
                {hour || "--"}
              </button>
              <span className="text-[#1E293B]">:</span>
              <button
                type="button"
                onClick={() => setMode("minute")}
                className={mode === "minute" ? "text-[#5815b7]" : "text-[#1E293B]"}
              >
                {minute || "--"}
              </button>
            </div>
            <div className="flex rounded-lg bg-[#F1F5F9] p-0.5">
              {["AM", "PM"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => update({ period: p })}
                  className={[
                    "px-2.5 py-1 rounded-md text-xs font-bold transition-colors",
                    period === p ? "text-white" : "text-[#64748B]",
                  ].join(" ")}
                  style={period === p ? { background: COLORS.gradientFrom } : undefined}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <ClockFace
            mode={mode}
            hour={hour}
            minute={minute}
            onPickHour={(h) => {
              update({ hour: h });
              setMode("minute");
            }}
            onPickMinute={(m) => {
              update({ minute: m });
            }}
          />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="btn btn-primary w-full h-9 mt-3 text-xs font-black uppercase tracking-wider"
          >
            Done
          </button>
        </PickerModal>
      )}
    </>
  );
}

/* ---- Branded calendar date picker ------------------------------------------
 * <input type="date"> opens the browser/OS's own generic calendar UI, which
 * doesn't match the app at all. This is a small custom month-grid calendar
 * styled with the same purple palette as everything else, using the same
 * PickerModal shell as the time picker above for a consistent feel. Value
 * is still stored as a plain ISO "YYYY-MM-DD" string (unchanged validation/
 * downstream display), just picked through a branded UI instead of the
 * native one. */
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toISODate(y, m, d) {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}

function parseISODate(value) {
  const mtch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!mtch) return null;
  return { y: Number(mtch[1]), m: Number(mtch[2]) - 1, d: Number(mtch[3]) };
}

function formatDisplayDate(value) {
  const parsed = parseISODate(value);
  if (!parsed) return "";
  return `${parsed.d} ${MONTH_LABELS[parsed.m].slice(0, 3)} ${parsed.y}`;
}

// Mon-Sat/Sun-first 6x7 grid for the given month, including the leading/
// trailing days of the adjacent months needed to fill whole weeks.
function buildCalendarGrid(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function DatePickerCalendar({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const selected = parseISODate(value);
  const [viewYear, setViewYear] = useState(selected ? selected.y : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected ? selected.m : today.getMonth());

  const todayISO = toISODate(today.getFullYear(), today.getMonth(), today.getDate());
  const isPastMonth = viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonth < today.getMonth());
  const cells = buildCalendarGrid(viewYear, viewMonth);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const pickDay = (d) => {
    const iso = toISODate(viewYear, viewMonth, d);
    if (iso < todayISO) return; // no past dates
    onChange(iso);
    setOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="w-full text-left bg-transparent outline-none text-sm text-[#1E293B]">
        {value ? formatDisplayDate(value) : <span className="text-slate-400">dd-mm-yyyy</span>}
      </button>

      {open && (
        <PickerModal onClose={() => setOpen(false)}>
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={goPrevMonth}
              disabled={isPastMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#64748B] hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <p className="text-sm font-black text-[#1E293B]">
              {MONTH_LABELS[viewMonth]} {viewYear}
            </p>
            <button type="button" onClick={goNextMonth} className="w-7 h-7 rounded-full flex items-center justify-center text-[#64748B] hover:bg-slate-100">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAY_LABELS.map((w) => (
              <span key={w} className="text-[10px] font-bold text-[#94A3B8] uppercase">{w}</span>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <span key={i} />;
              const iso = toISODate(viewYear, viewMonth, d);
              const isPast = iso < todayISO;
              const isSelected = iso === value;
              const isToday = iso === todayISO;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pickDay(d)}
                  disabled={isPast}
                  className={[
                    "h-8 w-8 mx-auto rounded-full text-xs font-semibold transition-colors",
                    isSelected ? "text-white" : isPast ? "text-slate-300" : "text-[#1E293B] hover:bg-[#f1fbfc]",
                    isToday && !isSelected ? "ring-1 ring-[#1bc5d8]" : "",
                  ].join(" ")}
                  style={isSelected ? { background: COLORS.gradientFrom } : undefined}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </PickerModal>
      )}
    </>
  );
}

function CheckboxPill({ label, icon, checked, onChange }) {
  return (
    <label
      className={[
        "h-full flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer select-none transition-colors",
        checked ? "border-[#1bc5d8] bg-[#f1fbfc]" : "border-[#b8eaf0] bg-white hover:border-[#7c2bea] hover:bg-slate-50",
      ].join(" ")}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span className={["shrink-0", checked ? "text-[#1bc5d8]" : "text-[#64748B]"].join(" ")}>{icon}</span>
      <span className="text-sm font-medium text-[#1E293B] leading-snug text-center">{label}</span>
    </label>
  );
}

function VehicleImage({ src, alt, className }) {
  if (src) return <img src={src} alt={alt} className={className} />;
  return (
    <div className={[className, "flex items-center justify-center bg-slate-100 text-slate-300"].join(" ")}>
      <ImageOff className="w-1/3 h-1/3" strokeWidth={1.5} />
    </div>
  );
}

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

/* ---- Branded airport picker ------------------------------------------------
 * The native <select> for choosing a drop airport opens the browser/OS's own
 * generic list UI (see the earlier date/time fixes for the same problem).
 * This swaps it for a scrollable list in the same PickerModal shell as the
 * calendar/clock, with the selected row styled exactly like a selected
 * vehicle card (VehicleSelectGrid below) for a consistent "selected" look
 * across the whole form. */
function AirportSelect({ airports, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-w-0 flex-1 items-center justify-between gap-2 bg-transparent text-left text-sm outline-none"
      >
        <span className={["flex-1 min-w-0 truncate", value ? "text-[#1E293B]" : "text-slate-400"].join(" ")}>
          {value || "Select an airport"}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {open && (
        <PickerModal onClose={() => setOpen(false)}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-wide text-[#64748B]">Select Tamil Nadu airport</p>
            <span className="rounded-full bg-[#F1FBFC] px-2 py-1 text-[10px] font-bold text-[#1bc5d8]">
              {airports.length} airports
            </span>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto -mx-1 px-1">
            {airports.map((a) => {
              const isSelected = a.name === value;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    onChange(a);
                    setOpen(false);
                  }}
                  className={[
                    "w-full flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-150",
                    isSelected ? "text-white border-transparent shadow-md" : "text-[#1E293B] bg-white border-[#b8eaf0] hover:border-[#7c2bea]",
                  ].join(" ")}
                  style={isSelected ? { background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})` } : undefined}
                >
                  <MapPin className={["w-4 h-4 shrink-0", isSelected ? "text-white" : "text-[#1bc5d8]"].join(" ")} />
                  <span className="text-sm font-semibold flex-1">{a.name}</span>
                </button>
              );
            })}
          </div>
        </PickerModal>
      )}
    </>
  );
}

function VehicleSelectGrid({ vehicles, value, onChange, hasError, tripType }) {
  const vehiclesWithRates = vehicles.map((vehicle) => ({
    ...vehicle,
    ratePerKm: getVehicleRate(vehicle.id, tripType),
  }));
  const selected = vehiclesWithRates.find((v) => v.id === value);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-black uppercase tracking-wide">Select Cab Type</label>
        {selected && (
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})` }}
          >
            {selected.label.toUpperCase()} ₹{selected.ratePerKm}/km
          </span>
        )}
      </div>
      <div className="flex overflow-x-auto gap-2.5 pb-1 -mx-1 px-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
        {vehiclesWithRates.map((v) => {
          const isSelected = v.id === value;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onChange(v.id)}
              className={[
                "shrink-0 w-[104px] sm:w-auto flex flex-col items-center gap-1.5 rounded-xl border-2 px-2.5 py-3 transition-all duration-150",
                isSelected ? "text-white border-transparent shadow-md" : "text-[#1E293B] bg-white border-[#b8eaf0] hover:border-[#7c2bea]",
              ].join(" ")}
              style={isSelected ? { background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})` } : undefined}
            >
              <VehicleImage src={VEHICLE_IMAGES[v.id]} alt={v.label} className="w-12 h-9 object-contain" />
              <span className="text-xs font-bold">{v.label}</span>
              <span className={isSelected ? "text-white/85 text-[11px] font-semibold" : "text-[#1bc5d8] text-[11px] font-semibold"}>
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
 * CAROUSEL BACKGROUND (image layer + left content) — auto-advancing
 * ========================================================================== */
function CarouselContent({ slide }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slide.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.45 }}
        className="max-w-lg"
      >
        <span
          className="inline-flex items-center gap-1.5 rounded-full text-white text-xs font-semibold px-3.5 py-1.5 mb-5"
          style={{ background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})` }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          {slide.badge}
        </span>
        <h1 className="page-title-pattern carousel-title-pattern">
          {slide.prefix}
          <br />
          <span style={{ color: COLORS.gradientTo }}>{slide.highlight}</span>
        </h1>
        <p className="mt-4 text-sm md:text-base text-white">{slide.subtext}</p>
      </motion.div>
    </AnimatePresence>
  );
}

function formatRouteDuration(minutes) {
  const totalMinutes = Math.max(0, Math.round(Number(minutes) || 0));
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  return hours ? `${hours} hrs ${remainingMinutes} mins` : `${remainingMinutes} mins`;
}

function RouteFareTable({ routeMeta }) {
  if (!routeMeta) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-[#b8eaf0] bg-[#f1fbfc] px-4 py-5 text-center text-xs font-medium text-[#64748B]">
        Route-based one-way and round-trip fares will appear as soon as the map route loads.
      </div>
    );
  }

  const oneWayDistance = routeMeta.distanceKm;
  const oneWayDuration = routeMeta.durationMins;
  const roundTripDistance = oneWayDistance * 2;
  const roundTripDuration = oneWayDuration * 2;

  return (
    <section className="mt-4 rounded-2xl border border-[#b8eaf0] bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-black text-[#1E293B]">Route Fare Comparison</h3>
          <p className="mt-0.5 text-[11px] text-[#64748B]">Includes ₹400 driver bata. Tolls and parking are extra.</p>
        </div>
        <span className="rounded-full bg-[#F1FBFC] px-2 py-1 text-[10px] font-bold text-[#1bc5d8]">Live estimate</span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[#b8eaf0] bg-[#f1fbfc] p-2.5">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#64748B]">One way</p>
          <p className="mt-1 text-xs font-bold text-[#1E293B]">{oneWayDistance} km</p>
          <p className="text-[11px] text-[#64748B]">{formatRouteDuration(oneWayDuration)}</p>
        </div>
        <div className="rounded-xl border border-[#d8c4fb] bg-[#faf7ff] p-2.5">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#5815b7]">Round trip</p>
          <p className="mt-1 text-xs font-bold text-[#1E293B]">{roundTripDistance} km</p>
          <p className="text-[11px] text-[#64748B]">{formatRouteDuration(roundTripDuration)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
        <table className="w-full min-w-[500px] text-left text-[11px]">
          <thead className="bg-[#F8F6FC] text-[#5815b7]">
            <tr>
              <th className="px-3 py-2.5 font-black uppercase tracking-wide">Cab</th>
              <th className="px-3 py-2.5 font-black uppercase tracking-wide">One Way</th>
              <th className="px-3 py-2.5 font-black uppercase tracking-wide">Round Trip</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-[#1E293B]">
            {FALLBACK_VEHICLES.map((vehicle) => {
              const oneWay = calculateFareEstimate({ vehicleId: vehicle.id, tripType: "oneway", distanceKm: oneWayDistance, durationMins: oneWayDuration });
              const roundTrip = calculateFareEstimate({ vehicleId: vehicle.id, tripType: "roundtrip", distanceKm: oneWayDistance, durationMins: oneWayDuration });
              return (
                <tr key={vehicle.id}>
                  <td className="px-3 py-2.5 font-bold">
                    <span className="flex items-center gap-2">
                      <img src={VEHICLE_IMAGES[vehicle.id]} alt="" className="h-7 w-11 object-contain" />
                      {vehicle.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="font-black text-[#1E293B]">₹{oneWay.fare.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-[#64748B]">₹{oneWay.ratePerKm}/km</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="font-black text-[#5815b7]">₹{roundTrip.fare.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-[#64748B]">₹{roundTrip.ratePerKm}/km</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BookingMapPreview({ isLoaded, pickupCoords, dropCoords, routeTitle }) {
  const mapRef = React.useRef(null);
  const [routeData, setRouteData] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const center = pickupCoords ?? DEFAULT_CENTER;
  const routeKey = pickupCoords && dropCoords
    ? `${pickupCoords.lat},${pickupCoords.lng}|${dropCoords.lat},${dropCoords.lng}`
    : "";
  const directions = routeData?.key === routeKey ? routeData.directions : null;
  const routeMeta = routeData?.key === routeKey ? routeData.meta : null;
  const visibleRouteError = routeError?.key === routeKey ? routeError.message : null;

  useEffect(() => {
    if (mapRef.current) mapRef.current.panTo(center);
  }, [center]);

  useEffect(() => {
    if (!isLoaded || !pickupCoords || !dropCoords || !window.google?.maps) return undefined;

    let active = true;
    const service = new window.google.maps.DirectionsService();
    service.route(
      { origin: pickupCoords, destination: dropCoords, travelMode: window.google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (!active) return;
        if (status === "OK" && result) {
          const leg = result.routes[0]?.legs[0];
          if (!leg?.distance || !leg?.duration) return;
          setRouteData({
            key: routeKey,
            directions: result,
            meta: {
              distanceKm: Math.round((leg.distance.value / 1000) * 10) / 10,
              durationMins: Math.round(leg.duration.value / 60),
            },
          });
          setRouteError(null);
          if (mapRef.current && result.routes[0]?.bounds) mapRef.current.fitBounds(result.routes[0].bounds);
        } else {
          setRouteData(null);
          setRouteError({ key: routeKey, message: "Google Maps could not find a driving route for these locations." });
        }
      }
    );

    return () => { active = false; };
  }, [isLoaded, pickupCoords, dropCoords, routeKey]);

  return (
    <aside className="order-2 lg:col-span-2 rounded-[20px] border border-[#b8eaf0] bg-white p-4 md:p-5 shadow-xl">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#1E293B]">{routeTitle || "Route Preview"}</h2>
        <p className="mt-0.5 text-xs text-[#64748B]">
          {routeMeta ? `${routeMeta.distanceKm} km • ${formatRouteDuration(routeMeta.durationMins)} driving route` : "Calculating the fastest driving route..."}
        </p>
      </div>

      <div className="h-[310px] overflow-hidden rounded-2xl bg-slate-100">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={pickupCoords || dropCoords ? 12 : 10}
            onLoad={(map) => (mapRef.current = map)}
            options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
          >
            {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true, polylineOptions: { strokeColor: "#5815b7", strokeWeight: 5 } }} />}
            {pickupCoords && <Marker position={pickupCoords} label="P" />}
            {dropCoords && <Marker position={dropCoords} label="D" />}
          </GoogleMap>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm font-semibold text-[#94A3B8]">
            <MapPin className="h-7 w-7 text-[#1bc5d8]" />
            Map preview
            <span className="text-[11px] font-normal">Add a Google Maps API key to see live directions.</span>
          </div>
        )}
      </div>
      {visibleRouteError && <p className="mt-3 text-center text-xs font-medium text-red-500">{visibleRouteError}</p>}
      <RouteFareTable routeMeta={routeMeta} />
    </aside>
  );
}

/* ============================================================================
 * MAIN — PAGE 1
 * ========================================================================== */
export default function BookingSection({ variant = "carousel", presetRoute = null }) {
  const isBookingPage = variant === "booking";
  const router = useRouter();
  const { setBooking } = useBooking();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [vehicles, setVehicles] = useState(FALLBACK_VEHICLES);
  const [tripType, setTripType] = useState("oneway");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [enquiryError, setEnquiryError] = useState(null);

  /* ---- Carousel autoplay ---- */
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlideIndex((i) => (i + 1) % SLIDES.length), 3000);
    return () => clearInterval(t);
  }, []);
  const slide = SLIDES[slideIndex];

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      ...defaultFormValues,
      pickup: presetRoute?.pickup ?? "",
      drop: presetRoute?.drop ?? "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    apiGetVehicles().then(setVehicles);
  }, []);

  // Reset drop when trip type changes (free-text ↔ airport picker mismatch).
  const handleTripTypeChange = (nextTripType) => {
    setTripType(nextTripType);
    setValue("drop", "");
    setDropCoords(null);
  };

  // Resolves free-typed text to coordinates via Google's Geocoder when the
  // customer typed a location but never clicked an Autocomplete suggestion
  // (the natural way most people fill a form — type, then move on). Returns
  // null if geocoding isn't possible/fails, so the caller can fall back
  // gracefully instead of blocking the whole submission.
  const geocodeAddress = (address) =>
    new Promise((resolve) => {
      if (!window.google?.maps) return resolve(null);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          resolve({ lat: loc.lat(), lng: loc.lng() });
        } else {
          resolve(null);
        }
      });
    });

  /* ---- Submit → persist → navigate to /estimate ---- */
  // NOTE: this never blocks the booking flow on geocoding. Coordinates are
  // "best effort" — if Autocomplete/Geocoder can resolve them (working,
  // billed API key) page 2 gets a real map + distance + duration; if not
  // (no key yet, or Google denies the request), pickup/dropCoords are just
  // null and page 2 falls back to its existing graceful placeholder state.
  // The booking itself (form → estimate → confirm) always goes through.
  const presetRouteKey = presetRoute?.pickup && presetRoute?.drop
    ? `${presetRoute.pickup}|${presetRoute.drop}`
    : "";
  const resolvedPresetRouteRef = React.useRef("");

  useEffect(() => {
    if (!isBookingPage || !isLoaded || !presetRouteKey || resolvedPresetRouteRef.current === presetRouteKey) return;
    resolvedPresetRouteRef.current = presetRouteKey;
    Promise.all([geocodeAddress(presetRoute.pickup), geocodeAddress(presetRoute.drop)]).then(([pickup, drop]) => {
      setPickupCoords(pickup);
      setDropCoords(drop);
    });
  }, [isBookingPage, isLoaded, presetRoute, presetRouteKey]);

  const onSubmit = async (values) => {
    setEnquiryError(null);
    let finalPickupCoords = pickupCoords;
    let finalDropCoords = dropCoords;

    if (isLoaded) {
      if (!finalPickupCoords && values.pickup) {
        finalPickupCoords = await geocodeAddress(values.pickup);
      }
      if (!finalDropCoords && values.drop && tripType !== "airport") {
        finalDropCoords = await geocodeAddress(values.drop);
      }
    }

    try {
      const enquiry = await apiSubmitEnquiry({ form: values, tripType }, "enquiry");
      setBooking({
        form: values,
        tripType,
        pickupCoords: finalPickupCoords,
        dropCoords: finalDropCoords,
        enquiryId: enquiry.enquiryId,
      });
      router.push("/estimate");
    } catch (error) {
      setEnquiryError(error.message || "We could not send your enquiry. Please try again.");
    }
  };

  return (
    <section className={`relative w-full overflow-hidden ${isBookingPage ? "" : "bg-white lg:bg-transparent"}`} style={isBookingPage ? { background: COLORS.bg } : undefined}>
      {!isBookingPage && (
        <div className="absolute inset-x-0 top-0 z-0 h-[320px] sm:h-[340px] lg:inset-0 lg:h-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img src={slide.image} alt="" className="h-full w-full object-contain object-top lg:object-cover lg:object-center" />
              <div className="absolute inset-0  from-[#1f043e]/40 via-[#1f043e]/40 to-black/40 lg:bg-gradient-to-r lg:from-[#1f043e]/70 lg:via-[#1f043e]/70 lg:to-black/70" />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ---- Carousel background image layer ---- */}
      {/* ---- Foreground: carousel content (left) + form (right) ---- */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-0 lg:px-8 lg:py-10">
        {/* Mobile: carousel content first, then the form peeking up beneath it
            (tight gap so at least the top half of the form is on-screen).
            Desktop: content left, form right. */}
        <div className={isBookingPage ? "grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-stretch" : "grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10 lg:items-start"}>
          {/* LEFT — carousel content + slide dots */}
          {!isBookingPage && <div className="order-1 flex flex-col justify-center py-8 lg:py-0 lg:pt-12">
            <CarouselContent slide={slide} />
            <div className="flex items-center gap-1.5 mt-5 md:mt-8">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={["h-1.5 rounded-full transition-all", i === slideIndex ? "w-6 bg-[#1bc5d8]" : "w-1.5 bg-[#b8eaf0]"].join(" ")}
                />
              ))}
            </div>
          </div>}

          {/* RIGHT — enquiry form card, with the same rotating-gradient
              border used on the fleet cards (Cars.js) for visual
              consistency: a big spinning gradient bar clipped by the
              rounded card, with a 2px-inset white plate masking everything
              except a thin rotating sliver around the edge. */}
          <div className={isBookingPage ? "order-1 lg:col-span-3" : "order-2 -mx-4 bg-white px-4 py-4 lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0"}>
            <div
              className="relative overflow-hidden rounded-[20px] shadow-xl"
              style={{ boxShadow: "0 20px 45px -12px rgba(88,21,183,0.22)" }}
            >
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[200%] w-32 -translate-x-1/2 -translate-y-1/2 animate-spin [animation-duration:6s]"
              style={{ background: "linear-gradient(180deg, #7c2bea 0%, #a55cff 35%, #1bc5d8 70%, #5815b7 100%)" }}
            />
            <div className="absolute inset-[2px] rounded-[18px] bg-white" />

            <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-4 p-5 sm:p-8">
              <div className="flex items-center gap-2.5 mb-1">
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-xl text-white"
                  style={{ background: `linear-gradient(135deg, ${COLORS.gradientFrom}, ${COLORS.gradientTo})` }}
                >
                  <Car className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-[#1E293B]">Book Your Taxi</h2>
                  <p className="text-xs text-[#64748B]">Get an instant quote — our team will call to confirm</p>
                </div>
              </div>

              <TripTypeTabs value={tripType} onChange={handleTripTypeChange} />

              {/* Pickup / Drop */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 sm:gap-3">
                <div>
                  <label className="text-xs font-semibold text-black mb-1 block">Pickup Location</label>
                  <Controller
                    name="pickup"
                    control={control}
                    render={({ field }) => (
                      <InputShell icon={<MapPin className="w-4 h-4" />} hasError={!!errors.pickup}>
                        {isLoaded ? (
                          <PlacesAutocompleteInput
                            value={field.value}
                            onValueChange={(nextValue) => {
                              field.onChange(nextValue);
                              setPickupCoords(null);
                            }}
                            onPlaceSelect={setPickupCoords}
                            onBlur={field.onBlur}
                            placeholder="Enter pickup location"
                          />
                        ) : (
                          <input {...field} placeholder="Enter pickup location" autoComplete="off" className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400" />
                        )}
                      </InputShell>
                    )}
                  />
                  <FieldError message={errors.pickup?.message} />
                </div>

                <div>
                  <label className="text-xs font-semibold text-black mb-1 block">
                    {tripType === "airport" ? "Airport" : "Drop Location"}
                  </label>
                  <Controller
                    name="drop"
                    control={control}
                    render={({ field }) =>
                      tripType === "airport" ? (
                        <InputShell icon={<MapPin className="w-4 h-4" />} hasError={!!errors.drop}>
                          <AirportSelect
                            airports={TAMIL_NADU_AIRPORTS}
                            value={field.value}
                            onChange={(airport) => {
                              field.onChange(airport.name);
                              setDropCoords({ lat: airport.lat, lng: airport.lng });
                            }}
                          />
                        </InputShell>
                      ) : (
                        <InputShell icon={<MapPin className="w-4 h-4" />} hasError={!!errors.drop}>
                          {isLoaded ? (
                            <PlacesAutocompleteInput
                              value={field.value}
                              onValueChange={(nextValue) => {
                                field.onChange(nextValue);
                                setDropCoords(null);
                              }}
                            onPlaceSelect={setDropCoords}
                            onBlur={field.onBlur}
                            placeholder="Enter drop location"
                            dropdownAlign="right"
                          />
                          ) : (
                            <input {...field} placeholder="Enter drop location" autoComplete="off" className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400" />
                          )}
                        </InputShell>
                      )
                    }
                  />
                  <FieldError message={errors.drop?.message} />
                </div>
              </div>

              {/* Date / Time */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 sm:gap-3">
                <div>
                  <label className="text-xs font-semibold text-black mb-1 block">Pickup Date</label>
                  <InputShell icon={<Calendar className="w-4 h-4" />} hasError={!!errors.pickupDate}>
                    <Controller
                      name="pickupDate"
                      control={control}
                      render={({ field }) => (
                        <DatePickerCalendar value={field.value} onChange={field.onChange} />
                      )}
                    />
                  </InputShell>
                  <FieldError message={errors.pickupDate?.message} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black mb-1 block">Pickup Time</label>
                  <InputShell icon={<Clock className="w-4 h-4" />} hasError={!!errors.pickupTime}>
                    <Controller
                      name="pickupTime"
                      control={control}
                      render={({ field }) => (
                        <TimePicker12h value={field.value} onChange={field.onChange} />
                      )}
                    />
                  </InputShell>
                  <FieldError message={errors.pickupTime?.message} />
                </div>
              </div>

              {/* Name / Mobile */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 sm:gap-3">
                <div>
                  <label className="text-xs font-semibold text-black mb-1 block">Customer Name</label>
                  <InputShell icon={<User className="w-4 h-4" />} hasError={!!errors.customerName}>
                    <input {...register("customerName")} placeholder="Full name" className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400" />
                  </InputShell>
                  <FieldError message={errors.customerName?.message} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black mb-1 block">Mobile Number</label>
                  <InputShell icon={<Phone className="w-4 h-4" />} hasError={!!errors.mobile}>
                    <input {...register("mobile")} placeholder="10-digit number" inputMode="numeric" maxLength={10} className="w-full bg-transparent outline-none text-sm text-[#1E293B] placeholder:text-slate-400" />
                  </InputShell>
                  <FieldError message={errors.mobile?.message} />
                </div>
              </div>

              {/* Vehicle */}
              <Controller
                name="vehicle"
                control={control}
                render={({ field }) => (
                <VehicleSelectGrid vehicles={vehicles} value={field.value} onChange={field.onChange} hasError={!!errors.vehicle} tripType={tripType} />
                )}
              />

              {/* Special requirements */}
              <div>
                <label className="text-xs font-semibold text-black mb-2 block">
                  Special Requirements <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="flex overflow-x-auto gap-2.5 pb-1 -mx-1 px-1 sm:grid sm:grid-cols-2 md:grid-cols-4 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
                  <Controller name="womanAlone" control={control} render={({ field }) => (
                    <div className="shrink-0 w-40 sm:w-auto sm:h-full"><CheckboxPill label="Woman Travelling Alone" icon={<ShieldCheck className="w-4 h-4" />} checked={field.value} onChange={field.onChange} /></div>
                  )} />
                  <Controller name="seniorCitizen" control={control} render={({ field }) => (
                    <div className="shrink-0 w-40 sm:w-auto sm:h-full"><CheckboxPill label="Senior Citizen" icon={<UserCircle2 className="w-4 h-4" />} checked={field.value} onChange={field.onChange} /></div>
                  )} />
                  <Controller name="travellingWithInfant" control={control} render={({ field }) => (
                    <div className="shrink-0 w-40 sm:w-auto sm:h-full"><CheckboxPill label="Travelling with Infant" icon={<User className="w-4 h-4" />} checked={field.value} onChange={field.onChange} /></div>
                  )} />
                  <Controller name="extraLuggage" control={control} render={({ field }) => (
                    <div className="shrink-0 w-40 sm:w-auto sm:h-full"><CheckboxPill label="Extra Luggage" icon={<Luggage className="w-4 h-4" />} checked={field.value} onChange={field.onChange} /></div>
                  )} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full h-[54px] text-sm font-black uppercase tracking-wider"
              >
                {isSubmitting ? "Sending Enquiry..." : "Get Fare Estimation"}
              </button>
              {enquiryError && <p role="alert" className="text-center text-xs font-medium text-red-500">{enquiryError}</p>}
            </form>
            </div>
          </div>

          {isBookingPage && (
            <BookingMapPreview
              isLoaded={isLoaded}
              pickupCoords={pickupCoords}
              dropCoords={dropCoords}
              routeTitle={presetRoute?.label}
            />
          )}
        </div>
      </div>
    </section>
  );
}
