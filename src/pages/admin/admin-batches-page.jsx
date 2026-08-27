import { Layers3, Plus } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { batches, departments } from "../../data/admin-portal-data";

export function AdminBatchesPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Batch Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Organize student batches by department, advisor, academic year, and size.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_160px_150px]">
          <Input placeholder="Batch name" />
          <Select defaultValue="">
            <option value="" disabled>Department</option>
            {departments.map((department) => (
              <option key={department.id}>{department.name}</option>
            ))}
          </Select>
          <Input placeholder="Year" />
          <Button>
            <Plus className="h-4 w-4" />
            Add Batch
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          columns={[
            { key: "name", header: "Batch" },
            { key: "department", header: "Department" },
            { key: "students", header: "Students" },
            { key: "advisor", header: "Advisor" },
            { key: "year", header: "Year" },
            { key: "id", header: "Action", render: () => <Button size="sm" variant="secondary"><Layers3 className="h-4 w-4" />Manage</Button> },
          ]}
          data={batches}
        />
      </Card>
    </div>
  );
}
