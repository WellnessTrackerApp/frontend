import axios from "axios";
import i18n from "./utils/i18n/index";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const commonConfig = {
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

export const publicApi = axios.create(commonConfig);
export const privateApi = axios.create(commonConfig);

privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Accept-Language"] = i18n.language || "en";
  return config;
});

publicApi.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = i18n.language || "en";
  return config;
});
