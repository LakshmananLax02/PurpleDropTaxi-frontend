"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, Share2, Smartphone, X } from "lucide-react";

const DISMISS_REMINDER_MS = 60_000;

function isInstalledApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isAppleMobileDevice() {
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (window.navigator.userAgent.includes("Mac") && window.navigator.maxTouchPoints > 1);
}

export default function PWAInstallPrompt() {
  const installEvent = useRef(null);
  const reminderTimer = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const isIOS = typeof window !== "undefined" && isAppleMobileDevice();

  const scheduleReminder = () => {
    setIsVisible(false);
    window.clearTimeout(reminderTimer.current);
    reminderTimer.current = window.setTimeout(() => setIsVisible(true), DISMISS_REMINDER_MS);
  };

  useEffect(() => {
    const installed = isInstalledApp();
    const appleDevice = isAppleMobileDevice();

    if (installed) {
      const installedTimer = window.setTimeout(() => setIsInstalled(true), 0);
      return () => window.clearTimeout(installedTimer);
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      installEvent.current = event;
      setIsVisible(true);
    };
    const handleAppInstalled = () => {
      window.clearTimeout(reminderTimer.current);
      installEvent.current = null;
      setIsInstalled(true);
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    if (appleDevice) reminderTimer.current = window.setTimeout(() => setIsVisible(true), 1_200);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.clearTimeout(reminderTimer.current);
    };
  }, []);

  const installApp = async () => {
    if (isIOS || !installEvent.current) {
      scheduleReminder();
      return;
    }

    const prompt = installEvent.current;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    installEvent.current = null;

    if (choice.outcome === "accepted") {
      setIsInstalled(true);
      setIsVisible(false);
      return;
    }
    scheduleReminder();
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="fixed bottom-4 left-4 right-4 z-[120] mx-auto max-w-md overflow-hidden rounded-3xl border border-white/35 bg-[#1f043e] p-[1px] shadow-2xl shadow-[#270755]/45 sm:bottom-6"
          aria-live="polite"
        >
          <div className="relative overflow-hidden rounded-[23px] bg-gradient-to-br from-[#270755] via-[#5815b7] to-[#1bc5d8] p-5 text-white">
            <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <button type="button" onClick={scheduleReminder} aria-label="Remind me later about installing the app" className="absolute right-3 top-3 rounded-full p-2 text-white/75 transition hover:bg-white/15 hover:text-white">
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex gap-4 pr-7">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#5815b7] shadow-lg shadow-[#270755]/30"><Smartphone className="h-6 w-6" /></span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b8eaf0]">PurpleDropTaxi app</p>
                <h2 className="mt-1 text-lg font-black leading-tight">Book faster from your home screen.</h2>
                <p className="mt-1.5 text-xs font-medium leading-relaxed text-white/80">
                  {isIOS ? "Install this app for a quicker, full-screen booking experience." : "Install for quick access to fares, routes and bookings — no app store needed."}
                </p>
              </div>
            </div>

            {isIOS && (
              <div className="relative mt-4 rounded-2xl border border-white/20 bg-[#0f172a]/20 px-3.5 py-3 text-xs font-semibold leading-relaxed text-white/90">
                Tap <Share2 className="mx-0.5 inline h-3.5 w-3.5" /> <b>Share</b>, then choose <b>Add to Home Screen</b>.
              </div>
            )}

            <div className="relative mt-4 flex items-center gap-3">
              <button type="button" onClick={installApp} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black uppercase tracking-wider text-[#5815b7] shadow-lg transition hover:bg-[#f1fbfc] active:scale-[0.98]">
                {isIOS ? <Share2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                {isIOS ? "Got it" : "Install app"}
              </button>
              <button type="button" onClick={scheduleReminder} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/35 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/10 active:scale-[0.98]">
                <Check className="h-3.5 w-3.5" /> Later
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
