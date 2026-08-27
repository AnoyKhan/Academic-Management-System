import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { studentCourses } from "../../data/student-portal-data";

export function StudentCoursesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Course List
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Enrolled courses with instructor, schedule, credits, and progress.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {studentCourses.map((course) => (
          <Card key={course.id}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {course.id}
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">
              {course.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Instructor: {course.instructor}
            </p>
            <p className="mt-1 text-sm text-slate-500">{course.schedule}</p>

            <div className="mt-4 flex items-center justify-between">
              <Badge tone="neutral">{course.credit} Credits</Badge>
              <Badge tone={course.progress >= 75 ? "success" : "warning"}>
                {course.progress}%
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
