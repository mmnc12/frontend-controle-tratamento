import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContextCore';
import { authApi } from '../api';
import type { Usuario, LoginRequest, ApiError } from '../types';
import toast from 'react-hot-toast';

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    // ============================================
    // VERIFICAR USUÁRIO LOGADO AO INICIAR
    // ============================================

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('usuario');

            if (token && userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } catch {
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // ============================================
    // FUNÇÃO DE LOGIN
    // ============================================

    const login = async (data: LoginRequest) => {
        setLoading(true);
        try {
            const response = await authApi.login(data);
            const { token, usuario } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify(usuario));

            setUser(usuario);
            toast.success('Login realizado com sucesso!');
        } catch (error) {
            const apiError = error as ApiError;
            const message = apiError.response?.data?.message || 'Erro ao fazer login';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // FUNÇÃO DE LOGOUT
    // ============================================

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUser(null);
        toast.success('Logout realizado com sucesso');
    };

    // ============================================
    // FUNÇÃO PARA ATUALIZAR USUÁRIO
    // ============================================

    const updateUser = (updatedUser: Usuario) => {
        setUser(updatedUser);
        localStorage.setItem('usuario', JSON.stringify(updatedUser));
    };

    // ============================================
    // RETORNO DO CONTEXTO
    // ============================================

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}