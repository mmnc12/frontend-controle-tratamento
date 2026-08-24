import { Users, Building2, Stethoscope, FileText, TrendingUp, Calendar } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { 
      title: 'Pacientes Ativos', 
      value: '2.847', 
      change: '+12%',
      icon: Users,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50'
    },
    { 
      title: 'PSFs Cadastrados', 
      value: '10', 
      change: '+2',
      icon: Building2,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      title: 'Aguardando Tratamento', 
      value: '183', 
      change: '-8%',
      icon: Stethoscope,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50'
    },
    { 
      title: 'Relatórios Gerados', 
      value: '156', 
      change: '+34',
      icon: FileText,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50'
    },
  ];

  const recentes = [
    { nome: 'João Silva', localidade: 'Centro', data: '23/08/2026', status: 'Tratado' },
    { nome: 'Maria Santos', localidade: 'Bairro A', data: '22/08/2026', status: 'Pendente' },
    { nome: 'Pedro Oliveira', localidade: 'Bairro B', data: '21/08/2026', status: 'Revisão' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">Visão geral do sistema</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/50 shadow-sm">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                <span className={`inline-flex items-center text-xs font-medium mt-2 ${
                  stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  <TrendingUp className={`w-3 h-3 mr-1 ${stat.change.startsWith('-') && 'rotate-180'}`} />
                  {stat.change}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Atividades Recentes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Atividades Recentes</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
            Ver todos
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((item, index) => (
                <tr key={index}>
                  <td className="font-medium text-slate-800">{item.nome}</td>
                  <td>{item.localidade}</td>
                  <td>{item.data}</td>
                  <td>
                    <span className={`badge ${
                      item.status === 'Tratado' ? 'badge-success' :
                      item.status === 'Pendente' ? 'badge-warning' :
                      'badge-info'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      Ver
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