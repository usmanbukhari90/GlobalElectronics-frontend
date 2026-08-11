import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopAnnouncementBar from "@/components/layout/TopAnnouncementBar";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/layout/Toast";
import SearchOverlay from "@/components/layout/SearchOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GLOBAL Electronics | TVs, Laptops & More — Dubai, UAE",
  description:
    "Premium electronics shop in Dubai. Smart TVs, laptops, accessories. TV repair professionals & used smart TVs.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
      <TopAnnouncementBar />
        <div className="relative">
          <Header />
          <Navigation />
          <SearchOverlay />
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
        <Toast />
      </body>
    </html>
  );
}
