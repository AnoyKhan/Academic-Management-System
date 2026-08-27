import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const Input = forwardRef(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
        className,
      )}
      {...props}
    />
  );
});
