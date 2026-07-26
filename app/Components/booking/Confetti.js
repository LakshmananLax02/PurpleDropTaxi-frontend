"use client";

/** Lightweight confetti burst (no external deps). Fills its positioned ancestor. */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../lib/booking";

export default function Confetti() {
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
