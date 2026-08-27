import { DEFAULT_AUTH_USERS } from "../data/dummy-auth";
import { ROUTE_PATHS } from "../routes/route-paths";

const USERS_KEY = "ams-dummy-users";
const RESET_KEY = "ams-dummy-reset-tokens";
const SESSION_KEY = "ams-session";

const wait = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms));

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  const users = readJson(USERS_KEY, null);
  if (Array.isArray(users)) {
    return users;
  }

  writeJson(USERS_KEY, DEFAULT_AUTH_USERS);
  return DEFAULT_AUTH_USERS;
}

function setUsers(users) {
  writeJson(USERS_KEY, users);
}

function getResetTokens() {
  return readJson(RESET_KEY, {});
}

function setResetTokens(tokens) {
  writeJson(RESET_KEY, tokens);
}

export const dummyAuthService = {
  async login(payload) {
    await wait();
    const users = getUsers();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === payload.email.toLowerCase() &&
        item.password === payload.password &&
        item.role === payload.role,
    );

    if (!user) {
      throw new Error("Invalid email, password, or role.");
    }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      loggedInAt: new Date().toISOString(),
    };

    writeJson(SESSION_KEY, session);
    return session;
  },

  async register(payload) {
    await wait();
    const users = getUsers();

    const exists = users.some(
      (item) => item.email.toLowerCase() === payload.email.toLowerCase(),
    );

    if (exists) {
      throw new Error("This email is already registered.");
    }

    const user = {
      id: `u-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      password: payload.password,
    };

    setUsers([...users, user]);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },

  async requestReset(payload) {
    await wait();
    const users = getUsers();
    const user = users.find(
      (item) => item.email.toLowerCase() === payload.email.toLowerCase(),
    );

    if (!user) {
      throw new Error("No account found with this email.");
    }

    const token = `AMS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const tokens = getResetTokens();

    tokens[payload.email.toLowerCase()] = token;
    setResetTokens(tokens);

    return { token };
  },

  async resetPassword(payload) {
    await wait();
    const users = getUsers();
    const tokens = getResetTokens();
    const emailKey = payload.email.toLowerCase();

    if (tokens[emailKey] !== payload.token) {
      throw new Error("Invalid reset token for this email.");
    }

    const index = users.findIndex(
      (item) => item.email.toLowerCase() === emailKey,
    );

    if (index === -1) {
      throw new Error("No account found for this email.");
    }

    users[index] = {
      ...users[index],
      password: payload.newPassword,
    };

    setUsers(users);
    delete tokens[emailKey];
    setResetTokens(tokens);
    return { success: true };
  },

  getSession() {
    return readJson(SESSION_KEY, null);
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getDashboardPath(role) {
    if (role === "teacher") {
      return ROUTE_PATHS.teacher;
    }

    if (role === "admin") {
      return ROUTE_PATHS.admin;
    }

    return ROUTE_PATHS.student;
  },
};
