import axios from 'axios';

// Instancia global pre-configurada
const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isDevelopment ? 'http://localhost:4000/api/v1' : 'https://api.esperanzalaguna.com/api/v1');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el Token JWT en cada petición
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejo global de errores (ej: Token expirado)
api.interceptors.response.use((response) => response, (error) => {
  // 401 = sesión vencida o inválida, salvo en login/registro/Google, donde significa "credenciales incorrectas":
  // ahí recargar /login borraba el mensaje de error antes de que se viera
  const isCredentialCheck = /^\/auth\/(login|register|google|recover|reset-password)$/.test(error.config?.url ?? '');
  if (error.response?.status === 401 && !isCredentialCheck) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      // Redirigir al login si el token expira
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

// Fetcher de SWR: la misma clave en varios componentes comparte una sola petición y su caché
export const fetcher = (url: string) => api.get(url).then((res) => res.data);
