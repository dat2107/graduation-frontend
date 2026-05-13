import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SLICE_BASE_NAME } from './constants';

export interface UserInfoState {
  email: string;
  userId: string;
  isTwoFaEnabled?: boolean;
  name?: string;
  walletAddress?: string;
  language?: string;
  role: string;
  googleLogin?: boolean;
  notificationCount?: number;
  avatarUrl?: string;
}

const initialState: UserInfoState = {
  email: '',
  userId: '',
  isTwoFaEnabled: false,
  name: '',
  walletAddress: '',
  language: '',
  role: '',
  googleLogin: false,
  notificationCount: 0,
  avatarUrl: '',
};

const userInfoSlice = createSlice({
  name: `${SLICE_BASE_NAME}/userInfo`,
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfoState>) {
      state.userId = action.payload?.userId;
      state.email = action.payload?.email;
      state.language = action.payload?.language;
      state.role = action.payload?.role;
      state.walletAddress = action.payload?.walletAddress;
      state.name = action.payload?.name;
      state.googleLogin = action.payload.googleLogin;
      state.notificationCount = action.payload?.notificationCount;
      state.isTwoFaEnabled = action.payload?.isTwoFaEnabled;
      state.avatarUrl = action.payload?.avatarUrl;
    },
    setAvatarUrl(state, action: PayloadAction<string>) {
      state.avatarUrl = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload?.language;
    },
    setUserInfoRole(state, action) {
      state.role = action.payload?.role;
    },
    setDisplayName(state, action) {
      state.name = action.payload;
    },
    setWalletAddress(state, action) {
      state.walletAddress = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setNotificationCount(state, action) {
      state.notificationCount = action.payload;
    },
    setTwoFactorAuth(state, action) {
      state.isTwoFaEnabled = action.payload;
    },
  },
});

export const {
  setUserInfo,
  setUserId,
  setLanguage,
  setWalletAddress,
  setDisplayName,
  setTwoFactorAuth,
  setUserInfoRole,
  setNotificationCount,
  setAvatarUrl,
} = userInfoSlice.actions;
export default userInfoSlice.reducer;
