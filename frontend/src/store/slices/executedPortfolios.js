import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  executedPortfolios: [],
};

export const executedPortfolioSlice = createSlice({
  name: "executedPortfolio",
  initialState,
  reducers: {
    setexecutedPortfolios: (state, action) => {
      state.executedPortfolios = action.payload.executedPortfolios || [];
    },
  },
});

export const { setexecutedPortfolios } = executedPortfolioSlice.actions;

export default executedPortfolioSlice.reducer;
