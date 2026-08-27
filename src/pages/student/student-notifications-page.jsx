import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { studentNotifications } from "../../data/student-portal-data";

export function StudentNotificationsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Notifications
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Important updates about deadlines, attendance, grades, and class
          announcements.
        </p>
      </Card>

      <div className="grid gap-3">
        {studentNotifications.map((notification) => (
          <Card key={notification.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {notification.message}
                </p>
              </div>
              <Badge tone={notification.type}>{notification.time}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
