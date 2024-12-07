import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  positions: [
    {
      "User ID": "",
      Product: "",
      Exchange: "",
      Symbol: "",
      "Net Qty": "",
      LTP: "",
      "P&L": "",
      "Buy Qty": "",
      "Buy Avg Price": "",
      "Buy Value": "",
      "Sell Qty": "",
      "Sell Avg Price": "",
      "Sell Value": "",
      "Realized Profit": "",
      "Unrealized profit": "",
    },
  ],
};

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPositions: (state, action) => {
      state.positions = action.payload.positions || [];
    },
  },
});

export const { setPositions } = positionSlice.actions;

export default positionSlice.reducer;
