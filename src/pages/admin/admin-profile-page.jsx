import { useEffect, useState } from "react";
import { UserCircle2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { adminService } from "../../services/admin.service";

export function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    adminService
      .getProfile()
      .then((response) => {
        if (!isMounted) return;
        const payload = adminService.unwrapData(response);
        setProfile(payload?.user ?? payload);
      })
      .catch((loadError) => {
        if (isMounted)
          setError(
            loadError?.response?.data?.message ||
              "Unable to load admin profile.",
          );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const name =
    profile?.name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.username ||
    "Admin";
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Admin Profile
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Profile information from the authenticated admin account.
        </p>
      </Card>
      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading admin profile…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="grid h-24 w-24 place-items-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                <UserCircle2 className="h-14 w-14" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
                {name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">Administrator</p>
            </div>
          </Card>
          <Card>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Account Details
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input value={name} disabled />
              <Input value={profile?.email || ""} disabled />
              <Input value={profile?.username || ""} disabled />
              <Input value={profile?.role || ""} disabled />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
