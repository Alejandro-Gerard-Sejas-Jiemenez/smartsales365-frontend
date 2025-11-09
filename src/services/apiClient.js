import { getToken, clearAuth } from "./auth.js";

// Configuración simple y directa
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";


export async function apiFetch(url, options = {}) {
  const token = getToken();
  let headers = options.headers || {};
  // Si el body es FormData, no establecer Content-Type (el navegador lo hace)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // En desarrollo local: usar proxy (/api)
  // En producción: usar URL completa
  const isDev = import.meta.env.DEV;
  const isLocal = window.location.hostname === 'localhost';

  let fullUrl;
  if (isDev && isLocal) {
    // Desarrollo local: usar rutas relativas (proxy se encarga)
    fullUrl = url;
  } else {
    // Producción: URL completa
    fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  }

  const res = await fetch(fullUrl, { ...options, headers });

  let data = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error('❌ Error parsing JSON:', e);
  }

  if (res.status === 401) {
    clearAuth();
    if (!url.includes('/login')) window.location.href = '/login';
  }

  if (!res.ok) {
    // Si el backend devuelve un diccionario de errores, conviértelo en texto legible
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      let errorMsg = data.detail || data.error || '';
      // Si hay errores de validación, los mostramos todos
      for (const key in data) {
        if (key !== 'detail' && key !== 'error' && Array.isArray(data[key])) {
          errorMsg += `\n${key}: ${data[key].join(', ')}`;
        }
      }
      throw new Error(errorMsg || `HTTP ${res.status}`);
    }
    throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
  }

  return data;
}

export const api = {
  get: (u) => apiFetch(u),
  post: (u, b) => apiFetch(u, { method: 'POST', body: b instanceof FormData ? b : JSON.stringify(b) }),
  put: (u, b) => apiFetch(u, { method: 'PUT', body: b instanceof FormData ? b : JSON.stringify(b) }),
  patch: (u, b) => apiFetch(u, { method: 'PATCH', body: b instanceof FormData ? b : JSON.stringify(b) }),
  del: (u) => apiFetch(u, { method: 'DELETE' })
};