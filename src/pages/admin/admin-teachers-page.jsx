import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { adminService } from "../../services/admin.service";

export function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTeachers = async () => {
      try {
        setLoading(true);
        const response = await adminService.getTeachers();
        const payload = adminService.unwrapData(response);

        if (isMounted) {
          setTeachers(
            Array.isArray(payload?.results) ? payload.results : payload || [],
          );
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message || "Unable to load teachers.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTeachers();

    return () => {
      isMounted = false;
    };
  }, []);

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
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_180px_150px]">
          <Input placeholder="Teacher name" />
          <Select defaultValue="">
            <option value="" disabled>
              Department
            </option>
            <option>Computer Science</option>
            <option>Business Administration</option>
          </Select>
          <Input type="email" placeholder="Email" />
          <Button>
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
            ]}
            data={teachers}
          />
        )}
      </Card>
    </div>
  );
}
