"use client";

import { updateStore, refreshAccessToken } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function Auth() {
  const { } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const data = await refreshAccessToken();
      updateStore(data);
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return <></>
}
