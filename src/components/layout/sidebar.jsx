import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { School } from "lucide-react";
import { ROLE_META, ROLE_NAV_LINKS } from "../../data/role-dashboard";
import { cn } from "../../utils/cn";

export function Sidebar({ role = "student", mobile = false, onNavigate }) {
  const { pathname } = useLocation();
  const links = ROLE_NAV_LINKS[role] ?? [];
  const roleLabel = ROLE_META[role]?.label ?? "Dashboard";

  return (
    <aside className="h-full w-72 border-r border-slate-200 bg-white/90 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90 md:w-72">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
          <School className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            AMS
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {roleLabel} Workspace
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((item, index) => {
          const active =
            pathname === item.path || pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                to={item.path}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {mobile ? null : (
        <div className="mt-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-sm text-white">
          <p className="font-semibold">{roleLabel} Console</p>
          <p className="mt-1 text-brand-100">Live data from the AMS backend.</p>
        </div>
      )}
    </aside>
  );
}
