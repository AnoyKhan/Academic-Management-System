import { useEffect, useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
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

export function TeacherAttendancePage() {
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    course_id: "",
    student_id: "",
    date: new Date().toISOString().slice(0, 10),
    status: "PRESENT",
  });

  const loadData = async () => {
    const [coursesResponse, attendanceResponse] = await Promise.all([
      teacherService.getCourses({ page_size: 100 }),
      teacherService.getAttendance({ page_size: 100 }),
    ]);

    setCourses(teacherService.unwrapData(coursesResponse));
    setAttendance(teacherService.unwrapData(attendanceResponse));
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
            loadError?.response?.data?.message ||
              "Unable to load attendance data.",
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
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.course_id || !form.student_id || !form.date) {
      setError("Course, student id, and date are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await teacherService.createAttendance({
        student_id: Number(form.student_id),
        course_id: Number(form.course_id),
        date: form.date,
        status: form.status,
      });
      setForm((current) => ({ ...current, student_id: "", status: "PRESENT" }));
      await loadData();
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.response?.data?.detail ||
          "Unable to save attendance.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Attendance Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Review live attendance records and create new entries using the
          teacher attendance API.
        </p>
      </Card>

      <Card>
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_160px]"
        >
          <Select
            value={form.course_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                course_id: event.target.value,
              }))
            }
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            value={form.student_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                student_id: event.target.value,
              }))
            }
            placeholder="Student ID"
          />
          <Input
            type="date"
            value={form.date}
            onChange={(event) =>
              setForm((current) => ({ ...current, date: event.target.value }))
            }
          />
          <Select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({ ...current, status: event.target.value }))
            }
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
          </Select>
          <Button type="submit" disabled={saving}>
            <CalendarCheck2 className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </form>
      </Card>

      {error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : null}

      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading attendance…
          </p>
        ) : attendance.length === 0 ? (
          <p className="text-sm text-slate-500">No attendance records found.</p>
        ) : (
          <Table
            columns={[
              {
                key: "student",
                header: "Student",
                render: (_, row) => row.student?.name || "—",
              },
              {
                key: "course",
                header: "Course",
                render: (_, row) => row.course?.course_name || "—",
              },
              {
                key: "date",
                header: "Date",
                render: (value) => formatDate(value),
              },
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
                    {value}
                  </Badge>
                ),
              },
            ]}
            data={attendance}
          />
        )}
      </Card>
    </div>
  );
}
