import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collapsed: false,
  height: 310,
};

export const collapseSlice = createSlice({
  name: "collapse",
  initialState,
  reducers: {
    setCollapse: (state, action) => {
      state.collapsed = action.payload.collapsed;
      state.height = action.payload.height || "";
    },
  },
});

export const { setCollapse } = collapseSlice.actions;

export default collapseSlice.reducer;
