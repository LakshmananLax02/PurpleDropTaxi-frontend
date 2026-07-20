"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Phone, MessageCircle, Menu, X, ShieldCheck, Users, Leaf, BadgeDollarSign } from "lucide-react"

// ---- Config: replace with your real values ----
const PHONE_NUMBER = "+911234567890"
const WHATSAPP_NUMBER = "911234567890"
const LOGO_SRC = "/images/logoimg.png"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Onewaytaxi", href: "#oneway" },
  { label: "Airport taxi", href: "#airport" },
  { label: "Service routes", href: "#routes" },
  { label: "Contact us", href: "#contact" },
]

const features = [
  { icon: ShieldCheck, label: "100% Verified Drivers" },
  { icon: Users, label: "Women-Friendly Services" },
  { icon: Leaf, label: "Carbon-Neutral Fleet" },
  { icon: BadgeDollarSign, label: "Transparent Pricing" },
]

function FeatureRow() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2 px-6 md:px-8">
          <feature.icon className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap text-sm font-medium">{feature.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState("Home")

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* Marquee animation (scoped) */}
      <style>{`
        @keyframes navbar-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .navbar-marquee { animation: navbar-marquee 22s linear infinite; }
        .navbar-marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .navbar-marquee { animation: none; }
        }
      `}</style>

      {/* ===== Top scrolling marquee bar ===== */}
      <div className="w-full overflow-hidden bg-[#e5d4f7] text-gray-900">
        <div className="navbar-marquee flex w-max py-2">
          <FeatureRow />
          <FeatureRow />
          <FeatureRow />
        </div>
        <ul className="sr-only">
          {features.map((feature, index) => (
            <li key={index}>{feature.label}</li>
          ))}
        </ul>
      </div>

      {/* ===== Main navigation ===== */}
      <nav className="w-full border-b border-gray-200 bg-white shadow-sm">
       <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-0 sm:px-6 sm:py-0">
  {/* Logo (image) */}
  <Link href="#home" className="flex shrink-0 items-center py-1" aria-label="PurpleDropTaxi home">
    <Image
      src={LOGO_SRC || "/placeholder.svg"}
      alt="PurpleDropTaxi logo"
      width={320}
      height={304}
      priority
      className="h-23 w-35 sm:h-23 md:h-23"
    />
  </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-10 lg:flex xl:gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className={`relative text-[17px] font-medium transition-colors hover:text-[#7b2ff7] ${
                    active === link.label ? "text-[#7b2ff7]" : "text-gray-900"
                  }`}
                >
                  {link.label}
                  {active === link.label && (
                    <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-[#7b2ff7]" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={`tel:${PHONE_NUMBER}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#7b2ff7] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
            >
              <Phone className="h-4 w-4" />
              Call now
            </Link>
            <Link
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              Whatsapp
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 transition-colors hover:bg-gray-100 lg:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile / tablet dropdown */}
        <div
          id="mobile-menu"
          className={`overflow-hidden border-t border-gray-200 bg-white transition-[max-height] duration-300 ease-in-out lg:hidden ${
            menuOpen ? "max-h-[32rem]" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => {
                    setActive(link.label)
                    setMenuOpen(false)
                  }}
                  className={`block rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-gray-100 ${
                    active === link.label ? "text-[#7b2ff7]" : "text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 px-4 pb-5 pt-2 sm:flex-row sm:px-6">
            <Link
              href={`tel:${PHONE_NUMBER}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#7b2ff7] px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:brightness-110 active:scale-95"
            >
              <Phone className="h-4 w-4" />
              Call now
            </Link>
            <Link
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:brightness-110 active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              Whatsapp
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}