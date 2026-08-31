import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { studentService } from "../../services/student.service";

export function StudentAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const response = await studentService.getAnalytics();
        const payload = studentService.unwrapData(response);

        if (isMounted) {
          setAnalytics(payload);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message || "Unable to load analytics.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const recentGrades = analytics?.recent_grades ?? [];
  const courseCompletion = analytics?.course_completion ?? [];
  const attendanceData = [
    {
      name: "Present",
      value: analytics?.present_attendance ?? 0,
      fill: "#14b8a6",
    },
    {
      name: "Remaining",
      value: Math.max(
        (analytics?.total_attendance_records ?? 0) -
          (analytics?.present_attendance ?? 0),
        0,
      ),
      fill: "#e2e8f0",
    },
  ];

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Loading student analytics…
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Student Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Live academic performance, assignment progress, and attendance data
          from your backend profile.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Courses
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.total_courses ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Assignments
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.total_assignments ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Pending
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.pending_assignments ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Average
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {Number(analytics?.average_marks ?? 0).toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="h-80">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Attendance Trend
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <PieChart>
              <Pie
                data={attendanceData}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={90}
                paddingAngle={4}
              >
                {attendanceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-80">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Course Completion
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart
              data={courseCompletion.map((item) => ({
                course: item.course,
                value: item.progress,
              }))}
              margin={{ top: 18, right: 12, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.25)"
              />
              <XAxis
                dataKey="course"
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Recent Grades
        </h2>
        <div className="mt-4 space-y-3">
          {recentGrades.length === 0 ? (
            <p className="text-sm text-slate-500">
              No grade records available yet.
            </p>
          ) : (
            recentGrades.map((item, index) => (
              <div
                key={`${item.assignment}-${index}`}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.assignment}
                  </p>
                  <p className="text-xs text-slate-500">{item.course}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    tone={Number(item.marks ?? 0) >= 70 ? "success" : "warning"}
                  >
                    {item.marks ?? "—"}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {item.feedback || "No feedback"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
