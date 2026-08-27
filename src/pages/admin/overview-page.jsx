import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table } from "../../components/ui/table";
import { PerformanceChart } from "../../components/common/performance-chart";
import { SearchForm } from "../../components/forms/search-form";

const columns = [
  { key: "course", header: "Course" },
  { key: "teacher", header: "Teacher" },
  {
    key: "status",
    header: "Status",
    render: (value) => (
      <Badge tone={value === "Live" ? "success" : "warning"}>{value}</Badge>
    ),
  },
];

const data = [
  {
    id: 1,
    course: "Discrete Mathematics",
    teacher: "A. Hussain",
    status: "Live",
  },
  {
    id: 2,
    course: "Operating Systems",
    teacher: "S. Tanvir",
    status: "Scheduled",
  },
];

export function OverviewPage() {
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm uppercase tracking-widest text-brand-700 dark:text-brand-300">
          AMS Foundation
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">
          Dashboard Architecture Ready
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          This is a shell-only overview to validate reusable components and
          responsive design. Feature pages are intentionally postponed.
        </p>
        <div className="mt-4">
          <SearchForm />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <PerformanceChart />
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}
