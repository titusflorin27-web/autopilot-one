import type { MetadataRoute } from "next";
import { siteConfig } from "../lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/demo", "/privacy", "/cookies", "/terms", "/refund-policy", "/consumer-rights", "/widget-demo"],
        disallow: [
          "/dashboard",
          "/demo-requests",
          "/onboarding",
          "/knowledge-base",
          "/reception-ai",
          "/widget-settings",
          "/widget-analytics",
          "/inbox",
          "/notifications",
          "/billing",
          "/launch",
          "/api",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
