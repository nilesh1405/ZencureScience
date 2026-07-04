import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  users: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
    },

    fetchProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
    },

    clearUserError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfile,
  clearUserError,
} = userSlice.actions;

export default userSlice.reducer;
