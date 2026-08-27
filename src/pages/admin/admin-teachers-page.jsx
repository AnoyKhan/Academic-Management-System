import { UserPlus } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { departments, teachers } from "../../data/admin-portal-data";

export function AdminTeachersPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Teacher Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Add faculty, assign departments, and monitor current teaching load.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_180px_150px]">
          <Input placeholder="Teacher name" />
          <Select defaultValue="">
            <option value="" disabled>Department</option>
            {departments.map((department) => (
              <option key={department.id}>{department.short}</option>
            ))}
          </Select>
          <Input type="email" placeholder="Email" />
          <Button>
            <UserPlus className="h-4 w-4" />
            Add Teacher
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          columns={[
            { key: "name", header: "Teacher" },
            { key: "department", header: "Department" },
            { key: "courses", header: "Courses" },
            { key: "status", header: "Status", render: (value) => <Badge tone={value === "Active" ? "success" : "warning"}>{value}</Badge> },
          ]}
          data={teachers}
        />
      </Card>
    </div>
  );
}
