import { useEffect, useState } from "react";
import { BookOpen, ClipboardList, GraduationCap, Users } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table } from "../../components/ui/table";
import { teacherService } from "../../services/teacher.service";

const icons = [BookOpen, Users, ClipboardList, GraduationCap];

export function TeacherPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getDashboard();
        const payload = teacherService.unwrapData(response);

        if (isMounted) {
          setDashboard(payload);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message ||
              "Unable to load teacher dashboard.",
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

  const stats = [
    {
      label: "Active Courses",
      value: dashboard?.total_courses ?? 0,
      delta: "Current term",
    },
    {
      label: "Total Students",
      value: dashboard?.total_students ?? 0,
      delta: "Across your courses",
    },
    {
      label: "Assignments",
      value: dashboard?.total_assignments ?? 0,
      delta: "Created this term",
    },
    {
      label: "Pending Reviews",
      value: dashboard?.pending_submissions ?? 0,
      delta: "Needs grading",
    },
  ];

  const recentSubmissions = dashboard?.recent_submissions ?? [];
  const recentNotifications = dashboard?.recent_notifications ?? [];

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Teacher Portal
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              Live overview of your courses, student activity, and pending
              reviews from the backend.
            </p>
          </div>
          <Badge tone="success">Live data</Badge>
        </div>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading teacher dashboard…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = icons[index];

              return (
                <Card key={stat.label} className="min-h-32">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {stat.delta}
                      </p>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <Card className="min-w-0">
              <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
                Recent Submission Review
              </h2>
              {recentSubmissions.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No recent submissions available.
                </p>
              ) : (
                <Table
                  columns={[
                    {
                      key: "student",
                      header: "Student",
                      render: (_, row) => row.student?.name ?? "—",
                    },
                    {
                      key: "assignment",
                      header: "Assignment",
                      render: (_, row) => row.assignment?.title ?? "—",
                    },
                    {
                      key: "course",
                      header: "Course",
                      render: (_, row) =>
                        row.assignment?.course?.course_name ?? "—",
                    },
                    {
                      key: "status",
                      header: "Status",
                      render: (value) => (
                        <Badge
                          tone={value === "GRADED" ? "success" : "warning"}
                        >
                          {value}
                        </Badge>
                      ),
                    },
                  ]}
                  data={recentSubmissions}
                />
              )}
            </Card>

            <Card className="min-w-0">
              <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
                Recent Notifications
              </h2>
              {recentNotifications.length === 0 ? (
                <p className="text-sm text-slate-500">No notifications yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentNotifications.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </p>
                        <Badge tone={item.is_read ? "neutral" : "warning"}>
                          {item.is_read ? "Read" : "New"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
