import { FileText, UserPlus } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { intakes } from "../../data/admin-portal-data";

export function AdminIntakePage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Intake Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Manage admission cycles, capacity, application status, and admitted cohorts.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Create Intake
          </h2>
          <div className="mt-4 space-y-3">
            <Input placeholder="Intake name, e.g. Spring 2027" />
            <Input type="number" placeholder="Seat capacity" />
            <Select defaultValue="Open">
              <option>Open</option>
              <option>Closed</option>
              <option>Archived</option>
            </Select>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">
                <UserPlus className="h-4 w-4" />
                Create Intake
              </Button>
              <Button size="sm" variant="secondary">
                <FileText className="h-4 w-4" />
                Import Applicants
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
            Admission Cycles
          </h2>
          <Table
            columns={[
              { key: "name", header: "Intake" },
              { key: "applications", header: "Applications" },
              { key: "admitted", header: "Admitted" },
              { key: "waitlisted", header: "Waitlisted" },
              { key: "status", header: "Status", render: (value) => <Badge tone={value === "Open" ? "success" : value === "Closed" ? "warning" : "neutral"}>{value}</Badge> },
            ]}
            data={intakes}
          />
        </Card>
      </div>
    </div>
  );
}
