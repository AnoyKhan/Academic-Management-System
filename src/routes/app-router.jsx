import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "../layouts/dashboard-layout";
import { AuthLayout } from "../layouts/auth-layout";
import { ROUTE_PATHS } from "./route-paths";
import { PageLoader } from "../components/ui/loader";
import {
  RedirectIfAuthenticated,
  RequireAuth,
  RequireRole,
} from "./protected-routes";
import { RootRedirect } from "./root-redirect";
import { ErrorBoundaryPage } from "../pages/error-boundary-page";

const lazyNamed = (loader, name) =>
  lazy(() => loader().then((module) => ({ default: module[name] })));

const AuthPage = lazyNamed(() => import("../pages/auth/auth-page"), "AuthPage");
const LoginPage = lazyNamed(
  () => import("../pages/auth/login-page"),
  "LoginPage",
);
const RegisterPage = lazyNamed(
  () => import("../pages/auth/register-page"),
  "RegisterPage",
);
const ForgotPasswordPage = lazyNamed(
  () => import("../pages/auth/forgot-password-page"),
  "ForgotPasswordPage",
);
const ResetPasswordPage = lazyNamed(
  () => import("../pages/auth/reset-password-page"),
  "ResetPasswordPage",
);
const NotFoundPage = lazyNamed(
  () => import("../pages/not-found-page"),
  "NotFoundPage",
);
const ForbiddenPage = lazyNamed(
  () => import("../pages/forbidden-page"),
  "ForbiddenPage",
);

const StudentPage = lazyNamed(
  () => import("../pages/student/student-page"),
  "StudentPage",
);
const StudentAcademicProgressPage = lazyNamed(
  () => import("../pages/student/student-academic-progress-page"),
  "StudentAcademicProgressPage",
);
const StudentAnalyticsPage = lazyNamed(
  () => import("../pages/student/student-analytics-page"),
  "StudentAnalyticsPage",
);
const StudentAssignmentsPage = lazyNamed(
  () => import("../pages/student/student-assignments-page"),
  "StudentAssignmentsPage",
);
const StudentAssignmentSubmissionPage = lazyNamed(
  () => import("../pages/student/student-assignment-submission-page"),
  "StudentAssignmentSubmissionPage",
);
const StudentCoursesPage = lazyNamed(
  () => import("../pages/student/student-courses-page"),
  "StudentCoursesPage",
);
const StudentGradesPage = lazyNamed(
  () => import("../pages/student/student-grades-page"),
  "StudentGradesPage",
);
const StudentAttendancePage = lazyNamed(
  () => import("../pages/student/student-attendance-page"),
  "StudentAttendancePage",
);
const StudentNotificationsPage = lazyNamed(
  () => import("../pages/student/student-notifications-page"),
  "StudentNotificationsPage",
);
const StudentProfileSettingsPage = lazyNamed(
  () => import("../pages/student/student-profile-settings-page"),
  "StudentProfileSettingsPage",
);

const TeacherPage = lazyNamed(
  () => import("../pages/teacher/teacher-page"),
  "TeacherPage",
);
const TeacherCoursesPage = lazyNamed(
  () => import("../pages/teacher/teacher-courses-page"),
  "TeacherCoursesPage",
);
const TeacherAssignmentsPage = lazyNamed(
  () => import("../pages/teacher/teacher-assignments-page"),
  "TeacherAssignmentsPage",
);
const TeacherSubmissionsPage = lazyNamed(
  () => import("../pages/teacher/teacher-submissions-page"),
  "TeacherSubmissionsPage",
);
const TeacherGradesPage = lazyNamed(
  () => import("../pages/teacher/teacher-grades-page"),
  "TeacherGradesPage",
);
const TeacherAttendancePage = lazyNamed(
  () => import("../pages/teacher/teacher-attendance-page"),
  "TeacherAttendancePage",
);
const TeacherMaterialsPage = lazyNamed(
  () => import("../pages/teacher/teacher-materials-page"),
  "TeacherMaterialsPage",
);
const TeacherAnalyticsPage = lazyNamed(
  () => import("../pages/teacher/teacher-analytics-page"),
  "TeacherAnalyticsPage",
);
const TeacherNotificationsPage = lazyNamed(
  () => import("../pages/teacher/teacher-notifications-page"),
  "TeacherNotificationsPage",
);
const TeacherProfileSettingsPage = lazyNamed(
  () => import("../pages/teacher/teacher-profile-settings-page"),
  "TeacherProfileSettingsPage",
);
const TeacherClassesPage = lazyNamed(
  () => import("../pages/teacher/teacher-classes-page"),
  "TeacherClassesPage",
);
const TeacherSchedulePage = lazyNamed(
  () => import("../pages/teacher/teacher-schedule-page"),
  "TeacherSchedulePage",
);
const TeacherReportsPage = lazyNamed(
  () => import("../pages/teacher/teacher-reports-page"),
  "TeacherReportsPage",
);

