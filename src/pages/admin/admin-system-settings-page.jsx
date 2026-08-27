import { Save, SlidersHorizontal } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { systemSettings } from "../../data/admin-portal-data";

export function AdminSystemSettingsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          System Settings
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Configure institution policies, academic defaults, notification rules, and approval flows.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Policy Controls
          </h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
              Online registration
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-brand-600" />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
              Email notifications
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-brand-600" />
            </label>
            <Input defaultValue="75" type="number" aria-label="Attendance threshold" />
            <Select defaultValue="Department Head">
              <option>Department Head</option>
              <option>Registrar</option>
              <option>Controller</option>
            </Select>
            <Button>
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
            Active Settings
          </h2>
          <Table
            columns={[
              { key: "name", header: "Setting" },
              { key: "value", header: "Value", render: (value) => <Badge tone={value === "Enabled" ? "success" : "neutral"}>{value}</Badge> },
              { key: "owner", header: "Owner" },
              { key: "id", header: "Action", render: () => <Button size="sm" variant="secondary"><SlidersHorizontal className="h-4 w-4" />Edit</Button> },
            ]}
            data={systemSettings}
          />
        </Card>
      </div>
    </div>
  );
}
