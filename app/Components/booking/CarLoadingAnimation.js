"use client";

/**
 * ============================================================================
 * CarLoadingAnimation — the "your ride is being confirmed" sequence.
 * ----------------------------------------------------------------------------
 * Deliberately branded to THIS app rather than a generic spinner:
 *   - Background is the same purple gradient used for every CTA button / badge
 *     (COLORS.gradientFrom → accent), just deepened for contrast.
 *   - The route strip mirrors the real Google Map above/below it on the
 *     estimate page: a green "P" pickup marker and a purple "D" drop marker,
 *     with the pickup/drop text labels — same visual language as the map's
 *     <Marker label="P"/"D"> and the From/To summary panel.
 *   - The vehicle crossing the route is the customer's ACTUAL selected car
 *     photo (from VEHICLE_IMAGES), not a generic icon — so a Sedan booking
 *     shows the sedan driving, an SUV booking shows the SUV, etc.
 *
 * Fills its nearest positioned ancestor (absolute inset-0) — drop it inside a
 * `relative` container.
 * ========================================================================== */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Car as CarIcon } from "lucide-react";
import { CONFIRM_LOADING_MESSAGES, VEHICLE_IMAGES, COLORS } from "../../lib/booking";

export default function CarLoadingAnimation({
  active,
  pickup,
  drop,
  vehicleId,
  title = "Confirming your booking",
  messages = CONFIRM_LOADING_MESSAGES,
}) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const vehicleImage = VEHICLE_IMAGES[vehicleId];
  const arrived = progress >= 100;

  useEffect(() => {
    if (!active) {
      setMessageIndex(0);
      setProgress(0);
      return;
    }
    const messageTimer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 650);
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(100, p + 100 / 40));
    }, 100);
    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, [active, messages.length]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="car-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[20px] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #26074b 0%, #3d0c79 45%, ${COLORS.gradientFrom} 100%)`,
          }}
        >
          {/* Drifting clouds */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute h-6 w-16 rounded-full bg-white/10 blur-sm"
              style={{ left: `${-20 + i * 10}%`, top: `${16 + i * 16}px` }}
              animate={{ x: ["-10%", "120%"] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center gap-7 px-8 w-full">
            {/* Brand header — same icon-chip + label pattern as the booking form header */}
            <div className="flex items-center gap-2.5">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-xl text-white shrink-0"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <CarIcon className="w-4 h-4" />
              </span>
              <p className="text-white text-sm font-bold tracking-wide">{title}</p>
            </div>

            {/* ---- Route strip: pickup marker → car crossing → drop marker ---- */}
            <div className="relative w-full max-w-sm">
              {/* Pickup / Drop labels, same green/purple dot language as the
                  From/To summary panel under the map */}
              <div className="flex items-center justify-between mb-2 px-1 gap-3">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
                  <span className="text-[11px] font-semibold text-white/90 truncate">
                    {pickup || "Pickup"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-semibold text-white/90 truncate">
                    {drop || "Drop"}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                </div>
              </div>

              {/* Road */}
              <div className="relative h-24 rounded-xl bg-black/15 overflow-hidden">
                {/* Passing skyline (parallax) */}
                <div className="absolute inset-x-0 bottom-9 flex items-end gap-4 opacity-25">
                  <motion.div
                    className="flex items-end gap-4 shrink-0"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  >
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 rounded-t-sm bg-white"
                        style={{ height: `${10 + ((i * 7) % 22)}px` }}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Lane markings */}
                <div className="absolute bottom-8 w-full h-1 rounded-full bg-white/20" />
                <div className="absolute bottom-[35px] w-full flex justify-between overflow-hidden px-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="h-[2px] w-4 bg-white/40 rounded-full"
                      animate={{ x: [0, -32] }}
                      transition={{ duration: 0.45, repeat: Infinity, ease: "linear" }}
                    />
                  ))}
                </div>

                {/* Pickup (P) marker — mirrors the real map's <Marker label="P"/> */}
                <div className="absolute bottom-[26px] left-1 w-5 h-5 rounded-full bg-[#22C55E] border-2 border-white/80 flex items-center justify-center text-[9px] font-black text-white shadow">
                  P
                </div>
                {/* Drop (D) marker */}
                <div className="absolute bottom-[26px] right-1 w-5 h-5 rounded-full bg-white border-2 border-white/80 flex items-center justify-center text-[9px] font-black text-[#5815b7] shadow">
                  D
                </div>

                {/* The customer's actual selected vehicle, driving pickup → drop */}
                <motion.div
                  className="absolute bottom-4 left-3 z-10"
                  initial={{ x: 0 }}
                  animate={{ x: [0, 232] }}
                  transition={{ duration: 3.6, ease: "easeInOut" }}
                >
                  {/* Suspension bounce + slight tilt while driving */}
                  <motion.div
                    className="relative"
                    animate={{ y: [0, -3, 0], rotate: [0, -1.5, 0, 1.5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {/* Exhaust puffs trailing behind */}
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="absolute -left-2 top-1/2 w-1.5 h-1.5 rounded-full bg-white/50 blur-[1px]"
                        animate={{ x: [0, -14 - i * 6], opacity: [0.5, 0], scale: [1, 1.8] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.22, ease: "easeOut" }}
                      />
                    ))}

                    {vehicleImage ? (
                      <img
                        src={vehicleImage}
                        alt="Your ride"
                        className="w-16 h-10 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.4)]"
                      />
                    ) : (
                      <CarIcon className="w-9 h-9 text-white drop-shadow-[0_0_10px_rgba(27,197,216,0.8)]" />
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-sm h-1.5 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-white to-[#b8eaf0]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Rotating message */}
            <div className="h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={arrived ? "arrived" : messageIndex}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white text-sm font-medium"
                >
                  {arrived ? "You're all set!" : messages[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {arrived && (
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
