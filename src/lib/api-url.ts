const RAW_API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
).replace(/\/+$/, "");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Base URL untuk endpoint `/api/v1/*`.
 * Pada browser di production, gunakan relative same-origin `/api/v1`
 * agar request melewati Next.js rewrites proxy (mengatasi cross-domain cookie/CSRF).
 * Pada SSR atau development lokal, gunakan URL lengkap backend.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined" && IS_PRODUCTION) {
    return "/api/v1";
  }

  return RAW_API_URL;
}

/**
 * Base URL untuk endpoint `/sanctum/*` (tanpa suffix `/api/v1`).
 * Pada browser di production, mengembalikan string kosong agar memanggil `/sanctum/...` same-origin.
 */
export function getSanctumBaseUrl(): string {
  if (typeof window !== "undefined" && IS_PRODUCTION) {
    return "";
  }

  return RAW_API_URL.replace(/\/api\/v1\/?$/, "");
}
