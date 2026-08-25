import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle,
  Stethoscope, 
  FileText, 
  TrendingUp, 
  Calendar, 
  ArrowRight
} from 'lucide-react';
import { redeBasicaApi, rotinaApi } from '../api';
import type { RedeBasica, Rotina } from '../types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pacientesRede, setPacientesRede] = useState<RedeBasica[]>([]);
  const [pacientesRotina, setPacientesRotina] = useState<Rotina[]>([]);
  const isFirstRender = useRef(true);

  // ============================================
  // CARREGAR DADOS
  // ============================================

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [redeResponse, rotinaResponse] = await Promise.all([
        redeBasicaApi.listar({}, 1, 1000),
        rotinaApi.listar({}, 1, 1000)
      ]);
      
      // Extrair os dados da resposta paginada
      setPacientesRede(redeResponse.data);
      setPacientesRotina(rotinaResponse.data);
    } catch {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados na primeira renderização
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      loadData();
    }
  }, [loadData]);

  // ============================================
  // CÁLCULO DAS ESTATÍSTICAS
  // ============================================

  const todosPacientes = [...pacientesRede, ...pacientesRotina];
  const totalPacientes = todosPacientes.length;
  const tratados = todosPacientes.filter(p => p.entrega_medicamento === 'S').length;
  const pendentes = todosPacientes.filter(p => p.entrega_medicamento === 'N').length;
  const revisoesFeitas = todosPacientes.filter(p => p.revisao === 'S').length;

  // Calcular percentuais
  const percentualTratados = totalPacientes > 0 ? Math.round((tratados / totalPacientes) * 100) : 0;
  const percentualPendentes = totalPacientes > 0 ? Math.round((pendentes / totalPacientes) * 100) : 0;
  const percentualRevisoes = totalPacientes > 0 ? Math.round((revisoesFeitas / totalPacientes) * 100) : 0;

  // ============================================
  // ÚLTIMOS PACIENTES (5 mais recentes)
  // ============================================

  const ultimosPacientes = [...todosPacientes]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      nome: p.nome,
      localidade: p.localidade_nome || '-',
      data: p.data_tratamento ? new Date(p.data_tratamento).toLocaleDateString('pt-BR') : '-',
      status: p.entrega_medicamento === 'S' ? 'Tratado' : 'Pendente',
      statusColor: p.entrega_medicamento === 'S' ? 'badge-success' : 'badge-warning',
      origem: 'psf_nome' in p ? 'rede' : 'rotina'
    }));

  // ============================================
  // STATS CARDS
  // ============================================

  const stats = [
    { 
      title: 'Total de Pacientes', 
      value: totalPacientes, 
      change: `${totalPacientes}`,
      icon: Users,
      bgColor: 'bg-primary-50',
      iconBg: 'bg-gradient-to-br from-primary-500 to-primary-600',
      textColor: 'text-primary-600'
    },
    { 
      title: 'Pacientes Tratados', 
      value: tratados, 
      change: `${percentualTratados}%`,
      icon: CheckCircle,
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-600'
    },
    { 
      title: 'Aguardando Tratamento', 
      value: pendentes, 
      change: `${percentualPendentes}%`,
      icon: Stethoscope,
      bgColor: 'bg-amber-50',
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      textColor: 'text-amber-600'
    },
    { 
      title: 'Revisões Realizadas', 
      value: revisoesFeitas, 
      change: `${percentualRevisoes}%`,
      icon: FileText,
      bgColor: 'bg-violet-50',
      iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
      textColor: 'text-violet-600'
    },
  ];

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Visão geral do sistema • {totalPacientes} pacientes cadastrados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-sm text-slate-500 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/50 shadow-sm">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/50 p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                <div className={`inline-flex items-center text-xs font-medium mt-2 px-2 py-0.5 rounded-full ${
                  stat.change === '0%' ? 'bg-slate-100 text-slate-500' :
                  parseInt(stat.change) > 50 ? 'bg-emerald-100 text-emerald-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  <TrendingUp className={`w-3 h-3 mr-1 ${parseInt(stat.change) < 50 && parseInt(stat.change) > 0 ? 'rotate-180' : ''}`} />
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

      {/* Últimos Pacientes */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Últimos Pacientes Cadastrados</h2>
          <button 
            onClick={() => navigate('/rotina')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {ultimosPacientes.length > 0 ? (
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
                {ultimosPacientes.map((item, index) => (
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
                      <button 
                        onClick={() => navigate(`/${item.origem === 'rede' ? 'rede-basica' : 'rotina'}`)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                      >
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">Nenhum paciente cadastrado</p>
        )}
      </div>
    </div>
  );
}