import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { studentGrades } from "../../data/student-portal-data";

const columns = [
  { key: "course", header: "Course" },
  { key: "quiz", header: "Quiz" },
  { key: "mid", header: "Mid" },
  { key: "final", header: "Final" },
  { key: "total", header: "Total" },
  {
    key: "letter",
    header: "Grade",
    render: (value) => (
      <Badge tone={value.startsWith("A") ? "success" : "warning"}>
        {value}
      </Badge>
    ),
  },
];

export function StudentGradesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Grades
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Semester result sheet with component-level marks and final letter
          grades.
        </p>
      </Card>

      <Table columns={columns} data={studentGrades} />
    </div>
  );
}
