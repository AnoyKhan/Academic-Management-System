import { Card } from "../../components/ui/card";

export function RoleSectionPage({ title, description }) {
  return (
    <Card>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
        {description}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {["KPI Panel", "Tasks", "Timeline"].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <p className="font-semibold">{item}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Mock widget with role-focused sample information.
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
