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
import { studentPerformance, submissionTrends, teacherGrades } from "../../data/teacher-portal-data";

export function TeacherAnalyticsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Student Performance Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Compare grade averages, attendance rates, and assignment submission momentum.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Best performing course</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            Artificial Intelligence
          </p>
          <Badge tone="success" className="mt-3">88% average</Badge>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Needs attention</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            Computer Networks
          </p>
          <Badge tone="warning" className="mt-3">78% average</Badge>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Pending grades</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            {teacherGrades.reduce((sum, item) => sum + item.pending, 0)}
          </p>
          <Badge className="mt-3">Across 5 courses</Badge>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="h-96">
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

        <Card className="h-96">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Submission Trends
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <AreaChart data={submissionTrends} margin={{ top: 18, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="submitted" stroke="#18877d" fill="#99f6e4" />
              <Area type="monotone" dataKey="late" stroke="#f97316" fill="#fed7aa" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
