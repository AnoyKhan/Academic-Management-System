import { Button } from "../ui/button";
import { Select } from "../ui/select";

export function AdminPagination({
  count = 0,
  page = 1,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, count);

  return (
    <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {start}–{end} of {count} records
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">
          <span className="sr-only">Page size</span>
          <Select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="h-9 w-20"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Select>
        </label>
        <Button
          size="sm"
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="px-1">
          Page {page} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
