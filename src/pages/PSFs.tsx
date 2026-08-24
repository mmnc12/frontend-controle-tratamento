import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  AlertCircle,
  User
} from 'lucide-react';
import { psfApi } from '../api';
import type { PSF, ApiError } from '../types';
import toast from 'react-hot-toast';

export default function PSFs() {
  const [psfs, setPsfs] = useState<PSF[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    nome_enfermeira: ''
  });

  // ============================================
  // CARREGAR PSFs
  // ============================================

  const loadPsfs = async () => {
    try {
      setLoading(true);
      const data = await psfApi.listar();
      setPsfs(data);
    } catch {
      toast.error('Erro ao carregar PSFs');
    } finally {
      setLoading(false);
    }
  };

  // Carregar ao montar o componente
  useState(() => {
    loadPsfs();
  });

  // ============================================
  // FILTRAR PSFs
  // ============================================

  const filteredPsfs = psfs.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================
  // ABRIR MODAL PARA CRIAR/EDITAR
  // ============================================

  const openModal = (psf?: PSF) => {
    if (psf) {
      setEditingId(psf.id);
      setFormData({
        nome: psf.nome,
        nome_enfermeira: psf.nome_enfermeira || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        nome_enfermeira: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nome: '',
      nome_enfermeira: ''
    });
  };

  // ============================================
  // VALIDAR FORMULÁRIO
  // ============================================

  const validateForm = (): boolean => {
    if (!formData.nome.trim()) {
      toast.error('O campo Nome é obrigatório');
      return false;
    }
    return true;
  };

  // ============================================
  // SALVAR PSF
  // ============================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingId) {
        await psfApi.atualizar(editingId, formData);
        toast.success('PSF atualizado com sucesso!');
      } else {
        await psfApi.criar(formData);
        toast.success('PSF criado com sucesso!');
      }
      closeModal();
      loadPsfs();
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Erro ao salvar PSF';
      toast.error(message);
    }
  };

  // ============================================
  // DELETAR PSF
  // ============================================

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o PSF "${nome}"?`)) {
      return;
    }

    try {
      await psfApi.deletar(id);
      toast.success('PSF excluído com sucesso!');
      loadPsfs();
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Erro ao excluir PSF';
      toast.error(message);
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
          <h1 className="text-2xl font-bold text-slate-800">PSFs</h1>
          <p className="text-slate-500 text-sm">Gerencie as Unidades de Saúde (PSFs)</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo PSF
        </button>
      </div>

      {/* Barra de busca */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome do PSF..."
              className="input-field pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium">{filteredPsfs.length}</span>
            <span>PSFs encontrados</span>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPsfs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <AlertCircle className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">Nenhum PSF encontrado</p>
            <p className="text-sm">Clique em "Novo PSF" para adicionar</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Enfermeira Responsável</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPsfs.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium text-slate-800">{item.nome}</td>
                    <td className="text-slate-500">
                      {item.nome_enfermeira ? (
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {item.nome_enfermeira}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm">Não informado</span>
                      )}
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

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingId ? 'Editar PSF' : 'Novo PSF'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="input-label">Nome do PSF *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: PSF Centro"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Nome da Enfermeira</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: Maria Silva"
                  value={formData.nome_enfermeira}
                  onChange={(e) => setFormData({ ...formData, nome_enfermeira: e.target.value })}
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
                  {editingId ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}