import { Building2, Plus } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { departments } from "../../data/admin-portal-data";

export function AdminDepartmentsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Department Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Manage departments, department heads, faculty count, and enrolled student load.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_140px_1fr_150px]">
          <Input placeholder="Department name" />
          <Input placeholder="Short code" />
          <Input placeholder="Department head" />
          <Button>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {departments.map((department) => (
          <Card key={department.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                  {department.short}
                </p>
                <h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
                  {department.name}
                </h2>
              </div>
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-4 text-sm text-slate-500">Head: {department.head}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-slate-500">Students</p>
                <p className="mt-1 font-bold text-slate-950 dark:text-white">{department.students}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-slate-500">Teachers</p>
                <p className="mt-1 font-bold text-slate-950 dark:text-white">{department.teachers}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <Table
          columns={[
            { key: "name", header: "Department" },
            { key: "short", header: "Code" },
            { key: "head", header: "Head" },
            { key: "students", header: "Students" },
            { key: "teachers", header: "Teachers" },
          ]}
          data={departments}
        />
      </Card>
    </div>
  );
}
