const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieVal = parts.pop()?.split(";").shift();
    return cookieVal ? decodeURIComponent(cookieVal) : null;
  }
  return null;
}

async function getCsrfToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const baseUrl = API_URL.replace(/\/api\/v1\/?$/, "");
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });
    return getCookie("XSRF-TOKEN");
  } catch {
    return null;
  }
}

/**
 * Structured API error with status code and per-field validation errors.
 */
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data.message || `Permintaan gagal (HTTP ${res.status})`,
      res.status,
      data.errors,
    );
  }

  return data as T;
}

function buildHeaders(csrfToken: string | null, contentType?: string): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (csrfToken) headers["X-XSRF-TOKEN"] = csrfToken;
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

// ─── Public helpers ─────────────────────────────────────────────────

export function buildQueryString(params: Record<string, string | number | undefined | null>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  }
  const str = query.toString();
  return str ? `?${str}` : "";
}

// ─── HTTP verbs ─────────────────────────────────────────────────────

export async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      credentials: "include",
      cache: "no-store",
    });
    return await handleResponse<T>(res);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Tidak dapat terhubung ke server API. Pastikan server backend Laravel berjalan.",
      0
    );
  }
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const csrfToken = await getCsrfToken();
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(csrfToken, "application/json"),
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return await handleResponse<T>(res);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Tidak dapat terhubung ke server API. Pastikan server backend Laravel berjalan.",
      0
    );
  }
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const csrfToken = await getCsrfToken();
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: buildHeaders(csrfToken, "application/json"),
      credentials: "include",
      body: JSON.stringify(body),
    });
    return await handleResponse<T>(res);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Tidak dapat terhubung ke server API. Pastikan server backend Laravel berjalan.",
      0
    );
  }
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const csrfToken = await getCsrfToken();
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "PATCH",
      headers: buildHeaders(csrfToken, "application/json"),
      credentials: "include",
      body: JSON.stringify(body),
    });
    return await handleResponse<T>(res);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Tidak dapat terhubung ke server API. Pastikan server backend Laravel berjalan.",
      0
    );
  }
}

export async function apiDelete(path: string): Promise<void> {
  const csrfToken = await getCsrfToken();
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(csrfToken),
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new ApiError(
        data.message || `Gagal menghapus (HTTP ${res.status})`,
        res.status,
        data.errors,
      );
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Tidak dapat terhubung ke server API. Pastikan server backend Laravel berjalan.",
      0
    );
  }
}

export async function apiPostFormData<T>(path: string, formData: FormData): Promise<T> {
  const csrfToken = await getCsrfToken();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (csrfToken) headers["X-XSRF-TOKEN"] = csrfToken;

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers,
      credentials: "include",
      body: formData,
    });
    return await handleResponse<T>(res);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Tidak dapat terhubung ke server API. Pastikan server backend Laravel berjalan.",
      0
    );
  }
}
