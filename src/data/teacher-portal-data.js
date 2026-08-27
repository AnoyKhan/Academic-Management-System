export const teacherDashboardStats = [
  { label: "Active Courses", value: "6", delta: "+2 this term" },
  { label: "Total Students", value: "248", delta: "Across 9 sections" },
  { label: "Pending Assignments", value: "37", delta: "12 urgent reviews" },
  { label: "Average Grade", value: "84%", delta: "+3.2% from last month" },
];

export const teacherCourses = [
  {
    id: "CSE-321",
    title: "Operating Systems",
    section: "A",
    students: 42,
    schedule: "Sun Tue, 10:00 AM",
    room: "Lab 304",
    progress: 72,
    status: "Active",
  },
  {
    id: "CSE-332",
    title: "Database Systems",
    section: "B",
    students: 38,
    schedule: "Mon Wed, 12:00 PM",
    room: "Room 210",
    progress: 64,
    status: "Active",
  },
  {
    id: "CSE-345",
    title: "Software Engineering",
    section: "A",
    students: 44,
    schedule: "Sun Thu, 2:00 PM",
    room: "Room 118",
    progress: 81,
    status: "Active",
  },
  {
    id: "CSE-410",
    title: "Artificial Intelligence",
    section: "C",
    students: 36,
    schedule: "Tue Thu, 9:00 AM",
    room: "AI Lab",
    progress: 58,
    status: "Active",
  },
  {
    id: "CSE-420",
    title: "Computer Networks",
    section: "B",
    students: 47,
    schedule: "Mon Wed, 3:00 PM",
    room: "Room 402",
    progress: 69,
    status: "Active",
  },
  {
    id: "CSE-431",
    title: "Machine Learning",
    section: "A",
    students: 41,
    schedule: "Sun Tue, 4:00 PM",
    room: "Lab 512",
    progress: 76,
    status: "Active",
  },
];

export const teacherAssignments = [
  {
    id: "A-1024",
    title: "Process Scheduling Case Study",
    course: "Operating Systems",
    due: "Jul 15, 2026",
    submissions: 31,
    total: 42,
    status: "Open",
  },
  {
    id: "A-1025",
    title: "ER Diagram and Normalization",
    course: "Database Systems",
    due: "Jul 18, 2026",
    submissions: 29,
    total: 38,
    status: "Open",
  },
  {
    id: "A-1026",
    title: "Sprint Planning Document",
    course: "Software Engineering",
    due: "Jul 21, 2026",
    submissions: 18,
    total: 44,
    status: "Draft",
  },
  {
    id: "A-1027",
    title: "Search Strategy Comparison",
    course: "Artificial Intelligence",
    due: "Jul 12, 2026",
    submissions: 36,
    total: 36,
    status: "Closed",
  },
];

export const teacherSubmissions = [
  {
    id: "S-441",
    student: "Nadia Rahman",
    assignment: "Process Scheduling Case Study",
    course: "Operating Systems",
    submitted: "Jul 10, 2026",
    score: "Pending",
    status: "Needs Review",
  },
  {
    id: "S-442",
    student: "Arif Hasan",
    assignment: "ER Diagram and Normalization",
    course: "Database Systems",
    submitted: "Jul 9, 2026",
    score: "88",
    status: "Reviewed",
  },
  {
    id: "S-443",
    student: "Maliha Chowdhury",
    assignment: "Search Strategy Comparison",
    course: "Artificial Intelligence",
    submitted: "Jul 8, 2026",
    score: "92",
    status: "Reviewed",
  },
  {
    id: "S-444",
    student: "Tahmid Islam",
    assignment: "Process Scheduling Case Study",
    course: "Operating Systems",
    submitted: "Jul 11, 2026",
    score: "Pending",
    status: "Needs Review",
  },
];

export const teacherGrades = [
  { id: "G-1", course: "Operating Systems", average: 82, highest: 97, lowest: 58, pending: 14 },
  { id: "G-2", course: "Database Systems", average: 86, highest: 99, lowest: 64, pending: 8 },
  { id: "G-3", course: "Software Engineering", average: 80, highest: 94, lowest: 61, pending: 11 },
  { id: "G-4", course: "Artificial Intelligence", average: 88, highest: 100, lowest: 70, pending: 4 },
  { id: "G-5", course: "Computer Networks", average: 78, highest: 93, lowest: 55, pending: 9 },
];

export const teacherAttendance = [
  { id: "AT-1", course: "Operating Systems", present: 39, absent: 3, rate: 93 },
  { id: "AT-2", course: "Database Systems", present: 34, absent: 4, rate: 89 },
  { id: "AT-3", course: "Software Engineering", present: 41, absent: 3, rate: 93 },
  { id: "AT-4", course: "Artificial Intelligence", present: 31, absent: 5, rate: 86 },
  { id: "AT-5", course: "Computer Networks", present: 42, absent: 5, rate: 89 },
];

export const teacherMaterials = [
  { id: "M-1", title: "CPU Scheduling Slides", course: "Operating Systems", type: "PDF", size: "3.4 MB", uploaded: "Jul 7, 2026" },
  { id: "M-2", title: "Normalization Worksheet", course: "Database Systems", type: "DOCX", size: "820 KB", uploaded: "Jul 6, 2026" },
  { id: "M-3", title: "UML Starter Template", course: "Software Engineering", type: "ZIP", size: "1.8 MB", uploaded: "Jul 5, 2026" },
  { id: "M-4", title: "Heuristic Search Notes", course: "Artificial Intelligence", type: "PDF", size: "2.1 MB", uploaded: "Jul 3, 2026" },
];

export const submissionTrends = [
  { week: "W1", submitted: 118, late: 14 },
  { week: "W2", submitted: 132, late: 11 },
  { week: "W3", submitted: 125, late: 16 },
  { week: "W4", submitted: 151, late: 9 },
  { week: "W5", submitted: 168, late: 7 },
  { week: "W6", submitted: 174, late: 6 },
];

export const studentPerformance = [
  { course: "OS", average: 82, attendance: 93 },
  { course: "DB", average: 86, attendance: 89 },
  { course: "SE", average: 80, attendance: 93 },
  { course: "AI", average: 88, attendance: 86 },
  { course: "CN", average: 78, attendance: 89 },
  { course: "ML", average: 85, attendance: 91 },
];

export const teacherNotifications = [
  { id: "N-1", title: "Assignment review queue", body: "12 Operating Systems submissions need grading today.", tone: "warning", time: "20 min ago" },
  { id: "N-2", title: "Attendance synced", body: "Database Systems attendance is ready for review.", tone: "success", time: "1 hour ago" },
  { id: "N-3", title: "Material upload completed", body: "CPU Scheduling Slides is visible to Section A.", tone: "success", time: "Yesterday" },
  { id: "N-4", title: "Grade deadline", body: "Midterm grade publishing closes on July 18, 2026.", tone: "danger", time: "Yesterday" },
];

export const teacherProfile = {
  name: "Dr. Samira Karim",
  title: "Associate Professor",
  department: "Computer Science and Engineering",
  email: "samira.karim@ams.edu",
  phone: "+880 1712 345 678",
  office: "Faculty Tower, Room 508",
};
