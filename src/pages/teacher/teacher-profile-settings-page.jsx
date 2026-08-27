import { Save, UserCircle2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { teacherProfile } from "../../data/teacher-portal-data";

export function TeacherProfileSettingsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Update teacher profile, department details, and contact preferences.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="grid h-24 w-24 place-items-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              <UserCircle2 className="h-14 w-14" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
              {teacherProfile.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{teacherProfile.title}</p>
            <p className="mt-1 text-sm text-slate-500">{teacherProfile.department}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Account Details
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Input defaultValue={teacherProfile.name} />
            <Input defaultValue={teacherProfile.title} />
            <Input defaultValue={teacherProfile.department} />
            <Input defaultValue={teacherProfile.email} />
            <Input defaultValue={teacherProfile.phone} />
            <Input defaultValue={teacherProfile.office} />
          </div>
          <div className="mt-5 flex justify-end">
            <Button>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
