import { useEffect } from "react";
import { privateApi } from "./clients";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useTranslation } from "react-i18next";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleLogoutCleanup = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.error(t("toastMessages.sessionExpiredMessage"));
      navigate("/register-login", { replace: true });
    };

    const responseInterceptor = privateApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (
            originalRequest.url?.includes("/auth/sign-in") ||
            originalRequest.url?.includes("/auth/sign-up")
          ) {
            return Promise.reject(error);
          }

          if (originalRequest.url?.includes("/auth/refresh")) {
            isRefreshing = false;
            handleLogoutCleanup();
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return privateApi(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const storedRefreshToken = localStorage.getItem("refreshToken");
            if (!storedRefreshToken) {
              throw new Error("No refresh token available");
            }
            const { data } = await refreshClient.post("/auth/refresh", {
              refreshToken: storedRefreshToken,
            });
            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            processQueue(null, newAccessToken);

            originalRequest.headers["Authorization"] =
              `Bearer ${newAccessToken}`;
            return privateApi(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            handleLogoutCleanup();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      },
    );

    return () => privateApi.interceptors.response.eject(responseInterceptor);
  }, [navigate, t]);

  return children;
};

export default AxiosInterceptor;
