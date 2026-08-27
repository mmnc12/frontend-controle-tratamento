// src/pages/TesteDownload.tsx
import { useState } from 'react';
import { relatorioApi } from '../api/relatorioApi';
import { downloadPDF } from '../utils/downloadUtils';
import toast from 'react-hot-toast';

export default function TesteDownload() {
  const [loading, setLoading] = useState(false);

  console.log('🔴🔴🔴 PÁGINA DE TESTE CARREGADA! 🔴🔴🔴');

  const testarPDF = async () => {
    console.log('🔴🔴🔴 BOTÃO CLICADO! 🔴🔴🔴');
    setLoading(true);
    
    try {
      console.log('1. Chamando API...');
      const data = await relatorioApi.redeBasicaPDF({});
      console.log('2. Dados:', data);
      console.log('3. Tamanho:', data.size);
      
      if (data.size === 0) {
        toast.error('PDF vazio!');
        return;
      }
      
      console.log('4. Baixando...');
      downloadPDF(data, `teste-${Date.now()}.pdf`);
      toast.success('PDF baixado!');
    } catch (error) {
      console.error('❌ Erro:', error);
      toast.error('Erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Página de Teste</h1>
      <button
        onClick={testarPDF}
        disabled={loading}
        className="bg-red-600 text-white px-6 py-3 rounded-lg text-xl hover:bg-red-700"
      >
        {loading ? '⏳ Testando...' : '🔴 TESTAR PDF'}
      </button>
      <p className="mt-4 text-gray-500">
        Abra o console (F12) para ver os logs
      </p>
    </div>
  );
}