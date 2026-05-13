import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import appConfig from '@/configs/app.config';
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/constants/api.constant';
import { PERSIST_STORE_NAME } from '@/constants/app.constant';
import deepParseJson from '@/utils/deepParseJson';
import store, { signOutSuccess, updateSession } from '../store';

const BaseService = axios.create({
  timeout: 60000,
  baseURL: appConfig.apiPrefix,
});

// ── Refresh token state ──────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

// ── Request interceptor ─────────────────────────────────────────────
BaseService.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME);
    const persistData = deepParseJson(rawPersistData);

    let accessToken = (persistData as any)?.auth?.session?.token;
    if (!accessToken) {
      const { auth } = store.getState();
      accessToken = auth.session.token;
    }

    if (accessToken) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — auto refresh on 401 ─────────────────────
BaseService.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401 and avoid infinite retry
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Skip refresh for auth endpoints (login, register, refresh itself)
    const url = originalRequest.url || '';
    if (url.includes('/api/auth/login') || url.includes('/api/auth/refresh') || url.includes('/api/auth/register')) {
      return Promise.reject(error);
    }

    // Get current refresh token from store
    const { auth } = store.getState();
    const refreshToken = auth.session.refreshToken;

    if (!refreshToken) {
      store.dispatch(signOutSuccess());
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${newToken}`;
        return BaseService(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${appConfig.apiPrefix}/api/auth/refresh`,
        { refreshToken },
        { timeout: 10000 }
      );

      const data = response.data?.data;
      const newAccessToken = data?.accessToken;
      const newRefreshToken = data?.refreshToken;
      const expiresIn = data?.expiresIn;

      if (!newAccessToken) {
        throw new Error('No access token in refresh response');
      }

      // Update store with new tokens
      store.dispatch(
        updateSession({
          token: newAccessToken,
          refreshToken: newRefreshToken,
          expireTime: expiresIn,
        })
      );

      // Retry queued requests with new token
      processQueue(null, newAccessToken);

      // Retry original request
      originalRequest.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${newAccessToken}`;
      return BaseService(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(signOutSuccess());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default BaseService;
