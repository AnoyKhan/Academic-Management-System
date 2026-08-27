import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const Select = forwardRef(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
