import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { PublicShell } from "@/components/layout/PublicShell";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PublicShell>{children}</PublicShell>
        </ThemeProvider>
      </body>
    </html>
  );
}