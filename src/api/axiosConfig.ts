// src/api/axiosConfig.ts
import axios, { AxiosError } from 'axios';

// ============================================
// CONFIGURAÇÃO BASE DO AXIOS
// ============================================

const api = axios.create({
  baseURL: 'https://backend-controle-tratamento.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// INTERCEPTOR PARA ADICIONAR TOKEN
// ============================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============================================
// INTERCEPTOR PARA TRATAR ERROS
// ============================================

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 🔥 REMOVA O window.location.href = '/'
    // Deixe apenas a limpeza do localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      // ❌ window.location.href = '/';  // REMOVER ESTA LINHA
    }
    return Promise.reject(error);
  }
);

export default api;