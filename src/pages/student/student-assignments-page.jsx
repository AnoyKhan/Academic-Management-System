import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
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

const getStatusTone = (status) => {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized === "SUBMITTED") return "success";
  if (normalized === "LATE") return "warning";
  return "neutral";
};

export function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAssignments = async () => {
      try {
        setLoading(true);
        const response = await studentService.getAssignments();
        const payload = studentService.unwrapData(response);

        if (isMounted) {
          setAssignments(
            Array.isArray(payload) ? payload : (payload?.results ?? []),
          );
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message || "Unable to load assignments.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAssignments();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = [
    { key: "title", header: "Assignment" },
    { key: "course", header: "Course" },
    {
      key: "deadline",
      header: "Due Date",
      render: (value) => formatDate(value),
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <Badge tone={getStatusTone(value)}>{String(value ?? "PENDING")}</Badge>
      ),
    },
    {
      key: "id",
      header: "Action",
      render: (_, row) => (
        <Link to={`/student/assignments/${row.id}/submit`}>
          <Button
            size="sm"
            variant={
              String(row.status ?? "").toUpperCase() === "SUBMITTED"
                ? "secondary"
                : "primary"
            }
          >
            {String(row.status ?? "").toUpperCase() === "SUBMITTED"
              ? "Update"
              : "Submit"}
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Assignments
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Manage assignment deadlines and submission state from the live student
          API.
        </p>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading assignments…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <Table
          columns={columns}
          data={assignments}
          emptyTitle="No assignments found"
          emptyDescription="You do not have any active assignments right now."
        />
      )}
    </div>
  );
}
