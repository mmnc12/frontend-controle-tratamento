import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ============================================
    // 🔥 VALIDAÇÃO DOS CAMPOS VAZIOS (ANTES DO LOADING)
    // ============================================

    const emailTrim = formData.email.trim();
    const senhaTrim = formData.senha.trim();

    if (!emailTrim || !senhaTrim) {
      toast.error('Preencha todos os campos para continuar', { duration: 4000 });
      return;
    }

    // Validação simples de email
    if (!emailTrim.includes('@') || !emailTrim.includes('.')) {
      toast.error('Digite um e-mail válido', { duration: 4000 });
      return;
    }

    // ============================================
    // 🔥 SETAR LOADING APÓS VALIDAÇÃO
    // ============================================

    setLoading(true);

    try {
      await login({ email: emailTrim, senha: senhaTrim });
      navigate('/dashboard');
    } catch {
      // ============================================
      // 🔥 LIMPAR OS CAMPOS EM CASO DE ERRO
      // ============================================
      setFormData({
        email: '',
        senha: ''
      });

      // Focar no campo de email para nova tentativa
      setTimeout(() => {
        const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
        if (emailInput) {
          emailInput.focus();
        }
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 🔥 FUNÇÃO PARA LIMPAR OS CAMPOS MANUALMENTE
  // ============================================

  const limparCampos = () => {
    setFormData({
      email: '',
      senha: ''
    });
    // 🔥 CORRIGIDO: toast.info não existe, usar toast.success ou toast.custom
    toast.success('Campos limpos!', { duration: 2000, icon: '🧹' });

    // Focar no campo de email
    setTimeout(() => {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (emailInput) {
        emailInput.focus();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-lg shadow-primary-500/30 mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Controle de Tratamento
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Faça login para acessar o sistema
          </p>
        </div>

        <div className="card shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                'Entrar no Sistema'
              )}
            </button>
          </form>

          {/* 🔥 BOTÃO PARA LIMPAR CAMPOS */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={limparCampos}
              className="text-xs text-slate-400 hover:text-primary-600 transition-colors"
            >
              Limpar campos
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400 border-t border-slate-200/60 pt-4">
            Sistema de Controle de Tratamento • {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}