import { http } from "./http";
import { API_ENDPOINTS } from "./api-endpoints";

const unwrapData = (response) => {
  const payload = response?.data?.data ?? response?.data ?? {};

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  return payload;
};

export const adminService = {
  getProfile: () => http.get(API_ENDPOINTS.auth.me),
  getDashboard: () => http.get(API_ENDPOINTS.admin.dashboard),
  getUsers: (params = {}) => http.get(API_ENDPOINTS.admin.users, { params }),
  getUser: (userId) => http.get(`${API_ENDPOINTS.admin.users}${userId}/`),
  createUser: (payload) => http.post(API_ENDPOINTS.admin.users, payload),
  updateUser: (userId, payload) =>
    http.put(`${API_ENDPOINTS.admin.users}${userId}/`, payload),
  deleteUser: (userId) => http.delete(`${API_ENDPOINTS.admin.users}${userId}/`),
  getStudents: (params = {}) =>
    http.get(API_ENDPOINTS.admin.students, { params }),
  getStudent: (studentId) =>
    http.get(`${API_ENDPOINTS.admin.students}${studentId}/`),
  createStudent: (payload) => http.post(API_ENDPOINTS.admin.students, payload),
  updateStudent: (studentId, payload) =>
    http.put(`${API_ENDPOINTS.admin.students}${studentId}/`, payload),
  deleteStudent: (studentId) =>
    http.delete(`${API_ENDPOINTS.admin.students}${studentId}/`),
  getTeachers: (params = {}) =>
    http.get(API_ENDPOINTS.admin.teachers, { params }),
  getTeacher: (teacherId) =>
    http.get(`${API_ENDPOINTS.admin.teachers}${teacherId}/`),
  createTeacher: (payload) => http.post(API_ENDPOINTS.admin.teachers, payload),
  updateTeacher: (teacherId, payload) =>
    http.put(`${API_ENDPOINTS.admin.teachers}${teacherId}/`, payload),
  deleteTeacher: (teacherId) =>
    http.delete(`${API_ENDPOINTS.admin.teachers}${teacherId}/`),
  getCourses: (params = {}) =>
    http.get(API_ENDPOINTS.admin.courses, { params }),
  getCourse: (courseId) =>
    http.get(`${API_ENDPOINTS.admin.courses}${courseId}/`),
  createCourse: (payload) => http.post(API_ENDPOINTS.admin.courses, payload),
  updateCourse: (courseId, payload) =>
    http.put(`${API_ENDPOINTS.admin.courses}${courseId}/`, payload),
  deleteCourse: (courseId) =>
    http.delete(`${API_ENDPOINTS.admin.courses}${courseId}/`),
  getAssignments: (params = {}) =>
    http.get(API_ENDPOINTS.admin.assignments, { params }),
  getAssignment: (assignmentId) =>
    http.get(`${API_ENDPOINTS.admin.assignments}${assignmentId}/`),
  createAssignment: (payload) =>
    http.post(API_ENDPOINTS.admin.assignments, payload),
  updateAssignment: (assignmentId, payload) =>
    http.put(`${API_ENDPOINTS.admin.assignments}${assignmentId}/`, payload),
  deleteAssignment: (assignmentId) =>
    http.delete(`${API_ENDPOINTS.admin.assignments}${assignmentId}/`),
  getGrades: (params = {}) => http.get(API_ENDPOINTS.admin.grades, { params }),
  createGrade: (payload) => http.post(API_ENDPOINTS.admin.grades, payload),
  getAttendance: (params = {}) =>
    http.get(API_ENDPOINTS.admin.attendance, { params }),
  createAttendance: (payload) =>
    http.post(API_ENDPOINTS.admin.attendance, payload),
  getNotifications: (params = {}) =>
    http.get(API_ENDPOINTS.admin.notifications, { params }),
  createNotification: (payload) =>
    http.post(API_ENDPOINTS.admin.notifications, payload),
  getAnalytics: () => http.get(API_ENDPOINTS.admin.analytics),
  unwrapData,
};
