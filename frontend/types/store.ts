import { UserResponse } from "./user";

export type AppStoreReducers = {
  setLoading: (loading: boolean) => void;
  setIsAuth: (isAuth: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  setUserId: (userId: string) => void;
  setUser: (user: UserResponse) => void;
  setSellerId: (sellerId: string) => void;
  setAffiliateCode: (affiliateCode: string) => void;
};

export type AppStoreStates = {
  loading: boolean;
  isAuth: boolean;
  accessToken: string;
  userId: string
  user: UserResponse | null;
  sellerId: string;
  affiliateCode: stria
};

export type AppStore = AppStoreStates & AppStoreReducers;
