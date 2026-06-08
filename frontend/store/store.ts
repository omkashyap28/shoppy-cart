import { create } from "zustand";

type AppStore = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  accessToken: "",
  setAccessToken: (accessToken: string) => set({ accessToken }),
  isAuth: false,
  setIsAuth: (isAuth: boolean) => set({ isAuth }),
}));