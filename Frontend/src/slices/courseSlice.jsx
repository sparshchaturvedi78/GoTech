import { createSlice } from "@reduxjs/toolkit";

// Retrieve saved step and course from localStorage
// const savedStep = localStorage.getItem("courseStep");
// const savedCourse = localStorage.getItem("courseData");

const initialState = {
  // step: savedStep ? parseInt(savedStep, 10) : 1,
  // course: savedCourse ? JSON.parse(savedCourse) : null,
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
      localStorage.setItem("courseStep", action.payload); // Persist step
    },
    setCourse: (state, action) => {
      state.course = action.payload;
      localStorage.setItem("courseData", JSON.stringify(action.payload)); // Persist course
    },
    setEditCourse: (state, action) => {

      state.editCourse = action.payload;
    },
    setPaymentLoading: (state, action) => {

      state.paymentLoading = action.payload;
    },
    resetCourseState: (state) => {
      state.step = 1;
      state.course = null;
      state.editCourse = false;
      // localStorage.removeItem("courseStep");   // Clear persisted step
      // localStorage.removeItem("courseData");   // Clear persisted course
    },
  },
});

export const {
  setStep,
  setCourse,
  setEditCourse,
  setPaymentLoading,
  resetCourseState,
} = courseSlice.actions;

export default courseSlice.reducer;
