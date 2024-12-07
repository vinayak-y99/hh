import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  masterChildAccounts: [],
};

export const masterChildAccountSlice = createSlice({
  name: "masterChildAccounts",
  initialState,
  reducers: {
    setmasterChildAccounts: (state, action) => {
      state.masterChildAccounts = action.payload.masterChildAccounts || [];
    },
  },
});

export const { setmasterChildAccounts } = masterChildAccountSlice.actions;

export default masterChildAccountSlice.reducer;
