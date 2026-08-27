export const AUTH_ROLES = {
  student: "student",
  teacher: "teacher",
  admin: "admin",
};

export const AUTH_ROLE_OPTIONS = [
  { label: "Student", value: AUTH_ROLES.student },
  { label: "Teacher", value: AUTH_ROLES.teacher },
  { label: "Admin", value: AUTH_ROLES.admin },
];

export const DEFAULT_AUTH_USERS = [
  {
    id: "u-std-1",
    name: "Nadia Student",
    email: "student@ams.dev",
    role: AUTH_ROLES.student,
    password: "Password123!",
  },
  {
    id: "u-tea-1",
    name: "Arif Teacher",
    email: "teacher@ams.dev",
    role: AUTH_ROLES.teacher,
    password: "Password123!",
  },
  {
    id: "u-adm-1",
    name: "Sadia Admin",
    email: "admin@ams.dev",
    role: AUTH_ROLES.admin,
    password: "Password123!",
  },
];
