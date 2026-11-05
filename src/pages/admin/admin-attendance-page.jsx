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
  student_id: "",
  course_id: "",
  date: "",
  status: "PRESENT",
};

const getRecords = (response) => {
  const payload = adminService.unwrapData(response);
  return Array.isArray(payload) ? payload : (payload?.results ?? []);
};

export function AdminAttendancePage() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    student_id: "",
    course_id: "",
    status: "",
    date_from: "",
    date_to: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async (signal) => {
    const [attendanceResponse, studentsResponse, coursesResponse] =
      await Promise.all([
        adminService.getAttendance({ ...filters, page, page_size: pageSize }, signal),
        adminService.getAllStudents({}, signal),
        adminService.getAllCourses({}, signal),
      ]);
    setRecords(getRecords(attendanceResponse));
    const attendancePayload = adminService.unwrapData(attendanceResponse);
    setTotal(
      Array.isArray(attendancePayload)
        ? attendancePayload.length
        : (attendancePayload?.count ?? 0),
    );
    setStudents(getRecords(studentsResponse));
    setCourses(getRecords(coursesResponse));
    return getRecords(attendanceResponse);
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
          setError(getApiErrorMessage(loadError, "Unable to load attendance."));
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

  const openEditModal = (record) => {
    setEditingRecord(record);
    setForm({
      student_id: String(record.student?.id ?? ""),
      course_id: String(record.course?.id ?? ""),
      date: record.date ?? "",
      status: record.status ?? "PRESENT",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.student_id || !form.course_id || !form.date || !form.status) {
      setError("Student, course, date, and status are required.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const payload = {
        ...form,
        student_id: Number(form.student_id),
        course_id: Number(form.course_id),
      };
      if (editingRecord) {
        await adminService.updateAttendance(editingRecord.id, payload);
        toast.success("Attendance updated successfully.");
      } else {
        await adminService.createAttendance(payload);
        toast.success("Attendance recorded successfully.");
      }
      setIsModalOpen(false);
      const records = await loadData();
      if (records.length === 0 && page > 1) setPage(page - 1);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to save attendance."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    if (
      !window.confirm(
        `Delete attendance for ${record.student?.name ?? "this student"}? This cannot be undone.`,
      )
    )
      return;
    try {
      setError("");
      await adminService.deleteAttendance(record.id);
      toast.success("Attendance deleted successfully.");
      const records = await loadData();
      if (records.length === 0 && page > 1) setPage(page - 1);
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, "Unable to delete attendance."));
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_140px_150px_150px_100px]">
          <Input
            placeholder="Search student or course"
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
            value={filters.status}
            onChange={(event) => {
              setFilters({ ...filters, status: event.target.value });
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
          </Select>
          <Input
            type="date"
            value={filters.date_from}
            onChange={(event) => {
              setFilters({ ...filters, date_from: event.target.value });
              setPage(1);
            }}
          />
          <Input
            type="date"
            value={filters.date_to}
            onChange={(event) => {
              setFilters({ ...filters, date_to: event.target.value });
              setPage(1);
            }}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setFilters({
                search: "",
                student_id: "",
                course_id: "",
                status: "",
                date_from: "",
                date_to: "",
              });
              setPage(1);
            }}
          >
            Clear
          </Button>
        </div>
      </Card>
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Attendance Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Institution-wide attendance records from the backend.
        </p>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => {
              setEditingRecord(null);
              setForm(emptyForm);
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Attendance
          </Button>
        </div>
      </Card>
      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading attendance…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Table
            data={records}
            columns={[
              {
                key: "student",
                header: "Student",
                render: (value) => value?.name ?? "—",
              },
              {
                key: "course",
                header: "Course",
                render: (value) => value?.course_name ?? "—",
              },
              { key: "date", header: "Date" },
              {
                key: "status",
                header: "Status",
                render: (value) => (
                  <Badge tone={value === "PRESENT" ? "success" : "warning"}>
                    {value}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                render: (_, record) => (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditModal(record)}
                      aria-label={`Edit attendance for ${record.student?.name ?? "student"}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(record)}
                      aria-label={`Delete attendance for ${record.student?.name ?? "student"}`}
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
        title={editingRecord ? "Edit Attendance" : "Add Attendance"}
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
            <Button type="submit" form="attendance-form" disabled={saving}>
              {saving ? "Saving..." : "Save Attendance"}
            </Button>
          </>
        }
      >
        <form
          id="attendance-form"
          className="space-y-3"
          onSubmit={handleSubmit}
        >
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
            value={form.course_id}
            onChange={(event) =>
              setForm({ ...form, course_id: event.target.value })
            }
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_code} · {course.course_name}
              </option>
            ))}
          </Select>
          <Input
            type="date"
            value={form.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
          />
          <Select
            value={form.status}
            onChange={(event) =>
              setForm({ ...form, status: event.target.value })
            }
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
          </Select>
        </form>
      </Modal>
    </div>
  );
}
