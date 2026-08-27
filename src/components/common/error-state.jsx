import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

export function ErrorState({
  code = "Error",
  title = "Something went wrong",
  description = "The requested screen could not be loaded.",
  actionLabel = "Back to dashboard",
  onAction,
}) {
  return (
    <div className="grid min-h-[55vh] place-items-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-slate-500">
          {code}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
        {onAction ? (
          <Button className="mt-5" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
