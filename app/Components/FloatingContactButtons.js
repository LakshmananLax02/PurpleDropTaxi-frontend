"use client";

import { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

const PHONE_NUMBER = "+918110880500";
const WHATSAPP_NUMBER = "918110880500";

export default function FloatingContactButtons() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.08 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={
        isFooterVisible
          ? "relative z-10 mt-10 flex items-center justify-between border-t border-[#5815b7]/60 pt-6"
          : "relative z-10"
      }
    >
      <a
        href={`tel:${PHONE_NUMBER}`}
        aria-label="Call PurpleDropTaxi"
        className={isFooterVisible ? "shrink-0" : "fixed bottom-4 left-4 z-[60] shrink-0 sm:bottom-6 sm:left-8 py-4"}
      >
        <span className="btn btn-primary btn-icon relative h-14 w-14 border-0 shadow-xl shadow-[#5815b7]/35 animate-pulse">
          <span className="absolute inset-1 rounded-full border border-white/25 animate-ping opacity-30" />
          <PhoneCall className="h-6 w-6" aria-hidden="true" />
        </span>
      </a>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Message PurpleDropTaxi on WhatsApp"
        className={isFooterVisible ? "shrink-0" : "fixed bottom-4 right-4 z-[60] shrink-0 sm:bottom-6 sm:right-8 py-4"}
      >
        <span className="btn btn-whatsapp btn-icon relative h-14 w-14 border-0 shadow-xl shadow-[#25D366]/35 animate-pulse">
          <span className="absolute inset-1 rounded-full border border-white/25 animate-ping opacity-30" />
          <WhatsAppIcon className="h-6 w-6" />
        </span>
      </a>
    </div>
  );
}
