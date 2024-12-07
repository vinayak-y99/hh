import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  NIFTY: [],
  BANKNIFTY: [],
  FINNIFTY: [],
  FUTNIFTY: [],
  FUTBANKNIFTY: [],
  FUTFINNIFTY: [],
};

export const expirySlice = createSlice({
  name: "expiry",
  initialState,
  reducers: {
    setExpiries: (state, action) => {
      state.NIFTY = action.payload.NIFTY || [];
      state.BANKNIFTY = action.payload.BANKNIFTY || [];
      state.FINNIFTY = action.payload.FINNIFTY || [];
      state.FUTNIFTY = action.payload.FUTNIFTY || [];
      state.FUTBANKNIFTY = action.payload.FUTBANKNIFTY || [];
      state.FUTFINNIFTY = action.payload.FUTFINNIFTY || [];
    },
  },
});

export const { setExpiries } = expirySlice.actions;

export default expirySlice.reducer;
