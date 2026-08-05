"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Share2, Smartphone, X } from "lucide-react";

const REMINDER_DELAY_MS = 60_000;

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isAppleMobileDevice() {
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (window.navigator.userAgent.includes("Mac") && window.navigator.maxTouchPoints > 1);
}

export default function PWAInstallPopup() {
  const installEvent = useRef(null);
  const reminderTimer = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  const remindLater = () => {
    setIsOpen(false);
    window.clearTimeout(reminderTimer.current);
    reminderTimer.current = window.setTimeout(() => setIsOpen(true), REMINDER_DELAY_MS);
  };

  useEffect(() => {
    const initializeTimer = window.setTimeout(() => {
      const installed = isStandalone();
      const appleDevice = isAppleMobileDevice();
      setIsInstalled(installed);
      setIsIOS(appleDevice);
      installEvent.current = window.__purpleDropTaxiInstallPrompt ?? null;
      if (!installed && (appleDevice || installEvent.current)) setIsOpen(true);
    }, 0);

    const handleInstallReady = () => {
      installEvent.current = window.__purpleDropTaxiInstallPrompt ?? null;
      if (installEvent.current) setIsOpen(true);
    };
    const handleInstalled = () => {
      window.clearTimeout(reminderTimer.current);
      installEvent.current = null;
      setIsInstalled(true);
      setIsOpen(false);
    };

    window.addEventListener("purpledroptaxi-install-ready", handleInstallReady);
    window.addEventListener("purpledroptaxi-installed", handleInstalled);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.clearTimeout(initializeTimer);
      window.clearTimeout(reminderTimer.current);
      window.removeEventListener("purpledroptaxi-install-ready", handleInstallReady);
      window.removeEventListener("purpledroptaxi-installed", handleInstalled);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (isIOS) {
      setShowIOSSteps(true);
      return;
    }

    const prompt = installEvent.current || window.__purpleDropTaxiInstallPrompt;
    if (!prompt) {
      remindLater();
      return;
    }

    await prompt.prompt();
    const choice = await prompt.userChoice;
    installEvent.current = null;
    window.__purpleDropTaxiInstallPrompt = null;
    if (choice.outcome === "accepted") handleInstalled();
    else remindLater();
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-sm overflow-hidden rounded-2xl bg-white p-[2px] shadow-2xl shadow-[#5815b7]/35 sm:bottom-6"
          aria-live="polite"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#5815b7] via-[#a55cff] to-[#1bc5d8]" />
          <div className="relative m-[2px] rounded-[14px] bg-white p-3.5 sm:p-4">
            <button type="button" onClick={remindLater} aria-label="Close install prompt" className="absolute right-2 top-2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#5815b7]"><X className="h-4 w-4" /></button>
            <div className="flex items-center gap-3 pr-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#5815b7]/10 bg-white p-1.5 shadow-sm"><Image src="/images/logo-navbar.png" alt="PurpleDropTaxi" width={80} height={40} className="h-auto w-full" priority /></div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#5815b7]">PurpleDropTaxi app</p>
                <h2 className="mt-0.5 text-base font-black text-[#1E293B]">Download our app</h2>
                <p className="mt-0.5 text-xs font-medium text-slate-500">Faster booking from your home screen.</p>
              </div>
              <button type="button" onClick={installApp} className="btn btn-primary shrink-0 px-3 py-2 text-[10px] font-black uppercase tracking-wider"><Download className="h-3.5 w-3.5" /> Install</button>
            </div>
            {showIOSSteps && <p className="mt-3 rounded-lg bg-[#f1fbfc] px-3 py-2 text-[11px] font-semibold leading-relaxed text-[#1E293B]"><Share2 className="mr-1 inline h-3.5 w-3.5 text-[#5815b7]" /> Tap <b>Share</b>, then <b>Add to Home Screen</b>.</p>}
            <button type="button" onClick={remindLater} className="mt-2 text-[10px] font-bold text-slate-400 transition hover:text-[#5815b7]"><Smartphone className="mr-1 inline h-3 w-3" /> Maybe later</button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
