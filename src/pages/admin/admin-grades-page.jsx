import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { adminService } from "../../services/admin.service";

export function AdminGradesPage() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    adminService
      .getGrades()
      .then((response) => {
        if (!isMounted) return;
        const payload = adminService.unwrapData(response);
        setGrades(payload?.results ?? payload ?? []);
      })
      .catch((loadError) => {
        if (isMounted)
          setError(
            loadError?.response?.data?.message || "Unable to load grades.",
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
          Grade Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Live grade records and published feedback.
        </p>
      </Card>
      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading grades…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Table
            data={grades}
            columns={[
              {
                key: "student",
                header: "Student",
                render: (value) => value?.name ?? "—",
              },
              {
                key: "assignment",
                header: "Assignment",
                render: (value) => value?.title ?? "—",
              },
              {
                key: "course",
                header: "Course",
                render: (value) => value?.course_name ?? "—",
              },
              { key: "marks", header: "Marks" },
              {
                key: "feedback",
                header: "Feedback",
                render: (value) => value || "—",
              },
              {
                key: "graded_by",
                header: "Graded By",
                render: (value) => value?.name ?? "—",
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}
