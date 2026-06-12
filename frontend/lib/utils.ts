import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAppStore } from "@/store/store";
import { clear } from "console";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const contextPath = "http://localhost:8080/api/v1";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const { accessToken } = useAppStore.getState();

  const makeRequest = async (token?: string) => {
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const { signal } = requestTimeout();

    return await fetch(`${contextPath}/${url}`, {
      ...options,
      credentials: "include",
      headers,
      signal,
    });
  };

  if (!accessToken) {
    try {
      const newResponse = await refreshAccessToken();
      updateStore(newResponse);

      return await makeRequest(newResponse.token);
    } catch (e) {
      clearStore();
      throw e;
    }
  }

  let response = await makeRequest(accessToken);

  if (response.status === 401) {
    try {
      const newToken = await refreshAccessTokenOnce();
      updateStore(newToken);
      return await makeRequest(newToken);

    } catch (error) {
      clearStore();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw error;
    }
  }
}

let refreshPromise: Promise<any> | null = null;

async function refreshAccessToken() {
  const { signal } = requestTimeout();

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
    throw e;
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

export async function logout() {
  const { signal } = requestTimeout();

  try {
    const response = await fetch(`${contextPath}/auth/logout`, {
      method: "DELETE",
      credentials: "include",
      signal,
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    clearStore();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error("Server is not responding. Please try again later.");
    }
  }
}

export function updateStore(data: any) {
  const {
    setAccessToken,
    setIsAuth,
    setEmail,
    setUserId,
    setSellerId,
    setAffiliateCode,
  } = useAppStore.getState();

  setAccessToken(data.token);
  setUserId(data.userId);
  setEmail(data.email);
  setSellerId(data.sellerId || "");
  setAffiliateCode(data.affiliateCode || "");
  setIsAuth(true);
}

export function clearStore() {
  const {
    setAccessToken,
    setIsAuth,
    setEmail,
    setUserId,
    setSellerId,
    setAffiliateCode,
  } = useAppStore.getState();

  setAccessToken("");
  setUserId("");
  setEmail("");
  setSellerId("");
  setAffiliateCode("");
  setIsAuth(false);
}
