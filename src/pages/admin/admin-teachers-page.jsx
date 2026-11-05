import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/card";
import { Modal } from "../../components/ui/modal";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { AdminPagination } from "../../components/common/admin-pagination";
import { adminService } from "../../services/admin.service";
import { getApiErrorMessage } from "../../utils/api-error";

const emptyForm = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  employee_id: "",
  department: "",
  designation: "Lecturer",
  joining_date: "",
};

const fields = [
  ["username", "Username"],
  ["email", "Email"],
  ["password", "Password"],
  ["first_name", "First name"],
  ["last_name", "Last name"],
  ["phone", "Phone"],
  ["employee_id", "Employee ID"],
  ["department", "Department"],
  ["designation", "Designation"],
  ["joining_date", "Joining date"],
];

export function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", department: "", designation: "", status: "" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTeachers = useCallback(async (nextPage = page, signal) => {
    try {
      setLoading(true);
      const response = await adminService.getTeachers({
        ...filters,
        page: nextPage,
        page_size: pageSize,
      }, signal);
      const payload = adminService.unwrapData(response);
      setTeachers(Array.isArray(payload) ? payload : (payload?.results ?? []));
      setTotal(Array.isArray(payload) ? payload.length : (payload?.count ?? 0));
      setError("");
      return Array.isArray(payload) ? payload : (payload?.results ?? []);
    } catch (loadError) {
      if (signal?.aborted) return [];
      setError(getApiErrorMessage(loadError, "Unable to load teachers."));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(
      () => loadTeachers(page, controller.signal),
      filters.search ? 350 : 0,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filters.search, loadTeachers, page]);

  const openCreateModal = () => {
    setEditingTeacher(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (teacher) => {
    const nameParts = (teacher.name ?? "").split(" ");
    setEditingTeacher(teacher);
    setForm({
      ...emptyForm,
      first_name: nameParts.shift() ?? "",
      last_name: nameParts.join(" "),
      email: teacher.email ?? "",
      employee_id: teacher.employee_id ?? "",
      department: teacher.department ?? "",
      designation: teacher.designation ?? "",
      joining_date: teacher.joining_date ?? "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.department || !form.designation) {
      setError("Email, department, and designation are required.");
      return;
    }
    if (!editingTeacher && !form.password) {
      setError("A password is required when creating a teacher.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const payload = { ...form };
      if (editingTeacher) {
        delete payload.password;
        await adminService.updateTeacher(editingTeacher.id, payload);
        toast.success("Teacher updated successfully.");
      } else {
        await adminService.createTeacher(payload);
        toast.success("Teacher created successfully.");
      }
      setIsModalOpen(false);
      const records = await loadTeachers(page);
      if (records.length === 0 && page > 1) setPage(page - 1);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to save teacher."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (teacher) => {
    if (
      !window.confirm(
        `Delete ${teacher.name || teacher.employee_id}? This cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      setError("");
      await adminService.deleteTeacher(teacher.id);
      toast.success("Teacher deleted successfully.");
      const records = await loadTeachers(page);
      if (records.length === 0 && page > 1) setPage(page - 1);
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, "Unable to delete teacher."));
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Teacher Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Add faculty, assign departments, and monitor current teaching load.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_100px_150px]">
          <Input
            placeholder="Search teacher, ID, or email"
            value={filters.search}
            onChange={(event) => {
              setFilters({ ...filters, search: event.target.value });
              setPage(1);
            }}
          />
          <Input
            placeholder="Department"
            value={filters.department}
            onChange={(event) => {
              setFilters({ ...filters, department: event.target.value });
              setPage(1);
            }}
          />
          <Input
            placeholder="Designation"
            value={filters.designation}
            onChange={(event) => {
              setFilters({ ...filters, designation: event.target.value });
              setPage(1);
            }}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setFilters({ search: "", department: "", designation: "", status: "" });
              setPage(1);
            }}
          >
            Clear
          </Button>
          <Button onClick={openCreateModal}>
            <UserPlus className="h-4 w-4" />
            Add Teacher
          </Button>
        </div>
      </Card>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading teachers…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Table
            columns={[
              { key: "name", header: "Teacher" },
              { key: "department", header: "Department" },
              { key: "course_count", header: "Courses" },
              {
                key: "status",
                header: "Status",
                render: (value) => (
                  <Badge tone={value === "Active" ? "success" : "warning"}>
                    {value}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                render: (_, teacher) => (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditModal(teacher)}
                      aria-label={`Edit ${teacher.name || teacher.employee_id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(teacher)}
                      aria-label={`Delete ${teacher.name || teacher.employee_id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={teachers}
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
        title={editingTeacher ? "Edit Teacher" : "Add Teacher"}
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
            <Button type="submit" form="teacher-form" disabled={saving}>
              {saving ? "Saving..." : "Save Teacher"}
            </Button>
          </>
        }
      >
        <form
          id="teacher-form"
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          {fields.map(([field, label]) => (
            <label key={field} className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {label}
                {["email", "department", "designation"].includes(field) ||
                (!editingTeacher && field === "password")
                  ? " *"
                  : ""}
              </span>
              <Input
                name={field}
                type={
                  field === "password"
                    ? "password"
                    : field === "joining_date"
                      ? "date"
                      : field === "email"
                        ? "email"
                        : "text"
                }
                value={form[field]}
                onChange={(event) =>
                  setForm({ ...form, [field]: event.target.value })
                }
                disabled={
                  editingTeacher && ["username", "password"].includes(field)
                }
              />
            </label>
          ))}
        </form>
      </Modal>
    </div>
  );
}
