"use server";

import { revalidateTag } from "next/cache";
import { requestTimeout } from "./utils";

const baseUrl = process.env.NEXT_BACKEND_BASE_URL as string;

interface ServerFetchOptions extends RequestInit {
  next?: NextFetchRequestConfig;
  validateStatus?: number | ((status: number) => boolean);
  errorMessage?: string;
  revalidate?: string | string[];
}

export async function serverFetch<T = unknown>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const { validateStatus, errorMessage, revalidate, headers, ...init } = options;

  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const { cancel, signal } = requestTimeout();

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal
    });

    let isValid;

    switch (typeof validateStatus) {
      case "number":
        isValid = res.status === validateStatus;
        break;
      case "function":
        isValid = validateStatus(res.status);
        break;
      default:
        isValid = res.ok;
    }

    if (!isValid) {
      throw new Error(errorMessage ?? `${init.method ?? "GET"} ${url} failed: ${res.status}`);
    }

    if (revalidate) {
      (Array.isArray(revalidate) ? revalidate : [revalidate]).forEach((tag) => revalidateTag(tag, "max"));
    }

    return res.status === 204 ? (null as T) : await res.json();
  } finally {
    cancel()
  }
}