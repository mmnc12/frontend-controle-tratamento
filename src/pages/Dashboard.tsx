import { Users, Building2, Stethoscope, FileText, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { 
      title: 'Pacientes Ativos', 
      value: '2.847', 
      change: '+12%',
      icon: Users,
      bgColor: 'bg-primary-50',
      iconBg: 'bg-gradient-to-br from-primary-500 to-primary-600',
      textColor: 'text-primary-600'
    },
    { 
      title: 'PSFs Cadastrados', 
      value: '10', 
      change: '+2',
      icon: Building2,
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-600'
    },
    { 
      title: 'Aguardando Tratamento', 
      value: '183', 
      change: '-8%',
      icon: Stethoscope,
      bgColor: 'bg-amber-50',
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      textColor: 'text-amber-600'
    },
    { 
      title: 'Relatórios Gerados', 
      value: '156', 
      change: '+34',
      icon: FileText,
      bgColor: 'bg-violet-50',
      iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
      textColor: 'text-violet-600'
    },
  ];

  const recentes = [
    { nome: 'João Silva', localidade: 'Centro', data: '23/08/2026', status: 'Tratado', statusColor: 'badge-success' },
    { nome: 'Maria Santos', localidade: 'Bairro A', data: '22/08/2026', status: 'Pendente', statusColor: 'badge-warning' },
    { nome: 'Pedro Oliveira', localidade: 'Bairro B', data: '21/08/2026', status: 'Revisão', statusColor: 'badge-info' },
    { nome: 'Ana Costa', localidade: 'Centro', data: '20/08/2026', status: 'Tratado', statusColor: 'badge-success' },
    { nome: 'Carlos Souza', localidade: 'Bairro A', data: '19/08/2026', status: 'Pendente', statusColor: 'badge-warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Visão geral do sistema de controle de tratamento</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/50 shadow-sm">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card-stats">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 truncate">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                <div className={`inline-flex items-center text-xs font-medium mt-2 px-2 py-0.5 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  <TrendingUp className={`w-3 h-3 mr-1 ${stat.change.startsWith('-') ? 'rotate-180' : ''}`} />
                  {stat.change}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} shadow-lg flex items-center justify-center flex-shrink-0 ml-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Atividades Recentes */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Atividades Recentes</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Localidade</th>
                <th>Data</th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((item, index) => (
                <tr key={index}>
                  <td className="font-medium text-slate-800">{item.nome}</td>
                  <td>{item.localidade}</td>
                  <td>{item.data}</td>
                  <td>
                    <span className={`badge ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
                      Visualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}