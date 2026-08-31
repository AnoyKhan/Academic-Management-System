import { useEffect, useState } from "react";
import { Save, UserCircle2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { teacherService } from "../../services/teacher.service";

export function TeacherProfileSettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getProfile();
        const payload = teacherService.unwrapData(response);

        if (isMounted) {
          setProfile(payload?.teacher ?? payload);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message ||
              "Unable to load teacher profile.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const name = profile?.name || "Teacher";
  const department = profile?.department || "Department";
  const designation = profile?.designation || "Teacher";

  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Live profile information from the authenticated teacher account.
        </p>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading teacher profile…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
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
              <p className="mt-1 text-sm text-slate-500">{designation}</p>
              <p className="mt-1 text-sm text-slate-500">{department}</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Account Details
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input value={name} disabled />
              <Input value={designation} disabled />
              <Input value={department} disabled />
              <Input value={profile?.email || ""} disabled />
              <Input value={profile?.employee_id || ""} disabled />
              <Input value={profile?.joining_date || ""} disabled />
            </div>
            <div className="mt-5 flex justify-end">
              <Button disabled>
                <Save className="h-4 w-4" />
                Update profile (backend missing)
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
