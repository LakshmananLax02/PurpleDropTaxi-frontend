"use client";

/**
 * A calm booking-confirmation state: customer-provided video background,
 * concise pickup/drop route summary, and a loading indicator.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Car as CarIcon } from "lucide-react";
import { CONFIRM_LOADING_MESSAGES, COLORS } from "../../lib/booking";

// Add your MP4 at: public/images/booking-confirmation-background.mp4
const CONFIRMATION_BACKGROUND_VIDEO = "/images/booking-confirmation-background.mp4";

export default function CarLoadingAnimation({
  active,
  pickup,
  drop,
  title = "Confirming your booking",
  messages = CONFIRM_LOADING_MESSAGES,
}) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const arrived = progress >= 100;

  useEffect(() => {
    if (!active) {
      setMessageIndex(0);
      setProgress(0);
      return undefined;
    }

    const messageTimer = setInterval(() => {
      setMessageIndex((index) => (index + 1) % messages.length);
    }, 650);
    const progressTimer = setInterval(() => {
      setProgress((current) => Math.min(100, current + 100 / 40));
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
          key="booking-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden rounded-[20px]"
          style={{
            background: `linear-gradient(135deg, #26074b 0%, #3d0c79 45%, ${COLORS.gradientFrom} 100%)`,
          }}
        >
          <video
            aria-hidden="true"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            src={CONFIRMATION_BACKGROUND_VIDEO}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-[#1f043e]/65 via-[#5815b7]/55 to-[#1bc5d8]/50" />

          <div className="relative z-10 flex w-full flex-col items-center gap-7 px-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                <CarIcon className="h-4 w-4" />
              </span>
              <p className="text-sm font-bold tracking-wide text-white">{title}</p>
            </div>

            <div className="w-full max-w-sm rounded-xl border border-white/25 bg-[#1f043e]/45 px-4 py-3">
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                <div className="flex min-w-0 items-center gap-2 text-left">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#22C55E] ring-4 ring-[#22C55E]/20" />
                  <span className="truncate text-xs font-semibold text-white">{pickup || "Pickup"}</span>
                </div>
                <div aria-hidden="true" className="h-px w-8 bg-white/70" />
                <div className="flex min-w-0 items-center justify-end gap-2 text-right">
                  <span className="truncate text-xs font-semibold text-white">{drop || "Drop"}</span>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white ring-4 ring-white/20" />
                </div>
              </div>
            </div>

            <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-white to-[#b8eaf0]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={arrived ? "arrived" : messageIndex}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-medium text-white"
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
                <CheckCircle2 className="h-12 w-12 text-[#22C55E]" />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
