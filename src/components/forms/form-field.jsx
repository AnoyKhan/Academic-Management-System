export function FormField({ label, error, htmlFor, children }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
