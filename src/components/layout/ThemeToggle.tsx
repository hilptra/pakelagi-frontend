"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hindari mismatch hydration: tunggu sampai client-side mount dulu
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-11 h-11 rounded-full border border-brand-border bg-surface shrink-0 ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className={`w-11 h-11 rounded-full border border-brand-border bg-surface flex items-center justify-center text-foreground hover:text-brand-primary hover:bg-background hover:border-brand-primary/40 transition-all shadow-2xs shrink-0 active:scale-95 ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}