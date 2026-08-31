import { http } from "./http";

const SESSION_KEY = "ams-session";
const ACCESS_TOKEN_KEY = "ams-access-token";
const REFRESH_TOKEN_KEY = "ams-refresh-token";

const normalizeRole = (value) => String(value ?? "student").toLowerCase();

const readSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const authService = {
  async login(payload) {
    const { data } = await http.post("/auth/login/", {
      email: payload.email,
      password: payload.password,
    });

    const authData = data?.data ?? data;
    const user = authData.user ?? {};
    const normalizedRole = normalizeRole(user.role);
    const session = {
      id: user.id ?? null,
      name:
        user.name ||
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        payload.email.split("@")[0] ||
        "User",
      email: user.email ?? payload.email,
      role: normalizedRole,
      accessToken: authData.access,
      refreshToken: authData.refresh,
      loggedInAt: new Date().toISOString(),
    };

    if (authData.access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, authData.access);
    }

    if (authData.refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, authData.refresh);
    }

    writeSession(session);
    return session;
  },

  async register(payload) {
    const nameParts = (payload.name ?? "").trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts.shift() ?? "Student";
    const lastName = nameParts.join(" ");
    const emailPrefix = (payload.email ?? "student").split("@")[0];

    const response = await http.post("/auth/register/", {
      username: `${emailPrefix}-${Date.now().toString().slice(-6)}`,
      email: payload.email,
      first_name: firstName,
      last_name: lastName,
      phone: payload.phone ?? "",
      password: payload.password,
      password2: payload.confirmPassword ?? payload.password,
      role: "STUDENT",
    });

    const userData = response?.data?.data?.user ?? response?.data?.user ?? {};
    return {
      id: userData.id,
      name: userData.name ?? payload.name,
      email: userData.email ?? payload.email,
      role: normalizeRole(userData.role ?? "student"),
    };
  },

  async logout() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    try {
      if (refreshToken) {
        await http.post("/auth/logout/", { refresh: refreshToken });
      }
    } catch {
      // Ignore logout failures and clear the local session anyway.
    }

    clearSession();
    return true;
  },

  getSession() {
    return readSession();
  },

  getDashboardPath(role) {
    const normalizedRole = normalizeRole(role);

    if (normalizedRole === "teacher") {
      return "/teacher";
    }

    if (normalizedRole === "admin") {
      return "/admin";
    }

    return "/student";
  },
};
