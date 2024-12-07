import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  holdings: [
    {
      "User ID": "",
      Exchange: "",
      Symbol: "",
      LTP: "",
      "P&L%": "",
      "Current value": "",
      "Avg Price": "",
      "Buy Value": "",
      "Collateral Qty": "",
    },
  ],
};

export const holdingSlice = createSlice({
  name: "holding",
  initialState,
  reducers: {
    setHoldings: (state, action) => {
      state.holdings = action.payload.holdings || [];
    },
  },
});

export const { setHoldings } = holdingSlice.actions;

export default holdingSlice.reducer;
