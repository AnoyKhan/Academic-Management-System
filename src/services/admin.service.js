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

const getAllPages = async (request, params = {}, signal) => {
  const pageSize = 100;
  const records = [];
  let page = 1;

  while (true) {
    const response = await request({
      ...params,
      page,
      page_size: pageSize,
    }, signal);
    const payload = unwrapData(response);
    const pageRecords = Array.isArray(payload)
      ? payload
      : (payload?.results ?? []);

    records.push(...pageRecords);
    if (
      pageRecords.length === 0 ||
      Array.isArray(payload) ||
      !payload?.next ||
      (payload.count != null && records.length >= payload.count)
    ) {
      return records;
    }
    page += 1;
  }
};

export const adminService = {
  getProfile: () => http.get(API_ENDPOINTS.auth.me),
  updateProfile: (payload) => http.patch(API_ENDPOINTS.auth.me, payload),
  getDashboard: () => http.get(API_ENDPOINTS.admin.dashboard),
  getUsers: (params = {}, signal) =>
    http.get(API_ENDPOINTS.admin.users, { params, signal }),
  getUser: (userId) => http.get(`${API_ENDPOINTS.admin.users}${userId}/`),
  createUser: (payload) => http.post(API_ENDPOINTS.admin.users, payload),
  updateUser: (userId, payload) =>
    http.put(`${API_ENDPOINTS.admin.users}${userId}/`, payload),
  deleteUser: (userId) => http.delete(`${API_ENDPOINTS.admin.users}${userId}/`),
  getStudents: (params = {}, signal) =>
    http.get(API_ENDPOINTS.admin.students, { params, signal }),
  getStudent: (studentId) =>
    http.get(`${API_ENDPOINTS.admin.students}${studentId}/`),
  createStudent: (payload) => http.post(API_ENDPOINTS.admin.students, payload),
  updateStudent: (studentId, payload) =>
    http.put(`${API_ENDPOINTS.admin.students}${studentId}/`, payload),
  deleteStudent: (studentId) =>
    http.delete(`${API_ENDPOINTS.admin.students}${studentId}/`),
  getTeachers: (params = {}, signal) =>
    http.get(API_ENDPOINTS.admin.teachers, { params, signal }),
  getTeacher: (teacherId) =>
    http.get(`${API_ENDPOINTS.admin.teachers}${teacherId}/`),
  createTeacher: (payload) => http.post(API_ENDPOINTS.admin.teachers, payload),
  updateTeacher: (teacherId, payload) =>
    http.put(`${API_ENDPOINTS.admin.teachers}${teacherId}/`, payload),
  deleteTeacher: (teacherId) =>
    http.delete(`${API_ENDPOINTS.admin.teachers}${teacherId}/`),
  getCourses: (params = {}, signal) =>
    http.get(API_ENDPOINTS.admin.courses, { params, signal }),
  getCourse: (courseId) =>
    http.get(`${API_ENDPOINTS.admin.courses}${courseId}/`),
  createCourse: (payload) => http.post(API_ENDPOINTS.admin.courses, payload),
  updateCourse: (courseId, payload) =>
    http.put(`${API_ENDPOINTS.admin.courses}${courseId}/`, payload),
  deleteCourse: (courseId) =>
    http.delete(`${API_ENDPOINTS.admin.courses}${courseId}/`),
  getAssignments: (params = {}, signal) =>
    http.get(API_ENDPOINTS.admin.assignments, { params, signal }),
  getAssignment: (assignmentId) =>
    http.get(`${API_ENDPOINTS.admin.assignments}${assignmentId}/`),
  createAssignment: (payload) =>
    http.post(API_ENDPOINTS.admin.assignments, payload),
  updateAssignment: (assignmentId, payload) =>
    http.put(`${API_ENDPOINTS.admin.assignments}${assignmentId}/`, payload),
  deleteAssignment: (assignmentId) =>
    http.delete(`${API_ENDPOINTS.admin.assignments}${assignmentId}/`),
  getGrades: (params = {}, signal) =>
    http.get(API_ENDPOINTS.admin.grades, { params, signal }),
  createGrade: (payload) => http.post(API_ENDPOINTS.admin.grades, payload),
  updateGrade: (gradeId, payload) =>
    http.patch(`${API_ENDPOINTS.admin.grades}${gradeId}/`, payload),
  deleteGrade: (gradeId) =>
    http.delete(`${API_ENDPOINTS.admin.grades}${gradeId}/`),
  getAttendance: (params = {}, signal) =>
    http.get(API_ENDPOINTS.admin.attendance, { params, signal }),
  createAttendance: (payload) =>
    http.post(API_ENDPOINTS.admin.attendance, payload),
  updateAttendance: (attendanceId, payload) =>
    http.patch(`${API_ENDPOINTS.admin.attendance}${attendanceId}/`, payload),
  deleteAttendance: (attendanceId) =>
    http.delete(`${API_ENDPOINTS.admin.attendance}${attendanceId}/`),
  getNotifications: (params = {}) =>
    http.get(API_ENDPOINTS.admin.notifications, { params }),
  createNotification: (payload) =>
    http.post(API_ENDPOINTS.admin.notifications, payload),
  updateNotification: (notificationId, payload) =>
    http.patch(
      `${API_ENDPOINTS.admin.notifications}${notificationId}/`,
      payload,
    ),
  deleteNotification: (notificationId) =>
    http.delete(`${API_ENDPOINTS.admin.notifications}${notificationId}/`),
  getAnalytics: () => http.get(API_ENDPOINTS.admin.analytics),
  getAllStudents: (params = {}, signal) =>
    getAllPages(
      (pageParams, requestSignal) =>
        http.get(API_ENDPOINTS.admin.students, {
          params: pageParams,
          signal: requestSignal,
        }),
      params,
      signal,
    ),
  getAllTeachers: (params = {}, signal) =>
    getAllPages(
      (pageParams, requestSignal) =>
        http.get(API_ENDPOINTS.admin.teachers, {
          params: pageParams,
          signal: requestSignal,
        }),
      params,
      signal,
    ),
  getAllCourses: (params = {}, signal) =>
    getAllPages(
      (pageParams, requestSignal) =>
        http.get(API_ENDPOINTS.admin.courses, {
          params: pageParams,
          signal: requestSignal,
        }),
      params,
      signal,
    ),
  getAllAssignments: (params = {}, signal) =>
    getAllPages(
      (pageParams, requestSignal) =>
        http.get(API_ENDPOINTS.admin.assignments, {
          params: pageParams,
          signal: requestSignal,
        }),
      params,
      signal,
    ),
  unwrapData,
};
