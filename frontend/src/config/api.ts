import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) config.headers["Authorization"] = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalConfig = error.config;

    const isAuthRoute =
      originalConfig.url === "/auth/register" ||
      originalConfig.url === "/auth/login" ||
      originalConfig.url === "/auth/refresh" ||
      originalConfig.url === "/auth/logout";

    if (
      error.response?.status === 401 &&
      !originalConfig._retry &&
      !isAuthRoute
    ) {
      if (!useAuthStore.getState().accessToken) {
        return Promise.reject(error);
      }
      originalConfig._retry = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { setAuth } = useAuthStore.getState();
        setAuth(data.accessKey, data.role, data.userId, data.isActive);
        originalConfig.headers["Authorization"] = `Bearer ${data.accessKey}`;

        return api(originalConfig);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { api };
