import { useState } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  MapPin,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  TooltipProps
} from 'recharts';

// ✅ CORES DOS GRÁFICOS
const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  teal: '#14b8a6',
  orange: '#f97316',
};

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger];

// ✅ CUSTOM TOOLTIP
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload?: unknown;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-medium text-slate-800 dark:text-white">{label}</p>
        <p className="text-sm text-primary-600 dark:text-primary-400">
          {payload[0].value} pacientes
        </p>
      </div>
    );
  }
  return null;
};

// ✅ RENDER PIE LABEL
interface PieLabelProps {
  name?: string;
  percent?: number;
}

const renderPieLabel = ({ name, percent }: PieLabelProps) => {
  if (!name || !percent) return '';
  return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export default function Dashboard() {
  const [loading] = useState(false);

  // ✅ DADOS DE EXEMPLO (temporários)
  const dadosExemplo = {
    evolucao: [
      { mes: 'Jan', quantidade: 5 },
      { mes: 'Fev', quantidade: 8 },
      { mes: 'Mar', quantidade: 12 },
      { mes: 'Abr', quantidade: 10 },
      { mes: 'Mai', quantidade: 15 },
      { mes: 'Jun', quantidade: 18 },
    ],
    localidades: [
      { nome: 'Serra da Carnaiba', quantidade: 25 },
      { nome: 'Bananeiras', quantidade: 18 },
      { nome: 'Várzea Grande', quantidade: 12 },
      { nome: 'Lajinha', quantidade: 8 },
      { nome: 'Cajueiro', quantidade: 5 },
    ],
    status: [
      { name: 'Tratados', value: 90 },
      { name: 'Pendentes', value: 3 },
    ],
    revisoes: [
      { name: 'Feitas', value: 69 },
      { name: 'Pendentes', value: 24 },
    ],
  };

  const stats = {
    totalPacientes: 93,
    tratados: 90,
    pendentes: 3,
    revisoesFeitas: 69,
  };

  const statsCards = [
    {
      titulo: 'Total de Pacientes',
      valor: stats.totalPacientes,
      icone: Users,
      cor: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      descricao: '93 pacientes cadastrados',
      detalhe: '↗︎ +12 este mês'
    },
    {
      titulo: 'Pacientes Tratados',
      valor: stats.tratados,
      icone: CheckCircle,
      cor: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      descricao: 'Com medicamento entregue',
      detalhe: `↗︎ ${((stats.tratados / stats.totalPacientes) * 100).toFixed(1)}% do total`
    },
    {
      titulo: 'Aguardando Tratamento',
      valor: stats.pendentes,
      icone: Clock,
      cor: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      descricao: 'Aguardando entrega',
      detalhe: `↘︎ ${stats.pendentes} pacientes`
    },
    {
      titulo: 'Revisões Realizadas',
      valor: stats.revisoesFeitas,
      icone: FileText,
      cor: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      descricao: 'Revisões concluídas',
      detalhe: `↗︎ ${((stats.revisoesFeitas / stats.totalPacientes) * 100).toFixed(1)}% do total`
    }
  ];

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
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary-500" />
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Visão geral do sistema • {stats.totalPacientes} pacientes cadastrados
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bg} rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.titulo}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.valor}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{stat.descricao}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.detalhe}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.cor} shadow-lg flex items-center justify-center flex-shrink-0 ml-3`}>
                <stat.icone className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================
          GRÁFICOS
          ============================================ */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Evolução de Pacientes */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Evolução de Pacientes
          </h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosExemplo.evolucao}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="quantidade"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.primary, r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Pacientes por Localidade */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-500" />
            Pacientes por Localidade
          </h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosExemplo.localidades} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="nome"
                  tick={{ fontSize: 11 }}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="quantidade"
                  fill={CHART_COLORS.primary}
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráficos de Status e Revisões */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico 3: Status de Tratamento */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Status de Tratamento
          </h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosExemplo.status}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={renderPieLabel}
                  labelLine={true}
                >
                  {dadosExemplo.status.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 4: Status de Revisões */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Status de Revisões
          </h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosExemplo.revisoes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={renderPieLabel}
                  labelLine={true}
                >
                  {dadosExemplo.revisoes.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index + 2]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Últimos Pacientes */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-500" />
          Últimos Pacientes
        </h3>
        <div className="overflow-x-auto">
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
              <tr>
                <td className="font-medium text-slate-800 dark:text-white">Ysla Vitória dos Santos</td>
                <td className="text-slate-600 dark:text-slate-300">Serra da Carnaiba</td>
                <td className="text-slate-600 dark:text-slate-300">09/10/2025</td>
                <td><span className="badge badge-success">Tratado</span></td>
                <td>
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Visualizar
                  </button>
                </td>
              </tr>
              <tr>
                <td className="font-medium text-slate-800 dark:text-white">Siélio Pereira dos Santos</td>
                <td className="text-slate-600 dark:text-slate-300">Serra da Carnaiba</td>
                <td className="text-slate-600 dark:text-slate-300">20/10/2025</td>
                <td><span className="badge badge-success">Tratado</span></td>
                <td>
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Visualizar
                  </button>
                </td>
              </tr>
              <tr>
                <td className="font-medium text-slate-800 dark:text-white">Reinaldo Soares Santos</td>
                <td className="text-slate-600 dark:text-slate-300">Serra da Carnaiba</td>
                <td className="text-slate-600 dark:text-slate-300">-</td>
                <td><span className="badge badge-warning">Pendente</span></td>
                <td>
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Visualizar
                  </button>
                </td>
              </tr>
              <tr>
                <td className="font-medium text-slate-800 dark:text-white">Raulino Alvino</td>
                <td className="text-slate-600 dark:text-slate-300">Serra da Carnaiba</td>
                <td className="text-slate-600 dark:text-slate-300">20/10/2025</td>
                <td><span className="badge badge-success">Tratado</span></td>
                <td>
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Visualizar
                  </button>
                </td>
              </tr>
              <tr>
                <td className="font-medium text-slate-800 dark:text-white">Natália Almeida Nascimento</td>
                <td className="text-slate-600 dark:text-slate-300">Serra da Carnaiba</td>
                <td className="text-slate-600 dark:text-slate-300">-</td>
                <td><span className="badge badge-success">Tratado</span></td>
                <td>
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Visualizar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Ver todos →
          </button>
        </div>
      </div>
    </div>
  );
}