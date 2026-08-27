import { Search, UserPlus } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { students } from "../../data/admin-portal-data";

export function AdminStudentsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Student Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Maintain student records, batch placement, academic standing, and enrollment status.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_150px]">
          <Input placeholder="Search student ID or name" />
          <Select defaultValue="all">
            <option value="all">All departments</option>
            <option>CSE</option>
            <option>EEE</option>
            <option>BBA</option>
            <option>Civil</option>
          </Select>
          <Select defaultValue="all">
            <option value="all">All statuses</option>
            <option>Active</option>
            <option>Probation</option>
          </Select>
          <Button variant="secondary">
            <Search className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex justify-end">
          <Button size="sm">
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
        </div>
        <Table
          columns={[
            { key: "id", header: "Student ID" },
            { key: "name", header: "Name" },
            { key: "department", header: "Department" },
            { key: "batch", header: "Batch" },
            { key: "cgpa", header: "CGPA" },
            { key: "status", header: "Status", render: (value) => <Badge tone={value === "Active" ? "success" : "warning"}>{value}</Badge> },
          ]}
          data={students}
        />
      </Card>
    </div>
  );
}
