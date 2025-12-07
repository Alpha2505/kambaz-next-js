import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};
export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return data;
};
export const findUsersForCourse = async (courseId: string) => {
 const response = await axios.get(`${COURSES_API}/${courseId}/users`);
 return response.data;
};
export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};
export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};
export const updateCourse = async (course: any) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};
export const findModulesForCourse = async (courseId: string) => {
  const response = await axios
    .get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};
export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};
const MODULES_API = `${HTTP_SERVER}/api/modules`;
// Assignments API
// Assignments API calls
export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return response.data;
};

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/assignments`, assignment);
  return response.data;
};

export const updateAssignment = async (assignment: any) => {
  const response = await axios.put(`${HTTP_SERVER}/api/assignments/${assignment._id}`, assignment);
  return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axios.delete(`${HTTP_SERVER}/api/assignments/${assignmentId}`);
  return response.data;
};

// Enrollments API
export const fetchAllEnrollments = async () => {
  const { data } = await axios.get(ENROLLMENTS_API);
  return data;
};

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.post(`${ENROLLMENTS_API}`, { user: userId, course: courseId });
  return data;
};

export const unenrollUserFromCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.delete(`${ENROLLMENTS_API}/${userId}/${courseId}`);
  return data;
};
// Make sure these functions pass courseId
export const deleteModule = async (courseId: string, moduleId: string) => {
  const response = await axios.delete(`${COURSES_API}/${courseId}/modules/${moduleId}`);
  return response.data;
};

export const updateModule = async (courseId: string, module: any) => {
  const { data } = await axios.put(
    `${COURSES_API}/${courseId}/modules/${module._id}`,
    module
  );
  return data;
};
export const enrollIntoCourse = async (userId: string, courseId: string) => {
 const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
 return response.data;
};
export const unenrollFromCourse = async (userId: string, courseId: string) => {
 const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
 return response.data;
};

// Quizzes API
export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const createQuizForCourse = async (courseId: string, quiz: any) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

export const updateQuiz = async (quiz: any) => {
  const response = await axios.put(`${HTTP_SERVER}/api/quizzes/${quiz._id}`, quiz);
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axios.delete(`${HTTP_SERVER}/api/quizzes/${quizId}`);
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axios.get(`${HTTP_SERVER}/api/quizzes/${quizId}`);
  return response.data;
};

// Quiz Attempts API
export const startQuizAttempt = async (quizId: string) => {
  const response = await axiosWithCredentials.post(`${HTTP_SERVER}/api/quizzes/${quizId}/attempts`);
  return response.data;
};

export const submitQuizAttempt = async (attemptId: string, answers: any[]) => {
  const response = await axiosWithCredentials.post(`${HTTP_SERVER}/api/attempts/${attemptId}/submit`, { answers });
  return response.data;
};

export const getLatestAttempt = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${HTTP_SERVER}/api/quizzes/${quizId}/attempts/latest`);
  return response.data;
};

export const getAllAttempts = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${HTTP_SERVER}/api/quizzes/${quizId}/attempts`);
  return response.data;
};