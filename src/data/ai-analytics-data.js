export const aiAnalyticsWidgets = [
  {
    label: "At Risk Students",
    value: "128",
    change: "-14 vs last week",
    tone: "danger",
  },
  {
    label: "Average GPA",
    value: "3.42",
    change: "+0.08 this term",
    tone: "success",
  },
  {
    label: "Assignment Completion Rate",
    value: "87.6%",
    change: "+4.1% in 30 days",
    tone: "success",
  },
  {
    label: "Attendance Health",
    value: "91.2%",
    change: "Stable forecast",
    tone: "neutral",
  },
];

export const performanceTrend = [
  { week: "W1", gpa: 3.18, completion: 76, engagement: 69 },
  { week: "W2", gpa: 3.21, completion: 79, engagement: 72 },
  { week: "W3", gpa: 3.24, completion: 82, engagement: 75 },
  { week: "W4", gpa: 3.31, completion: 84, engagement: 78 },
  { week: "W5", gpa: 3.38, completion: 86, engagement: 81 },
  { week: "W6", gpa: 3.42, completion: 88, engagement: 83 },
];

export const riskDistribution = [
  { name: "Low", value: 2350, fill: "#14b8a6" },
  { name: "Medium", value: 610, fill: "#f59e0b" },
  { name: "High", value: 128, fill: "#ef4444" },
];

export const attendanceAnalytics = [
  { department: "CSE", present: 93, late: 5, absent: 2 },
  { department: "EEE", present: 89, late: 7, absent: 4 },
  { department: "BBA", present: 91, late: 6, absent: 3 },
  { department: "Civil", present: 86, late: 8, absent: 6 },
  { department: "English", present: 94, late: 4, absent: 2 },
  { department: "Economics", present: 88, late: 7, absent: 5 },
];

export const studentRiskPredictions = [
  {
    id: "AI-R-1041",
    student: "Tahmid Islam",
    department: "Civil",
    risk: 92,
    factors: "Attendance drop, late submissions, GPA decline",
    intervention: "Advisor meeting within 48 hours",
  },
  {
    id: "AI-R-1042",
    student: "Sadia Akter",
    department: "EEE",
    risk: 84,
    factors: "Low quiz score, reduced LMS activity",
    intervention: "Targeted tutorial group",
  },
  {
    id: "AI-R-1043",
    student: "Rafi Chowdhury",
    department: "CSE",
    risk: 78,
    factors: "Missed lab, weak assignment trend",
    intervention: "Lab makeup and mentor check-in",
  },
  {
    id: "AI-R-1044",
    student: "Mim Rahman",
    department: "BBA",
    risk: 71,
    factors: "Midterm variance, poor attendance streak",
    intervention: "Attendance recovery plan",
  },
];

export const performanceInsights = [
  {
    id: "PI-1",
    title: "CSE engagement is improving",
    detail: "Predicted course engagement increased 11% after lab material uploads.",
    confidence: "94%",
  },
  {
    id: "PI-2",
    title: "Civil attendance needs intervention",
    detail: "Civil Engineering has the highest absence cluster over the last 14 days.",
    confidence: "89%",
  },
  {
    id: "PI-3",
    title: "Assignment completion is leading GPA",
    detail: "Students above 90% completion are projected to average 3.61 GPA.",
    confidence: "91%",
  },
];

export const aiRecommendations = [
  {
    id: "REC-1",
    priority: "High",
    action: "Create recovery cohort for 32 students with GPA below 2.75.",
    owner: "Academic Advisors",
    impact: "+8% retention probability",
  },
  {
    id: "REC-2",
    priority: "Medium",
    action: "Send personalized assignment reminders to sections with completion below 80%.",
    owner: "Course Teachers",
    impact: "+5% submission lift",
  },
  {
    id: "REC-3",
    priority: "Medium",
    action: "Schedule extra problem-solving sessions for EEE and Civil first-year batches.",
    owner: "Department Heads",
    impact: "-12% high-risk cases",
  },
];

export const earlyWarningAlerts = [
  {
    id: "EW-1",
    title: "High-risk cluster detected",
    body: "18 Civil students crossed the risk threshold after consecutive absences.",
    severity: "Critical",
    time: "Today, 10:20 AM",
  },
  {
    id: "EW-2",
    title: "Assignment completion anomaly",
    body: "EEE 60 completion rate is 17% below its projected baseline.",
    severity: "Warning",
    time: "Today, 9:05 AM",
  },
  {
    id: "EW-3",
    title: "Positive momentum",
    body: "CSE first-year GPA forecast improved after remedial lab sessions.",
    severity: "Info",
    time: "Yesterday",
  },
];

export const classPerformance = [
  { id: "CP-1", class: "CSE 61", gpa: 3.56, attendance: 93, completion: 91, risk: 18 },
  { id: "CP-2", class: "EEE 60", gpa: 3.28, attendance: 89, completion: 79, risk: 34 },
  { id: "CP-3", class: "BBA 59", gpa: 3.44, attendance: 91, completion: 86, risk: 22 },
  { id: "CP-4", class: "Civil 58", gpa: 3.12, attendance: 86, completion: 74, risk: 41 },
  { id: "CP-5", class: "English 57", gpa: 3.62, attendance: 94, completion: 90, risk: 12 },
];
