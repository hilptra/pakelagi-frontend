const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface AdminUser {
  name: string;
  email: string;
}

export interface SingleAdminResponse {
  data: AdminUser;
}

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

export async function ensureCsrfToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  
  try {
    const baseUrl = API_URL.replace(/\/api\/v1\/?$/, "");
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });

    return getCookie("XSRF-TOKEN");
  } catch (err) {
    console.warn("Unable to fetch CSRF token:", err);
    return null;
  }
}

export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const csrfToken = await ensureCsrfToken();

  const url = `${API_URL}/auth/login`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (csrfToken) {
    headers["X-XSRF-TOKEN"] = csrfToken;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    throw new Error(
      "Gagal terhubung ke server API (http://localhost:8000). Pastikan backend Laravel sedang berjalan."
    );
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.message || errorData.errors?.email?.[0] || "Gagal masuk. Periksa email dan kata sandi.";
    throw new Error(message);
  }

  const json: SingleAdminResponse = await res.json();
  return json.data;
}

export async function logoutAdmin(): Promise<void> {
  const csrfToken = await ensureCsrfToken();

  const url = `${API_URL}/auth/logout`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (csrfToken) {
    headers["X-XSRF-TOKEN"] = csrfToken;
  }

  try {
    await fetch(url, {
      method: "POST",
      headers,
      credentials: "include",
    });
  } catch (err) {
    console.warn("Logout request failed:", err);
  }
}

export async function getAdminProfile(): Promise<AdminUser | null> {
  const url = `${API_URL}/auth/me`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) return null;

    const json: SingleAdminResponse = await res.json();
    return json.data;
  } catch (err) {
    console.warn("Failed to fetch admin profile:", err);
    return null;
  }
}
