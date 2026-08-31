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
import { AlertTriangle, CheckCircle2, Gauge, TrendingUp } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table } from "../../components/ui/table";
import { adminService } from "../../services/admin.service";

const widgetIcons = [AlertTriangle, TrendingUp, CheckCircle2, Gauge];

export function AdminAIAnalyticsPageLive() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAnalytics();
        const payload = adminService.unwrapData(response);

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

  const stats = analytics?.stats ?? {};
  const widgets = [
    {
      label: "Users",
      value: stats.total_users ?? 0,
      tone: "warning",
      change: "Total accounts",
    },
    {
      label: "Students",
      value: stats.total_students ?? 0,
      tone: "success",
      change: "Enrolled",
    },
    {
      label: "Teachers",
      value: stats.total_teachers ?? 0,
      tone: "info",
      change: "Faculty",
    },
    {
      label: "Attendance",
      value: stats.total_attendance_records ?? 0,
      tone: "neutral",
      change: "Records",
    },
  ];

  const attendanceData = [
    { name: "Present", value: stats.present_attendance ?? 0, fill: "#14b8a6" },
    { name: "Absent", value: stats.absent_attendance ?? 0, fill: "#ef4444" },
    { name: "Late", value: stats.late_attendance ?? 0, fill: "#f59e0b" },
  ];

  const gradeTrend = [
    { label: "Avg", value: stats.average_grade ?? 0 },
    { label: "Assignments", value: stats.total_assignments ?? 0 },
    { label: "Submissions", value: stats.total_submissions ?? 0 },
    { label: "Grades", value: stats.total_grade_entries ?? 0 },
  ];

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Loading analytics…
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
      <Card className="overflow-hidden border-slate-200 bg-slate-950 p-0 text-white dark:border-slate-700">
        <div className="grid gap-6 p-5 lg:grid-cols-[1.3fr_0.7fr] lg:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-teal-400/15 text-teal-100">
                System snapshot
              </Badge>
              <Badge className="bg-blue-400/15 text-blue-100">
                Live backend
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              Academic Analytics
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-300">
              Real counts from the database for users, students, teachers,
              courses, submissions, attendance, and grades.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {widgets.map((widget, index) => {
          const Icon = widgetIcons[index];

          return (
            <Card key={widget.label} className="border-l-4 border-l-teal-500">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {widget.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
                    {widget.value}
                  </p>
                  <Badge tone={widget.tone} className="mt-3">
                    {widget.change}
                  </Badge>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-teal-300 dark:bg-slate-800">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="h-80">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Attendance Summary
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
            Performance Snapshot
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart
              data={gradeTrend}
              margin={{ top: 18, right: 12, left: -14, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.25)"
              />
              <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="mt-4">
          <Table
            columns={[
              { key: "title", header: "Title" },
              { key: "message", header: "Message" },
              {
                key: "is_read",
                header: "Read",
                render: (value) => (
                  <Badge tone={value ? "success" : "warning"}>
                    {value ? "Read" : "Unread"}
                  </Badge>
                ),
              },
            ]}
            data={analytics?.recent_activity ?? []}
          />
        </div>
      </Card>
    </div>
  );
}
