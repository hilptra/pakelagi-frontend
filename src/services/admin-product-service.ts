import { apiGet, apiPost, apiPut, apiPatch, apiDelete, buildQueryString } from "@/lib/api-client";
import type { PaginatedApiResponse, SingleApiResponse } from "@/types";
import type {
  AdminProduct,
  AdminProductListItem,
  AdminProductFilters,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types/admin";

export async function getAdminProducts(
  filters?: AdminProductFilters,
): Promise<PaginatedApiResponse<AdminProductListItem>> {
  const query = buildQueryString({
    q: filters?.q,
    category: filters?.category,
    status: filters?.status,
    sort: filters?.sort,
    per_page: filters?.per_page,
    page: filters?.page,
  });
  return apiGet<PaginatedApiResponse<AdminProductListItem>>(`/admin/products${query}`);
}

export async function getAdminProduct(id: number): Promise<AdminProduct> {
  const res = await apiGet<SingleApiResponse<AdminProduct>>(`/admin/products/${id}`);
  return res.data;
}

export async function createProduct(payload: CreateProductPayload): Promise<AdminProduct> {
  const res = await apiPost<SingleApiResponse<AdminProduct>>("/admin/products", payload);
  return res.data;
}

export async function updateProduct(id: number, payload: UpdateProductPayload): Promise<AdminProduct> {
  const res = await apiPut<SingleApiResponse<AdminProduct>>(`/admin/products/${id}`, payload);
  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  return apiDelete(`/admin/products/${id}`);
}

export async function markProductSold(id: number): Promise<AdminProduct> {
  const res = await apiPost<SingleApiResponse<AdminProduct>>(`/admin/products/${id}/sold`);
  return res.data;
}

export async function changeProductStatus(
  id: number,
  status: "available" | "hidden",
): Promise<AdminProduct> {
  const res = await apiPatch<SingleApiResponse<AdminProduct>>(`/admin/products/${id}/status`, { status });
  return res.data;
}
