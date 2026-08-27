import { CalendarPlus, Clock } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { academicCalendar } from "../../data/admin-portal-data";

export function AdminCalendarPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Academic Calendar
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Schedule admission events, registration windows, academic deadlines, and faculty activities.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Add Calendar Event
          </h2>
          <div className="mt-4 space-y-3">
            <Input placeholder="Event title" />
            <Input type="date" />
            <Select defaultValue="Academic">
              <option>Academic</option>
              <option>Admission</option>
              <option>Registration</option>
              <option>Faculty</option>
            </Select>
            <Button>
              <CalendarPlus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          {academicCalendar.map((event) => (
            <Card key={event.id}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-bold text-slate-950 dark:text-white">{event.title}</h2>
                    <Badge>{event.type}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{event.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <Table
          columns={[
            { key: "date", header: "Date" },
            { key: "title", header: "Event" },
            { key: "type", header: "Type", render: (value) => <Badge>{value}</Badge> },
          ]}
          data={academicCalendar}
        />
      </Card>
    </div>
  );
}
