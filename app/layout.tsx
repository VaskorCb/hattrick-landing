import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HatTrick — The Complete Turf Management Platform | Bangladesh",
  description:
    "Run your indoor football turf like Premier League. Smart bookings, live board, staff management, and reports — all in one app. 30-day free trial.",
  keywords: [
    "turf management Bangladesh",
    "futsal booking app",
    "indoor football Sylhet",
    "turf booking software",
    "HatTrick",
  ],
  openGraph: {
    title: "HatTrick — Turf Management for Bangladesh",
    description:
      "Stop juggling khata, WhatsApp, and double bookings. The all-in-one app for indoor football turfs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-ink-900 text-paper font-sans selection:bg-lime-500/30">
        {children}
      </body>
    </html>
  );
}
