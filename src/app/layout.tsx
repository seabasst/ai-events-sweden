import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Journalen - Discover AI Events & News in Sweden",
    template: "%s | AI Journalen",
  },
  description:
    "Discover AI events and news across Sweden. From conferences to meetups, workshops to webinars, find your next opportunity to learn and connect in the Swedish AI community.",
  keywords: [
    "AI events",
    "AI news",
    "Sweden",
    "artificial intelligence",
    "machine learning",
    "conferences",
    "meetups",
    "Stockholm",
    "Göteborg",
    "Malmö",
  ],
  authors: [{ name: "AI Journalen" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://aijournalen.se",
    siteName: "AI Journalen",
    title: "AI Journalen - Discover AI Events & News in Sweden",
    description:
      "Discover AI events and news across Sweden. From conferences to meetups, find your next opportunity to learn and connect.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Journalen",
    description: "Discover AI events and news across Sweden",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
