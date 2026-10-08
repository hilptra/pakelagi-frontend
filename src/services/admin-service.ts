import { ProductFilterParams, ProductListItem, SingleApiResponse, PaginatedApiResponse } from "@/types";
import { ensureCsrfToken } from "./auth-service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface AdminProductItem extends ProductListItem {
  id?: number;
  brand?: string | null;
  created_at?: string;
}

export async function getAdminProducts(
  params?: ProductFilterParams & { status?: string }
): Promise<PaginatedApiResponse<AdminProductItem>> {
  const query = new URLSearchParams();

  if (params) {
    if (params.category) query.append("category", params.category);
    if (params.status) query.append("status", params.status);
    if (params.q) query.append("q", params.q);
    if (params.sort) query.append("sort", params.sort);
    if (params.per_page) query.append("per_page", params.per_page.toString());
    if (params.page) query.append("page", params.page.toString());
  }

  const queryString = query.toString();
  const url = `${API_URL}/admin/products${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Gagal mengambil data produk admin (HTTP ${res.status})`);
  }

  return res.json();
}

export async function markAdminProductSold(slugOrId: string | number): Promise<AdminProductItem> {
  const csrfToken = await ensureCsrfToken();
  const url = `${API_URL}/admin/products/${slugOrId}/sold`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (csrfToken) headers["X-XSRF-TOKEN"] = csrfToken;

  const res = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Gagal menandai produk sebagai terjual (HTTP ${res.status})`);
  }

  const json: SingleApiResponse<AdminProductItem> = await res.json();
  return json.data;
}

export async function updateAdminProductStatus(
  slugOrId: string | number,
  status: "available" | "hidden" | "sold"
): Promise<AdminProductItem> {
  const csrfToken = await ensureCsrfToken();
  const url = `${API_URL}/admin/products/${slugOrId}/status`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (csrfToken) headers["X-XSRF-TOKEN"] = csrfToken;

  const res = await fetch(url, {
    method: "PATCH",
    headers,
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(`Gagal mengubah status produk (HTTP ${res.status})`);
  }

  const json: SingleApiResponse<AdminProductItem> = await res.json();
  return json.data;
}

export async function deleteAdminProduct(slugOrId: string | number): Promise<void> {
  const csrfToken = await ensureCsrfToken();
  const url = `${API_URL}/admin/products/${slugOrId}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (csrfToken) headers["X-XSRF-TOKEN"] = csrfToken;

  const res = await fetch(url, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Gagal menghapus produk (HTTP ${res.status})`);
  }
}

