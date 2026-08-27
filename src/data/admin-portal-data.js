export const adminDashboardCards = [
  { label: "Total Students", value: "4,862", delta: "+312 this semester" },
  { label: "Total Teachers", value: "286", delta: "34 adjunct faculty" },
  { label: "Total Batches", value: "42", delta: "8 active intakes" },
  { label: "Total Departments", value: "12", delta: "3 faculties" },
];

export const enrollmentGrowth = [
  { term: "Spring 2023", students: 3280 },
  { term: "Fall 2023", students: 3560 },
  { term: "Spring 2024", students: 3825 },
  { term: "Fall 2024", students: 4140 },
  { term: "Spring 2025", students: 4475 },
  { term: "Fall 2025", students: 4862 },
];

export const departmentStatistics = [
  { department: "CSE", students: 1180, teachers: 54 },
  { department: "EEE", students: 840, teachers: 41 },
  { department: "BBA", students: 920, teachers: 47 },
  { department: "English", students: 410, teachers: 22 },
  { department: "Economics", students: 365, teachers: 20 },
  { department: "Civil", students: 610, teachers: 35 },
];

export const assignmentActivity = [
  { month: "Jan", created: 96, submitted: 2680, graded: 2440 },
  { month: "Feb", created: 112, submitted: 3025, graded: 2810 },
  { month: "Mar", created: 128, submitted: 3490, graded: 3185 },
  { month: "Apr", created: 119, submitted: 3310, graded: 3100 },
  { month: "May", created: 143, submitted: 3895, graded: 3610 },
  { month: "Jun", created: 151, submitted: 4210, graded: 3975 },
];

export const intakes = [
  { id: "INT-2026-F", name: "Fall 2026", applications: 1840, admitted: 920, waitlisted: 180, status: "Open" },
  { id: "INT-2026-S", name: "Spring 2026", applications: 1520, admitted: 810, waitlisted: 95, status: "Closed" },
  { id: "INT-2025-F", name: "Fall 2025", applications: 1715, admitted: 875, waitlisted: 120, status: "Archived" },
];

export const batches = [
  { id: "B-61", name: "CSE 61", department: "Computer Science", students: 168, advisor: "Dr. Samira Karim", year: "2026" },
  { id: "B-60", name: "EEE 60", department: "Electrical Engineering", students: 142, advisor: "Prof. Mahmud Rahman", year: "2026" },
  { id: "B-59", name: "BBA 59", department: "Business Administration", students: 188, advisor: "Dr. Farhana Ahmed", year: "2025" },
  { id: "B-58", name: "Civil 58", department: "Civil Engineering", students: 126, advisor: "Engr. Tareq Hasan", year: "2025" },
];

export const teachers = [
  { id: "T-1001", name: "Dr. Samira Karim", department: "CSE", courses: 4, status: "Active" },
  { id: "T-1002", name: "Prof. Mahmud Rahman", department: "EEE", courses: 3, status: "Active" },
  { id: "T-1003", name: "Dr. Farhana Ahmed", department: "BBA", courses: 5, status: "Active" },
  { id: "T-1004", name: "Nusrat Jahan", department: "English", courses: 2, status: "On Leave" },
];

export const students = [
  { id: "S-2026-0142", name: "Nadia Rahman", department: "CSE", batch: "CSE 61", cgpa: 3.82, status: "Active" },
  { id: "S-2026-0188", name: "Arif Hasan", department: "EEE", batch: "EEE 60", cgpa: 3.64, status: "Active" },
  { id: "S-2025-0771", name: "Maliha Chowdhury", department: "BBA", batch: "BBA 59", cgpa: 3.71, status: "Active" },
  { id: "S-2025-0832", name: "Tahmid Islam", department: "Civil", batch: "Civil 58", cgpa: 3.28, status: "Probation" },
];

export const courses = [
  { id: "CSE-321", title: "Operating Systems", department: "CSE", credits: 3, teacher: "Dr. Samira Karim", status: "Running" },
  { id: "EEE-212", title: "Circuit Analysis", department: "EEE", credits: 4, teacher: "Prof. Mahmud Rahman", status: "Running" },
  { id: "BBA-305", title: "Marketing Analytics", department: "BBA", credits: 3, teacher: "Dr. Farhana Ahmed", status: "Running" },
  { id: "CIV-220", title: "Structural Mechanics", department: "Civil", credits: 3, teacher: "Engr. Tareq Hasan", status: "Scheduled" },
];

export const departments = [
  { id: "D-01", name: "Computer Science and Engineering", short: "CSE", students: 1180, teachers: 54, head: "Dr. Samira Karim" },
  { id: "D-02", name: "Electrical and Electronic Engineering", short: "EEE", students: 840, teachers: 41, head: "Prof. Mahmud Rahman" },
  { id: "D-03", name: "Business Administration", short: "BBA", students: 920, teachers: 47, head: "Dr. Farhana Ahmed" },
  { id: "D-04", name: "Civil Engineering", short: "Civil", students: 610, teachers: 35, head: "Engr. Tareq Hasan" },
];

export const academicCalendar = [
  { id: "AC-1", date: "Jul 15, 2026", title: "Fall 2026 admission test", type: "Admission" },
  { id: "AC-2", date: "Jul 21, 2026", title: "Midterm grade publication", type: "Academic" },
  { id: "AC-3", date: "Aug 3, 2026", title: "Course registration opens", type: "Registration" },
  { id: "AC-4", date: "Aug 18, 2026", title: "Faculty development workshop", type: "Faculty" },
];

export const systemSettings = [
  { id: "SS-1", name: "Online registration", value: "Enabled", owner: "Registrar" },
  { id: "SS-2", name: "Grade publishing approval", value: "Department Head", owner: "Academic Office" },
  { id: "SS-3", name: "Attendance threshold", value: "75%", owner: "Controller" },
  { id: "SS-4", name: "Email notifications", value: "Enabled", owner: "IT Office" },
];

export const reports = [
  { id: "R-1", title: "Semester Enrollment Summary", category: "Admissions", generated: "Jul 9, 2026", status: "Ready" },
  { id: "R-2", title: "Department Load Analysis", category: "Academic", generated: "Jul 8, 2026", status: "Ready" },
  { id: "R-3", title: "Assignment Completion Audit", category: "Assessment", generated: "Jul 7, 2026", status: "Review" },
  { id: "R-4", title: "Faculty Course Allocation", category: "HR", generated: "Jul 6, 2026", status: "Ready" },
];
