import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { teacherService } from "../../services/teacher.service";

export function TeacherGradesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadGradesFromSubmissions = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getSubmissions({
          page_size: 100,
        });
        const submissions = teacherService.unwrapData(response);

        if (isMounted) {
          const summary = {};

          for (const submission of Array.isArray(submissions)
            ? submissions
            : []) {
            const courseName =
              submission.assignment?.course?.course_name || "Unassigned";
            const marks = Number(submission.grade?.marks ?? 0);
            if (!summary[courseName]) {
              summary[courseName] = {
                course: courseName,
                values: [],
                pending: 0,
              };
            }
            if (
              submission.grade?.marks !== undefined &&
              submission.grade?.marks !== null
            ) {
              summary[courseName].values.push(marks);
            } else {
              summary[courseName].pending += 1;
            }
          }

          const nextRows = Object.values(summary).map((item) => {
            const values = item.values;
            const average = values.length
              ? values.reduce((sum, value) => sum + value, 0) / values.length
              : 0;
            return {
              course: item.course,
              average: average ? Number(average.toFixed(2)) : 0,
              highest: values.length ? Math.max(...values) : 0,
              lowest: values.length ? Math.min(...values) : 0,
              pending: item.pending,
            };
          });

          setRows(nextRows);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message ||
              "Unable to load grade summary.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadGradesFromSubmissions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
              Grade Management
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Summary derived from live submitted work and grading records from
              the backend.
            </p>
          </div>
          <Button size="sm" variant="secondary" disabled>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading grade summary…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : (
        <Card>
          <Table
            columns={[
              { key: "course", header: "Course" },
              {
                key: "average",
                header: "Average",
                render: (value) => `${value}%`,
              },
              {
                key: "highest",
                header: "Highest",
                render: (value) => `${value}%`,
              },
              {
                key: "lowest",
                header: "Lowest",
                render: (value) => `${value}%`,
              },
              { key: "pending", header: "Pending" },
            ]}
            data={rows}
            emptyTitle="No grade summary available"
            emptyDescription="Grade data will appear after submissions are graded."
          />
        </Card>
      )}
    </div>
  );
}
