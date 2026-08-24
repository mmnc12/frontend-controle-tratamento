import api from './axiosConfig';
import type { Localidade, ApiResponse } from '../types';

// ============================================
// API DE LOCALIDADES
// ============================================

export const localidadeApi = {
  // Listar todas
  listar: async (): Promise<Localidade[]> => {
    const response = await api.get<ApiResponse<Localidade[]>>('/localidades');
    return response.data.data;
  },

  // Buscar por ID
  buscarPorId: async (id: number): Promise<Localidade> => {
    const response = await api.get<ApiResponse<Localidade>>(`/localidades/${id}`);
    return response.data.data;
  },

  // Criar
  criar: async (data: Partial<Localidade>): Promise<Localidade> => {
    const response = await api.post<ApiResponse<Localidade>>('/localidades', data);
    return response.data.data;
  },

  // Atualizar
  atualizar: async (id: number, data: Partial<Localidade>): Promise<Localidade> => {
    const response = await api.put<ApiResponse<Localidade>>(`/localidades/${id}`, data);
    return response.data.data;
  },

  // Deletar
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/localidades/${id}`);
  },
};