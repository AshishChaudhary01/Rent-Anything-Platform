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
      originalConfig.url === "/auth/login";

    if (
      error.response?.status === 401 &&
      !originalConfig._retry &&
      !isAuthRoute
    ) {
      originalConfig._retry = true;

      try {
        const { data } = await axios.post(
          "/auth/refresh",
          {},
          { withCredentials: true },
        );

        const { setAuth, role, userId, isActive } = useAuthStore.getState();
        setAuth(
          data.data.access_token,
          role ?? data.data.role,
          userId ?? data.data.userId,
          isActive ?? data.data.isActive,
        );
        originalConfig.headers["Authorization"] = `Bearer ${data.accessToken}`;

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
