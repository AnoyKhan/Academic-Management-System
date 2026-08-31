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

export const teacherService = {
  getDashboard: () => http.get(API_ENDPOINTS.teacher.dashboard),
  getAnalytics: () => http.get(API_ENDPOINTS.teacher.analytics),
  getProfile: () => http.get(API_ENDPOINTS.teacher.profile),
  getCourses: (params = {}) =>
    http.get(API_ENDPOINTS.teacher.courses, { params }),
  getAssignments: (params = {}) =>
    http.get(API_ENDPOINTS.teacher.assignments, { params }),
  getAssignmentDetail: (assignmentId) =>
    http.get(
      `${API_ENDPOINTS.teacher.assignments.replace(/\/$/, "")}/${assignmentId}/`,
    ),
  createAssignment: (payload) =>
    http.post(API_ENDPOINTS.teacher.assignments, payload),
  updateAssignment: (assignmentId, payload) =>
    http.put(
      `${API_ENDPOINTS.teacher.assignments.replace(/\/$/, "")}/${assignmentId}/`,
      payload,
    ),
  deleteAssignment: (assignmentId) =>
    http.delete(
      `${API_ENDPOINTS.teacher.assignments.replace(/\/$/, "")}/${assignmentId}/`,
    ),
  getSubmissions: (params = {}) =>
    http.get(API_ENDPOINTS.teacher.submissions, { params }),
  getSubmissionDetail: (submissionId) =>
    http.get(
      `${API_ENDPOINTS.teacher.submissions.replace(/\/$/, "")}/${submissionId}/`,
    ),
  gradeSubmission: (submissionId, payload) =>
    http.post(
      `${API_ENDPOINTS.teacher.submissions.replace(/\/$/, "")}/${submissionId}/grade/`,
      payload,
    ),
  getAttendance: (params = {}) =>
    http.get(API_ENDPOINTS.teacher.attendance, { params }),
  createAttendance: (payload) =>
    http.post(API_ENDPOINTS.teacher.attendance, payload),
  updateAttendance: (attendanceId, payload) =>
    http.put(
      `${API_ENDPOINTS.teacher.attendance.replace(/\/$/, "")}/${attendanceId}/`,
      payload,
    ),
  getNotifications: (params = {}) =>
    http.get(API_ENDPOINTS.teacher.notifications, { params }),
  unwrapData,
};
