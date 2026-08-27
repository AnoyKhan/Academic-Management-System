import { BookOpen, Plus } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { courses, departments, teachers } from "../../data/admin-portal-data";

export function AdminCoursesPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Course Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Create courses, assign departments and teachers, and manage credit load.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 xl:grid-cols-[140px_1fr_160px_1fr_150px]">
          <Input placeholder="Code" />
          <Input placeholder="Course title" />
          <Select defaultValue="">
            <option value="" disabled>Department</option>
            {departments.map((department) => (
              <option key={department.id}>{department.short}</option>
            ))}
          </Select>
          <Select defaultValue="">
            <option value="" disabled>Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id}>{teacher.name}</option>
            ))}
          </Select>
          <Button>
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          columns={[
            { key: "id", header: "Code" },
            { key: "title", header: "Course" },
            { key: "department", header: "Department" },
            { key: "credits", header: "Credits" },
            { key: "teacher", header: "Teacher" },
            { key: "status", header: "Status", render: (value) => <Badge tone={value === "Running" ? "success" : "warning"}>{value}</Badge> },
            { key: "id", header: "Action", render: () => <Button size="sm" variant="secondary"><BookOpen className="h-4 w-4" />View</Button> },
          ]}
          data={courses}
        />
      </Card>
    </div>
  );
}
