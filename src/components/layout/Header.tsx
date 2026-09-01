import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { redeBasicaApi, rotinaApi } from '../../api';
import type { RedeBasica, Rotina } from '../../types';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pacientesRede, setPacientesRede] = useState<RedeBasica[]>([]);
  const [pacientesRotina, setPacientesRotina] = useState<Rotina[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const isFirstRender = useRef(true);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);

  // ✅ Verificar se é mobile
  const isMobile = window.innerWidth < 640;

  const loadData = useCallback(async () => {
    try {
      const [redeResponse, rotinaResponse] = await Promise.all([
        redeBasicaApi.listar({}, 1, 1000),
        rotinaApi.listar({}, 1, 1000)
      ]);
      setPacientesRede(redeResponse.data || []);
      setPacientesRotina(rotinaResponse.data || []);
    } catch {
      // Silencioso
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      loadData();
    }
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, [loadData]);

  const todosPacientes = [...pacientesRede, ...pacientesRotina];

  const revisoesAtrasadas = todosPacientes.filter(p => {
    if (p.revisao === 'S') return false;
    if (!p.data_revisao) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataRevisao = new Date(p.data_revisao);
    dataRevisao.setHours(0, 0, 0, 0);
    return dataRevisao < hoje;
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/localidades': 'Localidades',
      '/psf': 'PSFs',
      '/rede-basica': 'Rede Básica',
      '/rotina': 'Rotina',
      '/relatorios': 'Relatórios',
      '/configuracoes': 'Configurações',
      '/usuarios': 'Usuários',
    };
    return titles[path] || 'Sistema';
  };

  const updateDropdownPosition = (buttonRef: React.RefObject<HTMLButtonElement | null>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  };

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showNotifications) {
      updateDropdownPosition(notificationButtonRef);
    }
    setShowNotifications(!showNotifications);
    setShowDropdown(false);
  };

  const toggleProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showDropdown) {
      updateDropdownPosition(profileButtonRef);
    }
    setShowDropdown(!showDropdown);
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Lado esquerdo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-slate-600" />
            ) : (
              <Menu className="w-5 h-5 text-slate-600" />
            )}
          </button>
          <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
            {getPageTitle()}
          </h1>
        </div>

        {/* Lado direito */}
        <div className="flex items-center gap-3">
          {/* 🔔 Notificações */}
          <div className="relative">
            <button
              ref={notificationButtonRef}
              onClick={toggleNotifications}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-slate-500" />
              {revisoesAtrasadas.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {revisoesAtrasadas.length}
                </span>
              )}
            </button>

            {/* ✅ DROPDOWN DE NOTIFICAÇÕES COM AJUSTE MOBILE */}
            {showNotifications && createPortal(
              <div
                className="bg-white rounded-xl shadow-2xl border border-slate-200/50 py-2 z-[9999] max-h-[420px] overflow-y-auto"
                style={{
                  position: 'fixed',
                  top: isMobile ? '64px' : dropdownPosition.top,
                  right: isMobile ? '16px' : dropdownPosition.right,
                  left: isMobile ? '16px' : 'auto',
                  width: isMobile ? 'auto' : Math.min(380, window.innerWidth - 32),
                  maxWidth: 'calc(100vw - 32px)',
                }}
              >
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Revisões Atrasadas
                  </h3>
                  <span className="text-xs text-red-500 font-medium">
                    {revisoesAtrasadas.length} paciente(s)
                  </span>
                </div>

                {revisoesAtrasadas.length > 0 ? (
                  <>
                    {revisoesAtrasadas.slice(0, 10).map((p, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setShowNotifications(false);
                          const origem = 'psf_nome' in p ? 'rede-basica' : 'rotina';
                          navigate(`/${origem}`);
                        }}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                      >
                        <div className="p-2 rounded-full bg-red-50 text-red-600 flex-shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{p.nome}</p>
                          <p className="text-xs text-slate-500">
                            Revisão: {p.data_revisao ? new Date(p.data_revisao).toLocaleDateString('pt-BR') : '-'}
                          </p>
                          <p className="text-xs text-red-500 font-medium">
                            Atrasada! Deveria ter sido feita até {p.data_revisao ? new Date(p.data_revisao).toLocaleDateString('pt-BR') : '-'}
                          </p>
                        </div>
                      </button>
                    ))}
                    {revisoesAtrasadas.length > 10 && (
                      <div className="px-4 py-2 text-center text-xs text-slate-500 border-t border-slate-100">
                        + {revisoesAtrasadas.length - 10} pacientes atrasados
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Nenhuma revisão atrasada</p>
                    <p className="text-xs text-slate-400">Todas as revisões estão em dia</p>
                  </div>
                )}

                {revisoesAtrasadas.length > 0 && (
                  <div className="px-4 py-2 border-t border-slate-100 sticky bottom-0 bg-white rounded-b-xl">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/rotina');
                      }}
                      className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Ver todos os pacientes
                    </button>
                  </div>
                )}
              </div>,
              document.body
            )}
          </div>

          {/* Botão Sair */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>

          {/* Perfil do usuário */}
          <div className="relative">
            <button
              ref={profileButtonRef}
              onClick={toggleProfile}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-primary-500/20">
                {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {user?.nome?.split(' ')[0] || 'Usuário'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showDropdown && createPortal(
              <div
                className="bg-white rounded-xl shadow-2xl border border-slate-200/50 py-1 z-[9999] overflow-hidden"
                style={{
                  position: 'fixed',
                  top: isMobile ? '64px' : dropdownPosition.top,
                  right: isMobile ? '16px' : dropdownPosition.right,
                  left: isMobile ? '16px' : 'auto',
                  width: isMobile ? 'auto' : Math.min(224, window.innerWidth - 32),
                  maxWidth: 'calc(100vw - 32px)',
                }}
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">{user?.nome}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">
                    {user?.perfil === 'admin' ? 'Administrador' :
                      user?.perfil === 'usuario' ? 'Usuário' : 'Visualizador'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/configuracoes');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </header>
  );
}