import api from './axiosConfig';
import type { Rotina, FiltrosRotina, ApiResponse } from '../types';

// ============================================
// TIPO PARA RESPOSTA PAGINADA
// ============================================

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: FiltrosRotina;
}

// ============================================
// API DE ROTINA
// ============================================

export const rotinaApi = {
  // ============================================
  // LISTAR COM FILTROS E PAGINAÇÃO
  // ============================================
  listar: async (
    filtros?: FiltrosRotina,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Rotina>> => {
    const params = new URLSearchParams();

    // Adicionar filtros - CODIFICAR CORRETAMENTE
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          // Codificar o valor para URL
          params.append(key, String(value));
        }
      });
    }

    // Adicionar paginação com valores padrão
    params.append('page', String(page));
    params.append('limit', String(limit));

    const response = await api.get<PaginatedResponse<Rotina>>(
      `/rotina?${params.toString()}`
    );
    return response.data;
  },

  // ============================================
  // BUSCAR POR ID
  // ============================================
  buscarPorId: async (id: number): Promise<Rotina> => {
    const response = await api.get<ApiResponse<Rotina>>(`/rotina/${id}`);
    return response.data.data;
  },

  // ============================================
  // CRIAR
  // ============================================
  criar: async (data: Partial<Rotina>): Promise<Rotina> => {
    const response = await api.post<ApiResponse<Rotina>>('/rotina', data);
    return response.data.data;
  },

  // ============================================
  // ATUALIZAR
  // ============================================
  atualizar: async (id: number, data: Partial<Rotina>): Promise<Rotina> => {
    const response = await api.put<ApiResponse<Rotina>>(`/rotina/${id}`, data);
    return response.data.data;
  },

  // ============================================
  // DELETAR
  // ============================================
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/rotina/${id}`);
  },
};