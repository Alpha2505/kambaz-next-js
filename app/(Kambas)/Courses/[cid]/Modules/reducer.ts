import { createSlice } from "@reduxjs/toolkit";
import { modules } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  modules: [],
  enrollments: [],
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    // Modules reducers
    setModules: (state, action) => {
      state.modules = action.payload;
    },
    addModule: (state, { payload: module }) => {
      const newModule: any = {
        _id: uuidv4(),
        lessons: [],
        name: module.name,
        course: module.course,
      };
      state.modules = [...state.modules, newModule] as any;
    },
    deleteModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.filter(
        (m: any) => m._id !== moduleId);
    },
    updateModule: (state, { payload: module }) => {
      state.modules = state.modules.map((m: any) =>
        m._id === module._id ? module : m
      ) as any;
    },
    editModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.map((m: any) =>
        m._id === moduleId ? { ...m, editing: true } : m
      ) as any;
    },
    
    // Enrollments reducers
    setEnrollments: (state, { payload: enrollments }) => {
      state.enrollments = enrollments;
    },
    enrollInCourse: (state, { payload: enrollment }) => {
      const newEnrollment: any = {
        _id: enrollment._id || new Date().getTime().toString(),
        user: enrollment.user || enrollment.userId,
        course: enrollment.course || enrollment.courseId,
      };
      state.enrollments = [...state.enrollments, newEnrollment] as any;
    },
    unenrollFromCourse: (state, { payload }) => {
      const { userId, courseId } = payload;
      state.enrollments = state.enrollments.filter(
        (enrollment: any) =>
          !(enrollment.user === userId && enrollment.course === courseId)
      ) as any;
    },
  },
});

export const { 
  addModule, 
  deleteModule, 
  updateModule, 
  editModule, 
  setModules,
  setEnrollments,
  enrollInCourse,
  unenrollFromCourse
} = modulesSlice.actions;

export default modulesSlice.reducer;