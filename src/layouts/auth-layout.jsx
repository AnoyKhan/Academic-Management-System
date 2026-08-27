import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "../components/common/theme-toggle";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-app-gradient p-4 md:p-8">
      <div className="mx-auto flex w-full max-w-6xl items-start justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white/85 px-3 py-2 text-sm font-semibold text-slate-800 shadow-soft backdrop-blur-sm dark:bg-slate-900/75 dark:text-slate-100"
        >
          <GraduationCap className="h-4 w-4 text-brand-600" />
          AMS Frontend
        </Link>

        <ThemeToggle />
      </div>

      <div className="mx-auto mt-10 grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr,1fr] lg:items-center">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden rounded-3xl border border-white/70 bg-white/75 p-8 shadow-soft backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60 lg:block"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
            Academic Management System
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
            Secure role-based access for your campus workflows.
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            This module uses dummy data only. You can test Student, Teacher, and
            Admin authentication flows, including registration and password
            reset, with responsive screens and dark mode support.
          </p>
        </motion.section>

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
