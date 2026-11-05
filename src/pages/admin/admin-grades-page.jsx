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
  student_id: "",
  assignment_id: "",
  marks: "",
  feedback: "",
  graded_by_id: "",
};

const getRecords = (response) => {
  const payload = adminService.unwrapData(response);
  return Array.isArray(payload) ? payload : (payload?.results ?? []);
};

export function AdminGradesPage() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    student_id: "",
    assignment_id: "",
    course_id: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingGrade, setEditingGrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async (signal) => {
    const [
      gradesResponse,
      studentsResponse,
      assignmentsResponse,
      teachersResponse,
    ] = await Promise.all([
      adminService.getGrades({ ...filters, page, page_size: pageSize }, signal),
      adminService.getAllStudents({}, signal),
      adminService.getAllAssignments({}, signal),
      adminService.getAllTeachers({}, signal),
    ]);
    setGrades(getRecords(gradesResponse));
    const gradePayload = adminService.unwrapData(gradesResponse);
    setTotal(Array.isArray(gradePayload) ? gradePayload.length : (gradePayload?.count ?? 0));
    setStudents(getRecords(studentsResponse));
    setAssignments(getRecords(assignmentsResponse));
    setTeachers(getRecords(teachersResponse));
    return getRecords(gradesResponse);
  }, [filters, page, pageSize]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        await loadData(controller.signal);
        setError("");
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(loadError, "Unable to load grades."));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, filters.search ? 350 : 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filters.search, loadData]);

  const openEditModal = (grade) => {
    setEditingGrade(grade);
    setForm({
      student_id: String(grade.student?.id ?? ""),
      assignment_id: String(grade.assignment?.id ?? ""),
      marks: String(grade.marks ?? ""),
      feedback: grade.feedback ?? "",
      graded_by_id: String(grade.graded_by?.id ?? ""),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !form.student_id ||
      !form.assignment_id ||
      !form.graded_by_id ||
      form.marks === ""
    ) {
      setError("Student, assignment, grader, and marks are required.");
      return;
    }
    if (Number(form.marks) < 0 || Number(form.marks) > 100) {
      setError("Marks must be between 0 and 100.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const payload = {
        ...form,
        student_id: Number(form.student_id),
        assignment_id: Number(form.assignment_id),
        graded_by_id: Number(form.graded_by_id),
        marks: Number(form.marks),
      };
      if (editingGrade) {
        await adminService.updateGrade(editingGrade.id, payload);
        toast.success("Grade updated successfully.");
      } else {
        await adminService.createGrade(payload);
        toast.success("Grade created successfully.");
      }
      setIsModalOpen(false);
      const records = await loadData();
      if (records.length === 0 && page > 1) setPage(page - 1);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to save grade."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (grade) => {
    if (
      !window.confirm(
        `Delete the grade for ${grade.student?.name ?? "this student"}? This cannot be undone.`,
      )
    )
      return;
    try {
      setError("");
      await adminService.deleteGrade(grade.id);
      toast.success("Grade deleted successfully.");
      const records = await loadData();
      if (records.length === 0 && page > 1) setPage(page - 1);
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, "Unable to delete grade."));
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px_100px]">
          <Input
            placeholder="Search student, course, or assignment"
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
            {[...new Map(assignments.map((item) => [item.course?.id, item.course])).values()]
              .filter(Boolean)
              .map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_code}
                </option>
              ))}
          </Select>
          <Select
            value={filters.student_id}
            onChange={(event) => {
              setFilters({ ...filters, student_id: event.target.value });
              setPage(1);
            }}
          >
            <option value="">All students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </Select>
          <Select
            value={filters.assignment_id}
            onChange={(event) => {
              setFilters({ ...filters, assignment_id: event.target.value });
              setPage(1);
            }}
          >
            <option value="">All assignments</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </Select>
          <Button
            variant="secondary"
            onClick={() => {
              setFilters({ search: "", student_id: "", assignment_id: "", course_id: "" });
              setPage(1);
            }}
          >
            Clear
          </Button>
        </div>
      </Card>
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Grade Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Live grade records and published feedback.
        </p>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => {
              setEditingGrade(null);
              setForm(emptyForm);
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Grade
          </Button>
        </div>
      </Card>
      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading grades…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Table
            data={grades}
            columns={[
              {
                key: "student",
                header: "Student",
                render: (value) => value?.name ?? "—",
              },
              {
                key: "assignment",
                header: "Assignment",
                render: (value) => value?.title ?? "—",
              },
              {
                key: "course",
                header: "Course",
                render: (value) => value?.course_name ?? "—",
              },
              { key: "marks", header: "Marks" },
              {
                key: "feedback",
                header: "Feedback",
                render: (value) => value || "—",
              },
              {
                key: "graded_by",
                header: "Graded By",
                render: (value) => value?.name ?? "—",
              },
              {
                key: "actions",
                header: "Actions",
                render: (_, grade) => (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditModal(grade)}
                      aria-label={`Edit grade for ${grade.student?.name ?? "student"}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(grade)}
                      aria-label={`Delete grade for ${grade.student?.name ?? "student"}`}
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
        title={editingGrade ? "Edit Grade" : "Add Grade"}
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
            <Button type="submit" form="grade-form" disabled={saving}>
              {saving ? "Saving..." : "Save Grade"}
            </Button>
          </>
        }
      >
        <form id="grade-form" className="space-y-3" onSubmit={handleSubmit}>
          <Select
            value={form.student_id}
            onChange={(event) =>
              setForm({ ...form, student_id: event.target.value })
            }
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.student_id})
              </option>
            ))}
          </Select>
          <Select
            value={form.assignment_id}
            onChange={(event) =>
              setForm({ ...form, assignment_id: event.target.value })
            }
          >
            <option value="">Select assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </Select>
          <Select
            value={form.graded_by_id}
            onChange={(event) =>
              setForm({ ...form, graded_by_id: event.target.value })
            }
          >
            <option value="">Select grader</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.marks}
            onChange={(event) =>
              setForm({ ...form, marks: event.target.value })
            }
            placeholder="Marks"
          />
          <Input
            value={form.feedback}
            onChange={(event) =>
              setForm({ ...form, feedback: event.target.value })
            }
            placeholder="Feedback (optional)"
          />
        </form>
      </Modal>
    </div>
  );
}
