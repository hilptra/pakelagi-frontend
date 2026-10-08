import type { ConditionType, ProductStatus } from "./index";

// ─── Admin Product List Item (AdminProductListResource) ─────────────
export interface AdminProductListItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  size_label: string;
  condition: ConditionType;
  status: ProductStatus;
  sold_at: string | null;
  category: {
    name: string;
    slug: string;
  };
  primary_image: {
    url: string;
    thumbnail_url: string | null;
    is_primary: boolean;
    sort_order: number;
  } | null;
}

// ─── Admin Product Detail (AdminProductResource) ────────────────────
export interface AdminProduct {
  id: number;
  category_id: number;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  brand: string | null;
  size_label: string;
  condition: ConditionType;
  condition_notes: string | null;
  measurements: Record<string, number> | null;
  status: ProductStatus;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
  category: {
    name: string;
    slug: string;
    measurement_fields: string[] | null;
  };
  images: AdminProductImage[];
}

// ─── Admin Product Image (AdminProductImageResource) ────────────────
export interface AdminProductImage {
  id: number;
  url: string;
  thumbnail_url: string | null;
  is_primary: boolean;
  sort_order: number;
}

// ─── Admin Category (AdminCategoryResource) ─────────────────────────
export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  measurement_fields: string[] | null;
  products_count?: number;
}

export interface AdminDashboardStats {
  total_products: number;
  available_products: number;
  sold_products: number;
  total_categories: number;
}

// ─── Request Payloads ───────────────────────────────────────────────

export interface CreateProductPayload {
  category_id: number;
  name: string;
  description?: string | null;
  price: number;
  brand?: string | null;
  size_label: string;
  condition: ConditionType;
  condition_notes?: string | null;
  measurements?: Record<string, number> | null;
  status?: "available" | "hidden";
}

export interface UpdateProductPayload {
  category_id: number;
  name: string;
  description?: string | null;
  price: number;
  brand?: string | null;
  size_label: string;
  condition: ConditionType;
  condition_notes?: string | null;
  measurements?: Record<string, number> | null;
}

export interface SaveCategoryPayload {
  name: string;
  measurement_fields: string[];
}

// ─── Filters ────────────────────────────────────────────────────────

export interface AdminProductFilters {
  q?: string;
  category?: string;
  status?: "available" | "sold" | "hidden";
  sort?: "newest" | "price_asc" | "price_desc";
  per_page?: number;
  page?: number;
}
