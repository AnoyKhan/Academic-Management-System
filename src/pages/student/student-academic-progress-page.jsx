import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  academicProgress,
  studentCourses,
} from "../../data/student-portal-data";

export function StudentAcademicProgressPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Academic Progress
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Track completion status across curriculum requirements and current
          semester outcomes.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.3fr,1fr]">
        <Card className="h-[330px]">
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Progress by Category
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={academicProgress}
              margin={{ top: 8, right: 6, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="category"
                tick={{ fill: "#64748b", fontSize: 11 }}
                interval={0}
                angle={-15}
                height={50}
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#18877d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Current Courses
          </p>
          <div className="space-y-3">
            {studentCourses.slice(0, 4).map((course) => (
              <div
                key={course.id}
                className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {course.title}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Progress</span>
                  <Badge tone={course.progress >= 75 ? "success" : "warning"}>
                    {course.progress}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
