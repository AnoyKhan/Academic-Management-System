import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Gauge,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Table } from "../../components/ui/table";
import {
  aiAnalyticsWidgets,
  aiRecommendations,
  attendanceAnalytics,
  classPerformance,
  earlyWarningAlerts,
  performanceInsights,
  performanceTrend,
  riskDistribution,
  studentRiskPredictions,
} from "../../data/ai-analytics-data";

const widgetIcons = [AlertTriangle, TrendingUp, CheckCircle2, Gauge];

function riskTone(value) {
  if (value >= 85) return "danger";
  if (value >= 70) return "warning";
  return "success";
}

function severityTone(value) {
  if (value === "Critical") return "danger";
  if (value === "Warning") return "warning";
  return "success";
}

export function AdminAIAnalyticsPage() {
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-slate-200 bg-slate-950 p-0 text-white dark:border-slate-700">
        <div className="grid gap-6 p-5 lg:grid-cols-[1.3fr_0.7fr] lg:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-teal-400/15 text-teal-100">AI model v4.2</Badge>
              <Badge className="bg-blue-400/15 text-blue-100">Updated 8 min ago</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              AI Analytics Dashboard
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-300">
              Predictive student risk, performance insights, early warning alerts, and class-level intervention intelligence from mock AI-generated data.
            </p>
          </div>
          <div className="grid content-end gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Select className="border-slate-700 bg-slate-900 text-white" defaultValue="fall">
              <option value="fall">Fall 2026</option>
              <option value="spring">Spring 2026</option>
            </Select>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <BrainCircuit className="h-4 w-4" />
              Run Forecast
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {aiAnalyticsWidgets.map((widget, index) => {
          const Icon = widgetIcons[index];

          return (
            <Card key={widget.label} className="border-l-4 border-l-teal-500">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {widget.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
                    {widget.value}
                  </p>
                  <Badge tone={widget.tone} className="mt-3">
                    {widget.change}
                  </Badge>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-teal-300 dark:bg-slate-800">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="h-96">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Performance Trend
              </h2>
              <p className="mt-1 text-xs text-slate-500">GPA, assignment completion, and engagement forecast</p>
            </div>
            <Badge>Predictive</Badge>
          </div>
          <ResponsiveContainer width="100%" height="82%">
            <LineChart data={performanceTrend} margin={{ top: 18, right: 12, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="gpa" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="completion" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-96">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Risk Distribution
          </h2>
          <ResponsiveContainer width="100%" height="74%">
            <PieChart>
              <Pie
                data={riskDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={68}
                outerRadius={108}
                paddingAngle={4}
              >
                {riskDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2">
            {riskDistribution.map((item) => (
              <div key={item.name} className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                <p className="text-xs text-slate-500">{item.name}</p>
                <p className="mt-1 font-bold text-slate-950 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="h-96">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Attendance Analytics
          </h2>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={attendanceAnalytics} margin={{ top: 18, right: 12, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="department" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="present" stackId="a" fill="#14b8a6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="late" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="absent" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student Risk Prediction
            </h2>
            <Badge tone="warning">128 flagged</Badge>
          </div>
          <div className="mt-4">
            <Table
              columns={[
                { key: "student", header: "Student" },
                { key: "department", header: "Dept." },
                { key: "risk", header: "Risk", render: (value) => <Badge tone={riskTone(value)}>{value}%</Badge> },
                { key: "factors", header: "AI Factors" },
                { key: "intervention", header: "Action" },
              ]}
              data={studentRiskPredictions}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            Performance Insights
          </h2>
          <div className="mt-4 space-y-3">
            {performanceInsights.map((insight) => (
              <div key={insight.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{insight.title}</h3>
                  <Badge tone="success">{insight.confidence}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{insight.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            AI Recommendations
          </h2>
          <div className="mt-4 space-y-3">
            {aiRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge tone={recommendation.priority === "High" ? "danger" : "warning"}>
                    {recommendation.priority}
                  </Badge>
                  <span className="text-xs font-semibold text-teal-600">{recommendation.impact}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{recommendation.action}</p>
                <p className="mt-1 text-xs text-slate-500">{recommendation.owner}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            Early Warning Alerts
          </h2>
          <div className="mt-4 space-y-3">
            {earlyWarningAlerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge tone={severityTone(alert.severity)}>{alert.severity}</Badge>
                  <span className="text-xs text-slate-500">{alert.time}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{alert.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{alert.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Class Performance Analysis
            </h2>
            <p className="mt-1 text-xs text-slate-500">Class-level GPA, attendance, completion, and risk index</p>
          </div>
          <Button size="sm" variant="secondary">
            <ArrowUpRight className="h-4 w-4" />
            Drill Down
          </Button>
        </div>
        <Table
          columns={[
            { key: "class", header: "Class" },
            { key: "gpa", header: "GPA" },
            { key: "attendance", header: "Attendance", render: (value) => `${value}%` },
            { key: "completion", header: "Completion", render: (value) => `${value}%` },
            { key: "risk", header: "Risk Index", render: (value) => <Badge tone={riskTone(value + 45)}>{value}</Badge> },
          ]}
          data={classPerformance}
        />
      </Card>
    </div>
  );
}
