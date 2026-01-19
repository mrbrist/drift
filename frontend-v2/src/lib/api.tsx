const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // only if you use cookies
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed");
  }

  return res.json();
}

export const api = {
  get: <T,>(path: string) => apiFetch<T>(path),
  post: <T,>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: <T,>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: <T,>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
