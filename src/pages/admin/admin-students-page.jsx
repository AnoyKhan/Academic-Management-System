import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";
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
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  student_id: "",
  department: "",
  intake: "",
  batch: "",
  semester: "1",
  date_of_birth: "",
  address: "",
};

const fieldLabels = {
  username: "Username",
  email: "Email",
  password: "Password",
  first_name: "First name",
  last_name: "Last name",
  phone: "Phone",
  student_id: "Student ID",
  department: "Department",
  intake: "Intake",
  batch: "Batch",
  semester: "Semester",
  date_of_birth: "Date of birth",
  address: "Address",
};

export function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    status: "",
  });
  const [form, setForm] = useState(emptyForm);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadStudents = useCallback(async (nextPage = page, signal) => {
    try {
      setLoading(true);
      const response = await adminService.getStudents({
        ...filters,
        page: nextPage,
        page_size: pageSize,
      }, signal);
      const payload = adminService.unwrapData(response);
      setStudents(Array.isArray(payload) ? payload : (payload?.results ?? []));
      setTotal(Array.isArray(payload) ? payload.length : (payload?.count ?? 0));
      setError("");
      return Array.isArray(payload) ? payload : (payload?.results ?? []);
    } catch (loadError) {
      if (signal?.aborted) return [];
      setError(getApiErrorMessage(loadError, "Unable to load students."));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(
      () => loadStudents(page, controller.signal),
      filters.search ? 350 : 0,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filters.search, loadStudents, page]);

  const openCreateModal = () => {
    setEditingStudent(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setForm({
      ...emptyForm,
      first_name: student.name?.split(" ")[0] ?? "",
      last_name: student.name?.split(" ").slice(1).join(" ") ?? "",
      email: student.email ?? "",
      student_id: student.student_id ?? "",
      department: student.department ?? "",
      intake: student.intake ?? "",
      batch: student.batch ?? "",
      semester: String(student.semester ?? ""),
      date_of_birth: student.date_of_birth ?? "",
      address: student.address ?? "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.department || !form.intake || !form.batch) {
      setError("Email, department, intake, and batch are required.");
      return;
    }
    if (!editingStudent && !form.password) {
      setError("A password is required when creating a student.");
      return;
    }
    if (Number(form.semester) < 1 || Number(form.semester) > 12) {
      setError("Semester must be between 1 and 12.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = { ...form, semester: Number(form.semester) };
      if (editingStudent) {
        delete payload.password;
        await adminService.updateStudent(editingStudent.id, payload);
        toast.success("Student updated successfully.");
      } else {
        await adminService.createStudent(payload);
        toast.success("Student created successfully.");
      }
      setIsModalOpen(false);
      const records = await loadStudents(page);
      if (records.length === 0 && page > 1) setPage(page - 1);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to save student."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    if (
      !window.confirm(
        `Delete ${student.name || student.student_id}? This cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      setError("");
      await adminService.deleteStudent(student.id);
      toast.success("Student deleted successfully.");
      const records = await loadStudents(page);
      if (records.length === 0 && page > 1) setPage(page - 1);
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, "Unable to delete student."));
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Student Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Maintain student records, batch placement, academic standing, and
          enrollment status.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_150px]">
          <Input
            name="search"
            value={filters.search}
            onChange={(event) => handleFilterChange("search", event.target.value)}
            placeholder="Search student ID or name"
          />
          <Input
            value={filters.department}
            onChange={(event) =>
              handleFilterChange("department", event.target.value)
            }
            placeholder="Department"
          />
          <Select
            value={filters.status}
            onChange={(event) =>
              handleFilterChange("status", event.target.value)
            }
          >
            <option value="">All statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </Select>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFilters({ search: "", department: "", status: "" });
              setPage(1);
            }}
          >
            Clear
          </Button>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex justify-end">
          <Button size="sm" onClick={openCreateModal}>
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading students…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Table
            columns={[
              { key: "student_id", header: "Student ID" },
              { key: "name", header: "Name" },
              { key: "department", header: "Department" },
              { key: "batch", header: "Batch" },
              { key: "semester", header: "Semester" },
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
                render: (_, student) => (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditModal(student)}
                      aria-label={`Edit ${student.name || student.student_id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(student)}
                      aria-label={`Delete ${student.name || student.student_id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={students}
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
        title={editingStudent ? "Edit Student" : "Add Student"}
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
            <Button type="submit" form="student-form" disabled={saving}>
              {saving ? "Saving..." : "Save Student"}
            </Button>
          </>
        }
      >
        <form
          id="student-form"
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          {Object.entries(fieldLabels).map(([field, label]) => (
            <label
              key={field}
              className={`space-y-1 ${field === "address" ? "sm:col-span-2" : ""}`}
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {label}
                {["email", "department", "intake", "batch"].includes(field) ||
                (!editingStudent && ["password"].includes(field))
                  ? " *"
                  : ""}
              </span>
              {field === "semester" ? (
                <Input
                  name={field}
                  type="number"
                  min="1"
                  max="12"
                  value={form[field]}
                  onChange={handleChange}
                />
              ) : field === "address" ? (
                <textarea
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              ) : (
                <Input
                  name={field}
                  type={
                    field === "password"
                      ? "password"
                      : field === "date_of_birth"
                        ? "date"
                        : field === "email"
                          ? "email"
                          : "text"
                  }
                  value={form[field]}
                  onChange={handleChange}
                  disabled={
                    editingStudent && ["username", "password"].includes(field)
                  }
                />
              )}
            </label>
          ))}
        </form>
      </Modal>
    </div>
  );
}
