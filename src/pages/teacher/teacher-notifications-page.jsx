import { Bell, Send } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { teacherNotifications } from "../../data/teacher-portal-data";

export function TeacherNotificationsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Notifications
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Send course announcements and review recent classroom alerts.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Send Announcement
          </h2>
          <div className="mt-4 space-y-3">
            <Input placeholder="Announcement title" />
            <Select defaultValue="all">
              <option value="all">All active courses</option>
              <option>Operating Systems</option>
              <option>Database Systems</option>
              <option>Artificial Intelligence</option>
            </Select>
            <textarea
              className="min-h-32 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Message"
            />
            <Button>
              <Send className="h-4 w-4" />
              Send Notification
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          {teacherNotifications.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-bold text-slate-950 dark:text-white">
                      {item.title}
                    </h2>
                    <Badge tone={item.tone}>{item.time}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {item.body}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
