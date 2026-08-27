export function Loader({ label = "Loading..." }) {
  return (
    <div
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600 dark:border-slate-600"
        aria-hidden="true"
      />
      {label}
    </div>
  );
}

export function PageLoader({ label = "Loading dashboard..." }) {
  return (
    <div className="grid min-h-[45vh] place-items-center">
      <Loader label={label} />
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800 ${className}`}
      aria-hidden="true"
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-label="Loading dashboard content">
      <Skeleton className="h-32" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}
