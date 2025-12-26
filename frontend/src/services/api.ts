import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { useAuthStore } from "../stores/index";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json"
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器：添加 Token
    this.api.interceptors.request.use(
      (config) => {
        const authStore = useAuthStore();
        if (authStore.token) {
          config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器：处理 Token 刷新和错误
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const authStore = useAuthStore();
          // TODO: 实现 Token 刷新逻辑（需要 Keycloak 支持）
          // 目前先清除认证信息，让用户重新登录
          authStore.clear();
          
          // 重定向到登录页
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.api;
  }
}

export const apiService = new ApiService();
export default apiService.instance;

