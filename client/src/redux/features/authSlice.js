import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("ed_userInfo")
    ? JSON.parse(localStorage.getItem("ed_userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("ed_userInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("ed_userInfo");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
