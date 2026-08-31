import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, GraduationCap, Layers3, Users } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table } from "../../components/ui/table";
import { adminService } from "../../services/admin.service";

const cardIcons = [GraduationCap, Users, Layers3, Building2];

export function AdminPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboard();
        const payload = adminService.unwrapData(response);

        if (isMounted) {
          setDashboard(payload);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message ||
              "Unable to load admin dashboard.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      label: "Students",
      value: dashboard?.stats?.students ?? 0,
      delta: "Active records",
    },
    {
      label: "Teachers",
      value: dashboard?.stats?.teachers ?? 0,
      delta: "Faculty profile",
    },
    {
      label: "Courses",
      value: dashboard?.stats?.courses ?? 0,
      delta: "Offered courses",
    },
    {
      label: "Assignments",
      value: dashboard?.stats?.assignments ?? 0,
      delta: "All created",
    },
  ];

  const students = dashboard?.students ?? [];
  const teachers = dashboard?.teachers ?? [];
  const courses = dashboard?.courses ?? [];

  const chartStudents = [
    { term: "Current", students: dashboard?.stats?.students ?? 0 },
    { term: "Teachers", students: dashboard?.stats?.teachers ?? 0 },
    { term: "Courses", students: dashboard?.stats?.courses ?? 0 },
  ];

  const chartDepartments = [
    {
      department: "Students",
      students: dashboard?.stats?.students ?? 0,
      teachers: dashboard?.stats?.teachers ?? 0,
    },
    {
      department: "Courses",
      students: dashboard?.stats?.courses ?? 0,
      teachers: dashboard?.stats?.assignments ?? 0,
    },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Admin Portal
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              Institution-wide overview from the live admin backend.
            </p>
          </div>
          <Badge tone={error ? "warning" : "success"}>
            {error ? "Needs sync" : "Live data"}
          </Badge>
        </div>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading admin dashboard…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((card, index) => {
              const Icon = cardIcons[index];

              return (
                <Card key={card.label} className="min-h-32">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {card.label}
                      </p>
                      <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
                        {card.value}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {card.delta}
                      </p>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
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
                Portfolio Snapshot
              </h2>
              <ResponsiveContainer width="100%" height="88%">
                <AreaChart
                  data={chartStudents}
                  margin={{ top: 18, right: 12, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.25)"
                  />
                  <XAxis
                    dataKey="term"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#059669"
                    fill="#a7f3d0"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="h-80">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                System Summary
              </h2>
              <ResponsiveContainer width="100%" height="88%">
                <BarChart
                  data={chartDepartments}
                  margin={{ top: 18, right: 12, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.25)"
                  />
                  <XAxis
                    dataKey="department"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="students"
                    fill="#18877d"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="teachers"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="h-80">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Students
              </h2>
              <Table
                columns={[
                  { key: "student_id", header: "Student ID" },
                  { key: "name", header: "Name" },
                  { key: "department", header: "Department" },
                  {
                    key: "status",
                    header: "Status",
                    render: (value) => (
                      <Badge tone={value === "Active" ? "success" : "warning"}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={students.slice(0, 4)}
              />
            </Card>

            <Card>
              <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
                Recent Courses
              </h2>
              <Table
                columns={[
                  { key: "course_code", header: "Code" },
                  { key: "course_name", header: "Course" },
                  {
                    key: "status",
                    header: "Status",
                    render: (value) => (
                      <Badge tone={value === "Running" ? "success" : "warning"}>
                        {value}
                      </Badge>
                    ),
                  },
                ]}
                data={courses.slice(0, 4)}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
