import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AppStoreReducers = {
  setLoading: (loading: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setSellerId: (sellerId: string) => void;
  setAffiliateCode: (affiliateCode: string) => void;
  setIsAuth: (isAuth: boolean) => void;
};

export type AppStoreStates = {
  loading: boolean;
  isAuth: boolean;
  userId: string;
  accessToken: string;
  email: string;
  sellerId: string;
  affiliateCode: string;
}

export  type AppStore = AppStoreStates & AppStoreReducers;

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
