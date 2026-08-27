import { motion } from "framer-motion";
import { Card } from "../ui/card";

export function ModulePlaceholder({ title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </Card>
    </motion.div>
  );
}
