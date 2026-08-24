import api from './axiosConfig';
import type { RelatorioFiltros } from '../types';

// ============================================
// API DE RELATÓRIOS
// ============================================

export const relatorioApi = {
  // Rede Básica - CSV
  redeBasicaCSV: async (filtros?: RelatorioFiltros): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/relatorios/rede-basica/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Rede Básica - Excel
  redeBasicaExcel: async (filtros?: RelatorioFiltros): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/relatorios/rede-basica/excel?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Rede Básica - PDF
  redeBasicaPDF: async (filtros?: RelatorioFiltros): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/relatorios/rede-basica/pdf?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Rotina - CSV
  rotinaCSV: async (filtros?: RelatorioFiltros): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/relatorios/rotina/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};