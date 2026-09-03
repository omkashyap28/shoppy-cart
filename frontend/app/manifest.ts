import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shoppy Cart",
    short_name: "Shoppy Cart",
    description:
      "Online e-commerce for all end users to shop anything at anytime",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#ffffff",
    categories: ["e-commerce", "business", "shopping"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
