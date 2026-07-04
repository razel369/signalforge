import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "SignalForge — מנוע סיגנלים עסקיים ישראלי",
  description:
    "הזדמנויות B2B חמות ממכרזי רמ״י וחברות חדשות — מדורגות, מסוננות, מוכנות למכירה.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${secular.variable} ${heebo.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full bg-[#04040a] font-sans text-zinc-50 antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
