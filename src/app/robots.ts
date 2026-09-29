import type { MetadataRoute } from "next";
import { business } from "@/config/business";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/*/cart", "/*/checkout", "/*/account", "/*/order-success", "/*/wishlist", "/*/compare"],
      },
    ],
    sitemap: `${business.url}/sitemap.xml`,
  };
}
