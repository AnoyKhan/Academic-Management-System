import { Plus, Send } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { teacherAssignments, teacherCourses } from "../../data/teacher-portal-data";

export function TeacherAssignmentsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Assignment Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Create assignments, monitor deadlines, and track submission coverage.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Create Assignment
          </h2>
          <div className="mt-4 space-y-3">
            <Input placeholder="Assignment title" />
            <Select defaultValue="">
              <option value="" disabled>
                Select course
              </option>
              {teacherCourses.map((course) => (
                <option key={course.id}>{course.title}</option>
              ))}
            </Select>
            <Input type="date" />
            <textarea
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Instructions"
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Save Draft
              </Button>
              <Button size="sm" variant="secondary">
                <Send className="h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
            Assignment List
          </h2>
          <Table
            columns={[
              { key: "title", header: "Assignment" },
              { key: "course", header: "Course" },
              { key: "due", header: "Due" },
              { key: "submissions", header: "Submissions", render: (value, row) => `${value}/${row.total}` },
              { key: "status", header: "Status", render: (value) => <Badge tone={value === "Open" ? "warning" : value === "Closed" ? "success" : "neutral"}>{value}</Badge> },
            ]}
            data={teacherAssignments}
          />
        </Card>
      </div>
    </div>
  );
}
