// src/pages/Relatorios.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
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
import {
    Users,
    CheckCircle,
    Clock,
    FileText,
    File as FilePdf,
    TrendingUp,
    MapPin,
    Building2,
    Activity
} from 'lucide-react';
import { redeBasicaApi, rotinaApi, localidadeApi, psfApi } from '../api';
import type { RedeBasica, Rotina, Localidade, PSF } from '../types';
import toast from 'react-hot-toast';

// 🆕 Paleta de cores mais bonita para os gráficos
const CHART_COLORS = {
    primary: '#3b82f6',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899',
    teal: '#14b8a6',
    orange: '#f97316',
    indigo: '#6366f1',
    cyan: '#06b6d4',
};

const PIE_COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.danger,
    CHART_COLORS.purple,
    CHART_COLORS.pink,
    CHART_COLORS.teal,
    CHART_COLORS.orange,
];

// ✅ CUSTOM TOOLTIP COM TIPAGEM CORRETA
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

// ✅ RENDER PIE LABEL COM TIPAGEM CORRETA
interface PieLabelProps {
    name?: string;
    percent?: number;
}

const renderPieLabel = ({ name, percent }: PieLabelProps) => {
    if (!name || !percent) return '';
    return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export default function Relatorios() {
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState({ pdf: false });
    const [pacientesRede, setPacientesRede] = useState<RedeBasica[]>([]);
    const [pacientesRotina, setPacientesRotina] = useState<Rotina[]>([]);
    const [localidades, setLocalidades] = useState<Localidade[]>([]);
    const [psfs, setPsfs] = useState<PSF[]>([]);
    const [hasData, setHasData] = useState(false);
    const isFirstRender = useRef(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [redeResponse, rotinaResponse, locais, psfsData] = await Promise.all([
                redeBasicaApi.listar({}, 1, 1000),
                rotinaApi.listar({}, 1, 1000),
                localidadeApi.listar(),
                psfApi.listar()
            ]);

            const redeData = redeResponse.data || [];
            const rotinaData = rotinaResponse.data || [];

            setPacientesRede(redeData);
            setPacientesRotina(rotinaData);
            setLocalidades(locais || []);
            setPsfs(psfsData || []);
            setHasData(redeData.length > 0 || rotinaData.length > 0);
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            toast.error('Erro ao carregar dados');
            setHasData(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            loadData();
        }
    }, [loadData]);

    // ============================================
    // FUNÇÃO DE DOWNLOAD PDF
    // ============================================

    const downloadPDF = async () => {
        setDownloading(prev => ({ ...prev, pdf: true }));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Token não encontrado. Faça login novamente.');
                return;
            }

            const response = await fetch('https://backend-controle-tratamento.onrender.com/api/relatorios/rede-basica/pdf?ano=2024', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf',
                },
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('❌ Erro do servidor:', text);
                toast.error('Erro ao gerar PDF');
                return;
            }

            const blob = await response.blob();
            if (blob.size > 0) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorio-${Date.now()}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('PDF baixado com sucesso!');
            } else {
                toast.error('PDF vazio!');
            }
        } catch (error) {
            console.error('❌ Erro:', error);
            toast.error('Erro ao baixar PDF');
        } finally {
            setDownloading(prev => ({ ...prev, pdf: false }));
        }
    };

    // ============================================
    // CÁLCULO DE ESTATÍSTICAS
    // ============================================

    const todosPacientes = [...pacientesRede, ...pacientesRotina];
    const totalPacientes = todosPacientes.length;
    const tratados = todosPacientes.filter(p => p.entrega_medicamento === 'S').length;
    const pendentes = todosPacientes.filter(p => p.entrega_medicamento === 'N').length;
    const revisoesFeitas = todosPacientes.filter(p => p.revisao === 'S').length;
    const revisoesPendentes = todosPacientes.filter(p => p.revisao === 'N' && p.data_tratamento).length;

    // Dados para gráfico de localidades
    const pacientesPorLocalidade = localidades
        .map(local => ({
            nome: local.nome,
            quantidade: todosPacientes.filter(p => p.localidade_id === local.id).length
        }))
        .filter(item => item.quantidade > 0)
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 10);

    // Dados para gráfico de PSFs
    const pacientesPorPSF = psfs
        .map(psf => ({
            nome: psf.nome,
            quantidade: todosPacientes.filter(p => p.psf_id === psf.id).length
        }))
        .filter(item => item.quantidade > 0)
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 10);

    // Evolução mensal (últimos 6 meses)
    const evolucaoMensal = () => {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const mesAtual = new Date().getMonth();
        const anoAtual = new Date().getFullYear();
        const ultimosMeses = [];

        for (let i = 5; i >= 0; i--) {
            const mes = (mesAtual - i + 12) % 12;
            const ano = mesAtual - i < 0 ? anoAtual - 1 : anoAtual;
            ultimosMeses.push({ mes: meses[mes], ano, index: mes });
        }

        return ultimosMeses.map(({ mes, ano, index }) => {
            const count = todosPacientes.filter(p => {
                if (!p.data_tratamento) return false;
                const data = new Date(p.data_tratamento);
                return data.getMonth() === index && data.getFullYear() === ano;
            }).length;
            return { mes, quantidade: count };
        });
    };

    const dadosEvolucao = evolucaoMensal();

    // Últimos pacientes cadastrados
    const ultimosPacientes = [...todosPacientes]
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 10);

    // Dados para o gráfico de status (tratado vs não tratado)
    const dadosStatus = [
        { name: 'Tratados', value: tratados, color: CHART_COLORS.success },
        { name: 'Pendentes', value: pendentes, color: CHART_COLORS.warning },
    ].filter(d => d.value > 0);

    // Dados para o gráfico de revisões
    const dadosRevisoes = [
        { name: 'Revisões Feitas', value: revisoesFeitas, color: CHART_COLORS.success },
        { name: 'Revisões Pendentes', value: revisoesPendentes, color: CHART_COLORS.danger },
    ].filter(d => d.value > 0);

    const stats = [
        {
            titulo: 'Total de Pacientes',
            valor: totalPacientes,
            icone: Users,
            cor: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            texto: 'Todos os pacientes cadastrados'
        },
        {
            titulo: 'Pacientes Tratados',
            valor: tratados,
            icone: CheckCircle,
            cor: 'from-emerald-500 to-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            texto: 'Com medicamento entregue'
        },
        {
            titulo: 'Aguardando Tratamento',
            valor: pendentes,
            icone: Clock,
            cor: 'from-amber-500 to-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            texto: 'Aguardando entrega de medicamento'
        },
        {
            titulo: 'Revisões Realizadas',
            valor: revisoesFeitas,
            icone: FileText,
            cor: 'from-violet-500 to-violet-600',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            texto: `${revisoesPendentes} revisões pendentes`
        }
    ];

    // Renderizar placeholder quando não há dados
    const renderEmptyState = (mensagem: string) => (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Activity className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-500">{mensagem}</p>
            <p className="text-sm text-slate-400">Cadastre pacientes para ver os dados</p>
        </div>
    );

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-primary-500" />
                        Relatórios
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {hasData
                            ? `Visão consolidada de ${totalPacientes} pacientes`
                            : 'Nenhum paciente cadastrado ainda'}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={downloadPDF}
                        disabled={downloading.pdf || !hasData}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                        <FilePdf size={16} />
                        {downloading.pdf ? 'Baixando...' : 'PDF'}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`${stat.bg} rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.titulo}</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.valor}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{stat.texto}</p>
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
                {/* Gráfico: Pacientes por Localidade */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-500" />
                        Pacientes por Localidade
                    </h3>
                    {pacientesPorLocalidade.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={pacientesPorLocalidade} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis
                                    type="category"
                                    dataKey="nome"
                                    tick={{ fontSize: 11 }}
                                    width={100}
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
                    ) : (
                        renderEmptyState('Nenhum paciente por localidade')
                    )}
                </div>

                {/* Gráfico: Pacientes por PSF */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary-500" />
                        Pacientes por PSF
                    </h3>
                    {pacientesPorPSF.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pacientesPorPSF}
                                    dataKey="quantidade"
                                    nameKey="nome"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={renderPieLabel}
                                    labelLine={true}
                                >
                                    {pacientesPorPSF.map((_entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        renderEmptyState('Nenhum paciente por PSF')
                    )}
                </div>
            </div>

            {/* Gráfico: Evolução Mensal */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                    Evolução de Tratamentos por Mês
                </h3>
                {dadosEvolucao.some(d => d.quantidade > 0) ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dadosEvolucao}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="mes" />
                            <YAxis allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="quantidade"
                                stroke={CHART_COLORS.primary}
                                strokeWidth={3}
                                dot={{
                                    fill: CHART_COLORS.primary,
                                    strokeWidth: 2,
                                    r: 5
                                }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    renderEmptyState('Nenhum tratamento registrado')
                )}
            </div>

            {/* ============================================
                GRÁFICOS ADICIONAIS (Status e Revisões)
                ============================================ */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico: Status de Tratamento */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        Status de Tratamento
                    </h3>
                    {dadosStatus.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={dadosStatus}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label={renderPieLabel}
                                    labelLine={true}
                                >
                                    {dadosStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        renderEmptyState('Nenhum dado de tratamento')
                    )}
                </div>

                {/* Gráfico: Revisões */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        Status de Revisões
                    </h3>
                    {dadosRevisoes.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={dadosRevisoes}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label={renderPieLabel}
                                    labelLine={true}
                                >
                                    {dadosRevisoes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        renderEmptyState('Nenhum dado de revisão')
                    )}
                </div>
            </div>

            {/* Últimos Pacientes */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700 p-5">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-500" />
                    Últimos Pacientes Cadastrados
                </h3>
                {ultimosPacientes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Origem</th>
                                    <th>PSF</th>
                                    <th>Localidade</th>
                                    <th>Tratado</th>
                                    <th>Revisão</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ultimosPacientes.map((p) => (
                                    <tr key={p.id}>
                                        <td className="font-medium text-slate-800 dark:text-white">{p.nome}</td>
                                        <td>
                                            <span className={`badge ${'numero_amostra' in p ? 'badge-neutral' : 'badge-info'}`}>
                                                {'numero_amostra' in p ? 'Rotina' : 'Rede Básica'}
                                            </span>
                                        </td>
                                        <td className="text-slate-600 dark:text-slate-300">{p.psf_nome || '-'}</td>
                                        <td className="text-slate-600 dark:text-slate-300">{p.localidade_nome || '-'}</td>
                                        <td>
                                            <span className={`badge ${p.entrega_medicamento === 'S' ? 'badge-success' : 'badge-warning'}`}>
                                                {p.entrega_medicamento === 'S' ? 'Sim' : 'Não'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${p.revisao === 'S' ? 'badge-success' : 'badge-neutral'}`}>
                                                {p.revisao === 'S' ? 'Feita' : 'Pendente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="text-lg font-medium">Nenhum paciente cadastrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}