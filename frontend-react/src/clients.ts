import axios from "axios";
import i18n from "./utils/i18n/index";

const BASE_URL_GYM =
  import.meta.env.VITE_GYM_API_URL || "http://localhost:8080";
const BASE_URL_HEALTH =
  import.meta.env.VITE_HEALTH_API_URL || "http://localhost:8081";

const commonConfigGym = {
  baseURL: BASE_URL_GYM,
  headers: {
    "Content-Type": "application/json",
  },
};

const commonConfigHealth = {
  baseURL: BASE_URL_HEALTH,
  headers: {
    "Content-Type": "application/json",
  },
};

export const gymPublicApi = axios.create(commonConfigGym);
export const gymPrivateApi = axios.create(commonConfigGym);
export const healthPublicApi = axios.create(commonConfigHealth);
export const healthPrivateApi = axios.create(commonConfigHealth);

gymPrivateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Accept-Language"] = i18n.language || "en";
  return config;
});

gymPublicApi.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = i18n.language || "en";
  return config;
});

healthPrivateApi.interceptors.request.use((config) => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  if (username && password) {
    const token = btoa(`${username}:${password}`);
    config.headers.Authorization = `Basic ${token}`;
  }
  return config;
});
