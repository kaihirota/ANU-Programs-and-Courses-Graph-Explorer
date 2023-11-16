import { configureStore } from '@reduxjs/toolkit'
import selectionSliceReducer from './selections'

export const store = configureStore({
  reducer: {
    selections: selectionSliceReducer,
  },
})
