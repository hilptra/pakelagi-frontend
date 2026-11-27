import { apiGet, apiPut } from "@/lib/api-client";
import { getApiBaseUrl } from "@/lib/api-url";
import type { SingleApiResponse } from "@/types";
import type { WhatsAppSetting } from "@/types/setting";

export async function getPublicWhatsAppSetting(): Promise<WhatsAppSetting> {
  const url = `${getApiBaseUrl()}/settings/whatsapp`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Gagal memuat pengaturan WhatsApp (HTTP ${res.status})`);
  }

  const json: SingleApiResponse<WhatsAppSetting> = await res.json();
  return json.data;
}

export async function getAdminWhatsAppSetting(): Promise<WhatsAppSetting> {
  const res = await apiGet<SingleApiResponse<WhatsAppSetting>>("/admin/settings/whatsapp");
  return res.data;
}

export async function updateAdminWhatsAppSetting(
  whatsapp_number: string
): Promise<{ data: WhatsAppSetting; message: string }> {
  return apiPut<{ data: WhatsAppSetting; message: string }>("/admin/settings/whatsapp", {
    whatsapp_number,
  });
}

