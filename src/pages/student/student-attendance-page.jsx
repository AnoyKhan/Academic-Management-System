import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table } from "../../components/ui/table";
import { studentService } from "../../services/student.service";

const formatDate = (value) => {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

export function StudentAttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAttendance = async () => {
      try {
        setLoading(true);
        const response = await studentService.getAttendance();
        const payload = studentService.unwrapData(response);

        if (isMounted) {
          setAttendance(
            Array.isArray(payload) ? payload : (payload?.results ?? []),
          );
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message || "Unable to load attendance.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAttendance();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = [
    { key: "course", header: "Course" },
    { key: "date", header: "Date", render: (value) => formatDate(value) },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <Badge
          tone={
            value === "PRESENT"
              ? "success"
              : value === "LATE"
                ? "warning"
                : "neutral"
          }
        >
          {String(value ?? "ABSENT")}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Attendance
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Class-wise attendance records from your live student records.
        </p>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading attendance…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <Table
          columns={columns}
          data={attendance}
          emptyTitle="No attendance records found"
          emptyDescription="Attendance updates will appear after your instructor marks them."
        />
      )}
    </div>
  );
}
