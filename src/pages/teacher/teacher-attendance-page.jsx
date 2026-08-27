import { CalendarCheck2, Save } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { teacherAttendance, teacherCourses } from "../../data/teacher-portal-data";

export function TeacherAttendancePage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Attendance Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Mark attendance by course and review section attendance rates.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_180px_160px]">
          <Select defaultValue="">
            <option value="" disabled>Select course</option>
            {teacherCourses.map((course) => (
              <option key={course.id}>{course.title}</option>
            ))}
          </Select>
          <input
            type="date"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <Button>
            <CalendarCheck2 className="h-4 w-4" />
            Start
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          columns={[
            { key: "course", header: "Course" },
            { key: "present", header: "Present" },
            { key: "absent", header: "Absent" },
            { key: "rate", header: "Rate", render: (value) => <Badge tone={value >= 90 ? "success" : "warning"}>{value}%</Badge> },
            { key: "id", header: "Action", render: () => <Button size="sm" variant="secondary"><Save className="h-4 w-4" />Save</Button> },
          ]}
          data={teacherAttendance}
        />
      </Card>
    </div>
  );
}
