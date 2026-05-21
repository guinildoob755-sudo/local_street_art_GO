/**
 * Redux Store Configuration
 *
 * This file:
 * - Configures the global Redux store
 * - Registers application reducers
 * - Exports useful TypeScript types
 */

import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/features/userSlice';

/**
 * Create the Redux store
 */
export const store = configureStore({

  /**
   * Register all application reducers
   */
  reducer: {

    /**
     * User state management
     */
    user: userReducer,
  },
});

/**
 * RootState type
 *
 * Represents the complete Redux state structure
 * Useful with useSelector()
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch type
 *
 * Represents the Redux dispatch function type
 * Useful with useDispatch()
 */
export type AppDispatch = typeof store.dispatch;