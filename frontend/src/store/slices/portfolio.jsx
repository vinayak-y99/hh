import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  portfolios: [],
};

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setPortfolios: (state, action) => {
      state.portfolios = action.payload.portfolios || [];
    },
  },
});

export const { setPortfolios } = portfolioSlice.actions;

export default portfolioSlice.reducer;
