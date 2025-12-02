// app/(Kambaz)/Dashboard/reducer.ts

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrollments: [] as any[], // Changed from hardcoded to empty array
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, { payload }) => { // Added this action
      state.enrollments = payload;
    },
    
    enrollInCourse: (state, { payload }) => {
      const { userId, courseId } = payload;
      const newEnrollment = {
        _id: `${userId}-${courseId}`,
        user: userId,
        course: courseId,
      };
      state.enrollments = [...state.enrollments, newEnrollment];
    },
    
    unenrollFromCourse: (state, { payload }) => {
      const { userId, courseId } = payload;
      state.enrollments = state.enrollments.filter(
        (enrollment: any) =>
          !(enrollment.user === userId && enrollment.course === courseId)
      );
    },
  },
});

export const { setEnrollments, enrollInCourse, unenrollFromCourse } = enrollmentsSlice.actions; // Export setEnrollments
export default enrollmentsSlice.reducer;