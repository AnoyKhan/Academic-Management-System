import { useEffect, useState } from "react";
import { Plus, Send, Trash2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { teacherService } from "../../services/teacher.service";

const emptyForm = {
  title: "",
  description: "",
  course_id: "",
  deadline: "",
  attachment: null,
};

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

export function TeacherAssignmentsPage() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadTeacherData = async () => {
    const [coursesResponse, assignmentsResponse] = await Promise.all([
      teacherService.getCourses({ page_size: 100 }),
      teacherService.getAssignments({ page_size: 100 }),
    ]);

    const nextCourses = teacherService.unwrapData(coursesResponse);
    const nextAssignments = teacherService.unwrapData(assignmentsResponse);
    setCourses(
      Array.isArray(nextCourses) ? nextCourses : (nextCourses?.results ?? []),
    );
    setAssignments(
      Array.isArray(nextAssignments)
        ? nextAssignments
        : (nextAssignments?.results ?? []),
    );
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        await loadTeacherData();
        if (isMounted) {
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message ||
              "Unable to load assignment data.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title || !form.course_id || !form.deadline) {
      setError("Title, course, and deadline are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description || "");
      payload.append("course_id", String(form.course_id));
      payload.append(
        "deadline",
        new Date(`${form.deadline}T12:00:00`).toISOString(),
      );
      if (form.attachment) {
        payload.append("attachment", form.attachment);
      }

      if (editingId) {
        await teacherService.updateAssignment(editingId, payload);
      } else {
        await teacherService.createAssignment(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadTeacherData();
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          submitError?.response?.data?.detail ||
          "Unable to save assignment.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment.id);
    setForm({
      title: assignment.title || "",
      description: assignment.description || "",
      course_id: assignment.course?.id || "",
      deadline: assignment.deadline
        ? new Date(assignment.deadline).toISOString().slice(0, 10)
        : "",
      attachment: null,
    });
  };

  const handleDelete = async (assignmentId) => {
    try {
      setError("");
      await teacherService.deleteAssignment(assignmentId);
      await loadTeacherData();
    } catch (deleteError) {
      setError(
        deleteError?.response?.data?.message || "Unable to delete assignment.",
      );
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Assignment Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Create and manage assignments for your live teacher courses.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {editingId ? "Edit Assignment" : "Create Assignment"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Assignment title"
            />
            <Select
              name="course_id"
              value={form.course_id}
              onChange={handleChange}
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </Select>
            <Input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Instructions"
            />
            <Input name="attachment" type="file" onChange={handleChange} />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" size="sm" disabled={saving}>
                <Plus className="h-4 w-4" />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Assignment"
                    : "Publish Assignment"}
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card className="min-w-0">
          <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
            Assignment List
          </h2>
          {loading ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Loading assignments…
            </p>
          ) : assignments.length === 0 ? (
            <p className="text-sm text-slate-500">
              No assignments created yet.
            </p>
          ) : (
            <Table
              columns={[
                { key: "title", header: "Assignment" },
                {
                  key: "course",
                  header: "Course",
                  render: (_, row) => row.course?.course_name || "—",
                },
                {
                  key: "deadline",
                  header: "Due",
                  render: (value) => formatDate(value),
                },
                {
                  key: "status",
                  header: "Status",
                  render: () => <Badge tone="neutral">Open</Badge>,
                },
                {
                  key: "id",
                  header: "Action",
                  render: (_, row) => (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(row.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={assignments}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
