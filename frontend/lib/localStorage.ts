"use client";

export function getLocalStorage(key: string): unknown {
  if (typeof window !== "undefined") {
    const storageData = localStorage.getItem(key);
    return storageData ? JSON.parse(storageData) : undefined;
  }
}

export function setLocalStorage(key: string, data: unknown) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function removeItemFromLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}
