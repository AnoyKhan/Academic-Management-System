import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";

export function NotificationBell({ notifications = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
            {notifications.length}
          </span>
        ) : null}
      </Button>

      {open ? (
        <div
          className="absolute right-0 z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          role="dialog"
          aria-label="Notifications"
        >
          <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Notifications
          </p>
          <ul className="space-y-2">
            {notifications.length === 0 ? (
              <li className="text-sm text-slate-500 dark:text-slate-400">
                No new notifications.
              </li>
            ) : (
              notifications.map((item) => (
                <li
                  key={item}
                  className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-200"
                >
                  {item}
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
