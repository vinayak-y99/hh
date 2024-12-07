import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  consoleMsgs: [],
};

export const consoleMsgSlice = createSlice({
  name: "consoleMsg",
  initialState,
  reducers: {
    setConsoleMsgs: {
      reducer: (state, action) => {
        state.consoleMsgs = action.payload.consoleMsgs;
      },
      prepare: (consoleMsgs) => {
        return { payload: consoleMsgs };
      },
    },
  },
});

export const { setConsoleMsgs } = consoleMsgSlice.actions;

export default consoleMsgSlice.reducer;
