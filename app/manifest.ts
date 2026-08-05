import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PurpleDropTaxi – One-Way & Outstation Taxi",
    short_name: "PurpleDropTaxi",
    description: "Book safe, transparent one-way and outstation taxis across South India.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#5815b7",
    categories: ["travel", "transportation", "business"],
    icons: [
      { src: "/images/logoimg.png", sizes: "2000x2000", type: "image/png", purpose: "any" },
      { src: "/images/logoimg.png", sizes: "2000x2000", type: "image/png", purpose: "maskable" },
    ],
  };
}
