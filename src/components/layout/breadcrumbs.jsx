import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROLE_META } from "../../data/role-dashboard";

const labelMap = {
  student: "Dashboard",
  teacher: "Dashboard",
  admin: "Dashboard",
  "academic-progress": "Academic Progress",
  assignments: "Assignments",
  submit: "Submission",
  courses: "Courses",
  grades: "Grades",
  attendance: "Attendance",
  notifications: "Notifications",
  profile: "Profile Settings",
  classes: "Classes",
  schedule: "Schedule",
  reports: "Reports",
  intake: "Intake",
  batches: "Batches",
  teachers: "Teachers",
  students: "Students",
  departments: "Departments",
  calendar: "Academic Calendar",
  "ai-analytics": "AI Analytics",
  "system-settings": "System Settings",
  users: "Users",
  settings: "Settings",
  security: "Security",
};

function toLabel(segment) {
  return (
    labelMap[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

export function Breadcrumbs({ role }) {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const homeLabel = ROLE_META[role]?.label ?? "Dashboard";

  const crumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;
    return {
      label: index === 0 ? homeLabel : toLabel(segment),
      path,
    };
  });

  return (
    <nav
      className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400"
      aria-label="Breadcrumb"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <div key={crumb.path} className="inline-flex items-center gap-1.5">
            {isLast ? (
              <span className="text-slate-700 dark:text-slate-200">
                {crumb.label}
              </span>
            ) : (
              <Link
                className="hover:text-brand-700 dark:hover:text-brand-300"
                to={crumb.path}
              >
                {crumb.label}
              </Link>
            )}
            {isLast ? null : <ChevronRight className="h-3.5 w-3.5" />}
          </div>
        );
      })}
    </nav>
  );
}
