import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { adminService } from "../../services/admin.service";

export function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    adminService
      .getAssignments()
      .then((response) => {
        if (!isMounted) return;
        const payload = adminService.unwrapData(response);
        setAssignments(payload?.results ?? payload ?? []);
        setError("");
      })
      .catch((loadError) => {
        if (isMounted)
          setError(
            loadError?.response?.data?.message || "Unable to load assignments.",
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
          Assignment Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Live assignments across the institution.
        </p>
      </Card>
      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading assignments…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Table
            data={assignments}
            columns={[
              { key: "title", header: "Assignment" },
              {
                key: "course",
                header: "Course",
                render: (value) => value?.course_name ?? "—",
              },
              {
                key: "teacher",
                header: "Teacher",
                render: (value) => value?.name ?? "—",
              },
              {
                key: "deadline",
                header: "Due",
                render: (value) =>
                  value ? new Date(value).toLocaleDateString() : "—",
              },
              { key: "submission_count", header: "Submissions" },
              {
                key: "status",
                header: "Status",
                render: (_, row) => (
                  <Badge tone={row.submission_count ? "success" : "neutral"}>
                    {row.submission_count ? "Active" : "No submissions"}
                  </Badge>
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}
