import {
  apiGet,
  apiDelete,
  apiPut,
  apiPostFormData,
  buildQueryString,
} from "@/lib/api-client";
import type { PaginatedApiResponse, SingleApiResponse } from "@/types";
import type {
  EventDetail,
  EventListItem,
  EventFilters,
  AdminEventDetail,
  AdminEventListItem,
  AdminEventImage,
} from "@/types/event";

// ─── PUBLIC EVENT SERVICES ───────────────────────────────────────────

export async function getEvents(
  filters?: EventFilters
): Promise<PaginatedApiResponse<EventListItem>> {
  const query = buildQueryString({
    q: filters?.q,
    type: filters?.type,
    homepage: filters?.homepage ? 1 : undefined,
    sort: filters?.sort,
    per_page: filters?.per_page,
    page: filters?.page,
  });
  return apiGet<PaginatedApiResponse<EventListItem>>(`/events${query}`);
}

export async function getEventBySlug(slug: string): Promise<EventDetail> {
  const res = await apiGet<SingleApiResponse<EventDetail>>(`/events/${slug}`);
  return res.data;
}

// ─── ADMIN EVENT SERVICES ────────────────────────────────────────────

export async function getAdminEvents(
  filters?: EventFilters
): Promise<PaginatedApiResponse<AdminEventListItem>> {
  const query = buildQueryString({
    q: filters?.q,
    status: filters?.status,
    type: filters?.type,
    homepage: filters?.homepage !== undefined ? (filters.homepage ? 1 : 0) : undefined,
    sort: filters?.sort,
    per_page: filters?.per_page,
    page: filters?.page,
  });
  return apiGet<PaginatedApiResponse<AdminEventListItem>>(`/admin/events${query}`);
}

export async function getAdminEvent(id: number): Promise<AdminEventDetail> {
  const res = await apiGet<SingleApiResponse<AdminEventDetail>>(`/admin/events/${id}`);
  return res.data;
}

export async function createAdminEvent(formData: FormData): Promise<AdminEventDetail> {
  const res = await apiPostFormData<SingleApiResponse<AdminEventDetail>>(
    "/admin/events",
    formData
  );
  return res.data;
}

export async function updateAdminEvent(
  id: number,
  formData: FormData
): Promise<AdminEventDetail> {
  // Use POST with _method=PUT to support multipart file upload in Laravel
  formData.append("_method", "PUT");
  const res = await apiPostFormData<SingleApiResponse<AdminEventDetail>>(
    `/admin/events/${id}`,
    formData
  );
  return res.data;
}

export async function deleteAdminEvent(id: number): Promise<void> {
  return apiDelete(`/admin/events/${id}`);
}

export async function uploadAdminEventImages(
  eventId: number,
  formData: FormData
): Promise<AdminEventImage[]> {
  const res = await apiPostFormData<{ data: AdminEventImage[] }>(
    `/admin/events/${eventId}/images`,
    formData
  );
  return res.data;
}

export async function deleteAdminEventImage(
  eventId: number,
  imageId: number
): Promise<void> {
  return apiDelete(`/admin/events/${eventId}/images/${imageId}`);
}

export async function reorderAdminEventImages(
  eventId: number,
  imageIds: number[]
): Promise<AdminEventDetail> {
  const res = await apiPut<SingleApiResponse<AdminEventDetail>>(
    `/admin/events/${eventId}/images/order`,
    { image_ids: imageIds }
  );
  return res.data;
}
