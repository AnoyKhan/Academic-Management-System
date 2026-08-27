import { Inbox } from "lucide-react";
import { cn } from "../../utils/cn";

export function EmptyState({
  title = "No data available",
  description = "There is nothing to show here yet.",
  icon: Icon = Inbox,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "grid min-h-44 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900/60",
        className,
      )}
    >
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}
