import type { Metadata, Viewport } from "next";
import { Heebo, JetBrains_Mono, Secular_One } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const secular = Secular_One({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: "400",
});

const heebo = Heebo({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://signalforge-tau-three.vercel.app";

export const viewport: Viewport = {
  themeColor: "#04040a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SignalForge — מנוע סיגנלים עסקיים ישראלי",
    template: "%s | SignalForge",
  },
  description:
    "הזדמנויות B2B חמות ממכרזי רמ״י וחברות חדשות — מדורגות, מסוננות, מוכנות למכירה. דשבורד חי בעברית.",
  applicationName: "SignalForge",
  keywords: [
    "מכרזי רמ״י",
    "מכרזים",
    "B2B",
    "סיגנלים",
    "הזדמנויות עסקיות",
    "ישראל",
    "חברות חדשות",
    "data.gov.il",
  ],
  authors: [{ name: "SignalForge" }],
  alternates: {
    canonical: "/",
    languages: { "he-IL": "/", "en-US": "/en" },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "/",
    siteName: "SignalForge",
    title: "SignalForge — מנוע סיגנלים עסקיים ישראלי",
    description:
      "מכרזי רמ״י וחברות חדשות — מדורגים בזמן אמת, מוכנים לפעולה.",
    images: [
      { url: "/og.svg", width: 1200, height: 630, alt: "SignalForge — מנוע סיגנלים B2B" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SignalForge — מנוע סיגנלים עסקיים ישראלי",
    description: "מכרזי רמ״י וחברות חדשות — מדורגים בזמן אמת.",
    images: ["/og.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SignalForge",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  sameAs: [],
  description:
    "מנוע סיגנלים B2B ישראלי — מכרזי רמ״י וחברות חדשות מדורגים בזמן אמת.",
};

const PRODUCT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "SignalForge Pro",
  description:
    "60 סיגנלים חיים כל יום ממכרזי רמ״י ורשם החברות, עם סינון לפי עיר ותחום, התראות אימייל, ו-API.",
  brand: { "@type": "Brand", name: "SignalForge" },
  offers: [
    {
      "@type": "Offer",
      name: "Pro",
      price: "49",
      priceCurrency: "USD",
      category: "subscription",
      url: `${SITE_URL}/#pricing`,
    },
    {
      "@type": "Offer",
      name: "Enterprise",
      price: "199",
      priceCurrency: "USD",
      category: "subscription",
      url: `${SITE_URL}/#pricing`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${secular.variable} ${heebo.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full bg-[#04040a] font-sans text-zinc-50 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          דלג לתוכן
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSONLD) }}
        />
      </body>
    </html>
  );
}