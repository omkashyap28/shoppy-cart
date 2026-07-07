import { AppStore } from "@/types/store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    loading: false,
    setLoading: (loading) => set({ loading }),
    accessToken: "",
    setAccessToken: (accessToken) => set({ accessToken }),
    userId: "",
    setUserId: (userId) => set({ userId }),
    email: "",
    setEmail: (email) => set({ email }),
    sellerId: "",
    setSellerId: (sellerId) => set({ sellerId }),
    affiliateCode: "",
    setAffiliateCode: (affiliateCode) => set({ affiliateCode }),
    isAuth: false,
    setIsAuth: (isAuth) => set({ isAuth }),
  }))
);
