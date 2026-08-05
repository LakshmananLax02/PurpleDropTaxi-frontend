import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from './Components/Footer'
import InstantEnquiryPopup from "./Components/InstantEnquiryPopup";
import PWAInstallPopup from "./Components/PWAInstallPopup";
import ServiceWorkerRegistration from "./Components/ServiceWorkerRegistration";
import { BookingProvider } from "./context/BookingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PurpleDrop Taxi — One-Way & Outstation Drop Taxi in Tamil Nadu",
  description:
    "Book verified, transparent-priced one-way and outstation drop taxis across Tamil Nadu. Instant fare estimate, no hidden return charges.",
  applicationName: "PurpleDropTaxi",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PurpleDropTaxi",
  },
  icons: {
    icon: [{ url: "/images/logoimg.png", type: "image/png", sizes: "2000x2000" }],
    apple: [{ url: "/images/logoimg.png", type: "image/png", sizes: "2000x2000" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="pwa-install-event-capture" strategy="beforeInteractive">
          {`window.addEventListener("beforeinstallprompt", function (event) {
            event.preventDefault();
            window.__purpleDropTaxiInstallPrompt = event;
            window.dispatchEvent(new Event("purpledroptaxi-install-ready"));
          });
          window.addEventListener("appinstalled", function () {
            window.__purpleDropTaxiInstallPrompt = null;
            window.dispatchEvent(new Event("purpledroptaxi-installed"));
          });`}
        </Script>
        {/* BookingProvider lives here so it survives client-side route changes
            (App Router layouts don't remount), carrying the enquiry from the
            home form to /estimate. */}
        <BookingProvider>
          <Navbar />
          {children}
          <Footer/>
          <InstantEnquiryPopup />
          <PWAInstallPopup />
          <ServiceWorkerRegistration />
        </BookingProvider>
      </body>
    </html>
  );
}
