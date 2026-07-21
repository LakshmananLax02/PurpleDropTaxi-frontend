    "use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Phone, MessageSquare, Search } from "lucide-react";

/* ============================================================================
 * 1. FAQ DATASET
 * ========================================================================= */
const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "booking", label: "Booking & Fares" },
  { id: "outstation", label: "One-Way & Outstation" },
  { id: "safety", label: "Safety & Driver" },
];

const FAQS = [
  {
    id: 1,
    category: "outstation",
    question: "How does One-Way Drop Taxi fare calculation work?",
    answer:
      "You only pay for the distance travelled from your pickup city to the drop location. Unlike traditional cabs, we do NOT charge return toll or return kilometer charges for one-way trips across Tamil Nadu and nearby states.",
  },
  {
    id: 2,
    category: "booking",
    question: "Are there any hidden fees or surge pricing?",
    answer:
      "No. We pride ourselves on 100% transparent pricing. The estimated fare provided includes driver bata, vehicle charges, and base kilometers. Any applicable tolls or state taxes are clearly highlighted before booking.",
  },
  {
    id: 3,
    category: "safety",
    question: "What safety measures are taken for women travelling alone?",
    answer:
      "All our drivers undergo strict background verification and police checks. We offer continuous GPS tracking on every trip, 24/7 tele-support, and emergency SOS routing options specifically designed for solo women travelers.",
  },
  {
    id: 4,
    category: "booking",
    question: "How far in advance should I book my cab?",
    answer:
      "While we recommend booking at least 2 to 4 hours in advance for outstation routes to guarantee immediate driver assignment, we also cater to urgent immediate bookings across major cities in South India.",
  },
  {
    id: 5,
    category: "outstation",
    question: "What happens if my flight or train is delayed?",
    answer:
      "For Airport and Railway station pickups, our driver tracks your arrival status. We provide a grace waiting period without imposing penalty charges for flight schedule adjustments.",
  },
  {
    id: 6,
    category: "safety",
    question: "What types of vehicles are available in your fleet?",
    answer:
      "We offer clean, well-maintained Sedan (Etios/Dzire), SUV (Ertiga/Xylo), and Prime SUV (Innova/Innova Crysta) options depending on your passenger size and luggage preference.",
  },
];

/* ============================================================================
 * 2. FAQ COMPONENT
 * ========================================================================= */
export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState(1); // Default first item open
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Filter items based on Category Tab and Search Input
  const filteredFaqs = FAQS.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="w-full bg-[#f8fafc] py-5 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Decorative Brand Gradient Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* --- SECTION HEADER --- */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-[#7c3aed] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <HelpCircle className="w-4 h-4" /> Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Frequently Asked <span className="text-[#7c3aed]">Questions</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto font-medium">
            Everything you need to know about our drop taxi services, one-way pricing, and travel safety across South India.
          </p>    
        </div>

        {/* --- CATEGORY TABS --- */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#7c3aed] text-white shadow-md shadow-purple-600/20 scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* --- FAQ ACCORDION LIST --- */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "bg-white border-[#7c3aed] shadow-lg shadow-purple-900/5 ring-1 ring-[#7c3aed]/20"
                        : "bg-white border-gray-200/80 hover:border-purple-200 shadow-sm"
                    }`}
                  >
                    {/* Question Header Button */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none"
                    >
                      <span className="font-extrabold text-sm sm:text-base text-gray-900 leading-snug">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isOpen ? "bg-purple-100 text-[#7c3aed]" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    {/* Animated Answer Body */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 },
                          }}
                          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        >
                          <div className="px-6 pb-6 pt-1 text-gray-600 text-xs sm:text-sm font-medium leading-relaxed border-t border-purple-50/60 mt-1">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-sm font-semibold">
                  No matching questions found for "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-3 text-xs font-bold text-[#7c3aed] hover:underline"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* --- CALL TO ACTION SUPPORT CARD --- */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-[#7c3aed] to-[#6D28D9] rounded-3xl text-white shadow-xl shadow-purple-600/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-black tracking-tight">Still have questions?</h3>
            <p className="text-purple-100 text-xs font-medium max-w-sm">
              Can’t find the answer you’re looking for? Reach out to our 24/7 tele-support team.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="tel:+919361354492"
              className="flex items-center gap-2 bg-white text-[#7c3aed] hover:bg-purple-50 px-5 py-3 rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95"
            >
              <Phone className="w-4 h-4" /> Call Dispatch
            </a>
            <a
              href="https://wa.me/919361354492"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}