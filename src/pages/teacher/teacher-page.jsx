import {
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
import { BookOpen, ClipboardList, GraduationCap, Users } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table } from "../../components/ui/table";
import {
  studentPerformance,
  submissionTrends,
  teacherAssignments,
  teacherDashboardStats,
  teacherSubmissions,
} from "../../data/teacher-portal-data";

const icons = [BookOpen, Users, ClipboardList, GraduationCap];

export function TeacherPage() {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Teacher Portal
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              Mock overview of courses, learners, assignments, grades, and classroom activity.
            </p>
          </div>
          <Badge tone="success">Mock data only</Badge>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {teacherDashboardStats.map((stat, index) => {
          const Icon = icons[index];

          return (
            <Card key={stat.label} className="min-h-32">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">{stat.delta}</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
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
            Submission Trends
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <LineChart data={submissionTrends} margin={{ top: 18, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="submitted" stroke="#18877d" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="late" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-80">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Student Performance
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={studentPerformance} margin={{ top: 18, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="course" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="average" fill="#18877d" radius={[6, 6, 0, 0]} />
              <Bar dataKey="attendance" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
            Pending Assignment Snapshot
          </h2>
          <Table
            columns={[
              { key: "title", header: "Assignment" },
              { key: "course", header: "Course" },
              { key: "submissions", header: "Submitted", render: (value, row) => `${value}/${row.total}` },
              { key: "status", header: "Status", render: (value) => <Badge tone={value === "Open" ? "warning" : value === "Closed" ? "success" : "neutral"}>{value}</Badge> },
            ]}
            data={teacherAssignments}
          />
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
            Recent Submission Review
          </h2>
          <Table
            columns={[
              { key: "student", header: "Student" },
              { key: "course", header: "Course" },
              { key: "score", header: "Score" },
              { key: "status", header: "Status", render: (value) => <Badge tone={value === "Reviewed" ? "success" : "warning"}>{value}</Badge> },
            ]}
            data={teacherSubmissions}
          />
        </Card>
      </div>
    </div>
  );
}
