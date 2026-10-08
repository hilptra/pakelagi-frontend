import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client";
import type { SingleApiResponse } from "@/types";
import type { AdminCategory, SaveCategoryPayload } from "@/types/admin";

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const res = await apiGet<{ data: AdminCategory[] }>("/admin/categories");
  return res.data;
}

export async function createCategory(payload: SaveCategoryPayload): Promise<AdminCategory> {
  const res = await apiPost<SingleApiResponse<AdminCategory>>("/admin/categories", payload);
  return res.data;
}

export async function updateCategory(
  id: number,
  payload: SaveCategoryPayload,
): Promise<AdminCategory> {
  const res = await apiPut<SingleApiResponse<AdminCategory>>(`/admin/categories/${id}`, payload);
  return res.data;
}

export async function deleteCategory(id: number): Promise<void> {
  return apiDelete(`/admin/categories/${id}`);
}
