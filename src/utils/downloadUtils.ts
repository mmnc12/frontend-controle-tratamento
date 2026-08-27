// src/utils/downloadUtils.ts

/**
 * Baixa um arquivo a partir de um Blob
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  console.log('📥 downloadFile chamado com:', { filename, size: blob.size, type: blob.type });
  
  try {
    const url = window.URL.createObjectURL(blob);
    console.log('📥 URL criada:', url);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    console.log('📥 Link adicionado ao DOM');
    
    link.click();
    console.log('📥 Click disparado');
    
    document.body.removeChild(link);
    console.log('📥 Link removido');
    
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      console.log('📥 URL revogada');
    }, 1000);
  } catch (error) {
    console.error('❌ Erro no downloadFile:', error);
  }
};

/**
 * Baixa um arquivo CSV
 */
export const downloadCSV = (data: Blob, nomeArquivo: string = 'relatorio'): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `${nomeArquivo}.csv`);
};

/**
 * Baixa um arquivo Excel (XLSX)
 */
export const downloadExcel = (data: Blob, nomeArquivo: string = 'relatorio'): void => {
  const blob = new Blob([data], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  downloadFile(blob, `${nomeArquivo}.xlsx`);
};

/**
 * Baixa um arquivo PDF
 */
export const downloadPDF = (data: Blob, nomeArquivo: string = 'relatorio'): void => {
  console.log('📥 downloadPDF chamado com:', { nomeArquivo, dataSize: data.size, dataType: data.type });
  const blob = new Blob([data], { type: 'application/pdf' });
  console.log('📥 Novo Blob criado:', { size: blob.size, type: blob.type });
  downloadFile(blob, `${nomeArquivo}.pdf`);
};