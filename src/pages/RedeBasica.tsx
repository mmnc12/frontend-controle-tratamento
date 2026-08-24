import { useState, useEffect, useCallback, useRef } from 'react';
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
  File
} from 'lucide-react';
import { redeBasicaApi, localidadeApi, psfApi, relatorioApi } from '../api';
import type { RedeBasica, Localidade, PSF, FiltrosRedeBasica, ApiError } from '../types';
import toast from 'react-hot-toast';

export default function RedeBasica() {
  const [pacientes, setPacientes] = useState<RedeBasica[]>([]);
  const [localidades, setLocalidades] = useState<Localidade[]>([]);
  const [psfs, setPsfs] = useState<PSF[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filtros, setFiltros] = useState<FiltrosRedeBasica>({});
  const isFirstRender = useRef(true); // Controle para primeira renderização
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
  // CARREGAR DADOS
  // ============================================

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [pacientesData, localidadesData, psfsData] = await Promise.all([
        redeBasicaApi.listar(filtros),
        localidadeApi.listar(),
        psfApi.listar()
      ]);
      setPacientes(pacientesData);
      setLocalidades(localidadesData);
      setPsfs(psfsData);
    } catch {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Carregar dados apenas na primeira renderização
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      loadData();
    }
  }, [loadData]);

  // ============================================
  // FILTRAR - recarregar quando os filtros mudarem
  // ============================================

  const aplicarFiltros = () => {
    loadData();
  };

  const limparFiltros = () => {
    setFiltros({});
    // O loadData será chamado pelo useEffect quando isFirstRender for false
    // Mas como não vai mudar o estado de isFirstRender, precisamos chamar manualmente
    setTimeout(() => loadData(), 0);
  };

  // ============================================
  // ABRIR MODAL
  // ============================================

  const openModal = (paciente?: RedeBasica) => {
    if (paciente) {
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
        data_tratamento: paciente.data_tratamento || '',
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
      loadData();
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
      loadData();
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Erro ao excluir paciente';
      toast.error(message);
    }
  };

  // ============================================
  // EXPORTAR RELATÓRIOS
  // ============================================

  const exportarRelatorio = async (formato: 'csv' | 'excel' | 'pdf') => {
    try {
      const toastId = toast.loading(`Gerando relatório ${formato.toUpperCase()}...`);
      
      let blob: Blob;
      switch (formato) {
        case 'csv':
          blob = await relatorioApi.redeBasicaCSV(filtros);
          break;
        case 'excel':
          blob = await relatorioApi.redeBasicaExcel(filtros);
          break;
        case 'pdf':
          blob = await relatorioApi.redeBasicaPDF(filtros);
          break;
        default:
          return;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_rede_basica.${formato === 'excel' ? 'xlsx' : formato}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Relatório ${formato.toUpperCase()} gerado com sucesso!`, { id: toastId });
    } catch {
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
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ano</th>
                  <th>PSF</th>
                  <th>Localidade</th>
                  <th>Tratado</th>
                  <th>Revisão</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((item) => (
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
                      <span className={`badge ${item.revisao === 'S' ? 'badge-success' : 'badge-neutral'}`}>
                        {item.revisao === 'S' ? 'Feita' : 'Pendente'}
                      </span>
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
                ))}
              </tbody>
            </table>
          </div>
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
                    onChange={(e) => setFormData({ ...formData, entrega_documento: e.target.value as 'S' | 'N' })}
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
                    onChange={(e) => setFormData({ ...formData, entrega_medicamento: e.target.value as 'S' | 'N' })}
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
                    onChange={(e) => setFormData({ ...formData, revisao: e.target.value as 'S' | 'N' })}
                  >
                    <option value="N">Pendente</option>
                    <option value="S">Feita</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Data Tratamento</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.data_tratamento}
                    onChange={(e) => setFormData({ ...formData, data_tratamento: e.target.value })}
                  />
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