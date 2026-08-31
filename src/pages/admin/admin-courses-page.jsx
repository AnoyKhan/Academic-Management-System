import { useEffect, useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { adminService } from "../../services/admin.service";

export function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await adminService.getCourses();
        const payload = adminService.unwrapData(response);

        if (isMounted) {
          setCourses(
            Array.isArray(payload?.results) ? payload.results : payload || [],
          );
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message || "Unable to load courses.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

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
        <div className="grid gap-3 xl:grid-cols-[140px_1fr_160px_1fr_150px]">
          <Input placeholder="Code" />
          <Input placeholder="Course title" />
          <Select defaultValue="">
            <option value="" disabled>
              Department
            </option>
            <option>Computer Science</option>
            <option>Business Administration</option>
          </Select>
          <Select defaultValue="">
            <option value="" disabled>
              Teacher
            </option>
            <option>Faculty</option>
          </Select>
          <Button>
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
                render: () => (
                  <Button size="sm" variant="secondary">
                    <BookOpen className="h-4 w-4" />
                    View
                  </Button>
                ),
              },
            ]}
            data={courses}
          />
        )}
      </Card>
    </div>
  );
}
