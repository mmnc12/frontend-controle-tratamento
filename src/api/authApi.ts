import api from './axiosConfig';
import type { LoginRequest, LoginResponse } from '../types';

// ============================================
// API DE AUTENTICAÇÃO
// ============================================

export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Buscar dados do usuário logado
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};