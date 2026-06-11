import { create } from "zustand";
import { devtools } from "zustand/middleware"

type AppStore = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  email: string;
  setEmail: (email: string) => void
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
};

export const useAppStore = create<AppStore>()(devtools(set => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  accessToken: "",
  setAccessToken: (accessToken: string) => set({ accessToken }),
  userId: "",
  setUserId: (userId: string) => set({ userId }),
  email: "",
  setEmail: (email: string) => set({ email }),
  isAuth: false,
  setIsAuth: (isAuth: boolean) => set({ isAuth }),
}))
);