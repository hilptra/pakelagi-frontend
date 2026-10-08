"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAdminProfile, logoutAdmin, type AdminUser } from "@/services/auth-service";
import { Menu, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [isCheckingAuth, setIsCheckingAuth] = useState(!isLoginPage);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;

    let isMounted = true;

    getAdminProfile()
      .then((user) => {
        if (!isMounted) return;
        if (!user) {
          router.replace("/admin/login");
        } else {
          setAdmin(user);
          setIsCheckingAuth(false);
        }
      })
      .catch(() => {
        if (isMounted) router.replace("/admin/login");
      });

    return () => {
      isMounted = false;
    };
  }, [isLoginPage, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutAdmin();
    } catch {
      // proceed to login regardless
    }
    router.push("/admin/login");
  }, [router]);

  // ── Login page: standalone, no sidebar ──────────────────────────────
  if (isLoginPage) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#1F2937]">
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    );
  }

  // ── Checking auth ───────────────────────────────────────────────────
  if (isCheckingAuth || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#1E3447] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-[#6B7280]">
            Memeriksa sesi admin...
          </span>
        </div>
      </div>
    );
  }

  // ── Authenticated layout ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1F2937]">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[#6B7280] hover:text-[#1F2937] rounded-lg"
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[#1F2937] leading-tight">
                {admin.name}
              </p>
              <p className="text-[10px] text-[#6B7280] leading-tight">
                {admin.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-[#6B7280] hover:text-red-600 rounded-lg transition-colors"
              title="Keluar"
              aria-label="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
