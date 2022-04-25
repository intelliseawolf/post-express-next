import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../index";
import type { User } from "../../interfaces/user.interface";

interface AuthState {
  currentUser: User | null;
}

const initialState: AuthState = {
  currentUser: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
