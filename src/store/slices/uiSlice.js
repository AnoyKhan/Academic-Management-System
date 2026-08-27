import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenu: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const { toggleMobileMenu, setMobileMenu } = uiSlice.actions;

export default uiSlice.reducer;
