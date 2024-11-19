"use client";

import { USER } from "@/constants";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface InitialSateType {
  isAuthenticated: boolean;
  isLoading: boolean;
  data: USER | null;
}

const initialState: InitialSateType = {
  isAuthenticated: false,
  isLoading: true,
  data: null,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    set_current_user: (state, action: PayloadAction<USER>) => {
      // Let's mutate the original state, since redux toolkit allows us to do that
      (state.isAuthenticated = true), (state.data = action.payload);
    },
    stop_loading: (state) => {
      state.isLoading = false;
    },
    start_loading: (state) => {
      state.isLoading = true;
    },
    // We can add other reducers here in the future
  },
});

export const { set_current_user, stop_loading, start_loading } =
  UserSlice.actions;
export default UserSlice.reducer;
