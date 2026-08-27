import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";

export function Modal({ isOpen, title, children, onClose, footer }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close dialog</span>
              </Button>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-300">
              {children}
            </div>

            <div className="mt-6 flex justify-end gap-3">{footer}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
