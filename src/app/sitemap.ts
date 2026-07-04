import type { MetadataRoute } from "next";
import { CITY_PAGES, NICHE_PAGES } from "@/lib/seo-pages";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://signalforge.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/dashboard`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/michrazim`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  const cityPages: MetadataRoute.Sitemap = CITY_PAGES.map((c) => ({
    url: `${BASE}/michrazim/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const nichePages: MetadataRoute.Sitemap = NICHE_PAGES.map((n) => ({
    url: `${BASE}/michrazim/niche/${n.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...cityPages, ...nichePages];
}
