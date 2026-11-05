import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/card";
import { Modal } from "../../components/ui/modal";
import { Table } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { AdminPagination } from "../../components/common/admin-pagination";
import { adminService } from "../../services/admin.service";
import { getApiErrorMessage } from "../../utils/api-error";

const emptyForm = {
  title: "",
  description: "",
  course_id: "",
  teacher_id: "",
  deadline: "",
  attachment: null,
};

const toDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};

export function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    course_id: "",
    deadline_from: "",
    deadline_to: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAssignments = useCallback(async (nextPage = page, signal) => {
    const [assignmentsResponse, coursesResponse] = await Promise.all([
      adminService.getAssignments({
        ...filters,
        page: nextPage,
        page_size: pageSize,
      }, signal),
      adminService.getAllCourses({}, signal),
    ]);
    const assignmentPayload = adminService.unwrapData(assignmentsResponse);
    const coursePayload = adminService.unwrapData(coursesResponse);
    setAssignments(
      Array.isArray(assignmentPayload)
        ? assignmentPayload
        : (assignmentPayload?.results ?? []),
    );
    setTotal(
      Array.isArray(assignmentPayload)
        ? assignmentPayload.length
        : (assignmentPayload?.count ?? 0),
    );
    setCourses(
      Array.isArray(coursePayload)
        ? coursePayload
        : (coursePayload?.results ?? []),
    );
    return Array.isArray(assignmentPayload)
      ? assignmentPayload
      : (assignmentPayload?.results ?? []);
  }, [filters, page, pageSize]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        await loadAssignments(page, controller.signal);
        setError("");
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(loadError, "Unable to load assignments."));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
      filters.search ? 350 : 0,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filters.search, loadAssignments, page]);

  const openCreateModal = () => {
    setEditingAssignment(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setForm({
      title: assignment.title ?? "",
      description: assignment.description ?? "",
      course_id: String(assignment.course?.id ?? ""),
      teacher_id: String(assignment.teacher?.id ?? ""),
      deadline: toDateTimeLocal(assignment.deadline),
      attachment: null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.course_id || !form.deadline) {
      setError("Title, course, and deadline are required.");
      return;
    }
    if (new Date(form.deadline) <= new Date()) {
      setError("Deadline must be in the future.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const selectedCourse = courses.find(
        (course) => String(course.id) === String(form.course_id),
      );
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description || "");
      payload.append("course_id", String(form.course_id));
      payload.append(
        "teacher_id",
        String(selectedCourse?.teacher?.id ?? form.teacher_id),
      );
      payload.append("deadline", new Date(form.deadline).toISOString());
      if (form.attachment) payload.append("attachment", form.attachment);

      if (editingAssignment) {
        await adminService.updateAssignment(editingAssignment.id, payload);
        toast.success("Assignment updated successfully.");
      } else {
        await adminService.createAssignment(payload);
        toast.success("Assignment created successfully.");
      }
      setIsModalOpen(false);
      const records = await loadAssignments(page);
      if (records?.length === 0 && page > 1) setPage(page - 1);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to save assignment."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (assignment) => {
    if (!window.confirm(`Delete ${assignment.title}? This cannot be undone.`))
      return;
    try {
      setError("");
      await adminService.deleteAssignment(assignment.id);
      toast.success("Assignment deleted successfully.");
      const records = await loadAssignments(page);
      if (records?.length === 0 && page > 1) setPage(page - 1);
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, "Unable to delete assignment."));
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_150px_150px_100px]">
          <Input
            placeholder="Search assignment, course, or code"
            value={filters.search}
            onChange={(event) => {
              setFilters({ ...filters, search: event.target.value });
              setPage(1);
            }}
          />
          <Select
            value={filters.course_id}
            onChange={(event) => {
              setFilters({ ...filters, course_id: event.target.value });
              setPage(1);
            }}
          >
            <option value="">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_code}
              </option>
            ))}
          </Select>
          <Input
            type="date"
            value={filters.deadline_from}
            onChange={(event) => {
              setFilters({ ...filters, deadline_from: event.target.value });
              setPage(1);
            }}
          />
          <Input
            type="date"
            value={filters.deadline_to}
            onChange={(event) => {
              setFilters({ ...filters, deadline_to: event.target.value });
              setPage(1);
            }}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setFilters({ search: "", course_id: "", deadline_from: "", deadline_to: "" });
              setPage(1);
            }}
          >
            Clear
          </Button>
        </div>
      </Card>
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Assignment Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Live assignments across the institution.
        </p>
        <div className="mt-4 flex justify-end">
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Add Assignment
          </Button>
        </div>
      </Card>
      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading assignments…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Table
            data={assignments}
            columns={[
              { key: "title", header: "Assignment" },
              {
                key: "course",
                header: "Course",
                render: (value) => value?.course_name ?? "—",
              },
              {
                key: "teacher",
                header: "Teacher",
                render: (value) => value?.name ?? "—",
              },
              {
                key: "deadline",
                header: "Due",
                render: (value) =>
                  value ? new Date(value).toLocaleDateString() : "—",
              },
              { key: "submission_count", header: "Submissions" },
              {
                key: "actions",
                header: "Actions",
                render: (_, assignment) => (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditModal(assignment)}
                      aria-label={`Edit ${assignment.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(assignment)}
                      aria-label={`Delete ${assignment.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        )}
        {!loading && !error ? (
          <AdminPagination
            count={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
          />
        ) : null}
      </Card>

      <Modal
        isOpen={isModalOpen}
        title={editingAssignment ? "Edit Assignment" : "Add Assignment"}
        onClose={() => !saving && setIsModalOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" form="assignment-form" disabled={saving}>
              {saving ? "Saving..." : "Save Assignment"}
            </Button>
          </>
        }
      >
        <form
          id="assignment-form"
          className="space-y-3"
          onSubmit={handleSubmit}
        >
          <Input
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            placeholder="Assignment title"
          />
          <Select
            value={form.course_id}
            onChange={(event) =>
              setForm({ ...form, course_id: event.target.value })
            }
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_code} - {course.course_name}
              </option>
            ))}
          </Select>
          <Input
            type="datetime-local"
            value={form.deadline}
            onChange={(event) =>
              setForm({ ...form, deadline: event.target.value })
            }
          />
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            placeholder="Description"
            className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <Input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.jpg,.jpeg,.png"
            onChange={(event) =>
              setForm({ ...form, attachment: event.target.files?.[0] ?? null })
            }
          />
        </form>
      </Modal>
    </div>
  );
}
