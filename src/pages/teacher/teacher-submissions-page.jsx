import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { teacherService } from "../../services/teacher.service";

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

export function TeacherSubmissionsPage() {
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [savingGrade, setSavingGrade] = useState(false);

  const loadData = async () => {
    const params = {};
    if (courseFilter !== "all") params.course = courseFilter;
    if (statusFilter !== "all") params.status = statusFilter;
    if (search.trim()) params.assignment = search.trim();

    const [coursesResponse, submissionsResponse] = await Promise.all([
      teacherService.getCourses({ page_size: 100 }),
      teacherService.getSubmissions(params),
    ]);

    setCourses(teacherService.unwrapData(coursesResponse));
    setSubmissions(teacherService.unwrapData(submissionsResponse));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        await loadData();
        if (isMounted) setError("");
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message || "Unable to load submissions.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [courseFilter, statusFilter, search]);

  const handleGradeSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSubmission) return;

    try {
      setSavingGrade(true);
      await teacherService.gradeSubmission(selectedSubmission.id, {
        marks: Number(marks),
        feedback: feedback || "",
      });
      setSelectedSubmission(null);
      setMarks("");
      setFeedback("");
      await loadData();
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.response?.data?.detail ||
          "Unable to grade submission.",
      );
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Student Submission Review
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Review live submissions, grade them, and leave feedback using the
          backend grading API.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <Input
            placeholder="Search by assignment"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
          >
            <option value="all">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="LATE">Late</option>
          </Select>
        </div>
      </Card>

      {error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : null}

      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading submissions…
          </p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No submissions match your current filters.
          </p>
        ) : (
          <Table
            columns={[
              {
                key: "student",
                header: "Student",
                render: (_, row) => row.student?.name || "—",
              },
              {
                key: "assignment",
                header: "Assignment",
                render: (_, row) => row.assignment?.title || "—",
              },
              {
                key: "course",
                header: "Course",
                render: (_, row) => row.assignment?.course?.course_name || "—",
              },
              {
                key: "submission_date",
                header: "Submitted",
                render: (value) => formatDate(value),
              },
              {
                key: "grade",
                header: "Score",
                render: (value) => value?.marks ?? "—",
              },
              {
                key: "status",
                header: "Status",
                render: (value) => (
                  <Badge tone={value === "SUBMITTED" ? "warning" : "success"}>
                    {value}
                  </Badge>
                ),
              },
              {
                key: "id",
                header: "Action",
                render: (_, row) => (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedSubmission(row)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Grade
                  </Button>
                ),
              },
            ]}
            data={submissions}
          />
        )}
      </Card>

      {selectedSubmission ? (
        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Grade Submission: {selectedSubmission.assignment?.title}
          </h2>
          <form onSubmit={handleGradeSubmit} className="mt-4 space-y-3">
            <Input
              type="number"
              min="0"
              max="100"
              value={marks}
              onChange={(event) => setMarks(event.target.value)}
              placeholder="Marks out of 100"
            />
            <textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Feedback"
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={savingGrade}>
                {savingGrade ? "Saving..." : "Save Grade"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setSelectedSubmission(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
