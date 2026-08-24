import api from './axiosConfig';
import type { Rotina, FiltrosRotina, ApiResponse } from '../types';

// ============================================
// API DE ROTINA
// ============================================

export const rotinaApi = {
  // Listar com filtros
  listar: async (filtros?: FiltrosRotina): Promise<Rotina[]> => {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<ApiResponse<Rotina[]>>(`/rotina?${params.toString()}`);
    return response.data.data;
  },

  // Buscar por ID
  buscarPorId: async (id: number): Promise<Rotina> => {
    const response = await api.get<ApiResponse<Rotina>>(`/rotina/${id}`);
    return response.data.data;
  },

  // Criar
  criar: async (data: Partial<Rotina>): Promise<Rotina> => {
    const response = await api.post<ApiResponse<Rotina>>('/rotina', data);
    return response.data.data;
  },

  // Atualizar
  atualizar: async (id: number, data: Partial<Rotina>): Promise<Rotina> => {
    const response = await api.put<ApiResponse<Rotina>>(`/rotina/${id}`, data);
    return response.data.data;
  },

  // Deletar
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/rotina/${id}`);
  },
};