import {
  Bell,
  BookMarked,
  CalendarDays,
  ClipboardList,
  ClipboardCheck,
  Building2,
  BrainCircuit,
  FileUp,
  FileBarChart2,
  LayoutDashboard,
  LineChart,
  SlidersHorizontal,
  UserCircle2,
  UserPlus,
  Users,
} from "lucide-react";
import { ROUTE_PATHS } from "../routes/route-paths";

export const ROLE_META = {
  student: {
    label: "Student",
    accent: "from-cyan-500 to-sky-600",
  },
  teacher: {
    label: "Teacher",
    accent: "from-amber-500 to-orange-600",
  },
  admin: {
    label: "Admin",
    accent: "from-emerald-500 to-teal-700",
  },
};

export const ROLE_NAV_LINKS = {
  student: [
    { label: "Dashboard", path: ROUTE_PATHS.student, icon: LayoutDashboard },
    {
      label: "Academic Progress",
      path: ROUTE_PATHS.studentAcademicProgress,
      icon: LineChart,
    },
    {
      label: "Analytics",
      path: ROUTE_PATHS.studentAnalytics,
      icon: LineChart,
    },
    {
      label: "Assignments",
      path: ROUTE_PATHS.studentAssignments,
      icon: ClipboardList,
    },
    { label: "Courses", path: ROUTE_PATHS.studentCourses, icon: BookMarked },
    { label: "Grades", path: ROUTE_PATHS.studentGrades, icon: ClipboardCheck },
    {
      label: "Attendance",
      path: ROUTE_PATHS.studentAttendance,
      icon: CalendarDays,
    },
    {
      label: "Notifications",
      path: ROUTE_PATHS.studentNotifications,
      icon: Bell,
    },
    {
      label: "Profile Settings",
      path: ROUTE_PATHS.studentProfile,
      icon: UserCircle2,
    },
  ],
  teacher: [
    { label: "Dashboard", path: ROUTE_PATHS.teacher, icon: LayoutDashboard },
    { label: "Courses", path: ROUTE_PATHS.teacherCourses, icon: BookMarked },
    {
      label: "Assignments",
      path: ROUTE_PATHS.teacherAssignments,
      icon: ClipboardList,
    },
    {
      label: "Submissions",
      path: ROUTE_PATHS.teacherSubmissions,
      icon: ClipboardCheck,
    },
    { label: "Grades", path: ROUTE_PATHS.teacherGrades, icon: FileBarChart2 },
    {
      label: "Attendance",
      path: ROUTE_PATHS.teacherAttendance,
      icon: CalendarDays,
    },
    { label: "Materials", path: ROUTE_PATHS.teacherMaterials, icon: FileUp },
    { label: "Analytics", path: ROUTE_PATHS.teacherAnalytics, icon: LineChart },
    {
      label: "Notifications",
      path: ROUTE_PATHS.teacherNotifications,
      icon: Bell,
    },
    {
      label: "Profile Settings",
      path: ROUTE_PATHS.teacherProfile,
      icon: UserCircle2,
    },
  ],
  admin: [
    { label: "Dashboard", path: ROUTE_PATHS.admin, icon: LayoutDashboard },
    { label: "Intake", path: ROUTE_PATHS.adminIntake, icon: UserPlus },
    { label: "Batches", path: ROUTE_PATHS.adminBatches, icon: ClipboardList },
    { label: "Teachers", path: ROUTE_PATHS.adminTeachers, icon: UserCircle2 },
    { label: "Students", path: ROUTE_PATHS.adminStudents, icon: Users },
    { label: "Courses", path: ROUTE_PATHS.adminCourses, icon: BookMarked },
    {
      label: "Departments",
      path: ROUTE_PATHS.adminDepartments,
      icon: Building2,
    },
    {
      label: "Academic Calendar",
      path: ROUTE_PATHS.adminCalendar,
      icon: CalendarDays,
    },
    {
      label: "Assignments",
      path: ROUTE_PATHS.adminAssignments,
      icon: ClipboardList,
    },
    { label: "Grades", path: ROUTE_PATHS.adminGrades, icon: FileBarChart2 },
    {
      label: "Attendance",
      path: ROUTE_PATHS.adminAttendance,
      icon: CalendarDays,
    },
    {
      label: "Notifications",
      path: ROUTE_PATHS.adminNotifications,
      icon: Bell,
    },
    {
      label: "Analytics",
      path: ROUTE_PATHS.adminAnalytics,
      icon: LineChart,
    },
    {
      label: "AI Analytics",
      path: ROUTE_PATHS.adminAIAnalytics,
      icon: BrainCircuit,
    },
    {
      label: "System Settings",
      path: ROUTE_PATHS.adminSystemSettings,
      icon: SlidersHorizontal,
    },
    { label: "Reports", path: ROUTE_PATHS.adminReports, icon: FileBarChart2 },
    { label: "Profile", path: ROUTE_PATHS.adminProfile, icon: UserCircle2 },
  ],
};

export const MOCK_NOTIFICATIONS = {
  student: [
    "New assignment uploaded in Discrete Mathematics",
    "Attendance updated for Operating Systems",
    "Semester registration starts next week",
    "Profile verification pending document upload",
  ],
  teacher: [
    "Two assignments pending grading",
    "Faculty meeting at 2:00 PM",
    "New class schedule published",
  ],
  admin: [
    "5 new user requests need approval",
    "System maintenance scheduled tonight",
    "Policy audit report is ready",
  ],
};
