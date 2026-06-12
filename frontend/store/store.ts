import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AppStore = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  email: string;
  setEmail: (email: string) => void;
  sellerId: string;
  setSellerId: (sellerId: string) => void;
  affiliateCode: string;
  setAffiliateCode: (affiliateCode: string) => void;
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
};

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
