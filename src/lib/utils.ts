import { ConditionType, ProductStatus } from "@/types";

export function formatRupiah(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getConditionLabel(condition: ConditionType): string {
  switch (condition) {
    case "like_new":
      return "Sangat Baik (Like New)";
    case "good":
      return "Bagus (Good)";
    case "fair":
      return "Layak Pakai (Fair)";
    default:
      return condition;
  }
}

export function getStatusBadge(status: ProductStatus) {
  switch (status) {
    case "available":
      return { label: "Tersedia", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "sold":
      return { label: "Terjual", color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
    case "hidden":
      return { label: "Tersembunyi", color: "bg-amber-50 text-amber-700 border-amber-200" };
    default:
      return { label: status, color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
  }
}

export function formatMeasurementKey(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
