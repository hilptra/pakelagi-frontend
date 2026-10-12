"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PakeLagiLogo } from "@/components/ui/PakeLagiLogo";
import { AdminUser, getAdminProfile, logoutAdmin } from "@/services/auth-service";
import { LogOut, ExternalLink, Package } from "lucide-react";

export function AdminHeader() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    getAdminProfile()
      .then(setAdmin)
      .catch(() => setAdmin(null));
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setAdmin(null);
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/admin/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-border bg-surface shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand & Admin Tag */}
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3">
              <PakeLagiLogo height={34} className="text-brand-primary" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-primary bg-brand-accent/50 border border-brand-accent px-2.5 py-0.5 rounded-full">
                Admin Panel
              </span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-brand-primary hover:text-brand-primary-hover py-2 border-b-2 border-brand-primary"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Manajemen Produk</span>
              </Link>
            </nav>
          </div>

          {/* User profile & Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-brand-muted hover:text-brand-primary bg-background px-3 py-1.5 rounded-full border border-brand-border"
            >
              <span>Lihat Katalog Publik</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {admin ? (
              <div className="flex items-center gap-2 border-l border-brand-border pl-3 ml-1">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-foreground">{admin.name}</span>
                  <span className="text-[10px] text-brand-muted">{admin.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-brand-muted hover:text-red-600 rounded-lg transition-colors"
                  title="Logout Admin"
                  aria-label="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="text-xs font-semibold text-brand-primary hover:underline"
              >
                Login Admin
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
