import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Building2,
  Users,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  Activity
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/localidades', icon: MapPin, label: 'Localidades' },
    { path: '/psf', icon: Building2, label: 'PSFs' },
    { path: '/rede-basica', icon: Users, label: 'Rede Básica' },
    { path: '/rotina', icon: ClipboardList, label: 'Rotina' },
    { path: '/relatorios', icon: FileText, label: 'Relatórios' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - fixed */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[260px] bg-white border-r border-slate-200/60 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-200/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-slate-800 text-sm block">
                Controle de Tratamento
              </span>
              <span className="text-[10px] text-slate-400">Sistema de Gestão</span>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-0.5">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 
                    hover:bg-primary-50 hover:text-primary-700 transition-all duration-200
                    ${isActive ? 'bg-primary-50 text-primary-700 font-medium shadow-sm shadow-primary-500/5' : ''}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-slate-500'}`} />
                      <span className="text-sm">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Rodapé */}
          <div className="border-t border-slate-200/60 p-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sair</span>
            </button>
            <div className="mt-3 text-center text-[10px] text-slate-400">
              v1.0.0 • {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}