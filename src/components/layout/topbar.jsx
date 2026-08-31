import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ThemeToggle } from "../common/theme-toggle";
import { Breadcrumbs } from "./breadcrumbs";
import { NotificationBell } from "./notification-bell";
import { ProfileDropdown } from "./profile-dropdown";

export function Topbar({ role, session, notifications = [], onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/70 md:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            onClick={onToggleSidebar}
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <Breadcrumbs role={role} />
        </div>

        <div className="flex min-w-0 items-center gap-2 md:ml-auto">
          <div className="hidden w-full max-w-md sm:block lg:min-w-[280px]">
            <Input
              placeholder="Search modules, classes, users..."
              aria-label="Global search"
            />
          </div>

          <NotificationBell notifications={notifications} />
          <ThemeToggle />
          <ProfileDropdown session={session} />
        </div>
      </div>
    </header>
  );
}
