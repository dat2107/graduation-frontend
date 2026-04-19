import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/rootReducer';

// Define the state shape for cached data
export interface CachedDataState<T> {
  [key: string]: T | null; // Caching based on unique key (like a URL)
}

// Initial state for caching
const initialState: CachedDataState<any> = {};

// Define the slice using Redux Toolkit
const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    // Action to set the cache for a specific key
    setCacheData: <T>(
      state: CachedDataState<T>,
      action: PayloadAction<{ key: string; data: T }>
    ) => {
      const { key, data } = action.payload;
      state[key] = data;
    },
  },
});

// Export the action to set cache data
export const { setCacheData } = cacheSlice.actions;

// Selector to get cached data for a specific key
export const selectCacheData = <T>(state: RootState, key: string): T | null =>
  state.cache[key];

// Export the reducer to be added to the store
export default cacheSlice.reducer;
