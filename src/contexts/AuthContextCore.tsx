import { createContext } from 'react';
import type { Usuario, LoginRequest } from '../types';

// ============================================
// TIPOS DO CONTEXTO
// ============================================

interface AuthContextData {
    user: Usuario | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
    updateUser: (user: Usuario) => void;
}

// ============================================
// CRIAÇÃO DO CONTEXTO
// ============================================

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);