import { configureStore, createSlice } from '@reduxjs/toolkit'
import selectionSliceReducer from './selections'

export const store = configureStore({
  reducer: {
    selections: selectionSliceReducer,
  },
})
