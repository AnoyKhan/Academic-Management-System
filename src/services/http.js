import axios from "axios";

const ACCESS_TOKEN_KEY = "ams-access-token";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
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

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("ams-access-token");
      localStorage.removeItem("ams-refresh-token");
      localStorage.removeItem("ams-session");
    }

    return Promise.reject(error);
  },
);
