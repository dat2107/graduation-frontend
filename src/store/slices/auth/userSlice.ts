import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SLICE_BASE_NAME } from './constants';

interface SessionUserProps {
  verifyCheck: boolean;
  customerStatus: string;
  packageCode: string;
}
export interface UserState {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  role?: string[];
  custId?: string;
  custNo?: string;
  customer?: any;
  cifCoreBank?: string;
  session?: SessionUserProps;
}

const initialState: UserState = {
  fullName: '',
  email: '',
  custId: '',
  custNo: '',
  role: [],
  customer: {},
  session: {
    verifyCheck: false,
    customerStatus: '',
    packageCode: '',
  },
};

const userSlice = createSlice({
  name: `${SLICE_BASE_NAME}/user`,
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.email = action.payload?.email;
      state.fullName = action.payload?.fullName;
      state.role = action.payload?.role;
      state.phoneNumber = action.payload?.phoneNumber;
      state.custId = action.payload?.custId;
      state.custNo = action.payload?.custNo;
      state.cifCoreBank = action.payload?.cifCoreBank;
    },
    setUserRole(state, action) {
      state.role = action.payload.role;
    },
    setUserName(state, action) {
      state.fullName = action.payload;
    },
    setCustomer(state, action) {
      state.customer = action.payload;
    },
    setSession(state, { payload }) {
      return {
        ...state,
        session: payload,
      };
    },
  },
});

export const { setUser, setUserRole, setUserName, setCustomer, setSession } =
  userSlice.actions;
export default userSlice.reducer;
