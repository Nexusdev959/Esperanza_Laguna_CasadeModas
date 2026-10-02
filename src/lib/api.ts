import axios from 'axios';

// Instancia global pre-configurada
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.esperanzalaguna.com/api/v1',
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
  if (error.response?.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      // Redirigir al login si el token expira
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});
