import { useState } from 'react';
import {
    User,
    Mail,
    Shield,
    Key,
    Save,
    Eye,
    EyeOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Configuracoes() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingSenha, setLoadingSenha] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [initialProfile, setInitialProfile] = useState({
        nome: user?.nome || '',
        email: user?.email || ''
    });

    const [formData, setFormData] = useState({
        nome: user?.nome || '',
        email: user?.email || '',
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });

    const hasProfileChanges = () => {
        return formData.nome !== initialProfile.nome ||
            formData.email !== initialProfile.email;
    };

    // ============================================
    // ATUALIZAR PERFIL
    // ============================================

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!hasProfileChanges()) {
            toast.error('Nenhuma alteração foi feita no perfil');
            return;
        }

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setInitialProfile({
                nome: formData.nome,
                email: formData.email
            });
            toast.success('Perfil atualizado com sucesso!');
        } catch {
            toast.error('Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // VALIDAR FORMULÁRIO DE SENHA
    // ============================================

    const validatePasswordForm = (): boolean => {
        // Verificar senha atual
        if (!formData.senhaAtual.trim()) {
            toast.error('Digite sua senha atual');
            return false;
        }

        // Verificar nova senha
        if (!formData.novaSenha.trim()) {
            toast.error('Digite a nova senha');
            return false;
        }

        // Verificar tamanho da nova senha
        if (formData.novaSenha.length < 6) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres');
            return false;
        }

        // Verificar confirmar senha
        if (!formData.confirmarSenha.trim()) {
            toast.error('Confirme a nova senha');
            return false;
        }

        // Verificar se as senhas coincidem
        if (formData.novaSenha !== formData.confirmarSenha) {
            toast.error('As senhas não coincidem');
            return false;
        }

        return true;
    };

    // ============================================
    // ALTERAR SENHA
    // ============================================

    const handleChangePassword = async () => {
        if (!validatePasswordForm()) {
            return;
        }

        setLoadingSenha(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Senha alterada com sucesso!');

            setFormData({
                ...formData,
                senhaAtual: '',
                novaSenha: '',
                confirmarSenha: ''
            });
        } catch {
            toast.error('Erro ao alterar senha');
        } finally {
            setLoadingSenha(false);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
                <p className="text-slate-500 text-sm">Gerencie suas informações pessoais</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Perfil */}
                <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Meu Perfil</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="input-label">Nome completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    className="input-field pl-10"
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="input-label">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    className="input-field pl-10"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Perfil</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    className="input-field pl-10 bg-slate-50 cursor-not-allowed"
                                    value={user?.perfil === 'admin' ? 'Administrador' :
                                        user?.perfil === 'usuario' ? 'Usuário' : 'Visualizador'}
                                    disabled
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                            disabled={loading || !hasProfileChanges()}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Salvando...
                                </div>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Salvar Alterações
                                </>
                            )}
                        </button>

                        {!hasProfileChanges() && (
                            <p className="text-xs text-slate-400 text-center">
                                Nenhuma alteração foi feita no perfil
                            </p>
                        )}
                    </form>
                </div>

                {/* Senha */}
                <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                            <Key className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Alterar Senha</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="input-label">Senha atual</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Digite sua senha atual"
                                    value={formData.senhaAtual}
                                    onChange={(e) => setFormData({ ...formData, senhaAtual: e.target.value })}
                                    required
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

                        <div>
                            <label className="input-label">Nova senha</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.novaSenha}
                                    onChange={(e) => setFormData({ ...formData, novaSenha: e.target.value })}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Confirmar nova senha</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Confirme a nova senha"
                                    value={formData.confirmarSenha}
                                    onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleChangePassword}
                            className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700"
                            disabled={loadingSenha}
                        >
                            {loadingSenha ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Alterando...
                                </div>
                            ) : (
                                <>
                                    <Key className="w-4 h-4" />
                                    Alterar Senha
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}