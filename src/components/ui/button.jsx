import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400 dark:text-slate-200 dark:hover:bg-slate-800",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60 dark:focus-visible:ring-offset-slate-950",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
