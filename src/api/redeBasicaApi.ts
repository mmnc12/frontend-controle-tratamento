import api from './axiosConfig';
import type { RedeBasica, FiltrosRedeBasica, ApiResponse } from '../types';

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
    filters?: FiltrosRedeBasica;
}

// ============================================
// API DE REDE BÁSICA
// ============================================

export const redeBasicaApi = {
    listar: async (
        filtros?: FiltrosRedeBasica,
        page: number = 1,
        limit: number = 20
    ): Promise<PaginatedResponse<RedeBasica>> => {
        const params = new URLSearchParams();

        if (filtros) {
            Object.entries(filtros).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    params.append(key, String(value));
                }
            });
        }

        params.append('page', String(page));
        params.append('limit', String(limit));

        const response = await api.get<PaginatedResponse<RedeBasica>>(
            `/rede-basica?${params.toString()}`
        );
        return response.data;
    },

    // ============================================
    // BUSCAR POR ID
    // ============================================
    buscarPorId: async (id: number): Promise<RedeBasica> => {
        const response = await api.get<ApiResponse<RedeBasica>>(`/rede-basica/${id}`);
        return response.data.data;
    },

    // ============================================
    // CRIAR
    // ============================================
    criar: async (data: Partial<RedeBasica>): Promise<RedeBasica> => {
        const response = await api.post<ApiResponse<RedeBasica>>('/rede-basica', data);
        return response.data.data;
    },

    // ============================================
    // ATUALIZAR
    // ============================================
    atualizar: async (id: number, data: Partial<RedeBasica>): Promise<RedeBasica> => {
        const response = await api.put<ApiResponse<RedeBasica>>(`/rede-basica/${id}`, data);
        return response.data.data;
    },

    // ============================================
    // DELETAR
    // ============================================
    deletar: async (id: number): Promise<void> => {
        await api.delete(`/rede-basica/${id}`);
    },
};