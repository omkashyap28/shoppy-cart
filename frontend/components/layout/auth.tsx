"use client";

import { updateStore, refreshAccessToken, apiFetch } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/store";
import { useEffect } from "react";

export function Auth() {
  const userId = useAppStore((state) => state.userId);
  const setUser = useAppStore((state) => state.setUser);

  const { data: authData } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      return await refreshAccessToken();
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (authData) {
      updateStore(authData);
    }
  }, [authData]);

  const { data: userData } = useQuery({
    queryKey: ["user-data"],
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
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  return null;
}
