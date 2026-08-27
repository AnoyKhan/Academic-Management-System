import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  assignmentItems,
  attendanceTrendData,
  gpaTrendData,
  studentDashboardMetrics,
} from "../../data/student-portal-data";

export function StudentPage() {
  const dueSoon = assignmentItems
    .filter((item) => item.status === "Pending")
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Student Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Overview of academic health, deadlines, and semester performance with
          realistic mock data.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            GPA
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {studentDashboardMetrics.gpa}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Attendance
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {studentDashboardMetrics.attendance}%
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Assignments Due
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {studentDashboardMetrics.assignmentsDue}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Course Count
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {studentDashboardMetrics.courseCount}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="h-[320px]">
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            GPA Trend Chart
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={gpaTrendData}
              margin={{ top: 8, right: 8, left: -20, bottom: 6 }}
            >
              <defs>
                <linearGradient id="gpaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18877d" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="#18877d" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.25)"
              />
              <XAxis dataKey="term" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis
                domain={[3.0, 4.0]}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="gpa"
                stroke="#18877d"
                fill="url(#gpaFill)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-[320px]">
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Attendance Chart
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attendanceTrendData}
              margin={{ top: 8, right: 8, left: -20, bottom: 6 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.25)"
              />
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis
                domain={[70, 100]}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip />
              <Bar dataKey="attendance" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Assignment Due Card
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {dueSoon.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">{item.course}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Due {item.dueDate}
                </span>
                <Badge tone={item.priority === "High" ? "danger" : "warning"}>
                  {item.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
