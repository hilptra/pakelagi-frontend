"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PakeLagiLogo } from "@/components/ui/PakeLagiLogo";
import { LayoutDashboard, Package, Tag, ExternalLink, X, Calendar } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

type SidebarEntry = NavItem | NavGroup;

const sidebarNav: SidebarEntry[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    group: "Katalog & Konten",
    items: [
      { label: "Produk", href: "/admin/products", icon: Package },
      { label: "Kategori", href: "/admin/categories", icon: Tag },
      { label: "Events / Acara", href: "/admin/events", icon: Calendar },
    ],
  },
];

function isNavGroup(entry: SidebarEntry): entry is NavGroup {
  return "group" in entry;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  const content = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="h-14 flex items-center gap-3 px-5 border-b border-brand-border shrink-0">
        <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
          <PakeLagiLogo height={26} className="text-brand-primary" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-primary bg-brand-accent/50 border border-brand-accent px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {sidebarNav.map((entry, i) => {
          if (isNavGroup(entry)) {
            return (
              <div key={i}>
                <p className="px-3 mb-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-brand-muted">
                  {entry.group}
                </p>
                <div className="space-y-0.5">
                  {entry.items.map((item) => {
                    const active = isActive(item.href, item.exact);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                          active
                            ? "bg-brand-primary text-white"
                            : "text-foreground hover:bg-brand-accent/30"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const active = isActive(entry.href, entry.exact);
          const Icon = entry.icon;
          return (
            <Link
              key={entry.href}
              href={entry.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                active
                  ? "bg-brand-primary text-white"
                  : "text-foreground hover:bg-brand-accent/30"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{entry.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* View public site */}
      <div className="p-3 border-t border-brand-border shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-medium text-brand-muted hover:text-brand-primary bg-background border border-brand-border rounded-lg transition-colors"
        >
          Lihat Katalog Publik
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-surface border-r border-brand-border z-30">
        {content}
      </aside>

      {/* Mobile: slide-over drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30 transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-surface shadow-lg flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3 z-10 p-1.5 text-brand-muted hover:text-foreground rounded-lg"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
