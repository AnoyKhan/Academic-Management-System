import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/card";
import { Modal } from "../../components/ui/modal";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { AdminPagination } from "../../components/common/admin-pagination";
import { adminService } from "../../services/admin.service";
import { getApiErrorMessage } from "../../utils/api-error";

const emptyForm = {
  course_code: "",
  course_name: "",
  description: "",
  credit: "3",
  teacher_id: "",
};

export function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", teacher_id: "" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCourses = useCallback(async (nextPage = page, signal) => {
    const response = await adminService.getCourses({
      ...filters,
      page: nextPage,
      page_size: pageSize,
    }, signal);
    const payload = adminService.unwrapData(response);
    setCourses(Array.isArray(payload) ? payload : (payload?.results ?? []));
    setTotal(Array.isArray(payload) ? payload.length : (payload?.count ?? 0));
    return Array.isArray(payload) ? payload : (payload?.results ?? []);
  }, [filters, page, pageSize]);

  useEffect(() => {
    const controller = new AbortController();
    const loadTeachers = async () => {
      try {
        setTeachers(await adminService.getAllTeachers({}, controller.signal));
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(loadError, "Unable to load courses."));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadTeachers();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        await loadCourses(page, controller.signal);
        setError("");
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(loadError, "Unable to load courses."));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, filters.search ? 350 : 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filters.search, loadCourses, page]);

  const openCreateModal = () => {
    setEditingCourse(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      course_code: course.course_code ?? "",
      course_name: course.course_name ?? "",
      description: course.description ?? "",
      credit: String(course.credit ?? ""),
      teacher_id: String(course.teacher?.id ?? ""),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.course_code || !form.course_name || !form.teacher_id) {
      setError("Course code, course name, and teacher are required.");
      return;
    }
    if (Number(form.credit) < 0.5 || Number(form.credit) > 10) {
      setError("Credits must be between 0.50 and 10.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const payload = {
        ...form,
        credit: Number(form.credit),
        teacher_id: Number(form.teacher_id),
      };
      if (editingCourse) {
        await adminService.updateCourse(editingCourse.id, payload);
        toast.success("Course updated successfully.");
      } else {
        await adminService.createCourse(payload);
        toast.success("Course created successfully.");
      }
      setIsModalOpen(false);
      const records = await loadCourses(page);
      if (records.length === 0 && page > 1) setPage(page - 1);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to save course."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    if (
      !window.confirm(`Delete ${course.course_code}? This cannot be undone.`)
    ) {
      return;
    }
    try {
      setError("");
      await adminService.deleteCourse(course.id);
      toast.success("Course deleted successfully.");
      const records = await loadCourses(page);
      if (records.length === 0 && page > 1) setPage(page - 1);
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, "Unable to delete course."));
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Course Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Create courses, assign departments and teachers, and manage credit
          load.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_120px]">
          <Input
            placeholder="Search course, code, or teacher"
            value={filters.search}
            onChange={(event) => {
              setFilters({ ...filters, search: event.target.value });
              setPage(1);
            }}
          />
          <Select
            value={filters.teacher_id}
            onChange={(event) => {
              setFilters({ ...filters, teacher_id: event.target.value });
              setPage(1);
            }}
          >
            <option value="">All teachers</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </Select>
          <Button
            variant="secondary"
            onClick={() => {
              setFilters({ search: "", teacher_id: "" });
              setPage(1);
            }}
          >
            Clear
          </Button>
        </div>
        <div className="mt-3 flex justify-end">
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>
      </Card>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading courses…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Table
            columns={[
              { key: "course_code", header: "Code" },
              { key: "course_name", header: "Course" },
              {
                key: "teacher",
                header: "Teacher",
                render: (_, row) => row.teacher?.name ?? "—",
              },
              { key: "credit", header: "Credits" },
              {
                key: "status",
                header: "Status",
                render: (value) => (
                  <Badge tone={value === "Running" ? "success" : "warning"}>
                    {value}
                  </Badge>
                ),
              },
              {
                key: "id",
                header: "Action",
                render: (_, course) => (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditModal(course)}
                      aria-label={`Edit ${course.course_code}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(course)}
                      aria-label={`Delete ${course.course_code}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={courses}
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
        title={editingCourse ? "Edit Course" : "Add Course"}
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
            <Button type="submit" form="course-form" disabled={saving}>
              {saving ? "Saving..." : "Save Course"}
            </Button>
          </>
        }
      >
        <form id="course-form" className="space-y-3" onSubmit={handleSubmit}>
          <Input
            name="course_code"
            value={form.course_code}
            onChange={(event) =>
              setForm({ ...form, course_code: event.target.value })
            }
            placeholder="Course code"
          />
          <Input
            name="course_name"
            value={form.course_name}
            onChange={(event) =>
              setForm({ ...form, course_name: event.target.value })
            }
            placeholder="Course name"
          />
          <Select
            name="teacher_id"
            value={form.teacher_id}
            onChange={(event) =>
              setForm({ ...form, teacher_id: event.target.value })
            }
          >
            <option value="">Select teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} ({teacher.employee_id})
              </option>
            ))}
          </Select>
          <Input
            name="credit"
            type="number"
            min="0.5"
            max="10"
            step="0.5"
            value={form.credit}
            onChange={(event) =>
              setForm({ ...form, credit: event.target.value })
            }
            placeholder="Credits"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            placeholder="Description"
            className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </form>
      </Modal>
    </div>
  );
}
