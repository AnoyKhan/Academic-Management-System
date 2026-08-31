import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { adminService } from "../../services/admin.service";

export function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    adminService
      .getNotifications()
      .then((response) => {
        if (!isMounted) return;
        const payload = adminService.unwrapData(response);
        setNotifications(payload?.results ?? payload ?? []);
      })
      .catch((loadError) => {
        if (isMounted)
          setError(
            loadError?.response?.data?.message ||
              "Unable to load notifications.",
          );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
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
          Live notifications sent through the AMS backend.
        </p>
      </Card>
      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading notifications…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Table
            data={notifications}
            columns={[
              {
                key: "receiver",
                header: "Recipient",
                render: (value) => value?.name ?? value?.email ?? "—",
              },
              { key: "title", header: "Title" },
              { key: "message", header: "Message" },
              {
                key: "is_read",
                header: "Status",
                render: (value) => (
                  <Badge tone={value ? "success" : "warning"}>
                    {value ? "Read" : "Unread"}
                  </Badge>
                ),
              },
              {
                key: "created_at",
                header: "Created",
                render: (value) =>
                  value ? new Date(value).toLocaleString() : "—",
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}
