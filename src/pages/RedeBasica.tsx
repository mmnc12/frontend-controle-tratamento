import { useState, useCallback, useRef } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
  File,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Search,
  XCircle
} from 'lucide-react';
import { redeBasicaApi, localidadeApi, psfApi } from '../api';
import type { RedeBasica, Localidade, PSF, FiltrosRedeBasica, ApiError } from '../types';
import toast from 'react-hot-toast';
import Pagination from '../components/ui/Pagination';

export default function RedeBasica() {
  const [pacientes, setPacientes] = useState<RedeBasica[]>([]);
  const [localidades, setLocalidades] = useState<Localidade[]>([]);
  const [psfs, setPsfs] = useState<PSF[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filtros, setFiltros] = useState<FiltrosRedeBasica>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  // Controle de carregamento inicial
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [formData, setFormData] = useState({
    ano: new Date().getFullYear(),
    nome: '',
    psf_id: '',
    localidade_id: '',
    quarteirao: '',
    numero_imovel: '',
    entrega_documento: 'N' as 'S' | 'N',
    entrega_medicamento: 'N' as 'S' | 'N',
    data_tratamento: '',
    revisao: 'N' as 'S' | 'N',
    telefone: '',
    observacao: ''
  });

  // ============================================
  // VERIFICAR SE A DATA É FUTURA
  // ============================================

  const isDataFutura = (data: string): boolean => {
    if (!data) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(data);
    dataSelecionada.setHours(0, 0, 0, 0);
    return dataSelecionada > hoje;
  };

  // ============================================
  // CARREGAR DADOS - RECEBE O TERMO DE BUSCA
  // ============================================

  const loadData = useCallback(async (searchTermParam?: string) => {
    try {
      setLoading(true);

      const filtrosComBusca = { ...filtros };
      if (searchTermParam && searchTermParam.trim()) {
        filtrosComBusca.nome = searchTermParam.trim();
      }

      const [pacientesResponse, localidadesData, psfsData] = await Promise.all([
        redeBasicaApi.listar(filtrosComBusca, currentPage, itemsPerPage),
        localidadeApi.listar(),
        psfApi.listar()
      ]);

      if (pacientesResponse && pacientesResponse.data) {
        setPacientes(pacientesResponse.data);
        setTotalPages(pacientesResponse.pagination?.totalPages || 1);
        setTotalItems(pacientesResponse.pagination?.total || 0);
      } else {
        setPacientes([]);
        setTotalPages(1);
        setTotalItems(0);
      }

      setLocalidades(localidadesData);
      setPsfs(psfsData);
    } catch (error) {
      console.error('❌ Erro ao carregar dados Rede Básica:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [filtros, currentPage]);

  // ============================================
  // CARREGAR DADOS NA PRIMEIRA RENDERIZAÇÃO
  // ============================================

  if (!initialLoadDone) {
    setInitialLoadDone(true);
    loadData();
  }

  // ============================================
  // DEBOUNCE PARA BUSCA EM TEMPO REAL
  // ============================================

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
      setCurrentPage(1);
      loadData(value);
    }, 500);
  };

  // ============================================
  // LIMPAR BUSCA
  // ============================================

  const limparBusca = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setCurrentPage(1);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    loadData('');
  };

  // ============================================
  // FILTRAR
  // ============================================

  const aplicarFiltros = () => {
    setCurrentPage(1);
    setTimeout(() => {
      loadData();
    }, 0);
  };

  const limparFiltros = () => {
    setFiltros({});
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setCurrentPage(1);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    loadData('');
  };

  // ============================================
  // MUDAR PÁGINA
  // ============================================

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      loadData();
    }, 0);
  };

  // ============================================
  // ABRIR MODAL
  // ============================================

  const openModal = (paciente?: RedeBasica) => {
    if (paciente) {
      let dataTratamento = '';
      if (paciente.data_tratamento) {
        if (paciente.data_tratamento.includes('T')) {
          dataTratamento = paciente.data_tratamento.split('T')[0];
        } else {
          dataTratamento = paciente.data_tratamento;
        }
      }

      setEditingId(paciente.id);
      setFormData({
        ano: paciente.ano,
        nome: paciente.nome,
        psf_id: String(paciente.psf_id),
        localidade_id: String(paciente.localidade_id),
        quarteirao: paciente.quarteirao || '',
        numero_imovel: paciente.numero_imovel || '',
        entrega_documento: paciente.entrega_documento,
        entrega_medicamento: paciente.entrega_medicamento,
        data_tratamento: dataTratamento,
        revisao: paciente.revisao,
        telefone: paciente.telefone || '',
        observacao: paciente.observacao || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        ano: new Date().getFullYear(),
        nome: '',
        psf_id: '',
        localidade_id: '',
        quarteirao: '',
        numero_imovel: '',
        entrega_documento: 'N',
        entrega_medicamento: 'N',
        data_tratamento: '',
        revisao: 'N',
        telefone: '',
        observacao: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  // ============================================
  // VALIDAR FORMULÁRIO
  // ============================================

  const validateForm = (): boolean => {
    if (!formData.nome.trim()) {
      toast.error('O campo Nome é obrigatório');
      return false;
    }
    if (!formData.psf_id) {
      toast.error('Selecione um PSF');
      return false;
    }
    if (!formData.localidade_id) {
      toast.error('Selecione uma Localidade');
      return false;
    }
    return true;
  };

  // ============================================
  // SALVAR
  // ============================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (formData.revisao === 'S' && !formData.data_tratamento) {
      toast.error('Não é possível marcar revisão como feita sem uma data de tratamento');
      return;
    }

    if (formData.data_tratamento && formData.entrega_medicamento !== 'S') {
      toast.error('Para registrar data de tratamento, a entrega de medicamento deve ser "Sim"');
      return;
    }

    if (formData.data_tratamento && formData.entrega_documento !== 'S') {
      toast.error('Para registrar data de tratamento, a entrega de documento deve ser "Sim"');
      return;
    }

    if (formData.data_tratamento && isDataFutura(formData.data_tratamento)) {
      toast.error('Não é possível registrar uma data de tratamento no futuro');
      return;
    }

    const data = {
      ano: formData.ano,
      nome: formData.nome,
      psf_id: Number(formData.psf_id),
      localidade_id: Number(formData.localidade_id),
      quarteirao: formData.quarteirao || undefined,
      numero_imovel: formData.numero_imovel || undefined,
      entrega_documento: formData.entrega_documento,
      entrega_medicamento: formData.entrega_medicamento,
      data_tratamento: formData.data_tratamento || undefined,
      revisao: formData.revisao,
      telefone: formData.telefone || undefined,
      observacao: formData.observacao || undefined
    };

    try {
      if (editingId) {
        await redeBasicaApi.atualizar(editingId, data);
        toast.success('Paciente atualizado com sucesso!');
      } else {
        await redeBasicaApi.criar(data);
        toast.success('Paciente cadastrado com sucesso!');
      }
      closeModal();
      setTimeout(() => {
        loadData();
      }, 0);
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Erro ao salvar paciente';
      toast.error(message);
    }
  };

  // ============================================
  // DELETAR
  // ============================================

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o paciente "${nome}"?`)) {
      return;
    }

    try {
      await redeBasicaApi.deletar(id);
      toast.success('Paciente excluído com sucesso!');
      setTimeout(() => {
        loadData();
      }, 0);
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Erro ao excluir paciente';
      toast.error(message);
    }
  };

  // ============================================
  // EXPORTAR RELATÓRIOS
  // ============================================

  // ============================================
  // EXPORTAR RELATÓRIOS - REDE BÁSICA (CORRIGIDO)
  // ============================================

  const exportarRelatorio = async (formato: 'csv' | 'excel' | 'pdf') => {
    console.log(`🔘 Botão ${formato.toUpperCase()} clicado`);
    try {
      const toastId = toast.loading(`Gerando relatório ${formato.toUpperCase()}...`);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Token não encontrado. Faça login novamente.');
        return;
      }

      const url = `https://backend-controle-tratamento.onrender.com/api/relatorios/rede-basica/${formato}`;
      let acceptHeader = '';

      switch (formato) {
        case 'csv':
          acceptHeader = 'text/csv';
          break;
        case 'excel':
          acceptHeader = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'pdf':
          acceptHeader = 'application/pdf';
          break;
        default:
          return;
      }

      // Adicionar filtros à URL
      const params = new URLSearchParams();
      if (filtros.ano) params.append('ano', String(filtros.ano));
      if (filtros.localidade_id) params.append('localidade_id', String(filtros.localidade_id));
      if (filtros.psf_id) params.append('psf_id', String(filtros.psf_id));
      if (debouncedSearchTerm.trim()) params.append('nome', debouncedSearchTerm.trim());

      const urlComParams = params.toString() ? `${url}?${params.toString()}` : url;

      console.log('📤 URL:', urlComParams);

      const response = await fetch(urlComParams, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': acceptHeader,
        },
      });

      console.log('📊 Status:', response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error('❌ Erro do servidor:', text);
        toast.error(`Erro: ${response.status}`, { id: toastId });
        return;
      }

      const blob = await response.blob();
      console.log('📄 Blob criado. Tamanho:', blob.size, 'bytes');

      if (blob.size === 0) {
        toast.error('Arquivo vazio', { id: toastId });
        return;
      }

      // 🔥 PARTE QUE FALTAVA - DOWNLOAD
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const extensao = formato === 'excel' ? 'xlsx' : formato;
      link.download = `relatorio_rede_basica.${extensao}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success(`Relatório ${formato.toUpperCase()} gerado com sucesso!`, { id: toastId });
    } catch (error) {
      console.error('❌ Erro ao exportar relatório:', error);
      toast.error('Erro ao gerar relatório');
    }
  };


  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rede Básica</h1>
          <p className="text-slate-500 text-sm">Gerencie os pacientes da Rede Básica de Saúde</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => exportarRelatorio('csv')}
            className="btn-secondary flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => exportarRelatorio('excel')}
            className="btn-secondary flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={() => exportarRelatorio('pdf')}
            className="btn-secondary flex items-center gap-2"
          >
            <File className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Paciente
          </button>
        </div>
      </div>

      {/* Busca por nome - EM TEMPO REAL */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Digite para buscar por nome..."
              className="input-field pl-9 pr-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                onClick={limparBusca}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="input-label">Localidade</label>
              <select
                className="input-field"
                value={filtros.localidade_id || ''}
                onChange={(e) => setFiltros({ ...filtros, localidade_id: e.target.value || undefined })}
              >
                <option value="">Todas</option>
                {localidades.map((item) => (
                  <option key={item.id} value={item.id}>{item.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">PSF</label>
              <select
                className="input-field"
                value={filtros.psf_id || ''}
                onChange={(e) => setFiltros({ ...filtros, psf_id: e.target.value || undefined })}
              >
                <option value="">Todos</option>
                {psfs.map((item) => (
                  <option key={item.id} value={item.id}>{item.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Ano</label>
              <select
                className="input-field"
                value={filtros.ano || ''}
                onChange={(e) => setFiltros({ ...filtros, ano: e.target.value || undefined })}
              >
                <option value="">Todos</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((ano) => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Tratado</label>
              <select
                className="input-field"
                value={filtros.tratado || ''}
                onChange={(e) => setFiltros({ ...filtros, tratado: e.target.value as 'S' | 'N' | undefined })}
              >
                <option value="">Todos</option>
                <option value="S">Sim</option>
                <option value="N">Não</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={aplicarFiltros} className="btn-primary">
              Aplicar Filtros
            </button>
            <button onClick={limparFiltros} className="btn-secondary">
              Limpar
            </button>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pacientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <AlertCircle className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">Nenhum paciente encontrado</p>
            <p className="text-sm">Clique em "Novo Paciente" para adicionar</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Ano</th>
                    <th>PSF</th>
                    <th>Localidade</th>
                    <th>Tratado</th>
                    <th>Data Revisão</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map((item) => {
                    const dataRevisao = item.data_revisao;

                    return (
                      <tr key={item.id}>
                        <td className="font-medium text-slate-800">{item.nome}</td>
                        <td>{item.ano}</td>
                        <td>{item.psf_nome || '-'}</td>
                        <td>{item.localidade_nome || '-'}</td>
                        <td>
                          <span className={`badge ${item.entrega_medicamento === 'S' ? 'badge-success' : 'badge-warning'}`}>
                            {item.entrega_medicamento === 'S' ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {item.revisao === 'S' ? (
                              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Revisão feita</span>
                              </span>
                            ) : dataRevisao ? (
                              (() => {
                                const hoje = new Date();
                                hoje.setHours(0, 0, 0, 0);
                                const dataRev = new Date(dataRevisao);
                                dataRev.setHours(0, 0, 0, 0);
                                const estaAtrasada = dataRev < hoje;

                                return estaAtrasada ? (
                                  <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full font-bold">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Atrasada! {new Date(dataRevisao).toLocaleDateString('pt-BR')}</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">{new Date(dataRevisao).toLocaleDateString('pt-BR')}</span>
                                  </span>
                                );
                              })()
                            ) : (
                              <span className="text-slate-400 text-sm">-</span>
                            )}
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openModal(item)}
                              className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.nome)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingId ? 'Editar Paciente' : 'Novo Paciente'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Nome *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Nome do paciente"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Ano</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Ano do exame"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">PSF *</label>
                  <select
                    className="input-field"
                    value={formData.psf_id}
                    onChange={(e) => setFormData({ ...formData, psf_id: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    {psfs.map((item) => (
                      <option key={item.id} value={item.id}>{item.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Localidade *</label>
                  <select
                    className="input-field"
                    value={formData.localidade_id}
                    onChange={(e) => setFormData({ ...formData, localidade_id: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    {localidades.map((item) => (
                      <option key={item.id} value={item.id}>{item.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Quarteirão</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ex: Q1"
                    value={formData.quarteirao}
                    onChange={(e) => setFormData({ ...formData, quarteirao: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Nº Imóvel</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Número da casa"
                    value={formData.numero_imovel}
                    onChange={(e) => setFormData({ ...formData, numero_imovel: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="input-label">Entrega Documento</label>
                  <select
                    className="input-field"
                    value={formData.entrega_documento}
                    onChange={(e) => {
                      const value = e.target.value as 'S' | 'N';
                      setFormData({ ...formData, entrega_documento: value });
                      if (value === 'N' && formData.data_tratamento) {
                        toast.error('Para manter a data de tratamento, a entrega de documento deve ser "Sim"');
                      }
                    }}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Entrega Medicamento</label>
                  <select
                    className="input-field"
                    value={formData.entrega_medicamento}
                    onChange={(e) => {
                      const value = e.target.value as 'S' | 'N';
                      setFormData({ ...formData, entrega_medicamento: value });
                      if (value === 'N' && formData.data_tratamento) {
                        toast.error('Para manter a data de tratamento, a entrega de medicamento deve ser "Sim"');
                      }
                    }}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Revisão</label>
                  <select
                    className="input-field"
                    value={formData.revisao}
                    onChange={(e) => {
                      const value = e.target.value as 'S' | 'N';
                      if (value === 'S' && !formData.data_tratamento) {
                        toast.error('Não é possível marcar revisão como feita sem data de tratamento');
                        return;
                      }
                      setFormData({ ...formData, revisao: value });
                    }}
                  >
                    <option value="N">Pendente</option>
                    <option value="S">Feita</option>
                  </select>
                  {formData.revisao === 'S' && !formData.data_tratamento && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ Para marcar revisão como feita, é necessário ter uma data de tratamento
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Data Tratamento</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.data_tratamento}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value && isDataFutura(value)) {
                        toast.error('Não é possível selecionar uma data de tratamento no futuro');
                        return;
                      }

                      setFormData({ ...formData, data_tratamento: value });

                      if (value && formData.entrega_medicamento === 'S' && formData.entrega_documento === 'S') {
                        const dataRevisao = new Date(value);
                        dataRevisao.setDate(dataRevisao.getDate() + 40);
                        toast.success(`Data de revisão prevista: ${dataRevisao.toLocaleDateString('pt-BR')}`, {
                          duration: 5000,
                        });
                      }
                    }}
                  />
                  {formData.data_tratamento && (
                    <p className="text-xs text-slate-500 mt-1">
                      📅 Revisão prevista: {new Date(new Date(formData.data_tratamento).setDate(new Date(formData.data_tratamento).getDate() + 40)).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  {formData.data_tratamento && (formData.entrega_medicamento !== 'S' || formData.entrega_documento !== 'S') && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ Para registrar tratamento, é necessário marcar "Sim" em Entrega de Medicamento e Entrega de Documento
                    </p>
                  )}
                </div>
                <div>
                  <label className="input-label">Telefone</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Observação</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Observações adicionais..."
                  value={formData.observacao}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingId ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}