import api from './axiosConfig';
import type { PSF, ApiResponse } from '../types';

// ============================================
// API DE PSFs
// ============================================

export const psfApi = {
  // Listar todos
  listar: async (): Promise<PSF[]> => {
    const response = await api.get<ApiResponse<PSF[]>>('/psf');
    return response.data.data;
  },

  // Buscar por ID
  buscarPorId: async (id: number): Promise<PSF> => {
    const response = await api.get<ApiResponse<PSF>>(`/psf/${id}`);
    return response.data.data;
  },

  // Criar
  criar: async (data: Partial<PSF>): Promise<PSF> => {
    const response = await api.post<ApiResponse<PSF>>('/psf', data);
    return response.data.data;
  },

  // Atualizar
  atualizar: async (id: number, data: Partial<PSF>): Promise<PSF> => {
    const response = await api.put<ApiResponse<PSF>>(`/psf/${id}`, data);
    return response.data.data;
  },

  // Deletar
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/psf/${id}`);
  },
};