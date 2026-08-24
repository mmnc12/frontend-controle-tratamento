import api from './axiosConfig';
import type { RedeBasica, FiltrosRedeBasica, ApiResponse } from '../types';

// ============================================
// API DE REDE BÁSICA
// ============================================

export const redeBasicaApi = {
  // Listar com filtros
  listar: async (filtros?: FiltrosRedeBasica): Promise<RedeBasica[]> => {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<ApiResponse<RedeBasica[]>>(`/rede-basica?${params.toString()}`);
    return response.data.data;
  },

  // Buscar por ID
  buscarPorId: async (id: number): Promise<RedeBasica> => {
    const response = await api.get<ApiResponse<RedeBasica>>(`/rede-basica/${id}`);
    return response.data.data;
  },

  // Criar
  criar: async (data: Partial<RedeBasica>): Promise<RedeBasica> => {
    const response = await api.post<ApiResponse<RedeBasica>>('/rede-basica', data);
    return response.data.data;
  },

  // Atualizar
  atualizar: async (id: number, data: Partial<RedeBasica>): Promise<RedeBasica> => {
    const response = await api.put<ApiResponse<RedeBasica>>(`/rede-basica/${id}`, data);
    return response.data.data;
  },

  // Deletar
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/rede-basica/${id}`);
  },
};