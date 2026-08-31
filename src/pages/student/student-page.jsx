import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { studentService } from "../../services/student.service";

export function StudentPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const response = await studentService.getDashboard();
        const payload = studentService.unwrapData(response);

        if (isMounted) {
          setDashboard(payload);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message ||
              "Unable to load student dashboard.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const recentGrades = dashboard?.recent_grades ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Student Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Overview of academic health, assignment progress, and performance from
          the live backend.
        </p>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading student dashboard…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Average Marks
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {Number(dashboard?.average_marks ?? 0).toFixed(2)}
              </p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Attendance
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {Number(dashboard?.attendance_percentage ?? 0).toFixed(1)}%
              </p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Pending Assignments
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {dashboard?.pending_assignments ?? 0}
              </p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Course Count
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {dashboard?.total_courses ?? 0}
              </p>
            </Card>
          </div>

          <Card>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Recent Grades
            </p>
            {recentGrades.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No grade records available yet.
              </p>
            ) : (
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {recentGrades.map((item, index) => (
                  <div
                    key={`${item.assignment}-${index}`}
                    className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.assignment}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.course}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {item.marks ?? "—"} marks
                      </span>
                      <Badge
                        tone={
                          Number(item.marks ?? 0) >= 70 ? "success" : "warning"
                        }
                      >
                        {Number(item.marks ?? 0) >= 70
                          ? "Strong"
                          : "In progress"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
