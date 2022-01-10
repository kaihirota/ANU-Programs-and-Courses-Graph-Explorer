import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  programId: '',
  selectedCourses: [],
}

export const selectionSlice = createSlice({
  name: 'selections',
  initialState,
  reducers: {
    toggleCourse: (state, action) => {
      if (state.selectedCourses.includes(action.payload)) {
        state.selectedCourses = state.selectedCourses.filter(
          (course) => course !== action.payload
        )
      } else {
        state.selectedCourses = [...state.selectedCourses, action.payload]
      }
    },
    clearCourse: (state) => {
      state.selectedCourses = []
    },
    setSelectedCourses: (state, action) => {
      return {
        ...state,
        selectedCourses: action.payload,
      }
    },
    setProgram: (state, action) => {
      state.programId = action.payload
    },
  },
})
// Action creators are generated for each case reducer function
export const { toggleCourse, clearCourse, setSelectedCourses, setProgram } =
  selectionSlice.actions

export default selectionSlice.reducer
