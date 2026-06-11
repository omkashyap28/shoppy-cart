import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAppStore } from "@/store/store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const contextPath = "http://localhost:8080/api/v1";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const { accessToken, setAccessToken, setIsAuth, setEmail, setUserId } =
    useAppStore.getState();

  const makeRequest = async (token?: string) => {
    const headers = new Headers(options.headers);

    if (token !== "") {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const { cancel, signal } = requestTimeout();

    return await fetch(`${contextPath}/${url}`, {
      ...options,
      credentials: "include",
      headers,
      signal,
    });
  };

  if (accessToken === "") {
    try {
      setIsAuth(false);
      const newResponse = await refreshAccessToken();
      setAccessToken(newResponse.token);
      setUserId(newResponse.userId);
      setEmail(newResponse.email);
      setIsAuth(true);

      return await makeRequest(newResponse.token);
    } catch (e) {
      setAccessToken("");
      setUserId("");
      setEmail("");
      setIsAuth(false);
      throw e;
    }
  }

  let response = await makeRequest(accessToken);

  if (response.status !== 401) {
    return response;
  }

  try {
    const newToken = await refreshAccessTokenOnce();

    setAccessToken(newToken);

    return await makeRequest(newToken);
  } catch (error) {
    setAccessToken("");
    setIsAuth(false);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    throw error;
  }
}
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken() {
  const { cancel, signal } = requestTimeout();

  try {
    const response = await fetch(`${contextPath}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      signal,
    });

    if (!response.ok) {
      throw new Error("Refresh failed");
    }

    return await response.json();
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error("Server is not responding. Please try again later.");
    }
  }
}

async function refreshAccessTokenOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export function requestTimeout(timeout: number = 15000) {
  const controller = new AbortController();
  const signal = controller.signal;
  const id = setTimeout(() => controller.abort(), timeout);

  return { signal, cancel: () => clearTimeout(id) };
}
