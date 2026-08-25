import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    X,
    Search,
    AlertCircle,
    User,
    Mail,
    Shield,
    Key,
    Eye,
    EyeOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import type { Usuario } from '../types';

// Dados mockados para teste (depois conectamos com a API)
const usuariosMock: Usuario[] = [
    { id: 1, nome: 'Administrador', email: 'admin@sistema.com', perfil: 'admin', ativo: true, data_criacao: '2025-01-01', ultimo_login: null },
    { id: 2, nome: 'João Silva', email: 'joao@email.com', perfil: 'usuario', ativo: true, data_criacao: '2025-01-15', ultimo_login: null },
    { id: 3, nome: 'Maria Santos', email: 'maria@email.com', perfil: 'visualizador', ativo: false, data_criacao: '2025-02-01', ultimo_login: null },
];

export default function Usuarios() {
    const { user } = useAuth();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const isFirstRender = useRef(true);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        perfil: 'usuario' as 'admin' | 'usuario' | 'visualizador',
        ativo: true
    });

    // ============================================
    // CARREGAR USUÁRIOS
    // ============================================

    const loadUsuarios = useCallback(async () => {
        try {
            setLoading(true);
            // Simular carregamento (depois conectamos com a API)
            await new Promise(resolve => setTimeout(resolve, 800));
            setUsuarios(usuariosMock);
        } catch {
            toast.error('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    }, []);

    // Carregar dados na primeira renderização
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            loadUsuarios();
        }
    }, [loadUsuarios]);

    // ============================================
    // VERIFICAR SE É ADMIN - Movido para depois dos hooks
    // ============================================

    if (user?.perfil !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <Shield className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-xl font-semibold text-slate-800">Acesso Restrito</h2>
                <p className="text-slate-500 mt-1">Apenas administradores podem gerenciar usuários</p>
            </div>
        );
    }

    // ============================================
    // FILTRAR USUÁRIOS
    // ============================================

    const filteredUsuarios = usuarios.filter(item =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ============================================
    // ABRIR MODAL
    // ============================================

    const openModal = (usuario?: Usuario) => {
        if (usuario) {
            setEditingId(usuario.id);
            setFormData({
                nome: usuario.nome,
                email: usuario.email,
                senha: '',
                perfil: usuario.perfil,
                ativo: usuario.ativo
            });
        } else {
            setEditingId(null);
            setFormData({
                nome: '',
                email: '',
                senha: '',
                perfil: 'usuario',
                ativo: true
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({
            nome: '',
            email: '',
            senha: '',
            perfil: 'usuario',
            ativo: true
        });
    };

    // ============================================
    // VALIDAR FORMULÁRIO
    // ============================================

    const validateForm = (): boolean => {
        if (!formData.nome.trim()) {
            toast.error('O campo Nome é obrigatório');
            return false;
        }
        if (!formData.email.trim()) {
            toast.error('O campo E-mail é obrigatório');
            return false;
        }
        if (!editingId && !formData.senha.trim()) {
            toast.error('A senha é obrigatória para novos usuários');
            return false;
        }
        if (!editingId && formData.senha.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres');
            return false;
        }
        return true;
    };

    // ============================================
    // SALVAR USUÁRIO
    // ============================================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Simular salvamento (depois conectamos com a API)
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (editingId) {
                toast.success('Usuário atualizado com sucesso!');
            } else {
                toast.success('Usuário criado com sucesso!');
            }
            closeModal();
            loadUsuarios();
        } catch {
            toast.error('Erro ao salvar usuário');
        }
    };

    // ============================================
    // DELETAR USUÁRIO
    // ============================================

    const handleDelete = async (id: number, nome: string) => {
        if (id === user?.id) {
            toast.error('Você não pode excluir seu próprio usuário');
            return;
        }

        if (!confirm(`Tem certeza que deseja excluir o usuário "${nome}"?`)) {
            return;
        }

        try {
            // Simular exclusão (depois conectamos com a API)
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success('Usuário excluído com sucesso!');
            loadUsuarios();
        } catch {
            toast.error('Erro ao excluir usuário');
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Usuários</h1>
                    <p className="text-slate-500 text-sm">Gerencie os usuários do sistema</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Novo Usuário
                </button>
            </div>

            {/* Barra de busca */}
            <div className="card">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            className="input-field pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-medium">{filteredUsuarios.length}</span>
                        <span>usuários encontrados</span>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredUsuarios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <AlertCircle className="w-12 h-12 mb-3" />
                        <p className="text-lg font-medium">Nenhum usuário encontrado</p>
                        <p className="text-sm">Clique em "Novo Usuário" para adicionar</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Perfil</th>
                                    <th>Status</th>
                                    <th className="text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsuarios.map((item) => (
                                    <tr key={item.id}>
                                        <td className="font-medium text-slate-800">
                                            {item.nome}
                                            {item.id === user?.id && (
                                                <span className="ml-2 text-xs text-primary-600 font-normal">(Você)</span>
                                            )}
                                        </td>
                                        <td>{item.email}</td>
                                        <td>
                                            <span className={`badge ${item.perfil === 'admin' ? 'badge-danger' :
                                                    item.perfil === 'usuario' ? 'badge-info' :
                                                        'badge-neutral'
                                                }`}>
                                                {item.perfil === 'admin' ? 'Administrador' :
                                                    item.perfil === 'usuario' ? 'Usuário' : 'Visualizador'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${item.ativo ? 'badge-success' : 'badge-danger'}`}>
                                                {item.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.nome)}
                                                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                                                    title="Excluir"
                                                    disabled={item.id === user?.id}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
                            <h2 className="text-lg font-semibold text-slate-800">
                                {editingId ? 'Editar Usuário' : 'Novo Usuário'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="input-label">Nome *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        className="input-field pl-10"
                                        placeholder="Nome completo"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="input-label">E-mail *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        className="input-field pl-10"
                                        placeholder="email@exemplo.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {!editingId && (
                                <div>
                                    <label className="input-label">Senha *</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="input-field pl-10 pr-10"
                                            placeholder="Mínimo 6 caracteres"
                                            value={formData.senha}
                                            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                            required={!editingId}
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="input-label">Perfil</label>
                                <select
                                    className="input-field"
                                    value={formData.perfil}
                                    onChange={(e) => setFormData({ ...formData, perfil: e.target.value as 'admin' | 'usuario' | 'visualizador' })}
                                >
                                    <option value="admin">Administrador</option>
                                    <option value="usuario">Usuário</option>
                                    <option value="visualizador">Visualizador</option>
                                </select>
                            </div>

                            <div>
                                <label className="input-label">Status</label>
                                <select
                                    className="input-field"
                                    value={formData.ativo ? 'true' : 'false'}
                                    onChange={(e) => setFormData({ ...formData, ativo: e.target.value === 'true' })}
                                >
                                    <option value="true">Ativo</option>
                                    <option value="false">Inativo</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-secondary flex-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1"
                                >
                                    {editingId ? 'Atualizar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}