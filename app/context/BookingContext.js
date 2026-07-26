"use client";

/**
 * ============================================================================
 * BookingContext — carries the enquiry between page 1 (form) and page 2
 * (estimate) without a backend round-trip.
 *
 * The provider lives in the root layout, so it survives client-side route
 * changes (App Router layouts don't remount). The payload is ALSO mirrored to
 * sessionStorage so a hard refresh of /estimate keeps the user's details
 * instead of bouncing them back to the form.
 * ========================================================================== */

import { createContext, useContext, useEffect, useState } from "react";

const BookingContext = createContext(null);
const STORAGE_KEY = "pdt_booking_v1";

export function BookingProvider({ children }) {
  const [booking, setBookingState] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Rehydrate from sessionStorage on first client render.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setBookingState(JSON.parse(raw));
    } catch {
      /* ignore malformed/blocked storage */
    }
    setHydrated(true);
  }, []);

  const setBooking = (data) => {
    setBookingState(data);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage may be unavailable (private mode) — context still works in-memory */
    }
  };

  const clearBooking = () => {
    setBookingState(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <BookingContext.Provider value={{ booking, setBooking, clearBooking, hydrated }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within <BookingProvider>");
  return ctx;
}
