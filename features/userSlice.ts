import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Defines the structure of the user state
 */
type UserState = {

  /**
   * Unique identifier of the connected user
   */
  uid: string;
};

/**
 * Initial state of the user slice
 */
const initialState: UserState = {
  uid: '',
};

/**
 * Redux slice responsible for managing user data
 */
const userSlice = createSlice({

  /**
   * Slice name used in the Redux store
   */
  name: 'user',

  /**
   * Initial state of the slice
   */
  initialState,

  /**
   * Reducers used to modify the state
   */
  reducers: {

    /**
     * Updates the user UID in the Redux state
     *
     * @param state - Current Redux state
     * @param action - Redux action containing the new UID
     */
    setUid(state, action: PayloadAction<string>) {

      // Store the new user identifier
      state.uid = action.payload;
    },
  },
});

/**
 * Export generated Redux actions
 */
export const { setUid } = userSlice.actions;

/**
 * Export reducer to be added to the Redux store
 */
export default userSlice.reducer;