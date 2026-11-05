import axios from "axios";

const ACCESS_TOKEN_KEY = "ams-access-token";
const REFRESH_TOKEN_KEY = "ams-refresh-token";
const SESSION_KEY = "ams-session";
const REFRESH_ENDPOINT = "/auth/token/refresh/";

let refreshPromise = null;

export const http = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? "/api" : ""),
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["X-Requested-With"] = "AMS-Frontend";

  return config;
});

const clearAuthState = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
};

const isAuthEndpoint = (url = "") =>
  url.includes("/auth/login/") || url.includes(REFRESH_ENDPOINT);

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error("No refresh token is available.");
  }

  const response = await axios.post(
    `${http.defaults.baseURL}${REFRESH_ENDPOINT}`,
    { refresh: refreshToken },
    { headers: { "X-Requested-With": "AMS-Frontend" } },
  );
  const authData = response?.data?.data ?? response?.data ?? {};
  if (!authData.access) {
    throw new Error("The refresh response did not contain an access token.");
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, authData.access);
  if (authData.refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, authData.refresh);
  }

  const session = localStorage.getItem(SESSION_KEY);
  if (session) {
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          ...JSON.parse(session),
          accessToken: authData.access,
        }),
      );
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  return authData.access;
};

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (
      error?.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      if (
        error?.response?.status === 401 &&
        isAuthEndpoint(originalRequest?.url)
      ) {
        clearAuthState();
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const accessToken = await refreshPromise;
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return http(originalRequest);
    } catch (refreshError) {
      clearAuthState();
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/auth/login"
      ) {
        window.location.assign("/auth/login");
      }
      return Promise.reject(refreshError);
    }
  },
);
