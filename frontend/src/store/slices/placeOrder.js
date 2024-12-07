import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  placeOrderStart: false,
};

export const placeOrderStartSlice = createSlice({
  name: "placeOrderStart",
  initialState,
  reducers: {
    setPlaceOrderStart: (state, action) => {
      state.placeOrderStart = action.payload.placeOrderStart || false;
    },
  },
});

export const { setPlaceOrderStart } = placeOrderStartSlice.actions;

export default placeOrderStartSlice.reducer;
