import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { adminService } from "../../services/admin.service";

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    adminService
      .getAnalytics()
      .then((response) => {
        if (!isMounted) return;
        setAnalytics(adminService.unwrapData(response));
      })
      .catch((loadError) => {
        if (isMounted)
          setError(
            loadError?.response?.data?.message || "Unable to load analytics.",
          );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = analytics?.stats ?? {};
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Admin Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          System-wide metrics from the live backend. AI Analytics remains
          available separately.
        </p>
      </Card>
      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading analytics…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Users", stats.total_users],
              ["Students", stats.total_students],
              ["Teachers", stats.total_teachers],
              ["Courses", stats.total_courses],
              ["Assignments", stats.total_assignments],
              ["Submissions", stats.total_submissions],
              ["Grade Entries", stats.total_grade_entries],
              ["Attendance Records", stats.total_attendance_records],
            ].map(([label, value]) => (
              <Card key={label}>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {value ?? 0}
                </p>
              </Card>
            ))}
          </div>
          <Card>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Summary
            </h2>
            <Table
              data={[
                { metric: "Average Grade", value: stats.average_grade ?? 0 },
                {
                  metric: "Present Attendance",
                  value: stats.present_attendance ?? 0,
                },
                {
                  metric: "Absent Attendance",
                  value: stats.absent_attendance ?? 0,
                },
                {
                  metric: "Late Attendance",
                  value: stats.late_attendance ?? 0,
                },
              ]}
              columns={[
                { key: "metric", header: "Metric" },
                { key: "value", header: "Value" },
              ]}
            />
          </Card>
        </>
      )}
    </div>
  );
}
