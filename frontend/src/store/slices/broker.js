import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brokers: [
    // {
    //   enabled: true,
    //   mtmAll: 0,
    //   net: 0,
    //   availableMargin: 0,
    //   name: "pseudo account",
    //   userId: "1234567",
    //   broker: "pseudo account",
    //   secretKey: "",
    //   apiKey: "BS3JYNN6W3",
    //   qrCode: "PXFQ5LJL5W7JCSARFU3KAVS2Ji",
    //   sqOffTime: "00:00:00",
    //   maxProfit: 0,
    //   maxLoss: 0,
    //   profitLocking: "",
    //   qtyByExposure: 0,
    //   maxLossPerTrade: 0,
    //   maxOpenTrades: 0,
    //   qtyMultiplier: 0.0,
    //   mobile: "",
    //   email: "",
    //   password: "1234",
    //   autoLogin: true,
    //   historicalApi: false,
    //   inputDisabled: false,
    // },
  ],
};

export const brokerSlice = createSlice({
  name: "broker",
  initialState,
  reducers: {
    setBrokers: (state, action) => {
      state.brokers = action.payload.brokers || [];
    },
  },
});

export const { setBrokers } = brokerSlice.actions;

export default brokerSlice.reducer;
