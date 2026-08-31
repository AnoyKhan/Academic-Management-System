import { useEffect, useState } from "react";
import { Bell, Send } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { teacherService } from "../../services/teacher.service";

const formatTime = (value) => {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

export function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getNotifications({
          page_size: 100,
        });
        const payload = teacherService.unwrapData(response);

        if (isMounted) {
          setNotifications(
            Array.isArray(payload) ? payload : (payload?.results ?? []),
          );
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message ||
              "Unable to load notifications.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Notifications
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Live notifications received by your teacher account from the backend.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Send Announcement
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            This backend does not currently expose a teacher
            announcement-creation endpoint, so this form is intentionally
            disabled.
          </p>
          <div className="mt-4 space-y-3">
            <Input placeholder="Announcement title" disabled />
            <Select defaultValue="all" disabled>
              <option value="all">All active courses</option>
            </Select>
            <textarea
              className="min-h-32 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Message"
              disabled
            />
            <Button disabled>
              <Send className="h-4 w-4" />
              Send Notification
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          {loading ? (
            <Card>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Loading notifications…
              </p>
            </Card>
          ) : error ? (
            <Card>
              <p className="text-sm text-red-600">{error}</p>
            </Card>
          ) : notifications.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-500">
                No notifications available.
              </p>
            </Card>
          ) : (
            notifications.map((item) => (
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
                      <Badge tone={item.is_read ? "neutral" : "warning"}>
                        {item.is_read ? "Read" : "New"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.message}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatTime(item.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
