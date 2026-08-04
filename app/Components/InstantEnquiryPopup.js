"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, LoaderCircle, Phone, Send, Sparkles, User, X } from "lucide-react";

const POPUP_DELAY_MS = 15_000;
const SESSION_KEY = "purpledroptaxi-instant-enquiry-sent";

export default function InstantEnquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(() => (
    typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "true"
  ));
  const [error, setError] = useState("");

  useEffect(() => {
    if (isComplete) return undefined;

    const popupTimer = window.setInterval(() => setIsOpen(true), POPUP_DELAY_MS);
    return () => window.clearInterval(popupTimer);
  }, [isComplete]);

  useEffect(() => {
    if (!isComplete || !isOpen) return undefined;
    const closeTimer = window.setTimeout(() => setIsOpen(false), 2_600);
    return () => window.clearTimeout(closeTimer);
  }, [isComplete, isOpen]);

  const submitEnquiry = async (event) => {
    event.preventDefault();
    const normalizedMobile = mobile.replace(/\D/g, "");

    if (!name.trim() || normalizedMobile.length !== 10) {
      setError("Enter your name and a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "instant-enquiry",
          form: { customerName: name.trim(), mobile: normalizedMobile },
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not submit your enquiry.");

      window.sessionStorage.setItem(SESSION_KEY, "true");
      setIsComplete(true);
    } catch (submitError) {
      setError(submitError.message || "Could not submit your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && !isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="instant-enquiry-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white p-[2px] shadow-2xl shadow-[#5815b7]/35"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[190%] w-24 -translate-x-1/2 -translate-y-1/2 animate-spin [animation-duration:6s]" style={{ background: "linear-gradient(180deg, #5815b7 0%, #a55cff 40%, #1bc5d8 72%, #5815b7 100%)" }} />
            <div className="relative rounded-[26px] bg-white p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-[#1bc5d8] hover:text-[#5815b7]"
                aria-label="Close enquiry form"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-6 pr-10">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#1bc5d8]/30 bg-[#f1fbfc] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#5815b7]">
                  <Sparkles className="h-3.5 w-3.5 text-[#1bc5d8]" /> Quick enquiry
                </span>
                <h2 id="instant-enquiry-title" className="text-2xl font-black tracking-tight text-[#1E293B] sm:text-3xl">
                  Plan your next <span className="text-[#5815b7]">journey.</span>
                </h2>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                  Leave your details and our travel team will contact you shortly.
                </p>
              </div>

              <form onSubmit={submitEnquiry} className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1E293B]">Your name</span>
                  <span className="relative block">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1bc5d8]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="w-full rounded-xl border border-[#b8eaf0] bg-[#fbfdff] py-3.5 pl-11 pr-4 text-sm font-medium text-[#1E293B] outline-none transition-all placeholder:text-slate-400 hover:border-[#1bc5d8] focus:border-[#5815b7] focus:bg-white focus:ring-4 focus:ring-[#5815b7]/10"
                    />
                  </span>
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1E293B]">Mobile number</span>
                  <span className="relative block">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1bc5d8]" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={mobile}
                      onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Enter 10-digit mobile number"
                      autoComplete="tel"
                      className="w-full rounded-xl border border-[#b8eaf0] bg-[#fbfdff] py-3.5 pl-11 pr-4 text-sm font-medium text-[#1E293B] outline-none transition-all placeholder:text-slate-400 hover:border-[#1bc5d8] focus:border-[#5815b7] focus:bg-white focus:ring-4 focus:ring-[#5815b7]/10"
                    />
                  </span>
                </label>

                {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary mt-2 min-h-[52px] w-full text-xs font-black uppercase tracking-widest disabled:cursor-wait"
                >
                  {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? "Sending enquiry" : "Request a callback"}
                </button>
              </form>

              <p className="mt-4 text-center text-[11px] font-medium text-slate-400">No spam. We only use your details to arrange your taxi enquiry.</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {isOpen && isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/70 px-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl shadow-[#5815b7]/30">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-black text-[#1E293B]">Enquiry received</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">Thank you. Our team will call you shortly.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
