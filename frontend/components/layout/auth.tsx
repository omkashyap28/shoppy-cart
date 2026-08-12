"use client";

import { updateStore, refreshAccessToken, apiFetch } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/store";
import { useEffect } from "react";

export function Auth() {
  const userId = useAppStore((state) => state.userId);
  const setUser = useAppStore((state) => state.setUser);
  const setLoading = useAppStore((state) => state.setLoading);

  const { data: authData } = useQuery({
    queryKey: ["auth"],
    queryFn: refreshAccessToken,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (authData) {
      updateStore(authData);
    }
  }, [authData]);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-data", userId],
    queryFn: async () => {
      const response = await apiFetch(`user/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      return await response.json();
    },
    staleTime: Infinity,
    enabled: !!userId,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  return null;
}