const AdminPage = lazyNamed(
  () => import("../pages/admin/admin-page"),
  "AdminPage",
);
const AdminIntakePage = lazyNamed(
  () => import("../pages/admin/admin-intake-page"),
  "AdminIntakePage",
);
const AdminBatchesPage = lazyNamed(
  () => import("../pages/admin/admin-batches-page"),
  "AdminBatchesPage",
);
const AdminTeachersPage = lazyNamed(
  () => import("../pages/admin/admin-teachers-page"),
  "AdminTeachersPage",
);
const AdminStudentsPage = lazyNamed(
  () => import("../pages/admin/admin-students-page"),
  "AdminStudentsPage",
);
const AdminCoursesPage = lazyNamed(
  () => import("../pages/admin/admin-courses-page"),
  "AdminCoursesPage",
);
const AdminAssignmentsPage = lazyNamed(
  () => import("../pages/admin/admin-assignments-page"),
  "AdminAssignmentsPage",
);
const AdminGradesPage = lazyNamed(
  () => import("../pages/admin/admin-grades-page"),
  "AdminGradesPage",
);
const AdminAttendancePage = lazyNamed(
  () => import("../pages/admin/admin-attendance-page"),
  "AdminAttendancePage",
);
const AdminNotificationsPage = lazyNamed(
  () => import("../pages/admin/admin-notifications-page"),
  "AdminNotificationsPage",
);
const AdminAnalyticsPage = lazyNamed(
  () => import("../pages/admin/admin-analytics-page"),
  "AdminAnalyticsPage",
);
const AdminProfilePage = lazyNamed(
  () => import("../pages/admin/admin-profile-page"),
  "AdminProfilePage",
);
const AdminDepartmentsPage = lazyNamed(
  () => import("../pages/admin/admin-departments-page"),
  "AdminDepartmentsPage",
);
const AdminCalendarPage = lazyNamed(
  () => import("../pages/admin/admin-calendar-page"),
  "AdminCalendarPage",
);
const AdminAIAnalyticsPage = lazyNamed(
  () => import("../pages/admin/admin-ai-analytics-page-live"),
  "AdminAIAnalyticsPageLive",
);
const AdminSystemSettingsPage = lazyNamed(
  () => import("../pages/admin/admin-system-settings-page"),
  "AdminSystemSettingsPage",
);
const AdminReportsPage = lazyNamed(
  () => import("../pages/admin/admin-reports-page"),
  "AdminReportsPage",
);
const AdminUsersPage = lazyNamed(
  () => import("../pages/admin/admin-users-page"),
  "AdminUsersPage",
);
const AdminSettingsPage = lazyNamed(
  () => import("../pages/admin/admin-settings-page"),
  "AdminSettingsPage",
);
const AdminSecurityPage = lazyNamed(
  () => import("../pages/admin/admin-security-page"),
  "AdminSecurityPage",
);

