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
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand & Admin Tag */}
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3">
              <PakeLagiLogo height={34} color="#1E3447" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1E3447] bg-[#E7DCC8]/50 border border-[#E7DCC8] px-2.5 py-0.5 rounded-full">
                Admin Panel
              </span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-[#1E3447] hover:text-[#162735] py-2 border-b-2 border-[#1E3447]"
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
              className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-[#6B7280] hover:text-[#1E3447] bg-[#F8F7F4] px-3 py-1.5 rounded-full border border-[#E5E7EB]"
            >
              <span>Lihat Katalog Publik</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {admin ? (
              <div className="flex items-center gap-2 border-l border-[#E5E7EB] pl-3 ml-1">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-[#1F2937]">{admin.name}</span>
                  <span className="text-[10px] text-[#6B7280]">{admin.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#6B7280] hover:text-red-600 rounded-lg transition-colors"
                  title="Logout Admin"
                  aria-label="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="text-xs font-semibold text-[#1E3447] hover:underline"
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
