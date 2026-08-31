import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { adminService } from "../../services/admin.service";

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await adminService.getUsers();
        const payload = adminService.unwrapData(response);

        if (isMounted) {
          setUsers(
            Array.isArray(payload?.results) ? payload.results : payload || [],
          );
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message || "Unable to load users.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          User Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Manage system accounts, roles, and active status from the live
          backend.
        </p>
      </Card>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading users…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Table
            columns={[
              { key: "username", header: "Username" },
              { key: "email", header: "Email" },
              { key: "role", header: "Role" },
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
            data={users}
          />
        )}
      </Card>
    </div>
  );
}
