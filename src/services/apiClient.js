/**
 * HTTP API Client for RTConnect
 * Handles base URL, auth token injection, automatic token refresh, and response wrapping.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rtconnectapi.up.railway.app/api/v1';

export const TOKEN_KEY = 'rtconnect_token';
export const REFRESH_TOKEN_KEY = 'rtconnect_refresh_token';

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
}

export const tokenStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  },
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => {
    if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
    else localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

async function request(endpoint, options = {}, isRetry = false) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const token = tokenStorage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  } else if (options.body && typeof options.body === 'object' && !(options.body instanceof String)) {
    options.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 401 Unauthorized - Attempt token refresh once
    if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });
            const refreshData = await refreshRes.json();
            if (refreshRes.ok && refreshData.success && refreshData.data?.token) {
              tokenStorage.setToken(refreshData.data.token);
              if (refreshData.data.refreshToken) {
                tokenStorage.setRefreshToken(refreshData.data.refreshToken);
              }
              onRefreshed(refreshData.data.token);
            } else {
              tokenStorage.clear();
              onRefreshed(null);
            }
          } catch (err) {
            tokenStorage.clear();
            onRefreshed(null);
          } finally {
            isRefreshing = false;
          }
        }

        // Wait for token refresh to complete
        const retryToken = await new Promise((resolve) => {
          subscribeTokenRefresh(resolve);
        });

        if (retryToken) {
          return request(endpoint, options, true);
        }
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        `Permintaan gagal (${response.status}: ${response.statusText})`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = data?.error?.code || 'API_ERROR';
      error.details = data?.error?.details || [];
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const apiClient = {
  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });
    const qs = query.toString();
    const url = qs ? `${endpoint}?${qs}` : endpoint;
    return request(url, { method: 'GET' });
  },

  post(endpoint, body) {
    return request(endpoint, { method: 'POST', body });
  },

  patch(endpoint, body) {
    return request(endpoint, { method: 'PATCH', body });
  },

  put(endpoint, body) {
    return request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return request(endpoint, { method: 'DELETE' });
  },

  tokenStorage,
};

