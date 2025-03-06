import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseData: null,
};

const courseSlice = createSlice({
  name: "Course",
  initialState,
  reducers: {
    setCourse: (state, action: PayloadAction<{ course: any }>) => {
      state.courseData = action.payload.course;
    },
  },
});
export const { setCourse } = courseSlice.actions;

export default courseSlice.reducer;
