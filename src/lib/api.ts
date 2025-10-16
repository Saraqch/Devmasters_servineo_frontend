// lib/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface RequestConfig extends RequestInit {
  timeout?: number; // opcional si quieres manejar timeout
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL: string, defaultTimeout = 10000) {
    this.baseURL = baseURL;
    this.defaultTimeout = defaultTimeout;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { timeout, ...fetchConfig } = config;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout || this.defaultTimeout);

      const res = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchConfig,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(fetchConfig.headers || {}),
        },
      });

      clearTimeout(id);

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data?.message || 'Error en la solicitud' };
      }

      return { success: true, data };
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          return { success: false, error: 'La solicitud se ha agotado' };
        }
        return { success: false, error: err.message };
      }
      return { success: false, error: 'Error de conexión desconocido' };
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Exporta una instancia lista para usar
export const api = new ApiClient(API_BASE_URL);
