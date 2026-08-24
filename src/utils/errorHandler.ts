import type { ApiError } from '../types';

// ============================================
// FUNÇÃO PARA EXTRAIR MENSAGEM DE ERRO
// ============================================

export const getErrorMessage = (error: unknown): string => {
    const apiError = error as ApiError;
    
    if (apiError.response?.data?.message) {
        return apiError.response.data.message;
    }
    
    if (apiError.response?.data?.error) {
        return apiError.response.data.error;
    }
    
    if (apiError.message) {
        return apiError.message;
    }
    
    return 'Ocorreu um erro inesperado';
};

// ============================================
// FUNÇÃO PARA VERIFICAR SE É ERRO DE VALIDAÇÃO
// ============================================

export const isValidationError = (error: unknown): boolean => {
    const apiError = error as ApiError;
    return apiError.response?.status === 400;
};

// ============================================
// FUNÇÃO PARA VERIFICAR SE É ERRO DE NÃO AUTORIZADO
// ============================================

export const isUnauthorizedError = (error: unknown): boolean => {
    const apiError = error as ApiError;
    return apiError.response?.status === 401;
};

// ============================================
// FUNÇÃO PARA VERIFICAR SE É ERRO DE PROIBIDO
// ============================================

export const isForbiddenError = (error: unknown): boolean => {
    const apiError = error as ApiError;
    return apiError.response?.status === 403;
};

// ============================================
// FUNÇÃO PARA VERIFICAR SE É ERRO DE NÃO ENCONTRADO
// ============================================

export const isNotFoundError = (error: unknown): boolean => {
    const apiError = error as ApiError;
    return apiError.response?.status === 404;
};