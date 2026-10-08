import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { PublicShell } from "@/components/layout/PublicShell";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "PakeLagi — Pakaian preloved, cerita baru.",
    template: "%s — PakeLagi",
  },
  description:
    "PakeLagi adalah platform katalog dan penjualan pakaian preloved dengan pilihan terbaik untuk kamu.",
  keywords: ["preloved", "thrifting", "fashion second", "katalog pakaian", "vintage clothes", "pakelagi"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F7F4] text-[#1F2937] font-sans">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}

