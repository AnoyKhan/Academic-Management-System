import { Download, Save } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { teacherGrades } from "../../data/teacher-portal-data";

export function TeacherGradesPage() {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
              Grade Management
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Maintain course averages, pending grade queues, and grade publishing controls.
            </p>
          </div>
          <Button size="sm" variant="secondary">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          columns={[
            { key: "course", header: "Course" },
            { key: "average", header: "Average", render: (value) => `${value}%` },
            { key: "highest", header: "Highest", render: (value) => `${value}%` },
            { key: "lowest", header: "Lowest", render: (value) => `${value}%` },
            { key: "pending", header: "Pending" },
            { key: "id", header: "Quick Update", render: () => (
              <div className="flex min-w-48 gap-2">
                <Input className="h-9" placeholder="Mark" />
                <Button size="sm"><Save className="h-4 w-4" /></Button>
              </div>
            ) },
          ]}
          data={teacherGrades}
        />
      </Card>
    </div>
  );
}