function routeElement(Component) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const appRouter = createBrowserRouter(
  [
  {
    path: ROUTE_PATHS.root,
    element: <RootRedirect />,
    errorElement: <ErrorBoundaryPage />,
  },
  {
    path: ROUTE_PATHS.forbidden,
    element: routeElement(ForbiddenPage),
    errorElement: <ErrorBoundaryPage />,
  },
  {
    element: <RequireAuth />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        element: <RequireRole role="student" />,
        children: [
          {
            path: ROUTE_PATHS.student,
            element: <DashboardLayout role="student" />,
            children: [
              { index: true, element: routeElement(StudentPage) },
              {
                path: "academic-progress",
                element: routeElement(StudentAcademicProgressPage),
              },
              {
                path: "analytics",
                element: routeElement(StudentAnalyticsPage),
              },
              {
                path: "assignments",
                element: routeElement(StudentAssignmentsPage),
              },
              {
                path: "assignments/:assignmentId/submit",
                element: routeElement(StudentAssignmentSubmissionPage),
              },
              { path: "courses", element: routeElement(StudentCoursesPage) },
              { path: "grades", element: routeElement(StudentGradesPage) },
              {
                path: "attendance",
                element: routeElement(StudentAttendancePage),
              },
              {
                path: "notifications",
                element: routeElement(StudentNotificationsPage),
              },
              {
                path: "profile",
                element: routeElement(StudentProfileSettingsPage),
              },
            ],
          },
        ],
      },
      {
        element: <RequireRole role="teacher" />,
        children: [
          {
            path: ROUTE_PATHS.teacher,
            element: <DashboardLayout role="teacher" />,
            children: [
              { index: true, element: routeElement(TeacherPage) },
              { path: "courses", element: routeElement(TeacherCoursesPage) },
              {
                path: "assignments",
                element: routeElement(TeacherAssignmentsPage),
              },
              {
                path: "submissions",
                element: routeElement(TeacherSubmissionsPage),
              },
              { path: "grades", element: routeElement(TeacherGradesPage) },
              {
                path: "attendance",
                element: routeElement(TeacherAttendancePage),
              },
              {
                path: "materials",
                element: routeElement(TeacherMaterialsPage),
              },
              {
                path: "analytics",
                element: routeElement(TeacherAnalyticsPage),
              },
              {
                path: "notifications",
                element: routeElement(TeacherNotificationsPage),
              },
              {
                path: "profile",
                element: routeElement(TeacherProfileSettingsPage),
              },
              { path: "classes", element: routeElement(TeacherClassesPage) },
              { path: "schedule", element: routeElement(TeacherSchedulePage) },
              { path: "reports", element: routeElement(TeacherReportsPage) },
            ],
          },
        ],
      },
      {
        element: <RequireRole role="admin" />,
        children: [
          {
            path: ROUTE_PATHS.admin,
            element: <DashboardLayout role="admin" />,
            children: [
              { index: true, element: routeElement(AdminPage) },
              { path: "intake", element: routeElement(AdminIntakePage) },
              { path: "batches", element: routeElement(AdminBatchesPage) },
              { path: "teachers", element: routeElement(AdminTeachersPage) },
              { path: "students", element: routeElement(AdminStudentsPage) },
              { path: "courses", element: routeElement(AdminCoursesPage) },
              {
                path: "assignments",
                element: routeElement(AdminAssignmentsPage),
              },
              { path: "grades", element: routeElement(AdminGradesPage) },
              {
                path: "attendance",
                element: routeElement(AdminAttendancePage),
              },
              {
                path: "notifications",
                element: routeElement(AdminNotificationsPage),
              },
              { path: "analytics", element: routeElement(AdminAnalyticsPage) },
              { path: "profile", element: routeElement(AdminProfilePage) },
              {
                path: "departments",
                element: routeElement(AdminDepartmentsPage),
              },
              { path: "calendar", element: routeElement(AdminCalendarPage) },
              {
                path: "ai-analytics",
                element: routeElement(AdminAIAnalyticsPage),
              },
              {
                path: "system-settings",
                element: routeElement(AdminSystemSettingsPage),
              },
              { path: "reports", element: routeElement(AdminReportsPage) },
              { path: "users", element: routeElement(AdminUsersPage) },
              { path: "settings", element: routeElement(AdminSettingsPage) },
              { path: "security", element: routeElement(AdminSecurityPage) },
            ],
          },
        ],
      },
    ],
  },
  {
    path: ROUTE_PATHS.auth,
    element: <RedirectIfAuthenticated />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { index: true, element: routeElement(AuthPage) },
          { path: "login", element: routeElement(LoginPage) },
          { path: "register", element: routeElement(RegisterPage) },
          {
            path: "forgot-password",
            element: routeElement(ForgotPasswordPage),
          },
          {
            path: "reset-password/:uid/:token",
            element: routeElement(ResetPasswordPage),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: routeElement(NotFoundPage),
    errorElement: <ErrorBoundaryPage />,
  },
  ],
  { basename: import.meta.env.BASE_URL },
);
