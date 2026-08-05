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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] flex items-center justify-center bg-[#0f172a]/60 px-4 backdrop-blur-sm">
          <motion.section initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.97 }} transition={{ type: "spring", stiffness: 320, damping: 26 }} className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-[2px] shadow-2xl shadow-[#5815b7]/40">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5815b7] via-[#a55cff] to-[#1bc5d8]" />
            <div className="relative m-[2px] rounded-[22px] bg-white px-6 py-7 text-center sm:px-8">
              <button type="button" onClick={remindLater} aria-label="Close install prompt" className="absolute right-3 top-3 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#5815b7]"><X className="h-4 w-4" /></button>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5815b7]/10 bg-white p-2 shadow-md"><Image src="/images/logo-navbar.png" alt="PurpleDropTaxi" width={112} height={56} className="h-auto w-full" priority /></div>
              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#5815b7]">PurpleDropTaxi app</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1E293B]">Download our app</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">Book your next taxi faster from your home screen.</p>
              {showIOSSteps && <p className="mt-4 rounded-xl bg-[#f1fbfc] px-3 py-2.5 text-xs font-semibold leading-relaxed text-[#1E293B]"><Share2 className="mr-1 inline h-3.5 w-3.5 text-[#5815b7]" /> Tap <b>Share</b>, then <b>Add to Home Screen</b>.</p>}
              <button type="button" onClick={installApp} className="btn btn-primary mt-5 min-h-[50px] w-full text-xs font-black uppercase tracking-widest"><Download className="h-4 w-4" /> Install app</button>
              <button type="button" onClick={remindLater} className="mt-3 text-xs font-bold text-slate-400 transition hover:text-[#5815b7]"><Smartphone className="mr-1 inline h-3.5 w-3.5" /> Maybe later</button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
