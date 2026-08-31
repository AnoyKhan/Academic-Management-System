import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { studentService } from "../../services/student.service";

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

export function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        const response = await studentService.getNotifications();
        const payload = studentService.unwrapData(response);

        if (isMounted) {
          setNotifications(
            Array.isArray(payload) ? payload : (payload?.results ?? []),
          );
          setError("");
        }
      } catch (loadError) {
        if (isMounted && loadError?.response?.status !== 404) {
          setError(
            loadError?.response?.data?.message ||
              "Unable to load notifications.",
          );
        }
        if (isMounted) {
          setNotifications([]);
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
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Notifications
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Important updates from the institution and your instructor feed.
        </p>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading notifications…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">
            No notifications available yet.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {notifications.map((notification) => (
            <Card key={notification.id || notification.title} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {notification.message}
                  </p>
                </div>
                <Badge tone={notification.is_read ? "neutral" : "warning"}>
                  {notification.is_read ? "Read" : "New"}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {formatTime(notification.created_at)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
