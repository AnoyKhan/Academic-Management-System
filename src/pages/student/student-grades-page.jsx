import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { studentService } from "../../services/student.service";

export function StudentGradesPage() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadGrades = async () => {
      try {
        setLoading(true);
        const response = await studentService.getGrades();
        const payload = studentService.unwrapData(response);

        if (isMounted) {
          setGrades(
            Array.isArray(payload) ? payload : (payload?.results ?? []),
          );
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message || "Unable to load grades.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadGrades();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = [
    { key: "course", header: "Course" },
    { key: "assignment", header: "Assignment" },
    { key: "marks", header: "Marks" },
    { key: "feedback", header: "Feedback", render: (value) => value || "—" },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <Badge tone={Number(row.marks) >= 70 ? "success" : "warning"}>
          {Number(row.marks) >= 70 ? "Pass" : "Needs review"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Grades
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Live assignment marks and feedback published by the backend.
        </p>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading grades…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <Table
          columns={columns}
          data={grades}
          emptyTitle="No grades found"
          emptyDescription="Your grades will appear once instructors publish them."
        />
      )}
    </div>
  );
}
