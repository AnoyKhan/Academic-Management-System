import { cn } from "../../utils/cn";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white/85 p-5 shadow-soft backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/75",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
