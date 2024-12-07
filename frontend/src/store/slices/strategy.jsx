import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  strategies: [
    {
      enabled: true,
      logged: false,
      ManualSquareOff: "",
      StrategyLabel: "",
      PL: "0",
      TradeSize: "0",
      DuplicateSignalPrevention: "0",
      OpenTime: "00:00:00",
      CloseTime: "00:00:00",
      SqOffTime: "00:00:00",
      TradingAccount: "",
      MaxProfit: "0",
      MaxLoss: "0",
      MaxLossWaitTime: "00:00:00",
      ProfitLocking: "0",
      DelayBetweenUsers: "0",
      UniqueIDReqforOrder: "",
      CancelPreviousOpenSignal: "",
      StopReverse: "",
      PartMultiExists: "",
      HoldSellSeconds: "00",
      AllowedTrades: true,
      EntryOrderRetry: false,
      EntryRetryCount: "0",
      EntryRetryWaitSeconds: "00",
      ExitOrderRetry: false,
      ExitRetryCount: "0",
      ExitRetryWaitSeconds: "00",
      ExitMaxWaitSeconds: "00",
      SqOffDone: "",
      Delta: "0",
      Theta: "0",
      Vega: "0",
    },
  ],
};

export const strategySlice = createSlice({
  name: "strategy",
  initialState,
  reducers: {
    setStrategies: (state, action) => {
      state.strategies = action.payload.strategies || [];
    },
  },
});

export const { setStrategies } = strategySlice.actions;

export default strategySlice.reducer;
