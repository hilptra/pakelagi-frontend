import { apiPostFormData, apiPatch, apiPut, apiDelete } from "@/lib/api-client";
import type { AdminProductImage } from "@/types/admin";

export async function uploadProductImages(
  productId: number,
  files: File[],
): Promise<AdminProductImage[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images[]", file));

  const res = await apiPostFormData<{ data: AdminProductImage[] }>(
    `/admin/products/${productId}/images`,
    formData,
  );
  return res.data;
}

export async function setPrimaryImage(
  productId: number,
  imageId: number,
): Promise<AdminProductImage> {
  const res = await apiPatch<{ data: AdminProductImage }>(
    `/admin/products/${productId}/images/${imageId}`,
    { is_primary: true },
  );
  return res.data;
}

export async function reorderImages(
  productId: number,
  imageIds: number[],
): Promise<AdminProductImage[]> {
  const res = await apiPut<{ data: AdminProductImage[] }>(
    `/admin/products/${productId}/images/order`,
    { image_ids: imageIds },
  );
  return res.data;
}

export async function deleteProductImage(
  productId: number,
  imageId: number,
): Promise<void> {
  return apiDelete(`/admin/products/${productId}/images/${imageId}`);
}
