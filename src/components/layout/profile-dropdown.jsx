import { useState } from "react";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { ROUTE_PATHS } from "../../routes/route-paths";
import { ROLE_META } from "../../data/role-dashboard";
import { dummyAuthService } from "../../services/dummy-auth";

export function ProfileDropdown({ session }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const initials = (session?.name ?? "US")
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabel = ROLE_META[session?.role]?.label ?? "User";

  const profilePathByRole = {
    student: ROUTE_PATHS.studentProfile,
    teacher: ROUTE_PATHS.teacher,
    admin: ROUTE_PATHS.admin,
  };

  const handleLogout = () => {
    dummyAuthService.logout();
    toast.success("You are logged out.");
    navigate(ROUTE_PATHS.login);
  };

  const handleProfile = () => {
    navigate(profilePathByRole[session?.role] ?? ROUTE_PATHS.login);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-left shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle profile menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900/60 dark:text-brand-200">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            {session?.name}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {roleLabel}
          </p>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>

      {open ? (
        <div
          className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          role="menu"
        >
          <div className="mb-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {session?.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {session?.email}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={handleProfile}
            role="menuitem"
          >
            <UserCircle2 className="h-4 w-4" />
            My Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 w-full justify-start text-rose-600 hover:text-rose-700 dark:text-rose-400"
            onClick={handleLogout}
            role="menuitem"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      ) : null}
    </div>
  );
}
