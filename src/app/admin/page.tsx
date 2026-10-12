"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminDashboardStats } from "@/services/admin-dashboard-service";
import { getAdminProducts } from "@/services/admin-product-service";
import type { AdminDashboardStats } from "@/types/admin";
import type { AdminProductListItem } from "@/types/admin";
import { formatRupiah, getStatusBadge } from "@/lib/utils";
import {
  Package,
  CheckCircle,
  ShoppingBag,
  Tag,
  Plus,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<AdminProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, productsData] = await Promise.all([
          getAdminDashboardStats(),
          getAdminProducts({ per_page: 5, sort: "newest" }),
        ]);

        setStats(statsData);
        setRecentProducts(productsData.data);
      } catch (err: any) {
        console.error("Failed to load dashboard data:", err);
        setErrorMsg(err.message || "Gagal memuat statistik dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard Ringkasan"
        description="Pantau status katalog produk, ketersediaan, dan statistik toko PakeLagi"
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={
          <Link
            href="/admin/products/create"
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Link>
        }
      />

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-brand-border rounded-xl p-4 sm:p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Total Produk
            </span>
            <div className="p-2 bg-brand-accent/30 rounded-lg text-brand-primary">
              <Package className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-brand-border/60 rounded animate-pulse w-20" />
          ) : (
            <div className="text-2xl font-bold text-brand-primary">
              {stats?.total_products ?? 0}
            </div>
          )}
          <p className="text-xs text-brand-muted">Item tercatat di katalog</p>
        </div>

        <div className="bg-surface border border-brand-border rounded-xl p-4 sm:p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Produk Tersedia
            </span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-brand-border/60 rounded animate-pulse w-20" />
          ) : (
            <div className="text-2xl font-bold text-emerald-700">
              {stats?.available_products ?? 0}
            </div>
          )}
          <p className="text-xs text-brand-muted">Siap dibeli oleh pengguna</p>
        </div>

        <div className="bg-surface border border-brand-border rounded-xl p-4 sm:p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Produk Terjual
            </span>
            <div className="p-2 bg-background rounded-lg text-brand-muted">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-brand-border/60 rounded animate-pulse w-20" />
          ) : (
            <div className="text-2xl font-bold text-foreground">
              {stats?.sold_products ?? 0}
            </div>
          )}
          <p className="text-xs text-brand-muted">Status laku terjual</p>
        </div>

        <div className="bg-surface border border-brand-border rounded-xl p-4 sm:p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">
              Total Kategori
            </span>
            <div className="p-2 bg-brand-accent/30 rounded-lg text-brand-secondary">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-brand-border/60 rounded animate-pulse w-20" />
          ) : (
            <div className="text-2xl font-bold text-brand-primary">
              {stats?.total_categories ?? 0}
            </div>
          )}
          <p className="text-xs text-brand-muted">Kategori pakaian aktif</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-brand-border rounded-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-base font-semibold text-brand-primary">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/products/create"
            className="flex items-center justify-between p-4 bg-background border border-brand-border rounded-xl hover:border-brand-primary hover:bg-brand-accent/20 transition-all group"
          >
            <div>
              <span className="text-sm font-semibold text-brand-primary block">
                Tambah Produk Baru
              </span>
              <span className="text-xs text-brand-muted">Upload katalog pakaian preloved</span>
            </div>
            <Plus className="w-5 h-5 text-brand-primary group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center justify-between p-4 bg-background border border-brand-border rounded-xl hover:border-brand-primary hover:bg-brand-accent/20 transition-all group"
          >
            <div>
              <span className="text-sm font-semibold text-brand-primary block">
                Kelola Semua Produk
              </span>
              <span className="text-xs text-brand-muted">Cari, filter, edit & ubah status</span>
            </div>
            <Package className="w-5 h-5 text-brand-primary group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center justify-between p-4 bg-background border border-brand-border rounded-xl hover:border-brand-primary hover:bg-brand-accent/20 transition-all group"
          >
            <div>
              <span className="text-sm font-semibold text-brand-primary block">
                Kelola Kategori
              </span>
              <span className="text-xs text-brand-muted">Tambah & atur spesifikasi ukuran</span>
            </div>
            <Tag className="w-5 h-5 text-brand-primary group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-surface border border-brand-border rounded-xl overflow-hidden space-y-4 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-brand-primary">Produk Terbaru</h2>
            <p className="text-xs text-brand-muted">Daftar 5 produk pakaian yang paling baru ditambahkan</p>
          </div>
          <Link
            href="/admin/products"
            className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
          >
            Lihat Semua Produk
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-brand-primary animate-spin mx-auto" />
            <p className="text-xs text-brand-muted">Memuat produk terbaru...</p>
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="py-12 text-center text-xs text-brand-muted">
            Belum ada produk yang ditambahkan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-brand-border text-xs font-semibold text-brand-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-sm text-foreground">
                {recentProducts.map((product) => {
                  const badge = getStatusBadge(product.status);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-brand-border bg-slate-100 shrink-0">
                            {product.primary_image ? (
                              <img
                                src={product.primary_image.thumbnail_url || product.primary_image.url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-brand-muted">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-brand-primary block text-sm">
                              {product.name}
                            </span>
                            <span className="text-xs text-brand-muted">Size: {product.size_label}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-brand-secondary">
                        {product.category?.name || "-"}
                      </td>
                      <td className="py-3 px-4 font-semibold text-brand-primary text-xs">
                        {formatRupiah(product.price)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-xs font-semibold text-brand-primary hover:underline"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
