import type { Metadata } from "next";

export const siteConfig = {
  name: "Autopilot One",
  url: "https://app.autopilot-one.com",
  title: "Autopilot One — angajați AI pentru IMM-uri",
  description:
    "Autopilot One ajută IMM-urile să capteze lead-uri, să răspundă vizitatorilor 24/7 și să urmărească cererile într-un CRM simplu.",
  locale: "ro_RO",
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) {
    return path;
  }

  return `${siteConfig.url}${path === "/" ? "" : path}`;
}

export function createPageMetadata({ title, description, path, noIndex = false }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Autopilot One — angajați AI pentru IMM-uri",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export const publicSitemapRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/demo", priority: 0.9, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.4, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.4, changeFrequency: "monthly" },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "monthly" },
  { path: "/consumer-rights", priority: 0.3, changeFrequency: "monthly" },
  { path: "/widget-demo", priority: 0.5, changeFrequency: "monthly" },
] as const;
