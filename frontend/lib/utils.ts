import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAppStore } from "@/store/store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let refreshFailed = false;

interface TokenResponse {
  token: string;
  userId: string;
  email: string;
  sellerId?: string;
  affiliateCode?: string;
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const { accessToken } = useAppStore.getState();

  const makeRequest = async (token?: string) => {
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const { signal, cancel } = requestTimeout();

    try {
      return await fetch(`/backend/${url}`, {
        ...options,
        credentials: "include",
        headers,
        signal,
      });
    } finally {
      cancel();
    }
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
      response = await makeRequest(newToken.token);
    } catch (error) {
      throw error;
    }
  }

  return response;
}

let refreshPromise: Promise<TokenResponse> | null = null;

export async function refreshAccessToken(): Promise<TokenResponse> {
  const { signal, cancel } = requestTimeout();

  try {
    const response = await fetch(`/backend/auth/refresh`, {
      method: "POST",
      credentials: "include",
      signal,
    });

    if(response.status === 401) {
      refreshFailed = true;
      clearStore()
      await clearCookie()
    }
    refreshFailed = false;
    return await response.json();
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error("Server is not responding. Please try again later.");
    }
    throw e;
  } finally {
    cancel();
  }
}

async function refreshAccessTokenOnce(): Promise<TokenResponse> {
  if (refreshFailed) {
    throw new Error("Sesison Expired");
  }

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return await refreshPromise;
}

export function requestTimeout(timeout: number = 60000) {
  const controller = new AbortController();
  const signal = controller.signal;
  const id = setTimeout(() => controller.abort(), timeout);

  return { signal, cancel: () => clearTimeout(id) };
}

export async function logout() {
  const { signal, cancel } = requestTimeout();

  try {
    const response = await fetch(`api/auth/logout`, {
      method: "DELETE",
      credentials: "include",
      signal,
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    clearStore();
    if(typeof window !== "undefined") {
      window.location.href = "/"
    }
    
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error("Server is not responding. Please try again later.");
    }
  } finally {
    cancel();
  }
}

export function updateStore(data: {
  token: string;
  userId: string;
  email: string;
  sellerId?: string;
  affiliateCode?: string;
}) {
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

async function clearCookie() {
  await fetch("/backend/auth/clear-session", { method: "POST" });
}

export function debounce<Args extends unknown[]>(
  fn: (...args: [...Args, AbortSignal]) => Promise<void>,
  delay: number = 300
) {
  let timerId: ReturnType<typeof setTimeout> | undefined;
  let controller: AbortController | undefined;
  return function (...args: Args) {
    if (timerId) clearTimeout(timerId);
    controller?.abort();

    controller = new AbortController();
    const currentController = controller;

    timerId = setTimeout(() => {
      timerId = undefined;
      fn(...args, currentController.signal).catch((err) => {
        if (err.name !== "AbortError") throw err;
      });
    }, delay);
  };
}
