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
