import { Card } from "../../components/ui/card";

export function TeacherMaterialsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Upload Study Materials
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          No material upload or material-list API currently exists in the
          backend for teachers.
        </p>
      </Card>

      <Card>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          The current Django teacher API includes profile, dashboard, courses,
          assignments, submissions, attendance, and notifications only. No
          teacher materials endpoint was found in the backend, so this page
          intentionally does not call a fake or mock API.
        </p>
      </Card>
    </div>
  );
}
