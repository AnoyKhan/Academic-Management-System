import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table } from "../../components/ui/table";
import { studentAttendance } from "../../data/student-portal-data";

const columns = [
  { key: "course", header: "Course" },
  { key: "present", header: "Present" },
  { key: "total", header: "Total" },
  { key: "percentage", header: "Attendance %" },
  {
    key: "status",
    header: "Status",
    render: (value) => (
      <Badge
        tone={
          value === "Excellent"
            ? "success"
            : value === "Good"
              ? "neutral"
              : "warning"
        }
      >
        {value}
      </Badge>
    ),
  },
];

export function StudentAttendancePage() {
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Attendance
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Class-wise attendance records and status indicators based on your
          semester performance.
        </p>
      </Card>

      <Table columns={columns} data={studentAttendance} />
    </div>
  );
}
