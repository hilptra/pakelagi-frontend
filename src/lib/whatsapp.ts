import { ProductDetail, ProductListItem } from "@/types";
import { formatRupiah, getConditionLabel } from "./utils";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://pakelagi.com").replace(/\/+$/, "");

/**
 * Membuat tautan WhatsApp untuk produk.
 * Memprioritaskan nomor seller jika tersedia, kemudian nomor fallback (misal dari setting admin).
 * Jika tidak ada nomor yang tersedia, mengembalikan null.
 */
export function generateWhatsAppLink(
  product: ProductDetail | ProductListItem,
  sellerPhone?: string | null
): string | null {
  const rawPhone = sellerPhone || (product as { seller_phone?: string }).seller_phone;
  if (!rawPhone) return null;

  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  if (!cleanPhone) return null;

  const text = `Halo PakeLagi, saya tertarik dengan produk ini:

📌 *${product.name}*
- Harga: ${formatRupiah(product.price)}
- Ukuran: ${product.size_label}
- Kondisi: ${getConditionLabel(product.condition)}
- Link: ${SITE_URL}/products/${product.slug}

Apakah produk ini masih tersedia?`;

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}