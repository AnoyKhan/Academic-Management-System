import {
  Download,
  FileBarChart2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  assignmentActivity,
  departmentStatistics,
  reports,
} from "../../data/admin-portal-data";

export function AdminReportsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
              Reports
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Generate academic, admission, assessment, and faculty allocation reports.
            </p>
          </div>
          <Button size="sm">
            <FileBarChart2 className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="h-80">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Department Load
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={departmentStatistics} margin={{ top: 18, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="department" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="students" fill="#18877d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-80">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Monthly Assignment Submissions
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={assignmentActivity} margin={{ top: 18, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="submitted" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="graded" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <Table
          columns={[
            { key: "title", header: "Report" },
            { key: "category", header: "Category" },
            { key: "generated", header: "Generated" },
            { key: "status", header: "Status", render: (value) => <Badge tone={value === "Ready" ? "success" : "warning"}>{value}</Badge> },
            { key: "id", header: "Action", render: () => <Button size="sm" variant="secondary"><Download className="h-4 w-4" />Download</Button> },
          ]}
          data={reports}
        />
      </Card>
    </div>
  );
}
