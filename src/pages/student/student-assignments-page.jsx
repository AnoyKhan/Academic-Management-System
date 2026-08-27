import { Link } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { assignmentItems } from "../../data/student-portal-data";

const columns = [
  { key: "title", header: "Assignment" },
  { key: "course", header: "Course" },
  { key: "dueDate", header: "Due Date" },
  {
    key: "priority",
    header: "Priority",
    render: (value) => (
      <Badge
        tone={
          value === "High"
            ? "danger"
            : value === "Medium"
              ? "warning"
              : "neutral"
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (value) => (
      <Badge tone={value === "Submitted" ? "success" : "warning"}>
        {value}
      </Badge>
    ),
  },
  {
    key: "id",
    header: "Action",
    render: (_, row) => (
      <Link to={`/student/assignments/${row.id}/submit`}>
        <Button
          size="sm"
          variant={row.status === "Submitted" ? "secondary" : "primary"}
        >
          {row.status === "Submitted" ? "Update" : "Submit"}
        </Button>
      </Link>
    ),
  },
];

export function StudentAssignmentsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Assignments
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Manage pending coursework, priorities, due dates, and submissions from
          a single place.
        </p>
      </Card>

      <Table columns={columns} data={assignmentItems} />
    </div>
  );
}
