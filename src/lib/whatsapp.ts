import { ProductDetail, ProductListItem } from "@/types";
import { formatRupiah, getConditionLabel } from "./utils";

const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6289501085225";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pakelagi.com";

export function generateWhatsAppLink(
  product: ProductDetail | ProductListItem,
  sellerPhone: string = DEFAULT_WHATSAPP_NUMBER
): string {
  const cleanPhone = sellerPhone.replace(/[^0-9]/g, "");

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