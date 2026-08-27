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
    Line
} from 'recharts';
import {
    Users,
    CheckCircle,
    Clock,
    FileText,
    Download,
    FileSpreadsheet,
    File as FilePdf
} from 'lucide-react';
import { redeBasicaApi, rotinaApi, localidadeApi, psfApi } from '../api';
import type { RedeBasica, Rotina, Localidade, PSF } from '../types';
import toast from 'react-hot-toast';

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function Relatorios() {
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState({
        csv: false,
        excel: false,
        pdf: false,
    });
    const [pacientesRede, setPacientesRede] = useState<RedeBasica[]>([]);
    const [pacientesRotina, setPacientesRotina] = useState<Rotina[]>([]);
    const [localidades, setLocalidades] = useState<Localidade[]>([]);
    const [psfs, setPsfs] = useState<PSF[]>([]);
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

            setPacientesRede(redeResponse.data);
            setPacientesRotina(rotinaResponse.data);
            setLocalidades(locais);
            setPsfs(psfsData);
        } catch {
            toast.error('Erro ao carregar dados');
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
    // FUNÇÕES DE DOWNLOAD (USANDO O CÓDIGO QUE FUNCIONOU)
    // ============================================

    const downloadPDF = async () => {
        console.log('🔘 Download PDF iniciado pelo botão');
        setDownloading(prev => ({ ...prev, pdf: true }));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Token não encontrado. Faça login novamente.');
                return;
            }

            console.log('📤 Enviando requisição...');
            const response = await fetch('https://backend-controle-tratamento.onrender.com/api/relatorios/rede-basica/pdf?ano=2024', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf',
                },
            });

            console.log('📊 Status:', response.status);

            if (!response.ok) {
                const text = await response.text();
                console.error('❌ Erro do servidor:', text);
                toast.error('Erro ao gerar PDF');
                return;
            }

            const blob = await response.blob();
            console.log('📄 Tamanho:', blob.size, 'bytes');

            if (blob.size > 0) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorio-${Date.now()}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log('✅ DOWNLOAD INICIADO!');
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

    const downloadCSV = async () => {
        console.log('🔘 Download CSV iniciado pelo botão');
        setDownloading(prev => ({ ...prev, csv: true }));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Token não encontrado. Faça login novamente.');
                return;
            }

            console.log('📤 Enviando requisição...');
            const response = await fetch('https://backend-controle-tratamento.onrender.com/api/relatorios/rede-basica/csv?ano=2024', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'text/csv',
                },
            });

            console.log('📊 Status:', response.status);

            if (!response.ok) {
                const text = await response.text();
                console.error('❌ Erro do servidor:', text);
                toast.error('Erro ao gerar CSV');
                return;
            }

            const blob = await response.blob();
            console.log('📄 Tamanho:', blob.size, 'bytes');

            if (blob.size > 0) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorio-${Date.now()}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log('✅ DOWNLOAD INICIADO!');
                toast.success('CSV baixado com sucesso!');
            } else {
                toast.error('CSV vazio!');
            }
        } catch (error) {
            console.error('❌ Erro:', error);
            toast.error('Erro ao baixar CSV');
        } finally {
            setDownloading(prev => ({ ...prev, csv: false }));
        }
    };

    const downloadExcel = async () => {
        console.log('🔘 Download Excel iniciado pelo botão');
        setDownloading(prev => ({ ...prev, excel: true }));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Token não encontrado. Faça login novamente.');
                return;
            }

            console.log('📤 Enviando requisição...');
            const response = await fetch('https://backend-controle-tratamento.onrender.com/api/relatorios/rede-basica/excel?ano=2024', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            });

            console.log('📊 Status:', response.status);

            if (!response.ok) {
                const text = await response.text();
                console.error('❌ Erro do servidor:', text);
                toast.error('Erro ao gerar Excel');
                return;
            }

            const blob = await response.blob();
            console.log('📄 Tamanho:', blob.size, 'bytes');

            if (blob.size > 0) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorio-${Date.now()}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log('✅ DOWNLOAD INICIADO!');
                toast.success('Excel baixado com sucesso!');
            } else {
                toast.error('Excel vazio!');
            }
        } catch (error) {
            console.error('❌ Erro:', error);
            toast.error('Erro ao baixar Excel');
        } finally {
            setDownloading(prev => ({ ...prev, excel: false }));
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

    const pacientesPorLocalidade = localidades.map(local => {
        const count = todosPacientes.filter(p => p.localidade_id === local.id).length;
        return { nome: local.nome, quantidade: count };
    }).filter(item => item.quantidade > 0).sort((a, b) => b.quantidade - a.quantidade);

    const pacientesPorPSF = psfs.map(psf => {
        const count = todosPacientes.filter(p => p.psf_id === psf.id).length;
        return { nome: psf.nome, quantidade: count };
    }).filter(item => item.quantidade > 0).sort((a, b) => b.quantidade - a.quantidade);

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
    const ultimosPacientes = [...todosPacientes]
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 10);

    const stats = [
        { titulo: 'Total de Pacientes', valor: totalPacientes, icone: Users, cor: 'from-primary-500 to-primary-600' },
        { titulo: 'Pacientes Tratados', valor: tratados, icone: CheckCircle, cor: 'from-emerald-500 to-emerald-600' },
        { titulo: 'Aguardando Tratamento', valor: pendentes, icone: Clock, cor: 'from-amber-500 to-amber-600' },
        { titulo: 'Revisões Realizadas', valor: revisoesFeitas, icone: FileText, cor: 'from-violet-500 to-violet-600' }
    ];

    const renderPieLabel = ({ name, percent }: { name?: string; percent?: number }) => {
        if (!name || !percent) return '';
        return `${name}: ${(percent * 100).toFixed(0)}%`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
                    <p className="text-slate-500 text-sm">Visão consolidada dos dados do sistema</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={downloadCSV}
                        disabled={downloading.csv}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                        <Download size={16} />
                        {downloading.csv ? 'Baixando...' : 'CSV'}
                    </button>
                    <button
                        onClick={downloadExcel}
                        disabled={downloading.excel}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <FileSpreadsheet size={16} />
                        {downloading.excel ? 'Baixando...' : 'Excel'}
                    </button>
                    <button
                        onClick={downloadPDF}
                        disabled={downloading.pdf}
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
                    <div key={index} className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/50 p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500">{stat.titulo}</p>
                                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.valor}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.cor} shadow-lg flex items-center justify-center flex-shrink-0 ml-3`}>
                                <stat.icone className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/50 p-5">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Pacientes por Localidade</h3>
                    {pacientesPorLocalidade.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={pacientesPorLocalidade}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="nome" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    formatter={(value) => [`${value} pacientes`, 'Quantidade']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Bar dataKey="quantidade" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-slate-400 text-center py-12">Nenhum dado disponível</p>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/50 p-5">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Pacientes por PSF</h3>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value} pacientes`, 'Quantidade']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-slate-400 text-center py-12">Nenhum dado disponível</p>
                    )}
                </div>
            </div>

            {/* Evolução Mensal */}
            <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/50 p-5">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Evolução de Tratamentos por Mês</h3>
                {dadosEvolucao.some(d => d.quantidade > 0) ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dadosEvolucao}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="mes" />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                                formatter={(value) => [`${value} pacientes`, 'Quantidade']}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Line type="monotone" dataKey="quantidade" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-slate-400 text-center py-12">Nenhum dado disponível</p>
                )}
            </div>

            {/* Últimos Pacientes */}
            <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/50 p-5">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Últimos Pacientes Cadastrados</h3>
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
                                        <td className="font-medium text-slate-800">{p.nome}</td>
                                        <td>
                                            <span className={`badge ${'numero_amostra' in p ? 'badge-neutral' : 'badge-info'}`}>
                                                {'numero_amostra' in p ? 'Rotina' : 'Rede Básica'}
                                            </span>
                                        </td>
                                        <td>{p.psf_nome || '-'}</td>
                                        <td>{p.localidade_nome || '-'}</td>
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
                    <p className="text-slate-400 text-center py-8">Nenhum paciente cadastrado</p>
                )}
            </div>
        </div>
    );
}