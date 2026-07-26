import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
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
        {/* BookingProvider lives here so it survives client-side route changes
            (App Router layouts don't remount), carrying the enquiry from the
            home form to /estimate. */}
        <BookingProvider>
          <Navbar />
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}
