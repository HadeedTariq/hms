import { createSlice } from "@reduxjs/toolkit";

export type FullAppState = {
  user: User | null;
  hotelDetails: any;
};

const initialState: FullAppState = {
  user: null,
  hotelDetails: null,
};

const fullAppReducer = createSlice({
  name: "fullAppReducer",
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: User }) => {
      state.user = payload;
    },
    setHotelDetails: (state, { payload }: { payload: any }) => {
      state.hotelDetails = payload;
    },
  },
});

export const { setUser, setHotelDetails } = fullAppReducer.actions;
export default fullAppReducer.reducer;
