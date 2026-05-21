import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  uid: string;
};

const initialState: UserState = {
  uid: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUid(state, action: PayloadAction<string>) {
      state.uid = action.payload;
    },
  },
});

export const { setUid } = userSlice.actions;
export default userSlice.reducer;