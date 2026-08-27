export const studentDashboardMetrics = {
  gpa: 3.78,
  attendance: 91.4,
  assignmentsDue: 3,
  courseCount: 6,
};

export const gpaTrendData = [
  { term: "Fall 24", gpa: 3.42 },
  { term: "Spring 25", gpa: 3.51 },
  { term: "Summer 25", gpa: 3.63 },
  { term: "Fall 25", gpa: 3.7 },
  { term: "Spring 26", gpa: 3.78 },
];

export const attendanceTrendData = [
  { week: "W1", attendance: 88 },
  { week: "W2", attendance: 90 },
  { week: "W3", attendance: 92 },
  { week: "W4", attendance: 87 },
  { week: "W5", attendance: 94 },
  { week: "W6", attendance: 91 },
  { week: "W7", attendance: 93 },
  { week: "W8", attendance: 96 },
];

export const studentCourses = [
  {
    id: "CSE-331",
    title: "Operating Systems",
    instructor: "Sharif Uddin",
    credit: 3,
    schedule: "Sun, Tue 10:30 AM",
    progress: 72,
  },
  {
    id: "CSE-341",
    title: "Computer Networks",
    instructor: "Nafisa Karim",
    credit: 3,
    schedule: "Mon, Wed 01:00 PM",
    progress: 65,
  },
  {
    id: "CSE-351",
    title: "Software Engineering",
    instructor: "Anika Rahman",
    credit: 3,
    schedule: "Sun, Tue 12:15 PM",
    progress: 81,
  },
  {
    id: "MAT-321",
    title: "Numerical Methods",
    instructor: "Tarek Ahmed",
    credit: 3,
    schedule: "Mon, Thu 09:00 AM",
    progress: 69,
  },
  {
    id: "EEE-303",
    title: "Digital Electronics",
    instructor: "Sadia Hossain",
    credit: 3,
    schedule: "Tue, Thu 03:00 PM",
    progress: 74,
  },
  {
    id: "ENG-211",
    title: "Technical Writing",
    instructor: "Rifat Chowdhury",
    credit: 2,
    schedule: "Wed 11:00 AM",
    progress: 88,
  },
];

export const studentGrades = [
  {
    id: "g-1",
    course: "Operating Systems",
    quiz: 16,
    mid: 26,
    final: 40,
    total: 82,
    letter: "A-",
  },
  {
    id: "g-2",
    course: "Computer Networks",
    quiz: 17,
    mid: 24,
    final: 38,
    total: 79,
    letter: "B+",
  },
  {
    id: "g-3",
    course: "Software Engineering",
    quiz: 18,
    mid: 27,
    final: 42,
    total: 87,
    letter: "A",
  },
  {
    id: "g-4",
    course: "Numerical Methods",
    quiz: 15,
    mid: 25,
    final: 37,
    total: 77,
    letter: "B+",
  },
];

export const studentAttendance = [
  {
    id: "a-1",
    course: "Operating Systems",
    present: 21,
    total: 24,
    percentage: 87.5,
    status: "Needs attention",
  },
  {
    id: "a-2",
    course: "Computer Networks",
    present: 23,
    total: 24,
    percentage: 95.8,
    status: "Excellent",
  },
  {
    id: "a-3",
    course: "Software Engineering",
    present: 22,
    total: 24,
    percentage: 91.6,
    status: "Good",
  },
  {
    id: "a-4",
    course: "Numerical Methods",
    present: 20,
    total: 24,
    percentage: 83.3,
    status: "Needs attention",
  },
];

export const assignmentItems = [
  {
    id: "asn-101",
    title: "Process Scheduling Simulation",
    course: "Operating Systems",
    dueDate: "2026-07-12",
    points: 15,
    status: "Pending",
    priority: "High",
    description:
      "Implement FCFS, SJF, and Round Robin scheduling in a comparative simulation report.",
  },
  {
    id: "asn-102",
    title: "Network Topology Case Study",
    course: "Computer Networks",
    dueDate: "2026-07-14",
    points: 10,
    status: "Submitted",
    priority: "Medium",
    description:
      "Analyze a medium-scale enterprise topology and justify protocol selection.",
  },
  {
    id: "asn-103",
    title: "UML for Library Management",
    course: "Software Engineering",
    dueDate: "2026-07-18",
    points: 20,
    status: "Pending",
    priority: "High",
    description:
      "Design use case, activity, and class diagrams for the given requirements.",
  },
  {
    id: "asn-104",
    title: "Root Finding Methods",
    course: "Numerical Methods",
    dueDate: "2026-07-20",
    points: 10,
    status: "Pending",
    priority: "Low",
    description:
      "Compare bisection and Newton-Raphson methods on three nonlinear equations.",
  },
];

export const studentNotifications = [
  {
    id: "n-1",
    title: "Assignment Deadline Reminder",
    message: "Process Scheduling Simulation due in 3 days.",
    time: "2 hours ago",
    type: "warning",
  },
  {
    id: "n-2",
    title: "New Grade Published",
    message: "Software Engineering midterm grade has been posted.",
    time: "Yesterday",
    type: "success",
  },
  {
    id: "n-3",
    title: "Attendance Alert",
    message: "Operating Systems attendance dropped below 90%.",
    time: "2 days ago",
    type: "danger",
  },
  {
    id: "n-4",
    title: "Schedule Update",
    message: "Computer Networks class moved to Room 410.",
    time: "3 days ago",
    type: "neutral",
  },
];

export const academicProgress = [
  { id: "p-1", category: "Core Completion", value: 76 },
  { id: "p-2", category: "Credit Completion", value: 68 },
  { id: "p-3", category: "Project Milestones", value: 58 },
  { id: "p-4", category: "Certification Track", value: 44 },
];

export const studentProfile = {
  studentId: "2022-1-60-311",
  name: "Nadia Student",
  email: "student@ams.dev",
  phone: "+880 1712-345678",
  department: "Computer Science and Engineering",
  semester: "8th Semester",
  guardianName: "Mahmud Hasan",
  guardianPhone: "+880 1811-123456",
  address: "House 14, Road 3, Uttara, Dhaka",
};
