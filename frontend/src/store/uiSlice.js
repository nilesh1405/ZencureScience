import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sideBar: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    sideBarOpen: (state) => {
      state.sideBar = true;
    },

    sideBarClose: (state) => {
      state.sideBar = false;
    },

    toggleSideBar: (state) => {
      state.sideBar = !state.sideBar;
    },
  },
});

export const { sideBarOpen, sideBarClose, toggleSideBar } = uiSlice.actions;

export default uiSlice.reducer;
