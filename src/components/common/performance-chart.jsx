import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../ui/card";

const sample = [
  { month: "Jan", attendance: 82 },
  { month: "Feb", attendance: 84 },
  { month: "Mar", attendance: 88 },
  { month: "Apr", attendance: 86 },
  { month: "May", attendance: 91 },
  { month: "Jun", attendance: 93 },
];

export function PerformanceChart() {
  return (
    <Card className="h-[320px]">
      <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        Attendance Trend
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sample}
          margin={{ top: 16, right: 12, left: -20, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.25)"
          />
          <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#18877d"
            strokeWidth={3}
            dot={{ r: 4, fill: "#18877d" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
