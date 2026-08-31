import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sidebar } from "../components/layout/sidebar";
import { Topbar } from "../components/layout/topbar";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { setMobileMenu, toggleMobileMenu } from "../store/slices/uiSlice";
import { authService } from "../services/auth.service";
import { adminService } from "../services/admin.service";
import { studentService } from "../services/student.service";
import { teacherService } from "../services/teacher.service";

export function DashboardLayout({ role = "student" }) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const mobileMenuOpen = useAppSelector((state) => state.ui.mobileMenuOpen);
  const session = authService.getSession();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const service = {
      admin: adminService,
      student: studentService,
      teacher: teacherService,
    }[role];

    if (!service) {
      setNotifications([]);
      return undefined;
    }

    let isMounted = true;
    service
      .getNotifications()
      .then((response) => {
        if (!isMounted) return;
        const payload = service.unwrapData(response);
        const records = Array.isArray(payload)
          ? payload
          : (payload?.results ?? []);
        setNotifications(
          records
            .filter((item) => !item.is_read)
            .map((item) => `${item.title}: ${item.message}`),
        );
      })
      .catch(() => {
        if (isMounted) setNotifications([]);
      });

    return () => {
      isMounted = false;
    };
  }, [role]);

  return (
    <div className="min-h-screen bg-app-gradient text-slate-900 dark:text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-700 focus:shadow-xl dark:focus:bg-slate-900"
      >
        Skip to main content
      </a>
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar role={role} />
        </div>

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <button
                type="button"
                className="absolute inset-0 bg-slate-950/50"
                onClick={() => dispatch(setMobileMenu(false))}
                aria-label="Close mobile sidebar"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 290, damping: 30 }}
                className="relative z-10 h-full w-72"
              >
                <Sidebar
                  role={role}
                  mobile
                  onNavigate={() => dispatch(setMobileMenu(false))}
                />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            role={role}
            session={session}
            notifications={notifications}
            onToggleSidebar={() => dispatch(toggleMobileMenu())}
          />

          <main id="main-content" className="flex-1 p-4 md:p-6" tabIndex={-1}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="mx-auto w-full max-w-7xl"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
