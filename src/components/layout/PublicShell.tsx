"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * Conditionally wraps children with Navbar + Footer for public pages,
 * and renders nothing extra for /admin routes.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Suspense
        fallback={
          <header className="h-16 w-full bg-background border-b border-brand-border" />
        }
      >
        <Navbar />
      </Suspense>
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
