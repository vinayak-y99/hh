import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [
  ],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload.orders || [];
    },
  },
});

export const { setOrders } = orderSlice.actions;

export default orderSlice.reducer;
