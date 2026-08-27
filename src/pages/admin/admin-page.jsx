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
import {
  adminDashboardCards,
  assignmentActivity,
  departmentStatistics,
  enrollmentGrowth,
  reports,
} from "../../data/admin-portal-data";

const cardIcons = [GraduationCap, Users, Layers3, Building2];

export function AdminPage() {
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
              Institution-wide overview of enrollment, departments, faculty, batches, and assessment activity.
            </p>
          </div>
          <Badge tone="success">Realistic mock data</Badge>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminDashboardCards.map((card, index) => {
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
                  <p className="mt-2 text-xs text-slate-500">{card.delta}</p>
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
            Enrollment Growth
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <AreaChart data={enrollmentGrowth} margin={{ top: 18, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="term" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="students" stroke="#059669" fill="#a7f3d0" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-80">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Department Statistics
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={departmentStatistics} margin={{ top: 18, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="department" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="students" fill="#18877d" radius={[6, 6, 0, 0]} />
              <Bar dataKey="teachers" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="h-80">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Assignment Activity
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <LineChart data={assignmentActivity} margin={{ top: 18, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="created" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="submitted" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="graded" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
            Recent Reports
          </h2>
          <Table
            columns={[
              { key: "title", header: "Report" },
              { key: "category", header: "Category" },
              { key: "status", header: "Status", render: (value) => <Badge tone={value === "Ready" ? "success" : "warning"}>{value}</Badge> },
            ]}
            data={reports.slice(0, 3)}
          />
        </Card>
      </div>
    </div>
  );
}
