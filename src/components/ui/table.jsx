import { cn } from "../../utils/cn";
import { EmptyState } from "../common/empty-state";

export function Table({
  columns = [],
  data = [],
  className,
  caption,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting filters or add new records to this module.",
}) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700",
        className,
      )}
    >
      <table className="min-w-full divide-y divide-slate-200 text-left dark:divide-slate-700">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
          {data.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex}>
              {columns.map((column) => (
                <td
                  key={`${column.key}-${row.id ?? rowIndex}`}
                  className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
