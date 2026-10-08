import {
  Category,
  PaginatedApiResponse,
  ProductDetail,
  ProductFilterParams,
  ProductListItem,
  SingleApiResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function getProducts(
  params?: ProductFilterParams
): Promise<PaginatedApiResponse<ProductListItem>> {
  const query = new URLSearchParams();

  if (params) {
    if (params.category) query.append("category", params.category);
    if (params.size) query.append("size", params.size);
    if (params.min_price !== undefined && params.min_price !== null && params.min_price > 0) {
      query.append("min_price", params.min_price.toString());
    }
    if (params.max_price !== undefined && params.max_price !== null && params.max_price > 0) {
      query.append("max_price", params.max_price.toString());
    }
    if (params.q) query.append("q", params.q);
    if (params.sort) query.append("sort", params.sort);
    if (params.slugs) query.append("slugs", params.slugs);
    if (params.per_page) query.append("per_page", params.per_page.toString());
    if (params.page) query.append("page", params.page.toString());
  }

  const queryString = query.toString();
  const url = `${API_URL}/products${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Gagal mengambil data produk (HTTP ${res.status})`);
  }

  return res.json();
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDetail> {
  const url = `${API_URL}/products/${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (res.status === 404) {
    throw new Error("Produk tidak ditemukan");
  }

  if (!res.ok) {
    throw new Error(`Gagal mengambil detail produk (HTTP ${res.status})`);
  }

  const json: SingleApiResponse<ProductDetail> = await res.json();
  return json.data;
}

export async function getCategories(): Promise<Category[]> {
  const url = `${API_URL}/categories`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Gagal mengambil data kategori (HTTP ${res.status})`);
  }

  const json: { data: Category[] } = await res.json();
  return json.data;
}
