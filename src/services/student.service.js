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

export const studentService = {
  getDashboard: () => http.get(API_ENDPOINTS.student.dashboard),
  getAnalytics: () => http.get(API_ENDPOINTS.student.analytics),
  getProfile: () => http.get(API_ENDPOINTS.student.profile),
  getCourses: (params = {}) =>
    http.get(API_ENDPOINTS.student.courses, { params }),
  getAssignments: (params = {}) =>
    http.get(API_ENDPOINTS.student.assignments, { params }),
  getGrades: (params = {}) =>
    http.get(API_ENDPOINTS.student.grades, { params }),
  getAttendance: (params = {}) =>
    http.get(API_ENDPOINTS.student.attendance, { params }),
  getNotifications: (params = {}) =>
    http.get(API_ENDPOINTS.student.notifications, { params }),
  submitAssignment: (assignmentId, formData) =>
    http.post(
      `${API_ENDPOINTS.student.assignments.replace(/\/$/, "")}/${assignmentId}/submit/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    ),
  unwrapData,
};
